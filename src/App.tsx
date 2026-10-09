/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { 
  ExamConfig, 
  ExamPassage, 
  Lesson, 
  LessonProgress, 
  ScreenType, 
  TestResult, 
  TestSessionConfig, 
  UserProfile, 
  UserSettings 
} from './types';
import { 
  loadLessonProgress, 
  loadTestResults, 
  loadUserProfile, 
  loadUserSettings, 
  saveTestResult, 
  saveUserProfile, 
  saveUserSettings, 
  updateLessonProgress 
} from './utils/storage';
import { EXAM_CONFIGS, EXAM_PASSAGES } from './data/examsData';
import { ALL_LESSONS } from './data/lessonsData';
import { DeviceFrame } from './components/layout/DeviceFrame';
import { HomeScreen } from './components/screens/HomeScreen';
import { LearnScreen } from './components/screens/LearnScreen';
import { ExamPracticeScreen } from './components/screens/ExamPracticeScreen';
import { CustomPracticeScreen } from './components/screens/CustomPracticeScreen';
import { StatsScreen } from './components/screens/StatsScreen';
import { ProfileScreen } from './components/screens/ProfileScreen';
import { TypingTestScreen } from './components/screens/TypingTestScreen';
import { TestResultScreen } from './components/screens/TestResultScreen';

