import React, { useState } from 'react';
import { 
  BarChart2, 
  Calendar, 
  Clock, 
  Download, 
  Flame, 
  HelpCircle, 
  Keyboard as KeyboardIcon, 
  Sparkles, 
  Target, 
  TrendingUp, 
  Zap 
} from 'lucide-react';
import { TestResult, UserProfile } from '../../types';
import { loadWeakKeys } from '../../utils/storage';
import { AdBanner } from '../common/AdBanner';

interface StatsScreenProps {
  results: TestResult[];
  profile: UserProfile;
}

const HEATMAP_ROWS = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm'],
];

export const StatsScreen: React.FC<StatsScreenProps> = ({ results, profile }) => {
  const [weakKeysMap] = useState<Record<string, number>>(() => loadWeakKeys());

  const totalTests = results.length;
  const avgWpm = totalTests > 0
    ? Math.round(results.reduce((acc, r) => acc + r.netWpm, 0) / totalTests)
    : 0;
  const bestWpm = totalTests > 0
    ? Math.max(...results.map((r) => r.netWpm))
    : 0;
  const avgAccuracy = totalTests > 0
    ? Math.round((results.reduce((acc, r) => acc + r.accuracy, 0) / totalTests) * 10) / 10
    : 100;

  // Max errors on any single key for color normalization
  const maxKeyErrors = Math.max(1, ...Object.values(weakKeysMap));

  // Extract frequent mistyped words
  const errorWordsFreq: Record<string, number> = {};
  results.forEach((r) => {
    r.errorWords?.forEach((w) => {
      errorWordsFreq[w] = (errorWordsFreq[w] || 0) + 1;
    });
  });
  const topErrorWords = Object.entries(errorWordsFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  // Time of day performance breakdown
  const timePerformance = {
    Morning: { count: 0, wpmTotal: 0 },
    Afternoon: { count: 0, wpmTotal: 0 },
    Evening: { count: 0, wpmTotal: 0 },
    Night: { count: 0, wpmTotal: 0 },
  };

  results.forEach((r) => {
    const hours = new Date(r.timestamp).getHours();
    let slot: keyof typeof timePerformance = 'Morning';
    if (hours >= 12 && hours < 17) slot = 'Afternoon';
    else if (hours >= 17 && hours < 22) slot = 'Evening';
    else if (hours >= 22 || hours < 5) slot = 'Night';

    timePerformance[slot].count += 1;
    timePerformance[slot].wpmTotal += r.netWpm;
  });

  const handleExportCsv = () => {
    const rows = [
      'ID,Date,Mode,Title,Gross WPM,Net WPM,Accuracy,Duration(s),Passed',
      ...results.map(
        (r) =>
          `${r.id},${new Date(r.timestamp).toISOString()},${r.mode},"${r.title}",${r.grossWpm},${r.netWpm},${r.accuracy}%,${r.durationSeconds},${r.isPassed ? 'Yes' : 'No'}`
      ),
    ];
    const encodedUri = encodeURI('data:text/csv;charset=utf-8,' + rows.join('\n'));
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `TypeMaster_All_Results_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto pb-6">
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-zinc-800/60 bg-zinc-900/40">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              Analytics & Analytics Engine
            </h1>
            <p className="text-xs text-zinc-400">
              Exam performance metrics, weak key detection & typing trends
            </p>
          </div>
          <button
            type="button"
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold hover:bg-emerald-500/20 active:scale-95 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      <div className="p-4 flex flex-col gap-4">
        {/* KPI Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div className="p-3.5 rounded-2xl bg-zinc-900/70 border border-zinc-800">
            <span className="text-[11px] text-zinc-400 block mb-1">Average Net WPM</span>
            <span className="text-2xl font-bold font-mono text-emerald-400">{avgWpm}</span>
            <span className="text-[10px] text-zinc-500 block font-mono">Benchmark</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-zinc-900/70 border border-zinc-800">
            <span className="text-[11px] text-zinc-400 block mb-1">All-Time Peak</span>
            <span className="text-2xl font-bold font-mono text-amber-400">{bestWpm}</span>
            <span className="text-[10px] text-zinc-500 block font-mono">Personal Best</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-zinc-900/70 border border-zinc-800">
            <span className="text-[11px] text-zinc-400 block mb-1">Average Accuracy</span>
            <span className="text-2xl font-bold font-mono text-zinc-100">{avgAccuracy}%</span>
            <span className="text-[10px] text-zinc-500 block font-mono">Precision</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-zinc-900/70 border border-zinc-800">
            <span className="text-[11px] text-zinc-400 block mb-1">Total Tests Taken</span>
            <span className="text-2xl font-bold font-mono text-purple-400">{totalTests}</span>
            <span className="text-[10px] text-zinc-500 block font-mono">Completed</span>
          </div>
        </div>

        {/* WPM Progress Timeline (Interactive SVG) */}
        <div className="p-4 rounded-2xl bg-zinc-900/70 border border-zinc-800 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
              Net WPM History Over Tests
            </h3>
            <span className="text-[11px] text-zinc-400 font-mono">Recent {Math.min(15, results.length)} Tests</span>
          </div>

          <div className="w-full h-36 relative flex items-end pt-4">
            {results.length > 0 ? (
              <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 50">
                {/* 35 WPM cutoff guideline */}
                <line
                  x1="0"
                  y1={45 - (35 / 65) * 40}
                  x2="100"
                  y2={45 - (35 / 65) * 40}
                  stroke="rgba(245, 158, 11, 0.4)"
                  strokeDasharray="2 2"
                  strokeWidth="0.8"
                />
                <polyline
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={results
                    .slice(0, 15)
                    .reverse()
                    .map((r, idx, arr) => {
                      const x = arr.length > 1 ? (idx / (arr.length - 1)) * 100 : 50;
                      const y = 45 - (r.netWpm / 65) * 40;
                      return `${x},${y}`;
                    })
                    .join(' ')}
                />
              </svg>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs text-zinc-500">
                Complete your first test to generate your performance curve.
              </div>
            )}
          </div>
          <div className="flex items-center justify-between text-[10px] text-zinc-500 font-mono">
            <span>Older Tests</span>
            <span className="text-amber-400">--- 35 WPM SSC/High Court Cutoff</span>
            <span>Latest Session</span>
          </div>
        </div>

        {/* Weak Keys Keyboard Heatmap */}
        <div className="p-4 rounded-2xl bg-zinc-900/70 border border-zinc-800 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
              <KeyboardIcon className="w-3.5 h-3.5 text-rose-400" />
              Weak Keys Error Heatmap
            </h3>
            <span className="text-[10px] text-zinc-500">Red = High Error Frequency</span>
          </div>

          <p className="text-xs text-zinc-400">
            Keys where your fingers make the most frequent slips. Prioritize these keys in Stage 9 drills.
          </p>

          <div className="flex flex-col gap-1.5 items-center w-full max-w-md mx-auto pt-2">
            {HEATMAP_ROWS.map((row, rIdx) => (
              <div key={rIdx} className="flex justify-center gap-1 w-full">
                {row.map((k) => {
                  const errorCount = weakKeysMap[k] || 0;
                  const ratio = errorCount / maxKeyErrors;

                  let heatBg = 'bg-zinc-950 text-zinc-400 border-zinc-800';
                  if (errorCount > 0) {
                    if (ratio > 0.6) heatBg = 'bg-rose-500/30 text-rose-300 border-rose-500/60 font-bold';
                    else if (ratio > 0.3) heatBg = 'bg-amber-500/20 text-amber-300 border-amber-500/50';
                    else heatBg = 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30';
                  }

                  return (
                    <div
                      key={k}
                      className={`
                        w-8 h-8 rounded-lg border flex flex-col items-center justify-center font-mono text-xs
                        ${heatBg}
                      `}
                      title={`${k.toUpperCase()}: ${errorCount} errors`}
                    >
                      <span>{k.toUpperCase()}</span>
                      {errorCount > 0 && (
                        <span className="text-[8px] opacity-75 font-sans leading-none">{errorCount}</span>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* 30-Day Streak Grid */}
        <div className="p-4 rounded-2xl bg-zinc-900/70 border border-zinc-800 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-orange-400" />
              30-Day Activity Calendar
            </h3>
            <div className="flex items-center gap-1 text-xs text-orange-400 font-semibold">
              <Flame className="w-3.5 h-3.5 fill-current" />
              <span>{profile.streakDays} Days Streak</span>
            </div>
          </div>

          <div className="grid grid-cols-10 gap-1.5 pt-2">
            {Array.from({ length: 30 }).map((_, idx) => {
              const isFilled = idx >= 30 - profile.streakDays;
              return (
                <div
                  key={idx}
                  className={`h-5 rounded-md border ${
                    isFilled
                      ? 'bg-orange-500 border-orange-400 shadow-sm shadow-orange-500/20'
                      : 'bg-zinc-950 border-zinc-800'
                  }`}
                  title={`Day ${idx + 1}`}
                />
              );
            })}
          </div>
          <span className="text-[10px] text-zinc-500 font-mono text-right">
            Practiced today · Next milestone: 7 Days
          </span>
        </div>

        {/* Time of Day Performance */}
        <div className="p-4 rounded-2xl bg-zinc-900/70 border border-zinc-800 flex flex-col gap-3">
          <h3 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-blue-400" />
            Time-of-Day Cadence
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {Object.entries(timePerformance).map(([slot, data]) => {
              const avg = data.count > 0 ? Math.round(data.wpmTotal / data.count) : 0;
              return (
                <div key={slot} className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800/80">
                  <span className="text-[11px] text-zinc-400 block">{slot}</span>
                  <span className="text-base font-bold font-mono text-zinc-100">{avg} WPM</span>
                  <span className="text-[10px] text-zinc-500 block font-mono">{data.count} sessions</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Ad Banner */}
        <AdBanner />
      </div>
    </div>
  );
};
