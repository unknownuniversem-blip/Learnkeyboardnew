import React from 'react';
import { 
  Award, 
  BookOpen, 
  ChevronRight, 
  Flame, 
  Play, 
  Sliders, 
  Target, 
  TrendingUp, 
  Zap 
} from 'lucide-react';
import { ExamConfig, ScreenType, TestResult, UserProfile } from '../../types';
import { EXAM_CONFIGS } from '../../data/examsData';
import { AdBanner } from '../common/AdBanner';

interface HomeScreenProps {
  profile: UserProfile;
  results: TestResult[];
  onNavigate: (screen: ScreenType) => void;
  onStartQuickTest: () => void;
  onSelectExam: (exam: ExamConfig) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  profile,
  results,
  onNavigate,
  onStartQuickTest,
  onSelectExam,
}) => {
  // Aggregate stats
  const totalTests = results.length;
  const avgWpm = totalTests > 0
    ? Math.round(results.reduce((acc, r) => acc + r.netWpm, 0) / totalTests)
    : 0;
  const bestWpm = totalTests > 0
    ? Math.max(...results.map(r => r.netWpm))
    : 0;
  const avgAccuracy = totalTests > 0
    ? Math.round((results.reduce((acc, r) => acc + r.accuracy, 0) / totalTests) * 10) / 10
    : 100;

  // Daily goal calculation (e.g. 15 mins)
  const goalMinutes = profile.dailyGoalMinutes || 15;
  const practicedMinutesToday = 12; // 12 mins today
  const progressRatio = Math.min(1, practicedMinutesToday / goalMinutes);
  const strokeDash = 2 * Math.PI * 26; // r = 26

  const targetExam = EXAM_CONFIGS.find(e => e.id === profile.targetExamId) || EXAM_CONFIGS[0];

  return (
    <div className="flex flex-col h-full overflow-y-auto pb-6">
      {/* Top Banner / Header */}
      <div className="p-4 sm:p-5 border-b border-zinc-800/60 bg-gradient-to-b from-zinc-900/60 to-transparent">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden border border-amber-500/40 shadow-md shadow-amber-500/10">
              <img 
                src="/src/assets/images/typemaster_app_icon_1791577217868.jpg" 
                alt="TypeMaster Pro" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <h1 className="text-base font-bold text-white tracking-tight flex items-center gap-1.5">
                TypeMaster Pro
                <span className="text-[10px] font-semibold text-amber-400 bg-amber-500/15 border border-amber-500/30 px-1.5 py-0.2 rounded-full uppercase">
                  Exam Edition
                </span>
              </h1>
              <p className="text-xs text-zinc-400">Targeting {targetExam.shortName} · Cutoff {targetExam.cutoffWpm} WPM</p>
            </div>
          </div>

          {/* Daily streak indicator */}
          <div className="flex items-center gap-1.5 bg-orange-500/10 border border-orange-500/30 text-orange-400 px-3 py-1.5 rounded-full text-xs font-semibold">
            <Flame className="w-4 h-4 fill-orange-500 text-orange-500 animate-pulse" />
            <span>{profile.streakDays} Day Streak</span>
          </div>
        </div>

        {/* Daily Goal & Overview Strip */}
        <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-zinc-900/80 border border-zinc-800">
          {/* Goal Ring */}
          <div className="flex items-center gap-2.5 col-span-1 border-r border-zinc-800/80 pr-2">
            <div className="relative w-14 h-14 shrink-0 flex items-center justify-center">
              <svg className="w-14 h-14 -rotate-90" viewBox="0 0 60 60">
                <circle
                  cx="30"
                  cy="30"
                  r="26"
                  stroke="currentColor"
                  strokeWidth="5"
                  className="text-zinc-800"
                  fill="transparent"
                />
                <circle
                  cx="30"
                  cy="30"
                  r="26"
                  stroke="currentColor"
                  strokeWidth="5"
                  className="text-amber-500"
                  strokeDasharray={strokeDash}
                  strokeDashoffset={strokeDash * (1 - progressRatio)}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <span className="absolute text-[11px] font-mono font-bold text-zinc-200">
                {Math.round(progressRatio * 100)}%
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] text-zinc-400">Daily Target</span>
              <span className="text-xs font-semibold text-zinc-200">{practicedMinutesToday}/{goalMinutes}m</span>
            </div>
          </div>

          {/* Avg Net WPM */}
          <div className="flex flex-col justify-center px-2 border-r border-zinc-800/80">
            <span className="text-[11px] text-zinc-400">Average WPM</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-lg font-bold font-mono text-emerald-400">{avgWpm}</span>
              <span className="text-[10px] text-zinc-500">Net</span>
            </div>
          </div>

          {/* Best Speed */}
          <div className="flex flex-col justify-center px-2">
            <span className="text-[11px] text-zinc-400">Peak Record</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-lg font-bold font-mono text-amber-400">{bestWpm}</span>
              <span className="text-[10px] text-zinc-500">WPM</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main CTA: Big Instant Test Button */}
      <div className="px-4 sm:px-5 pt-4">
        <button
          type="button"
          onClick={onStartQuickTest}
          className="w-full relative overflow-hidden rounded-2xl p-4 bg-gradient-to-r from-amber-500 to-amber-600 text-zinc-950 font-bold shadow-lg shadow-amber-500/20 active:scale-[0.99] transition-transform text-left group"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-zinc-900/80 mb-1">
                <Zap className="w-3.5 h-3.5 fill-current" />
                1-Minute Speed Sprint
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-zinc-950">
                Start Typing Test
              </h2>
              <p className="text-xs text-zinc-900/80 mt-0.5">
                Benchmark your WPM, accuracy & finger coordination instantly
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-zinc-950 text-amber-400 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform shrink-0">
              <Play className="w-6 h-6 fill-amber-400 ml-0.5" />
            </div>
          </div>
        </button>
      </div>

      {/* Primary Action Modules Grid */}
      <div className="px-4 sm:px-5 pt-4">
        <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2.5">
          Mastery Portals
        </h3>

        <div className="grid grid-cols-2 gap-3">
          {/* Learn Module */}
          <button
            type="button"
            onClick={() => onNavigate('learn')}
            className="p-3.5 rounded-2xl bg-zinc-900/70 border border-zinc-800 hover:border-zinc-700 active:scale-[0.98] transition-all text-left flex flex-col justify-between group"
          >
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 flex items-center justify-center mb-2.5">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-zinc-100 group-hover:text-blue-400 transition-colors">
                Learn Module
              </h4>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                Stages 1–10 · Finger guide & muscle memory
              </p>
            </div>
          </button>

          {/* Exam Practice */}
          <button
            type="button"
            onClick={() => onNavigate('exams')}
            className="p-3.5 rounded-2xl bg-zinc-900/70 border border-zinc-800 hover:border-zinc-700 active:scale-[0.98] transition-all text-left flex flex-col justify-between group"
          >
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mb-2.5">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-zinc-100 group-hover:text-amber-400 transition-colors">
                Exam Practice
              </h4>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                SSC, CPCT, RRB, High Court official tests
              </p>
            </div>
          </button>

          {/* Custom Practice */}
          <button
            type="button"
            onClick={() => onNavigate('custom')}
            className="p-3.5 rounded-2xl bg-zinc-900/70 border border-zinc-800 hover:border-zinc-700 active:scale-[0.98] transition-all text-left flex flex-col justify-between group"
          >
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400 flex items-center justify-center mb-2.5">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-zinc-100 group-hover:text-purple-400 transition-colors">
                Custom Practice
              </h4>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                Custom text, time & blind modes
              </p>
            </div>
          </button>

          {/* Analytics */}
          <button
            type="button"
            onClick={() => onNavigate('stats')}
            className="p-3.5 rounded-2xl bg-zinc-900/70 border border-zinc-800 hover:border-zinc-700 active:scale-[0.98] transition-all text-left flex flex-col justify-between group"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mb-2.5">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-zinc-100 group-hover:text-emerald-400 transition-colors">
                Analytics & Keys
              </h4>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                Weak key heatmap & speed curves
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Target Exam Focus Bar */}
      <div className="px-4 sm:px-5 pt-5">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
            Exam Focus: {targetExam.shortName}
          </h3>
          <button 
            type="button"
            onClick={() => onNavigate('exams')}
            className="text-xs text-amber-400 hover:underline"
          >
            All Exams
          </button>
        </div>

        <div className="p-3.5 rounded-2xl bg-zinc-900/50 border border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center font-bold text-sm">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">{targetExam.name}</h4>
              <p className="text-xs text-zinc-400">
                Official Cutoff: <span className="text-amber-400 font-mono font-medium">{targetExam.cutoffWpm} WPM</span> · {targetExam.durationMinutes} Mins · {targetExam.errorAllowancePercent}% error margin
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onSelectExam(targetExam)}
            className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-semibold text-xs rounded-xl transition-colors shrink-0"
          >
            Practice
          </button>
        </div>
      </div>

      {/* Inline Native Ad */}
      <div className="px-4 sm:px-5 pt-3">
        <AdBanner placement="inline" />
      </div>

      {/* Recent History Preview */}
      <div className="px-4 sm:px-5 pt-3">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
            Recent Practice Sessions
          </h3>
          <button 
            type="button"
            onClick={() => onNavigate('stats')}
            className="text-xs text-zinc-400 hover:text-zinc-200"
          >
            View All ({totalTests})
          </button>
        </div>

        <div className="flex flex-col gap-2">
          {results.slice(0, 3).map((res) => (
            <div
              key={res.id}
              className="p-3 rounded-xl bg-zinc-900/40 border border-zinc-800/80 flex items-center justify-between"
            >
              <div className="flex flex-col">
                <span className="text-xs font-medium text-zinc-200 truncate max-w-[200px]">
                  {res.title}
                </span>
                <span className="text-[10px] text-zinc-500">
                  {new Date(res.timestamp).toLocaleDateString()} · {Math.round(res.durationSeconds / 60)} min
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-xs font-mono font-bold text-emerald-400">
                    {res.netWpm} <span className="text-[10px] text-zinc-400 font-normal">WPM</span>
                  </div>
                  <div className="text-[10px] text-zinc-400 font-mono">
                    {res.accuracy}% acc
                  </div>
                </div>
                {res.isPassed !== undefined && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${res.isPassed ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                    {res.isPassed ? 'PASS' : 'FAIL'}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
