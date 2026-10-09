import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  AlertCircle, 
  ArrowRight, 
  Award, 
  CheckCircle2, 
  Download, 
  Flame, 
  RefreshCw, 
  Share2, 
  TrendingUp, 
  X, 
  XCircle 
} from 'lucide-react';
import { TestResult } from '../../types';
import { playSuccessFanfare, triggerHaptic } from '../../utils/audio';

interface TestResultScreenProps {
  result: TestResult;
  onRetry: () => void;
  onNext: () => void;
  onGoHome: () => void;
}

export const TestResultScreen: React.FC<TestResultScreenProps> = ({
  result,
  onRetry,
  onNext,
  onGoHome,
}) => {
  const [showInterstitialAd, setShowInterstitialAd] = useState<boolean>(false);
  const [adCountdown, setAdCountdown] = useState<number>(3);

  const isExam = result.mode === 'exam';
  const isPassed = result.isPassed ?? (result.accuracy >= 95 && result.netWpm >= 30);

  // Trigger celebration on pass
  useEffect(() => {
    if (isPassed) {
      playSuccessFanfare(0.6);
      triggerHaptic('success');
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#f59e0b', '#10b981', '#3b82f6', '#ec4899'],
        });
      } catch {
        // Confetti fallback
      }
    }
  }, [isPassed]);

  // Check 3-test cooldown for AdMob interstitial simulation
  useEffect(() => {
    try {
      const testsCompletedStr = localStorage.getItem('typemaster_interstitial_counter') || '0';
      const testsCount = parseInt(testsCompletedStr, 10) + 1;
      localStorage.setItem('typemaster_interstitial_counter', testsCount.toString());

      if (testsCount % 3 === 0) {
        setShowInterstitialAd(true);
        const timer = setInterval(() => {
          setAdCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(timer);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
        return () => clearInterval(timer);
      }
    } catch {
      // Storage fallback
    }
  }, []);

  // Format time
  const formatDuration = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}m ${s}s`;
  };

  const handleDownloadCsv = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [
        'Metric,Value',
        `Title,${result.title}`,
        `Date,${new Date(result.timestamp).toISOString()}`,
        `Gross WPM,${result.grossWpm}`,
        `Net WPM,${result.netWpm}`,
        `Accuracy,${result.accuracy}%`,
        `Errors,${result.wrongChars}`,
        `Total Keystrokes,${result.rawKeystrokes}`,
        `Duration,${result.durationSeconds}s`,
        `Result,${isPassed ? 'QUALIFIED' : 'DISQUALIFIED'}`,
      ].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `TypeMaster_Report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto pb-6 relative">
      {/* Interstitial Ad Simulation (Triggered only after 3 tests, skippable) */}
      {showInterstitialAd && (
        <div className="fixed inset-0 z-50 bg-zinc-950 flex flex-col justify-between p-6 animate-in fade-in">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">
              AdMob Interstitial Demo
            </span>
            {adCountdown === 0 ? (
              <button
                type="button"
                onClick={() => setShowInterstitialAd(false)}
                className="flex items-center gap-1 px-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-white rounded-full text-xs font-semibold"
              >
                <span>Skip Ad</span>
                <X className="w-3.5 h-3.5" />
              </button>
            ) : (
              <span className="text-xs text-zinc-500 font-mono">
                Reward in {adCountdown}s
              </span>
            )}
          </div>

          <div className="flex flex-col items-center justify-center text-center my-auto max-w-sm mx-auto">
            <div className="w-20 h-20 rounded-3xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mb-4">
              <Award className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              Unlock All 500+ Official Exam Drills
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Targeting SSC CGL, CPCT or High Court? Unlock comprehensive previous year court judgements and full test series.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowInterstitialAd(false)}
            className="w-full py-3 rounded-xl bg-amber-500 text-zinc-950 font-bold text-xs"
          >
            Continue to Marksheet
          </button>
        </div>
      )}

      {/* Result Top Marksheet Card */}
      <div className="p-4 sm:p-6 border-b border-zinc-800/80 bg-zinc-900/50">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-mono text-zinc-400">
            {new Date(result.timestamp).toLocaleDateString()} · {formatDuration(result.durationSeconds)}
          </span>
          <span className="text-xs text-zinc-400 font-medium">
            Test Ref: #{result.id.slice(-6)}
          </span>
        </div>

        {/* Pass/Fail Hero Status */}
        <div className={`p-4 rounded-2xl border flex items-center justify-between mb-4 ${
          isPassed
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
            : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
              isPassed ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
            }`}>
              {isPassed ? <CheckCircle2 className="w-7 h-7" /> : <XCircle className="w-7 h-7" />}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-lg font-black tracking-tight text-white">
                  {isPassed ? 'QUALIFIED / PASSED' : 'NOT QUALIFIED'}
                </h2>
              </div>
              <p className="text-xs text-zinc-300 mt-0.5">
                {isPassed
                  ? `Achieved ${result.netWpm} Net WPM (Cutoff: ${result.cutoffWpm || 30} WPM)`
                  : `Need ${result.cutoffWpm || 30} Net WPM to qualify. Keep practicing!`}
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-2xl sm:text-3xl font-mono font-black text-white">
              {result.netWpm}
            </span>
            <span className="block text-[10px] text-zinc-400 font-mono uppercase">Net WPM</span>
          </div>
        </div>

        {/* 4-Metric Official Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div className="p-3 rounded-xl bg-zinc-900/90 border border-zinc-800">
            <span className="text-[11px] text-zinc-400 block mb-1">Gross Speed</span>
            <span className="text-xl font-bold font-mono text-zinc-100">{result.grossWpm}</span>
            <span className="text-[10px] text-zinc-500 block font-mono">WPM (Strokes/5)</span>
          </div>

          <div className="p-3 rounded-xl bg-zinc-900/90 border border-zinc-800">
            <span className="text-[11px] text-zinc-400 block mb-1">Accuracy</span>
            <span className="text-xl font-bold font-mono text-emerald-400">{result.accuracy}%</span>
            <span className="text-[10px] text-zinc-500 block font-mono">{result.correctChars} correct chars</span>
          </div>

          <div className="p-3 rounded-xl bg-zinc-900/90 border border-zinc-800">
            <span className="text-[11px] text-zinc-400 block mb-1">Error Deductions</span>
            <span className="text-xl font-bold font-mono text-rose-400">{result.wrongChars}</span>
            <span className="text-[10px] text-zinc-500 block font-mono">{result.backspaces} backspaces</span>
          </div>

          <div className="p-3 rounded-xl bg-zinc-900/90 border border-zinc-800">
            <span className="text-[11px] text-zinc-400 block mb-1">Total Keystrokes</span>
            <span className="text-xl font-bold font-mono text-amber-400">{result.rawKeystrokes}</span>
            <span className="text-[10px] text-zinc-500 block font-mono">~{result.wordCount} words</span>
          </div>
        </div>
      </div>

      {/* Speed Progression Curve */}
      <div className="px-4 pt-4">
        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
              WPM Speed Over Test Duration
            </h3>
            <span className="text-[11px] font-mono text-zinc-400">
              Peak: {Math.max(...(result.wpmHistory.length > 0 ? result.wpmHistory : [result.netWpm]))} WPM
            </span>
          </div>

          {/* SVG Line Graph */}
          <div className="w-full h-28 relative flex items-end pt-4">
            {result.wpmHistory.length > 1 ? (
              <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 50">
                {/* Horizontal guide line for cutoff */}
                {result.cutoffWpm && (
                  <line
                    x1="0"
                    y1={Math.max(5, 45 - (result.cutoffWpm / 60) * 40)}
                    x2="100"
                    y2={Math.max(5, 45 - (result.cutoffWpm / 60) * 40)}
                    stroke="rgba(245, 158, 11, 0.4)"
                    strokeDasharray="2 2"
                    strokeWidth="0.8"
                  />
                )}
                <polyline
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={result.wpmHistory
                    .map((val, idx) => {
                      const x = (idx / (result.wpmHistory.length - 1)) * 100;
                      const maxV = Math.max(60, ...result.wpmHistory);
                      const y = 45 - (val / maxV) * 40;
                      return `${x},${y}`;
                    })
                    .join(' ')}
                />
              </svg>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs text-zinc-500">
                Consistent pace maintained across test
              </div>
            )}
          </div>
          <div className="flex items-center justify-between text-[10px] text-zinc-500 font-mono">
            <span>0s Start</span>
            <span>{formatDuration(result.durationSeconds)} Finish</span>
          </div>
        </div>
      </div>

      {/* Weak Keys & Error Analysis */}
      <div className="px-4 pt-4">
        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex flex-col gap-3">
          <h3 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
            Weak Keys Stumbled In This Test
          </h3>

          {Object.keys(result.weakKeys).length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {Object.entries(result.weakKeys).map(([key, count]) => (
                <div
                  key={key}
                  className="px-2.5 py-1.5 rounded-xl bg-zinc-950 border border-rose-500/30 flex items-center gap-2"
                >
                  <span className="font-mono font-bold text-rose-400 uppercase text-xs">
                    {key === ' ' ? 'SPACE' : key}
                  </span>
                  <span className="text-[10px] text-zinc-400 font-mono">
                    {count} mistake{count > 1 ? 's' : ''}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-emerald-400">
              Flawless key coordination! Zero recurring weak keys identified.
            </p>
          )}
        </div>
      </div>

      {/* Bottom Sticky Action CTAs */}
      <div className="px-4 pt-6 flex flex-col sm:flex-row gap-2.5">
        <button
          type="button"
          onClick={onRetry}
          className="flex-1 py-3 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-100 font-semibold text-xs transition-colors flex items-center justify-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Retake Test
        </button>

        <button
          type="button"
          onClick={handleDownloadCsv}
          className="flex-1 py-3 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-100 font-semibold text-xs transition-colors flex items-center justify-center gap-2"
        >
          <Download className="w-4 h-4" />
          Export Report (CSV)
        </button>

        <button
          type="button"
          onClick={onNext}
          className="flex-1 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs transition-colors flex items-center justify-center gap-2"
        >
          <span>Continue / Next Drill</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
