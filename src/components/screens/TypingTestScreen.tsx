import React, { useCallback, useEffect, useRef, useState } from 'react';
import { 
  AlertTriangle, 
  Eye, 
  EyeOff, 
  Flame, 
  Keyboard as KeyboardIcon, 
  Maximize2, 
  Minimize2, 
  Pause, 
  Play, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  X 
} from 'lucide-react';
import { TestResult, TestSessionConfig, UserSettings } from '../../types';
import { 
  calculateAccuracy, 
  calculateGrossWpm, 
  calculateNetWpm, 
  getFingerForChar 
} from '../../utils/typingEngine';
import { playErrorSound, playKeySound, triggerHaptic } from '../../utils/audio';
import { VirtualKeyboard } from '../common/VirtualKeyboard';

interface TypingTestScreenProps {
  sessionConfig: TestSessionConfig;
  settings: UserSettings;
  onFinishTest: (result: TestResult) => void;
  onCancelTest: () => void;
}

export const TypingTestScreen: React.FC<TypingTestScreenProps> = ({
  sessionConfig,
  settings,
  onFinishTest,
  onCancelTest,
}) => {
  const targetText = sessionConfig.text;
  const targetChars = targetText.split('');
  const totalLength = targetChars.length;

  // Typing state
  const [typedChars, setTypedChars] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isStarted, setIsStarted] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [keystrokes, setKeystrokes] = useState<number>(0);
  const [backspacesCount, setBackspacesCount] = useState<number>(0);
  const [wpmHistory, setWpmHistory] = useState<number[]>([]);
  const [weakKeysMap, setWeakKeysMap] = useState<Record<string, number>>({});
  const [errorWordsList, setErrorWordsList] = useState<string[]>([]);

  // Sound & keyboard local toggles
  const [soundEnabled, setSoundEnabled] = useState<boolean>(settings.soundType !== 'muted');
  const [showSoftKeyboard, setShowSoftKeyboard] = useState<boolean>(
    settings.keyboardMode === 'virtual' || settings.keyboardMode === 'auto'
  );

  // Hidden text input ref for mobile hardware keyboard capture
  const hiddenInputRef = useRef<HTMLInputElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);
  const activeCharSpanRef = useRef<HTMLSpanElement>(null);

  // Time limit logic
  const isCountdown = sessionConfig.durationSeconds > 0;
  const remainingSeconds = isCountdown
    ? Math.max(0, sessionConfig.durationSeconds - elapsedSeconds)
    : elapsedSeconds;

  // Real-time calculations
  const correctCount = typedChars.reduce((acc, char, idx) => {
    return char === targetChars[idx] ? acc + 1 : acc;
  }, 0);
  const wrongCount = typedChars.length - correctCount;

  const currentGrossWpm = calculateGrossWpm(keystrokes, elapsedSeconds);
  const currentNetWpm = calculateNetWpm(
    keystrokes,
    wrongCount,
    elapsedSeconds,
    sessionConfig.examConfig?.id
  );
  const currentAccuracy = calculateAccuracy(correctCount, wrongCount);

  // Keep hidden input focused for immediate keystrokes on mobile or desktop
  const focusInput = useCallback(() => {
    if (hiddenInputRef.current) {
      hiddenInputRef.current.focus({ preventScroll: true });
    }
  }, []);

  useEffect(() => {
    focusInput();
  }, [focusInput]);

  // Scroll active char into view
  useEffect(() => {
    if (activeCharSpanRef.current && textContainerRef.current) {
      const container = textContainerRef.current;
      const element = activeCharSpanRef.current;
      const containerTop = container.scrollTop;
      const containerBottom = containerTop + container.clientHeight;
      const elemTop = element.offsetTop;
      const elemBottom = elemTop + element.clientHeight;

      if (elemTop < containerTop + 40 || elemBottom > containerBottom - 40) {
        container.scrollTo({
          top: elemTop - 80,
          behavior: 'smooth',
        });
      }
    }
  }, [currentIndex]);

  // Complete test session handler
  const completeTest = useCallback(() => {
    const finalGrossWpm = calculateGrossWpm(keystrokes, Math.max(1, elapsedSeconds));
    const finalNetWpm = calculateNetWpm(
      keystrokes,
      wrongCount,
      Math.max(1, elapsedSeconds),
      sessionConfig.examConfig?.id
    );
    const finalAccuracy = calculateAccuracy(correctCount, wrongCount);

    const cutoff = sessionConfig.examConfig?.cutoffWpm || 30;
    const isPassed =
      sessionConfig.mode === 'exam'
        ? finalNetWpm >= cutoff && finalAccuracy >= (100 - (sessionConfig.examConfig?.errorAllowancePercent || 5))
        : true;

    const testResult: TestResult = {
      id: `test_${Date.now()}`,
      mode: sessionConfig.mode,
      title: sessionConfig.title,
      timestamp: Date.now(),
      durationSeconds: Math.max(1, elapsedSeconds),
      grossWpm: finalGrossWpm,
      netWpm: finalNetWpm,
      accuracy: finalAccuracy,
      rawKeystrokes: keystrokes,
      correctChars: correctCount,
      wrongChars: wrongCount,
      backspaces: backspacesCount,
      wordCount: Math.round(keystrokes / 5),
      errorWords: errorWordsList,
      weakKeys: weakKeysMap,
      isPassed,
      cutoffWpm: sessionConfig.examConfig?.cutoffWpm,
      examShortName: sessionConfig.examConfig?.shortName,
      wpmHistory: wpmHistory.length > 0 ? wpmHistory : [finalNetWpm],
    };

    onFinishTest(testResult);
  }, [
    keystrokes,
    elapsedSeconds,
    wrongCount,
    correctCount,
    backspacesCount,
    errorWordsList,
    weakKeysMap,
    sessionConfig,
    wpmHistory,
    onFinishTest,
  ]);

  // 1-Second Timer Interval
  useEffect(() => {
    if (!isStarted || isPaused) return;

    const timer = setInterval(() => {
      setElapsedSeconds((prev) => {
        const next = prev + 1;

        // Record WPM History
        const snapshotNet = calculateNetWpm(
          keystrokes,
          wrongCount,
          next,
          sessionConfig.examConfig?.id
        );
        setWpmHistory((hist) => [...hist, snapshotNet]);

        // Check countdown expiration
        if (isCountdown && next >= sessionConfig.durationSeconds) {
          clearInterval(timer);
          setTimeout(() => completeTest(), 50);
          return next;
        }

        return next;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isStarted, isPaused, isCountdown, sessionConfig, keystrokes, wrongCount, completeTest]);

  // Handle Keystroke
  const handleCharInput = useCallback(
    (char: string) => {
      if (isPaused) return;

      if (!isStarted) {
        setIsStarted(true);
      }

      if (char === 'Backspace') {
        if (!sessionConfig.allowBackspace) return;
        if (currentIndex > 0) {
          setBackspacesCount((b) => b + 1);
          setCurrentIndex((idx) => idx - 1);
          setTypedChars((chars) => chars.slice(0, -1));
          if (soundEnabled) playKeySound(settings.soundType, settings.soundVolume);
        }
        return;
      }

      // Single character stroke
      if (char.length !== 1) return;

      setKeystrokes((k) => k + 1);

      const expected = targetChars[currentIndex];
      const isMatch = char === expected;

      if (isMatch) {
        if (soundEnabled) {
          playKeySound(settings.soundType, settings.soundVolume);
        }
        if (settings.hapticFeedback) {
          triggerHaptic('key');
        }
      } else {
        if (soundEnabled) {
          playErrorSound(settings.soundVolume);
        }
        if (settings.hapticFeedback) {
          triggerHaptic('error');
        }

        // Track weak key
        setWeakKeysMap((prev) => ({
          ...prev,
          [expected.toLowerCase()]: (prev[expected.toLowerCase()] || 0) + 1,
        }));

        // Instant death mode check
        if (sessionConfig.instantDeath) {
          completeTest();
          return;
        }
      }

      const nextTyped = [...typedChars, char];
      setTypedChars(nextTyped);
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);

      // Check test completion by length
      if (nextIdx >= totalLength) {
        setTimeout(() => completeTest(), 50);
      }
    },
    [
      currentIndex,
      isPaused,
      isStarted,
      sessionConfig,
      settings,
      soundEnabled,
      targetChars,
      totalLength,
      typedChars,
      completeTest,
    ]
  );

  // Global Keydown listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't capture standard modifier combinations like Ctrl+R or F5
      if (e.ctrlKey || e.metaKey || e.altKey) return;

      if (e.key === 'Tab') {
        e.preventDefault();
        // Reset or restart test
        setTypedChars([]);
        setCurrentIndex(0);
        setIsStarted(false);
        setElapsedSeconds(0);
        setKeystrokes(0);
        return;
      }

      if (e.key === 'Escape') {
        e.preventDefault();
        setIsPaused((p) => !p);
        return;
      }

      if (e.key === 'Backspace') {
        e.preventDefault();
        handleCharInput('Backspace');
        return;
      }

      if (e.key.length === 1) {
        e.preventDefault();
        handleCharInput(e.key);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleCharInput]);

  const currentExpectedChar = targetChars[currentIndex] || '';
  const fingerGuide = getFingerForChar(currentExpectedChar);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div
      className="flex flex-col h-full bg-zinc-950 text-zinc-100 select-none relative overflow-hidden"
      onClick={focusInput}
    >
      {/* Hidden input for capturing mobile software keyboard */}
      <input
        ref={hiddenInputRef}
        type="text"
        className="opacity-0 absolute -top-96 left-0 pointer-events-none"
        autoFocus
        tabIndex={-1}
        aria-hidden="true"
        onChange={(e) => {
          const val = e.target.value;
          if (val) {
            handleCharInput(val.slice(-1));
            e.target.value = '';
          }
        }}
      />

      {/* Top Test Header / HUD (Zero Distraction, Minimal) */}
      <div className="p-3 sm:p-4 border-b border-zinc-900 bg-zinc-950/90 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onCancelTest}
            className="p-1.5 rounded-lg bg-zinc-900 text-zinc-400 hover:text-white transition-colors"
            title="Exit Test"
          >
            <X className="w-4 h-4" />
          </button>
          <div>
            <h2 className="text-xs font-bold text-zinc-200 truncate max-w-[180px] sm:max-w-xs">
              {sessionConfig.title}
            </h2>
            <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-mono">
              <span>{sessionConfig.mode.toUpperCase()}</span>
              {sessionConfig.examConfig && (
                <span>· Target: {sessionConfig.examConfig.cutoffWpm} WPM</span>
              )}
            </div>
          </div>
        </div>

        {/* Live Metrics Strip */}
        <div className="flex items-center gap-3 sm:gap-5 font-mono">
          {/* Timer */}
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Time</span>
            <span className={`text-sm sm:text-base font-bold ${isCountdown && remainingSeconds < 30 ? 'text-rose-400 animate-pulse' : 'text-amber-400'}`}>
              {formatTime(remainingSeconds)}
            </span>
          </div>

          {/* Net WPM */}
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Net WPM</span>
            <span className="text-sm sm:text-base font-bold text-emerald-400">
              {currentNetWpm}
            </span>
          </div>

          {/* Accuracy */}
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Accuracy</span>
            <span className="text-sm sm:text-base font-bold text-zinc-200">
              {currentAccuracy}%
            </span>
          </div>

          {/* Mistakes */}
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Errors</span>
            <span className={`text-sm sm:text-base font-bold ${wrongCount > 0 ? 'text-rose-400' : 'text-zinc-500'}`}>
              {wrongCount}
            </span>
          </div>

          {/* Quick controls */}
          <div className="flex items-center gap-1 border-l border-zinc-800 pl-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setSoundEnabled(!soundEnabled);
              }}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-amber-400" /> : <VolumeX className="w-4 h-4" />}
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsPaused(!isPaused);
              }}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white"
            >
              {isPaused ? <Play className="w-4 h-4 text-emerald-400" /> : <Pause className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Main Text Display Viewport */}
      <div
        ref={textContainerRef}
        className="flex-1 p-4 sm:p-8 overflow-y-auto font-mono text-base sm:text-xl leading-relaxed tracking-wide select-none focus:outline-none flex flex-col justify-center"
      >
        <div className="max-w-3xl mx-auto w-full relative">
          {!isStarted && (
            <div className="mb-4 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center justify-between">
              <span>Start typing to begin timer automatically</span>
              <span className="text-[11px] text-zinc-400">Press Tab to restart</span>
            </div>
          )}

          {/* Render target characters with high-performance styling */}
          <div className="leading-loose sm:leading-[2.2] break-words">
            {targetChars.map((targetChar, index) => {
              const isTyped = index < currentIndex;
              const isCurrent = index === currentIndex;
              const userTyped = typedChars[index];
              const isCorrect = userTyped === targetChar;

              if (isTyped) {
                if (sessionConfig.blindMode) {
                  return (
                    <span key={index} className="text-zinc-400">
                      {targetChar}
                    </span>
                  );
                }
                return (
                  <span
                    key={index}
                    className={
                      isCorrect
                        ? 'text-emerald-400'
                        : 'text-rose-400 bg-rose-500/20 underline decoration-rose-500 decoration-2'
                    }
                  >
                    {userTyped === ' ' && !isCorrect ? '␣' : targetChar}
                  </span>
                );
              }

              if (isCurrent) {
                return (
                  <span
                    key={index}
                    ref={activeCharSpanRef}
                    className="relative text-amber-400 font-bold bg-amber-500/20 rounded px-0.5 border-b-2 border-amber-400 inline-block"
                  >
                    <span className="animate-caret inline-block">
                      {targetChar === ' ' ? '␣' : targetChar}
                    </span>
                  </span>
                );
              }

              // Pending char
              return (
                <span key={index} className="text-zinc-600">
                  {targetChar}
                </span>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Section: Finger Guide & On-Screen Virtual Keyboard */}
      <div className="shrink-0 p-2 sm:p-4 border-t border-zinc-900 bg-zinc-950/95 flex flex-col items-center">
        <div className="w-full max-w-2xl flex items-center justify-between mb-2 px-1 text-xs text-zinc-400">
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-zinc-500 font-mono">Finger Hint:</span>
            <span className="font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
              {fingerGuide.label}
            </span>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowSoftKeyboard(!showSoftKeyboard);
            }}
            className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-zinc-200"
          >
            <KeyboardIcon className="w-3.5 h-3.5" />
            <span>{showSoftKeyboard ? 'Hide App Keyboard' : 'Show App Keyboard'}</span>
          </button>
        </div>

        {showSoftKeyboard && (
          <VirtualKeyboard
            currentExpectedChar={currentExpectedChar}
            onKeyPress={(char) => handleCharInput(char)}
            showFingerGuide={settings.showFingerGuide}
          />
        )}
      </div>

      {/* Pause Modal Overlay */}
      {isPaused && (
        <div className="absolute inset-0 bg-zinc-950/85 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 text-center max-w-sm w-full flex flex-col items-center gap-4 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
              <Pause className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Test Paused</h3>
              <p className="text-xs text-zinc-400 mt-1">Take a deep breath and keep hands in home row position.</p>
            </div>
            <div className="flex flex-col w-full gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsPaused(false)}
                className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <Play className="w-4 h-4 fill-current" /> Resume Test
              </button>
              <button
                type="button"
                onClick={() => {
                  setTypedChars([]);
                  setCurrentIndex(0);
                  setIsStarted(false);
                  setIsPaused(false);
                  setElapsedSeconds(0);
                  setKeystrokes(0);
                }}
                className="w-full py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-medium text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-4 h-4" /> Restart From Scratch
              </button>
              <button
                type="button"
                onClick={onCancelTest}
                className="w-full py-2 text-zinc-500 hover:text-zinc-300 text-xs transition-colors"
              >
                Exit to Menu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
