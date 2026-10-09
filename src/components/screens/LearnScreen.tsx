import React, { useState } from 'react';
import { 
  CheckCircle, 
  ChevronRight, 
  Lock, 
  Play, 
  Shuffle, 
  Star, 
  Target 
} from 'lucide-react';
import { ALL_LESSONS, LESSON_STAGES } from '../../data/lessonsData';
import { Lesson, LessonProgress } from '../../types';

interface LearnScreenProps {
  progressMap: Record<string, LessonProgress>;
  onStartLesson: (lesson: Lesson) => void;
}

export const LearnScreen: React.FC<LearnScreenProps> = ({
  progressMap,
  onStartLesson,
}) => {
  const [selectedStageId, setSelectedStageId] = useState<number>(1);

  const currentStage = LESSON_STAGES.find(s => s.id === selectedStageId) || LESSON_STAGES[0];
  const stageLessons = ALL_LESSONS.filter(l => l.stageId === selectedStageId);

  // Overall progress
  const completedCount = Object.values(progressMap).filter(p => p.completed).length;
  const totalLessons = ALL_LESSONS.length;

  const handleShuffleStart = () => {
    const unlocked = stageLessons.filter(l => progressMap[l.id]?.unlocked);
    if (unlocked.length > 0) {
      const randomLesson = unlocked[Math.floor(Math.random() * unlocked.length)];
      onStartLesson(randomLesson);
    } else {
      onStartLesson(stageLessons[0]);
    }
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto pb-6">
      {/* Header bar */}
      <div className="p-4 sm:p-5 border-b border-zinc-800/60 bg-zinc-900/40">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight">Learn Module</h1>
            <p className="text-xs text-zinc-400">Stages 1 to 10 · Touch Typing Mastery</p>
          </div>
          <button
            type="button"
            onClick={handleShuffleStart}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold hover:bg-amber-500/20 active:scale-95 transition-all"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span>Random Drill</span>
          </button>
        </div>

        {/* Global Progress Bar */}
        <div className="flex items-center justify-between text-xs text-zinc-400 mb-1.5">
          <span>Overall Curriculum Progress</span>
          <span className="font-mono text-zinc-200">{completedCount} / {totalLessons} Lessons ({Math.round((completedCount / totalLessons) * 100)}%)</span>
        </div>
        <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-amber-400 transition-all duration-300"
            style={{ width: `${(completedCount / totalLessons) * 100}%` }}
          />
        </div>
      </div>

      {/* Stage Horizontal Tab Scroller */}
      <div className="flex items-center gap-2 px-4 py-3 overflow-x-auto border-b border-zinc-800/40 bg-zinc-950/60 no-scrollbar">
        {LESSON_STAGES.map((stg) => {
          const isSelected = stg.id === selectedStageId;
          const stageLessonsList = ALL_LESSONS.filter(l => l.stageId === stg.id);
          const stageCompletedCount = stageLessonsList.filter(l => progressMap[l.id]?.completed).length;

          return (
            <button
              key={stg.id}
              type="button"
              onClick={() => setSelectedStageId(stg.id)}
              className={`
                shrink-0 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex flex-col items-start
                ${
                  isSelected
                    ? 'bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/20'
                    : 'bg-zinc-900/80 text-zinc-300 border border-zinc-800/80 hover:border-zinc-700'
                }
              `}
            >
              <span>{stg.title.split(':')[0]}</span>
              <span className={`text-[10px] font-normal ${isSelected ? 'text-zinc-900' : 'text-zinc-500'}`}>
                {stageCompletedCount}/{stg.totalLessons} done
              </span>
            </button>
          );
        })}
      </div>

      {/* Current Stage Overview Card */}
      <div className="px-4 pt-4">
        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white">{currentStage.title}</h2>
            <span className="text-[11px] font-medium text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-full">
              {currentStage.subtitle}
            </span>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            {currentStage.description}
          </p>
        </div>
      </div>

      {/* Lesson List */}
      <div className="px-4 pt-4 flex flex-col gap-2.5">
        <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
          Lessons ({stageLessons.length})
        </h3>

        {stageLessons.map((lesson, idx) => {
          const prog = progressMap[lesson.id] || {
            lessonId: lesson.id,
            unlocked: idx === 0 || selectedStageId === 1,
            completed: false,
            stars: 0,
            bestWpm: 0,
            bestAccuracy: 0,
            attempts: 0,
          };

          const isUnlocked = prog.unlocked;

          return (
            <div
              key={lesson.id}
              className={`
                p-3.5 rounded-2xl border transition-all flex items-center justify-between
                ${
                  isUnlocked
                    ? 'bg-zinc-900/70 border-zinc-800/90 hover:border-zinc-700 cursor-pointer'
                    : 'bg-zinc-950/40 border-zinc-900 opacity-60'
                }
              `}
              onClick={() => {
                if (isUnlocked) onStartLesson(lesson);
              }}
            >
              <div className="flex items-center gap-3">
                <div className={`
                  w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0
                  ${
                    prog.completed
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : isUnlocked
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      : 'bg-zinc-800 text-zinc-600'
                  }
                `}>
                  {prog.completed ? (
                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                  ) : isUnlocked ? (
                    <span>{idx + 1}</span>
                  ) : (
                    <Lock className="w-4 h-4 text-zinc-500" />
                  )}
                </div>

                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs sm:text-sm font-semibold text-zinc-100">
                      {lesson.title}
                    </h4>
                  </div>
                  <span className="text-[11px] text-zinc-400 line-clamp-1">
                    {lesson.subtitle}
                  </span>

                  <div className="flex items-center gap-3 mt-1 text-[10px] text-zinc-400">
                    <span>Target: <span className="font-mono text-zinc-300 font-semibold">{lesson.targetWpm} WPM</span></span>
                    <span>Acc: <span className="font-mono text-zinc-300 font-semibold">{lesson.targetAccuracy}%</span></span>
                    {prog.bestWpm > 0 && (
                      <span className="text-emerald-400 font-mono">Best: {prog.bestWpm} WPM</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Action & Stars */}
              <div className="flex items-center gap-2 shrink-0">
                {isUnlocked && (
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3].map((starIdx) => (
                      <Star
                        key={starIdx}
                        className={`w-3.5 h-3.5 ${
                          starIdx <= prog.stars
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-zinc-700'
                        }`}
                      />
                    ))}
                  </div>
                )}

                {isUnlocked ? (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onStartLesson(lesson);
                    }}
                    className="p-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 active:scale-95 transition-all"
                  >
                    <Play className="w-4 h-4 fill-amber-400" />
                  </button>
                ) : (
                  <div className="p-2 text-zinc-600">
                    <Lock className="w-4 h-4" />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