export default function App() {
  const [profile, setProfile] = useState<UserProfile>(() => loadUserProfile());
  const [settings, setSettings] = useState<UserSettings>(() => loadUserSettings());
  const [results, setResults] = useState<TestResult[]>(() => loadTestResults());
  const [progressMap, setProgressMap] = useState<Record<string, LessonProgress>>(() =>
    loadLessonProgress()
  );

  const [activeScreen, setActiveScreen] = useState<ScreenType>('home');
  const [currentTestSession, setCurrentTestSession] = useState<TestSessionConfig | null>(null);
  const [lastTestResult, setLastTestResult] = useState<TestResult | null>(null);
  const [selectedExamForPractice, setSelectedExamForPractice] = useState<string | undefined>(undefined);

  // Sync profile & settings to localStorage
  const handleUpdateProfile = (newProfile: UserProfile) => {
    setProfile(newProfile);
    saveUserProfile(newProfile);
  };

  const handleUpdateSettings = (newSettings: UserSettings) => {
    setSettings(newSettings);
    saveUserSettings(newSettings);
  };

  const handleResetData = () => {
    setProfile(loadUserProfile());
    setSettings(loadUserSettings());
    setResults(loadTestResults());
    setProgressMap(loadLessonProgress());
    setActiveScreen('home');
  };

  // Quick 1-minute test starter
  const handleStartQuickTest = () => {
    const defaultExam = EXAM_CONFIGS.find(e => e.id === profile.targetExamId) || EXAM_CONFIGS[0];
    const passage = EXAM_PASSAGES[0];

    const session: TestSessionConfig = {
      mode: 'quick',
      title: '1-Minute Speed Benchmark',
      text: passage.text,
      durationSeconds: 60,
      examConfig: defaultExam,
      allowBackspace: true,
      blindMode: false,
      instantDeath: false,
      language: 'en',
    };

    setCurrentTestSession(session);
    setActiveScreen('test');
  };

  // Start selected Lesson
  const handleStartLesson = (lesson: Lesson) => {
    const session: TestSessionConfig = {
      mode: 'learn',
      title: `${lesson.title} (${lesson.targetWpm} WPM)`,
      text: lesson.text,
      durationSeconds: 0, // count-up until complete
      lessonId: lesson.id,
      allowBackspace: true,
      blindMode: false,
      instantDeath: false,
      language: 'en',
    };

    setCurrentTestSession(session);
    setActiveScreen('test');
  };

  // Start Exam Simulation
  const handleStartExam = (
    exam: ExamConfig,
    passage: ExamPassage,
    durationMinutes: number,
    language: 'en' | 'hi'
  ) => {
    const session: TestSessionConfig = {
      mode: 'exam',
      title: `${exam.shortName} Official Simulation (${durationMinutes}m)`,
      text: passage.text,
      durationSeconds: durationMinutes * 60,
      examConfig: exam,
      allowBackspace: exam.backspaceRule !== 'disabled',
      blindMode: false,
      instantDeath: false,
      language,
    };

    setCurrentTestSession(session);
    setActiveScreen('test');
  };

  // Start Custom Test
  const handleStartCustomTest = (sessionConfig: TestSessionConfig) => {
    setCurrentTestSession(sessionConfig);
    setActiveScreen('test');
  };

  // Handle Finished Test Result
  const handleFinishTest = (result: TestResult) => {
    saveTestResult(result);
    setResults(loadTestResults());
    setLastTestResult(result);

    // If it was a lesson, update progress & unlock next
    if (result.mode === 'learn' && currentTestSession?.lessonId) {
      const lesson = ALL_LESSONS.find(l => l.id === currentTestSession.lessonId);
      if (lesson) {
        updateLessonProgress(
          lesson.id,
          result.netWpm,
          result.accuracy,
          lesson.targetWpm,
          lesson.targetAccuracy
        );
        setProgressMap(loadLessonProgress());
      }
    }

    // Update streak in memory
    setProfile(loadUserProfile());
  };

  // Navigate to exam screen with specific exam preselected
  const handleSelectExamFromHome = (exam: ExamConfig) => {
    setSelectedExamForPractice(exam.id);
    setActiveScreen('exams');
  };

  return (
    <DeviceFrame
      activeScreen={activeScreen}
      onNavigate={(screen) => {
        if (screen !== 'test') {
          setCurrentTestSession(null);
        }
        setActiveScreen(screen);
      }}
      settings={settings}
      onUpdateSettings={handleUpdateSettings}
      isTesting={activeScreen === 'test' && !lastTestResult}
    >
      {/* Active screen routing */}
      {activeScreen === 'test' ? (
        lastTestResult ? (
          <TestResultScreen
            result={lastTestResult}
            onRetry={() => {
              setLastTestResult(null);
              // Restart same test
            }}
            onNext={() => {
              setLastTestResult(null);
              setCurrentTestSession(null);
              setActiveScreen('home');
            }}
            onGoHome={() => {
              setLastTestResult(null);
              setCurrentTestSession(null);
              setActiveScreen('home');
            }}
          />
        ) : currentTestSession ? (
          <TypingTestScreen
            sessionConfig={currentTestSession}
            settings={settings}
            onFinishTest={handleFinishTest}
            onCancelTest={() => {
              setCurrentTestSession(null);
              setActiveScreen('home');
            }}
          />
        ) : null
      ) : activeScreen === 'home' ? (
        <HomeScreen
          profile={profile}
          results={results}
          onNavigate={setActiveScreen}
          onStartQuickTest={handleStartQuickTest}
          onSelectExam={handleSelectExamFromHome}
        />
      ) : activeScreen === 'learn' ? (
        <LearnScreen
          progressMap={progressMap}
          onStartLesson={handleStartLesson}
        />
      ) : activeScreen === 'exams' ? (
        <ExamPracticeScreen
          selectedExamId={selectedExamForPractice}
          onStartExam={handleStartExam}
        />
      ) : activeScreen === 'custom' ? (
        <CustomPracticeScreen onStartCustomTest={handleStartCustomTest} />
      ) : activeScreen === 'stats' ? (
        <StatsScreen results={results} profile={profile} />
      ) : activeScreen === 'profile' ? (
        <ProfileScreen
          profile={profile}
          settings={settings}
          onUpdateProfile={handleUpdateProfile}
          onUpdateSettings={handleUpdateSettings}
          onResetData={handleResetData}
        />
      ) : null}
    </DeviceFrame>
  );
}
