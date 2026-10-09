import { CustomPreset, LessonProgress, TestResult, UserProfile, UserSettings } from '../types';
import { ALL_LESSONS } from '../data/lessonsData';

const STORAGE_KEYS = {
  PROFILE: 'typemaster_user_profile',
  SETTINGS: 'typemaster_user_settings',
  RESULTS: 'typemaster_test_results',
  LESSON_PROGRESS: 'typemaster_lesson_progress',
  CUSTOM_PRESETS: 'typemaster_custom_presets',
  WEAK_KEYS: 'typemaster_weak_keys',
};

const DEFAULT_PROFILE: UserProfile = {
  name: 'Aspirant',
  avatar: '👨‍💼',
  targetExamId: 'ssc_chsl_cgl',
  targetWpm: 35,
  dailyGoalMinutes: 15,
  streakDays: 4,
  lastActiveDate: new Date().toISOString().split('T')[0],
};

const DEFAULT_SETTINGS: UserSettings = {
  theme: 'amoled',
  fontFamily: 'JetBrains Mono',
  fontSize: 'lg',
  soundType: 'cherry_blue',
  soundVolume: 0.6,
  hapticFeedback: true,
  keyboardMode: 'auto',
  showFingerGuide: true,
  blindMode: false,
  instantDeath: false,
  smoothCaret: true,
  languagePreference: 'en',
  showAdSimulations: true,
  viewportMode: 'android_frame',
  mobileOrientation: 'portrait',
};

export function loadUserProfile(): UserProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (raw) return { ...DEFAULT_PROFILE, ...JSON.parse(raw) };
  } catch (err) {
    console.warn('Failed to load profile', err);
  }
  return DEFAULT_PROFILE;
}

export function saveUserProfile(profile: UserProfile) {
  try {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  } catch (err) {
    console.warn('Failed to save profile', err);
  }
}

export function loadUserSettings(): UserSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (raw) return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch (err) {
    console.warn('Failed to load settings', err);
  }
  return DEFAULT_SETTINGS;
}

export function saveUserSettings(settings: UserSettings) {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (err) {
    console.warn('Failed to save settings', err);
  }
}

export function loadTestResults(): TestResult[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.RESULTS);
    if (raw) return JSON.parse(raw);
  } catch (err) {
    console.warn('Failed to load results', err);
  }
  // Return initial mock results for realistic stats
  const initialResults: TestResult[] = [
    {
      id: 'res_1',
      mode: 'exam',
      title: 'SSC CHSL Mock Test #1',
      timestamp: Date.now() - 86400000 * 3,
      durationSeconds: 900,
      grossWpm: 34.2,
      netWpm: 31.8,
      accuracy: 94.8,
      rawKeystrokes: 2565,
      correctChars: 2430,
      wrongChars: 135,
      backspaces: 42,
      wordCount: 513,
      errorWords: ['commission', 'precedent', 'parliamentary'],
      weakKeys: { c: 5, p: 4, m: 3 },
      isPassed: true,
      cutoffWpm: 30,
      examShortName: 'SSC CGL/CHSL',
      wpmHistory: [28, 30, 32, 33, 34, 34, 35, 33, 34],
    },
    {
      id: 'res_2',
      mode: 'learn',
      title: 'Top Row & Home Row Fusion',
      timestamp: Date.now() - 86400000 * 2,
      durationSeconds: 120,
      grossWpm: 38.6,
      netWpm: 37.1,
      accuracy: 96.5,
      rawKeystrokes: 386,
      correctChars: 372,
      wrongChars: 14,
      backspaces: 8,
      wordCount: 77,
      errorWords: ['poured', 'quiet'],
      weakKeys: { q: 2, p: 2 },
      isPassed: true,
      wpmHistory: [32, 35, 38, 39],
    },
    {
      id: 'res_3',
      mode: 'exam',
      title: 'High Court LDC Speed Drill',
      timestamp: Date.now() - 86400000,
      durationSeconds: 600,
      grossWpm: 42.0,
      netWpm: 40.2,
      accuracy: 97.4,
      rawKeystrokes: 2100,
      correctChars: 2045,
      wrongChars: 55,
      backspaces: 19,
      wordCount: 420,
      errorWords: ['jurisdiction', 'unanimous'],
      weakKeys: { j: 3, x: 2 },
      isPassed: true,
      cutoffWpm: 35,
      examShortName: 'High Court LDC',
      wpmHistory: [36, 38, 41, 42, 43, 41],
    },
  ];
  return initialResults;
}

export function saveTestResult(result: TestResult) {
  try {
    const existing = loadTestResults();
    const updated = [result, ...existing].slice(0, 100);
    localStorage.setItem(STORAGE_KEYS.RESULTS, JSON.stringify(updated));

    // Update weak keys aggregate
    const weakKeysMap = loadWeakKeys();
    Object.entries(result.weakKeys).forEach(([key, count]) => {
      weakKeysMap[key] = (weakKeysMap[key] || 0) + count;
    });
    localStorage.setItem(STORAGE_KEYS.WEAK_KEYS, JSON.stringify(weakKeysMap));

    // Update profile streak
    const profile = loadUserProfile();
    const today = new Date().toISOString().split('T')[0];
    if (profile.lastActiveDate !== today) {
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      if (profile.lastActiveDate === yesterday) {
        profile.streakDays += 1;
      } else {
        profile.streakDays = 1;
      }
      profile.lastActiveDate = today;
      saveUserProfile(profile);
    }
  } catch (err) {
    console.warn('Failed to save test result', err);
  }
}

