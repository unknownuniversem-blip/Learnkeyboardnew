import { ExamId, FingerType } from '../types';

/**
 * Key to recommended finger mapping for standard touch-typing
 */
export const KEY_FINGER_MAP: Record<string, { finger: FingerType; label: string; hand: 'left' | 'right' }> = {
  // Left Pinky
  '`': { finger: 'left-pinky', label: 'Left Pinky', hand: 'left' },
  '~': { finger: 'left-pinky', label: 'Left Pinky', hand: 'left' },
  '1': { finger: 'left-pinky', label: 'Left Pinky', hand: 'left' },
  '!': { finger: 'left-pinky', label: 'Left Pinky', hand: 'left' },
  'q': { finger: 'left-pinky', label: 'Left Pinky', hand: 'left' },
  'Q': { finger: 'left-pinky', label: 'Left Pinky', hand: 'left' },
  'a': { finger: 'left-pinky', label: 'Left Pinky', hand: 'left' },
  'A': { finger: 'left-pinky', label: 'Left Pinky', hand: 'left' },
  'z': { finger: 'left-pinky', label: 'Left Pinky', hand: 'left' },
  'Z': { finger: 'left-pinky', label: 'Left Pinky', hand: 'left' },

  // Left Ring
  '2': { finger: 'left-ring', label: 'Left Ring', hand: 'left' },
  '@': { finger: 'left-ring', label: 'Left Ring', hand: 'left' },
  'w': { finger: 'left-ring', label: 'Left Ring', hand: 'left' },
  'W': { finger: 'left-ring', label: 'Left Ring', hand: 'left' },
  's': { finger: 'left-ring', label: 'Left Ring', hand: 'left' },
  'S': { finger: 'left-ring', label: 'Left Ring', hand: 'left' },
  'x': { finger: 'left-ring', label: 'Left Ring', hand: 'left' },
  'X': { finger: 'left-ring', label: 'Left Ring', hand: 'left' },

  // Left Middle
  '3': { finger: 'left-middle', label: 'Left Middle', hand: 'left' },
  '#': { finger: 'left-middle', label: 'Left Middle', hand: 'left' },
  'e': { finger: 'left-middle', label: 'Left Middle', hand: 'left' },
  'E': { finger: 'left-middle', label: 'Left Middle', hand: 'left' },
  'd': { finger: 'left-middle', label: 'Left Middle', hand: 'left' },
  'D': { finger: 'left-middle', label: 'Left Middle', hand: 'left' },
  'c': { finger: 'left-middle', label: 'Left Middle', hand: 'left' },
  'C': { finger: 'left-middle', label: 'Left Middle', hand: 'left' },

  // Left Index
  '4': { finger: 'left-index', label: 'Left Index', hand: 'left' },
  '$': { finger: 'left-index', label: 'Left Index', hand: 'left' },
  '5': { finger: 'left-index', label: 'Left Index', hand: 'left' },
  '%': { finger: 'left-index', label: 'Left Index', hand: 'left' },
  'r': { finger: 'left-index', label: 'Left Index', hand: 'left' },
  'R': { finger: 'left-index', label: 'Left Index', hand: 'left' },
  't': { finger: 'left-index', label: 'Left Index', hand: 'left' },
  'T': { finger: 'left-index', label: 'Left Index', hand: 'left' },
  'f': { finger: 'left-index', label: 'Left Index', hand: 'left' },
  'F': { finger: 'left-index', label: 'Left Index', hand: 'left' },
  'g': { finger: 'left-index', label: 'Left Index', hand: 'left' },
  'G': { finger: 'left-index', label: 'Left Index', hand: 'left' },
  'v': { finger: 'left-index', label: 'Left Index', hand: 'left' },
  'V': { finger: 'left-index', label: 'Left Index', hand: 'left' },
  'b': { finger: 'left-index', label: 'Left Index', hand: 'left' },
  'B': { finger: 'left-index', label: 'Left Index', hand: 'left' },

  // Thumbs
  ' ': { finger: 'thumb', label: 'Thumb (Space)', hand: 'right' },

  // Right Index
  '6': { finger: 'right-index', label: 'Right Index', hand: 'right' },
  '^': { finger: 'right-index', label: 'Right Index', hand: 'right' },
  '7': { finger: 'right-index', label: 'Right Index', hand: 'right' },
  '&': { finger: 'right-index', label: 'Right Index', hand: 'right' },
  'y': { finger: 'right-index', label: 'Right Index', hand: 'right' },
  'Y': { finger: 'right-index', label: 'Right Index', hand: 'right' },
  'u': { finger: 'right-index', label: 'Right Index', hand: 'right' },
  'U': { finger: 'right-index', label: 'Right Index', hand: 'right' },
  'h': { finger: 'right-index', label: 'Right Index', hand: 'right' },
  'H': { finger: 'right-index', label: 'Right Index', hand: 'right' },
  'j': { finger: 'right-index', label: 'Right Index', hand: 'right' },
  'J': { finger: 'right-index', label: 'Right Index', hand: 'right' },
  'n': { finger: 'right-index', label: 'Right Index', hand: 'right' },
  'N': { finger: 'right-index', label: 'Right Index', hand: 'right' },
  'm': { finger: 'right-index', label: 'Right Index', hand: 'right' },
  'M': { finger: 'right-index', label: 'Right Index', hand: 'right' },

  // Right Middle
  '8': { finger: 'right-middle', label: 'Right Middle', hand: 'right' },
  '*': { finger: 'right-middle', label: 'Right Middle', hand: 'right' },
  'i': { finger: 'right-middle', label: 'Right Middle', hand: 'right' },
  'I': { finger: 'right-middle', label: 'Right Middle', hand: 'right' },
  'k': { finger: 'right-middle', label: 'Right Middle', hand: 'right' },
  'K': { finger: 'right-middle', label: 'Right Middle', hand: 'right' },
  ',': { finger: 'right-middle', label: 'Right Middle', hand: 'right' },
  '<': { finger: 'right-middle', label: 'Right Middle', hand: 'right' },

  // Right Ring
  '9': { finger: 'right-ring', label: 'Right Ring', hand: 'right' },
  '(': { finger: 'right-ring', label: 'Right Ring', hand: 'right' },
  'o': { finger: 'right-ring', label: 'Right Ring', hand: 'right' },
  'O': { finger: 'right-ring', label: 'Right Ring', hand: 'right' },
  'l': { finger: 'right-ring', label: 'Right Ring', hand: 'right' },
  'L': { finger: 'right-ring', label: 'Right Ring', hand: 'right' },
  '.': { finger: 'right-ring', label: 'Right Ring', hand: 'right' },
  '>': { finger: 'right-ring', label: 'Right Ring', hand: 'right' },

  // Right Pinky
  '0': { finger: 'right-pinky', label: 'Right Pinky', hand: 'right' },
  ')': { finger: 'right-pinky', label: 'Right Pinky', hand: 'right' },
  '-': { finger: 'right-pinky', label: 'Right Pinky', hand: 'right' },
  '_': { finger: 'right-pinky', label: 'Right Pinky', hand: 'right' },
  '=': { finger: 'right-pinky', label: 'Right Pinky', hand: 'right' },
  '+': { finger: 'right-pinky', label: 'Right Pinky', hand: 'right' },
  'p': { finger: 'right-pinky', label: 'Right Pinky', hand: 'right' },
  'P': { finger: 'right-pinky', label: 'Right Pinky', hand: 'right' },
  '[': { finger: 'right-pinky', label: 'Right Pinky', hand: 'right' },
  '{': { finger: 'right-pinky', label: 'Right Pinky', hand: 'right' },
  ']': { finger: 'right-pinky', label: 'Right Pinky', hand: 'right' },
  '}': { finger: 'right-pinky', label: 'Right Pinky', hand: 'right' },
  '\\': { finger: 'right-pinky', label: 'Right Pinky', hand: 'right' },
  '|': { finger: 'right-pinky', label: 'Right Pinky', hand: 'right' },
  ';': { finger: 'right-pinky', label: 'Right Pinky', hand: 'right' },
  ':': { finger: 'right-pinky', label: 'Right Pinky', hand: 'right' },
  "'": { finger: 'right-pinky', label: 'Right Pinky', hand: 'right' },
  '"': { finger: 'right-pinky', label: 'Right Pinky', hand: 'right' },
  '/': { finger: 'right-pinky', label: 'Right Pinky', hand: 'right' },
  '?': { finger: 'right-pinky', label: 'Right Pinky', hand: 'right' },
};

