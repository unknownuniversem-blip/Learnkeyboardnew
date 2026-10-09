import React from 'react';
import { KEY_FINGER_MAP } from '../../utils/typingEngine';
import { FingerType } from '../../types';

interface VirtualKeyboardProps {
  currentExpectedChar?: string;
  onKeyPress?: (char: string) => void;
  showFingerGuide?: boolean;
}

const FINGER_COLORS: Record<FingerType, string> = {
  'left-pinky': 'border-rose-500/40 text-rose-400 bg-rose-500/10',
  'left-ring': 'border-amber-500/40 text-amber-400 bg-amber-500/10',
  'left-middle': 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10',
  'left-index': 'border-blue-500/40 text-blue-400 bg-blue-500/10',
  'thumb': 'border-indigo-500/40 text-indigo-400 bg-indigo-500/10',
  'right-index': 'border-blue-500/40 text-blue-400 bg-blue-500/10',
  'right-middle': 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10',
  'right-ring': 'border-amber-500/40 text-amber-400 bg-amber-500/10',
  'right-pinky': 'border-rose-500/40 text-rose-400 bg-rose-500/10',
};

const KEYBOARD_ROWS = [
  ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace'],
  ['Tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\'],
  ['Caps', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'", 'Enter'],
  ['Shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', 'Shift'],
  ['Ctrl', 'Alt', 'Space', 'Alt', 'Ctrl'],
];

export const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({
  currentExpectedChar = '',
  onKeyPress,
  showFingerGuide = true,
}) => {
  const activeCharLower = currentExpectedChar.toLowerCase();
  const fingerInfo = KEY_FINGER_MAP[currentExpectedChar] || KEY_FINGER_MAP[activeCharLower];

  const handleKeyClick = (key: string) => {
    if (!onKeyPress) return;
    if (key === 'Space') {
      onKeyPress(' ');
    } else if (key === 'Backspace') {
      onKeyPress('Backspace');
    } else if (key.length === 1) {
      onKeyPress(key);
    }
  };

  return (
    <div className="w-full bg-zinc-950/80 border border-zinc-800/80 rounded-2xl p-2.5 backdrop-blur-md select-none">
      {/* Finger guide hint bar */}
      {showFingerGuide && fingerInfo && (
        <div className="flex items-center justify-between text-xs px-2 pb-2 mb-2 border-b border-zinc-800/60">
          <div className="flex items-center gap-2">
            <span className="text-zinc-400">Next Target:</span>
            <span className="font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
              {currentExpectedChar === ' ' ? 'SPACE' : currentExpectedChar || '—'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-zinc-400">Recommended:</span>
            <span className="font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
              {fingerInfo.label}
            </span>
          </div>
        </div>
      )}

      {/* Keyboard Grid */}
      <div className="flex flex-col gap-1 w-full max-w-2xl mx-auto">
        {KEYBOARD_ROWS.map((row, rIdx) => (
          <div key={rIdx} className="flex justify-center gap-1 w-full">
            {row.map((k, kIdx) => {
              const isSpace = k === 'Space';
              const isTarget =
                (isSpace && currentExpectedChar === ' ') ||
                k.toLowerCase() === activeCharLower;
              const fingerData = KEY_FINGER_MAP[k.toLowerCase()];
              const fingerColorClass =
                showFingerGuide && fingerData ? FINGER_COLORS[fingerData.finger] : 'border-zinc-800 text-zinc-300 bg-zinc-900/60';

              let widthClass = 'w-7 sm:w-9 h-8 sm:h-9 text-xs';
              if (k === 'Backspace' || k === 'Tab' || k === 'Enter' || k === 'Caps') {
                widthClass = 'w-12 sm:w-16 h-8 sm:h-9 text-[10px] sm:text-xs';
              } else if (k === 'Shift') {
                widthClass = 'w-14 sm:w-20 h-8 sm:h-9 text-[10px] sm:text-xs';
              } else if (isSpace) {
                widthClass = 'flex-1 max-w-[200px] h-8 sm:h-9 text-xs';
              }

              return (
                <button
                  key={`${rIdx}-${kIdx}`}
                  type="button"
                  onClick={() => handleKeyClick(k)}
                  className={`
                    ${widthClass}
                    flex items-center justify-center font-mono font-medium rounded-lg border transition-all duration-75 active:scale-95
                    ${
                      isTarget
                        ? 'ring-2 ring-amber-400 bg-amber-400 text-zinc-950 font-bold shadow-lg shadow-amber-500/20 scale-105 z-10'
                        : `${fingerColorClass} hover:bg-zinc-800/80`
                    }
                  `}
                >
                  {isSpace ? '␣' : k}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Finger legend indicators */}
      {showFingerGuide && (
        <div className="flex items-center justify-center gap-3 pt-2 mt-2 text-[10px] text-zinc-500 border-t border-zinc-900 overflow-x-auto">
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
            <span>Pinky</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            <span>Ring</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Middle</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            <span>Index</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
            <span>Thumb</span>
          </div>
        </div>
      )}
    </div>
  );
};