export function loadWeakKeys(): Record<string, number> {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.WEAK_KEYS);
    if (raw) return JSON.parse(raw);
  } catch (err) {
    console.warn('Failed to load weak keys', err);
  }
  return { q: 14, z: 12, p: 11, x: 9, c: 8, b: 7, ';': 6, '-': 5 };
}

export function loadLessonProgress(): Record<string, LessonProgress> {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.LESSON_PROGRESS);
    if (raw) return JSON.parse(raw);
  } catch (err) {
    console.warn('Failed to load lesson progress', err);
  }

  // Initialize all lessons with first two unlocked
  const initialMap: Record<string, LessonProgress> = {};
  ALL_LESSONS.forEach((l, idx) => {
    initialMap[l.id] = {
      lessonId: l.id,
      unlocked: idx < 3 || l.stageId === 1,
      completed: idx < 2,
      stars: idx < 2 ? 3 : 0,
      bestWpm: idx === 0 ? 28 : idx === 1 ? 31 : 0,
      bestAccuracy: idx === 0 ? 98 : idx === 1 ? 97 : 0,
      attempts: idx < 2 ? 2 : 0,
    };
  });
  return initialMap;
}

export function updateLessonProgress(
  lessonId: string,
  wpm: number,
  accuracy: number,
  targetWpm: number,
  targetAccuracy: number
) {
  try {
    const map = loadLessonProgress();
    const current = map[lessonId] || {
      lessonId,
      unlocked: true,
      completed: false,
      stars: 0,
      bestWpm: 0,
      bestAccuracy: 0,
      attempts: 0,
    };

    const isPassed = wpm >= targetWpm && accuracy >= targetAccuracy;
    let stars = 0;
    if (isPassed) {
      stars = 1;
      if (wpm >= targetWpm + 5 && accuracy >= targetAccuracy + 1) stars = 2;
      if (wpm >= targetWpm + 10 && accuracy >= 98) stars = 3;
    }

    current.attempts += 1;
    current.completed = current.completed || isPassed;
    current.stars = Math.max(current.stars, stars);
    current.bestWpm = Math.max(current.bestWpm, wpm);
    current.bestAccuracy = Math.max(current.bestAccuracy, accuracy);
    current.lastAttemptAt = Date.now();
    map[lessonId] = current;

    // Unlock next lesson
    const currentIndex = ALL_LESSONS.findIndex(l => l.id === lessonId);
    if (isPassed && currentIndex >= 0 && currentIndex + 1 < ALL_LESSONS.length) {
      const nextId = ALL_LESSONS[currentIndex + 1].id;
      if (map[nextId]) {
        map[nextId].unlocked = true;
      }
    }

    localStorage.setItem(STORAGE_KEYS.LESSON_PROGRESS, JSON.stringify(map));
  } catch (err) {
    console.warn('Failed to update lesson progress', err);
  }
}

export function loadCustomPresets(): CustomPreset[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CUSTOM_PRESETS);
    if (raw) return JSON.parse(raw);
  } catch (err) {
    console.warn('Failed to load custom presets', err);
  }
  return [
    {
      id: 'pre_1',
      name: 'SSC 15-Min Official Simulation',
      durationMinutes: 15,
      wordCount: 0,
      allowBackspace: true,
      blindMode: false,
      instantDeath: false,
    },
    {
      id: 'pre_2',
      name: '5-Minute High Intensity Sprint',
      durationMinutes: 5,
      wordCount: 0,
      allowBackspace: true,
      blindMode: false,
      instantDeath: false,
    },
    {
      id: 'pre_3',
      name: '100-Word Zero Tolerance (Blind)',
      durationMinutes: 0,
      wordCount: 100,
      allowBackspace: false,
      blindMode: true,
      instantDeath: true,
    },
  ];
}

export function saveCustomPreset(preset: CustomPreset) {
  try {
    const presets = loadCustomPresets();
    const existingIndex = presets.findIndex(p => p.id === preset.id);
    if (existingIndex >= 0) {
      presets[existingIndex] = preset;
    } else {
      presets.push(preset);
    }
    localStorage.setItem(STORAGE_KEYS.CUSTOM_PRESETS, JSON.stringify(presets));
  } catch (err) {
    console.warn('Failed to save preset', err);
  }
}

export function resetAllData() {
  localStorage.removeItem(STORAGE_KEYS.PROFILE);
  localStorage.removeItem(STORAGE_KEYS.SETTINGS);
  localStorage.removeItem(STORAGE_KEYS.RESULTS);
  localStorage.removeItem(STORAGE_KEYS.LESSON_PROGRESS);
  localStorage.removeItem(STORAGE_KEYS.CUSTOM_PRESETS);
  localStorage.removeItem(STORAGE_KEYS.WEAK_KEYS);
}