/**
 * Gross WPM = (Total Keystrokes / 5) / (Time in minutes)
 */
export function calculateGrossWpm(totalKeystrokes: number, secondsElapsed: number): number {
  if (secondsElapsed <= 0) return 0;
  const minutes = secondsElapsed / 60;
  const words = totalKeystrokes / 5;
  return Math.round((words / minutes) * 10) / 10;
}

/**
 * Net WPM calculation with official Indian competitive exam rules
 */
export function calculateNetWpm(
  totalKeystrokes: number,
  wrongChars: number,
  secondsElapsed: number,
  examId?: ExamId
): number {
  if (secondsElapsed <= 0) return 0;
  const minutes = secondsElapsed / 60;
  const grossWpm = calculateGrossWpm(totalKeystrokes, secondsElapsed);
  const totalWords = totalKeystrokes / 5;
  const mistakes = wrongChars / 5;

  if (examId === 'rrb_ntpc') {
    // RRB NTPC: 5% of total words can be mistaken without penalty.
    // Additional mistakes multiplied by 10 are deducted from total words.
    const allowedMistakes = totalWords * 0.05;
    const excessMistakes = Math.max(0, mistakes - allowedMistakes);
    const penaltyWords = excessMistakes * 10;
    const netWords = Math.max(0, totalWords - penaltyWords);
    return Math.round((netWords / minutes) * 10) / 10;
  }

  if (examId === 'ssc_chsl_cgl') {
    // SSC CGL/CHSL: 5% permissible mistake rebate.
    // Errors beyond 5% attract standard proportional deduction.
    const allowedMistakes = totalWords * 0.05;
    const excessMistakes = Math.max(0, mistakes - allowedMistakes);
    const netWpm = Math.max(0, grossWpm - (excessMistakes * 2) / minutes);
    return Math.round(netWpm * 10) / 10;
  }

  // Standard Net WPM: Gross WPM - (Mistakes / Minutes)
  const netWpm = Math.max(0, grossWpm - mistakes / minutes);
  return Math.round(netWpm * 10) / 10;
}

