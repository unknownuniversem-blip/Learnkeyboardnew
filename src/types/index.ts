export type ScreenType = 'home' | 'learn' | 'exams' | 'custom' | 'stats' | 'profile' | 'test';

export type ExamId = 
  | 'ssc_chsl_cgl' 
  | 'cpct' 
  | 'rrb_ntpc' 
  | 'bank_po' 
  | 'high_court_ldc' 
  | 'up_police' 
  | 'court_clerk' 
  | 'cisf_delhi_police' 
  | 'custom_exam';

export type SoundType = 'cherry_blue' | 'cherry_brown' | 'cherry_red' | 'typewriter' | 'muted';

export type ThemeType = 'amoled' | 'obsidian' | 'material' | 'cyber' | 'light';

export type FontType = 'JetBrains Mono' | 'Fira Code' | 'Roboto Mono';

export type FingerType = 
  | 'left-pinky' 
  | 'left-ring' 
  | 'left-middle' 
  | 'left-index' 
  | 'thumb' 
  | 'right-index' 
  | 'right-middle' 
  | 'right-ring' 
  | 'right-pinky';

export interface UserProfile {
  name: string;
  avatar: string;
  targetExamId: ExamId;
  targetWpm: number;
  dailyGoalMinutes: number;
  streakDays: number;
  lastActiveDate: string;
}

export interface UserSettings {
  theme: ThemeType;
  fontFamily: FontType;
  fontSize: 'sm' | 'base' | 'lg' | 'xl';
  soundType: SoundType;
  soundVolume: number;
  hapticFeedback: boolean;
  keyboardMode: 'auto' | 'physical' | 'virtual';
  showFingerGuide: boolean;
  blindMode: boolean;
  instantDeath: boolean;
  smoothCaret: boolean;
  languagePreference: 'en' | 'hi';
  showAdSimulations: boolean;
  viewportMode: 'android_frame' | 'fullscreen';
  mobileOrientation: 'portrait' | 'landscape';
}

export interface LessonStage {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  iconName: string;
  totalLessons: number;
}

export interface Lesson {
  id: string;
  stageId: number;
  title: string;
  subtitle: string;
  description: string;
  text: string;
  targetWpm: number;
  targetAccuracy: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  keyFocus: string[];
  recommendedFinger?: string;
}

export interface LessonProgress {
  lessonId: string;
  unlocked: boolean;
  completed: boolean;
  stars: number; // 0 to 3
  bestWpm: number;
  bestAccuracy: number;
  attempts: number;
  lastAttemptAt?: number;
}

export interface ExamConfig {
  id: ExamId;
  name: string;
  shortName: string;
  organization: string;
  durationMinutes: number;
  cutoffWpm: number;
  hindiCutoffWpm?: number;
  errorAllowancePercent: number; // e.g. 5% for SSC
  allowHindi: boolean;
  backspaceRule: 'allowed' | 'restricted' | 'disabled';
  description: string;
  scoringFormula: string;
  keyHighlights: string[];
}

export interface ExamPassage {
  id: string;
  examId: ExamId | 'all';
  title: string;
  language: 'en' | 'hi';
  text: string;
  wordCount: number;
  category: 'Administration' | 'Judicial' | 'General Knowledge' | 'Constitution' | 'Science & Tech' | 'Economy';
}

export interface TestSessionConfig {
  mode: 'learn' | 'exam' | 'custom' | 'quick';
  title: string;
  text: string;
  durationSeconds: number; // 0 = unlimited / count-up
  wordLimit?: number; // 0 = no limit
  examConfig?: ExamConfig;
  lessonId?: string;
  allowBackspace: boolean;
  blindMode: boolean;
  instantDeath: boolean;
  language: 'en' | 'hi';
}

export interface TestResult {
  id: string;
  mode: 'learn' | 'exam' | 'custom' | 'quick';
  title: string;
  timestamp: number;
  durationSeconds: number;
  grossWpm: number;
  netWpm: number;
  accuracy: number;
  rawKeystrokes: number;
  correctChars: number;
  wrongChars: number;
  backspaces: number;
  wordCount: number;
  errorWords: string[];
  weakKeys: Record<string, number>;
  isPassed?: boolean;
  cutoffWpm?: number;
  examShortName?: string;
  wpmHistory: number[]; // snapshot per second
}

export interface CustomPreset {
  id: string;
  name: string;
  durationMinutes: number;
  wordCount: number;
  allowBackspace: boolean;
  blindMode: boolean;
  instantDeath: boolean;
}