/**
 * Accuracy percentage = (Correct Characters / Total Attempted Characters) * 100
 */
export function calculateAccuracy(correctChars: number, wrongChars: number): number {
  const total = correctChars + wrongChars;
  if (total === 0) return 100;
  return Math.round((correctChars / total) * 1000) / 10;
}

/**
 * Evaluate if the test meets the official qualifying cutoffs
 */
export function evaluateExamResult(
  netWpm: number,
  accuracy: number,
  cutoffWpm: number,
  errorAllowancePercent: number = 5
): { passed: boolean; reason: string } {
  const minimumAccuracy = Math.max(80, 100 - errorAllowancePercent);

  if (netWpm < cutoffWpm) {
    return {
      passed: false,
      reason: `Net Speed of ${netWpm} WPM is below the required cutoff of ${cutoffWpm} WPM.`,
    };
  }

  if (accuracy < minimumAccuracy) {
    return {
      passed: false,
      reason: `Accuracy of ${accuracy}% is below the permissible cutoff of ${minimumAccuracy}%.`,
    };
  }

  return {
    passed: true,
    reason: `Qualified! Achieved ${netWpm} Net WPM with ${accuracy}% accuracy.`,
  };
}

/**
 * Helper to identify finger for current char
 */
export function getFingerForChar(char: string) {
  return KEY_FINGER_MAP[char] || { finger: 'thumb' as FingerType, label: 'Thumb', hand: 'right' as const };
}
