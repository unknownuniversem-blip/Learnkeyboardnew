import React, { useState } from 'react';
import { 
  AlertCircle, 
  Award, 
  CheckCircle2, 
  Clock, 
  FileText, 
  Globe2, 
  Play, 
  Settings2, 
  ShieldCheck, 
  Sparkles 
} from 'lucide-react';
import { EXAM_CONFIGS, EXAM_PASSAGES } from '../../data/examsData';
import { ExamConfig, ExamPassage } from '../../types';

interface ExamPracticeScreenProps {
  onStartExam: (
    exam: ExamConfig,
    passage: ExamPassage,
    durationMinutes: number,
    language: 'en' | 'hi'
  ) => void;
  selectedExamId?: string;
}

export const ExamPracticeScreen: React.FC<ExamPracticeScreenProps> = ({
  onStartExam,
  selectedExamId,
}) => {
  const [activeExam, setActiveExam] = useState<ExamConfig>(() => {
    return (
      EXAM_CONFIGS.find((e) => e.id === selectedExamId) || EXAM_CONFIGS[0]
    );
  });

  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const [customDuration, setCustomDuration] = useState<number>(activeExam.durationMinutes);
  const [selectedPassageId, setSelectedPassageId] = useState<string>('random');

  // Filter passages by language and exam
  const availablePassages = EXAM_PASSAGES.filter(
    (p) => p.language === language && (p.examId === activeExam.id || p.examId === 'all')
  );

  const fallbackPassages = EXAM_PASSAGES.filter((p) => p.language === language);
  const effectivePassages = availablePassages.length > 0 ? availablePassages : fallbackPassages;

  const handleLaunch = () => {
    let chosenPassage: ExamPassage;
    if (selectedPassageId === 'random' || !effectivePassages.find((p) => p.id === selectedPassageId)) {
      chosenPassage = effectivePassages[Math.floor(Math.random() * effectivePassages.length)];
    } else {
      chosenPassage = effectivePassages.find((p) => p.id === selectedPassageId)!;
    }

    onStartExam(activeExam, chosenPassage, customDuration, language);
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto pb-6">
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-zinc-800/60 bg-zinc-900/40">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              Indian Competitive Exams
              <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                Real Cutoffs
              </span>
            </h1>
            <p className="text-xs text-zinc-400">
              SSC, CPCT, RRB, High Court & Police Recruitment Typing Tests
            </p>
          </div>
        </div>
      </div>

      {/* Exam Selector Horizontal Pills */}
      <div className="flex items-center gap-2 px-4 py-3 overflow-x-auto border-b border-zinc-800/40 bg-zinc-950/60 no-scrollbar">
        {EXAM_CONFIGS.map((exam) => {
          const isSelected = exam.id === activeExam.id;
          return (
            <button
              key={exam.id}
              type="button"
              onClick={() => {
                setActiveExam(exam);
                setCustomDuration(exam.durationMinutes);
              }}
              className={`
                shrink-0 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap
                ${
                  isSelected
                    ? 'bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/20'
                    : 'bg-zinc-900/80 text-zinc-300 border border-zinc-800/80 hover:border-zinc-700'
                }
              `}
            >
              {exam.shortName}
            </button>
          );
        })}
      </div>

      {/* Main Exam Configuration Container */}
      <div className="px-4 pt-4 flex flex-col gap-4">
        {/* Active Exam Highlights Card */}
        <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 flex flex-col gap-3">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-medium text-amber-400">
                {activeExam.organization}
              </span>
              <h2 className="text-base font-bold text-white mt-0.5">
                {activeExam.name}
              </h2>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-lg font-mono font-bold text-amber-400">
                {language === 'hi' && activeExam.hindiCutoffWpm ? activeExam.hindiCutoffWpm : activeExam.cutoffWpm} WPM
              </span>
              <span className="text-[10px] text-zinc-400">Qualifying Cutoff</span>
            </div>
          </div>

          <p className="text-xs text-zinc-400 leading-relaxed">
            {activeExam.description}
          </p>

          {/* Highlights checklist */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-zinc-800/80">
            {activeExam.keyHighlights.map((hl, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs text-zinc-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{hl}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Test Options (Language, Duration, Passage) */}
        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex flex-col gap-4">
          <h3 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
            <Settings2 className="w-3.5 h-3.5 text-amber-400" />
            Simulation Parameters
          </h3>

          {/* Language selector */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-zinc-400 flex items-center gap-1">
              <Globe2 className="w-3.5 h-3.5" /> Language Option:
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                  language === 'en'
                    ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                    : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                English ({activeExam.cutoffWpm} WPM Cutoff)
              </button>
              <button
                type="button"
                onClick={() => setLanguage('hi')}
                className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                  language === 'hi'
                    ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                    : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Hindi ({activeExam.hindiCutoffWpm || 30} WPM Cutoff)
              </button>
            </div>
          </div>

          {/* Duration Selector */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-xs">
              <label className="text-zinc-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> Test Duration:
              </label>
              <span className="font-mono text-amber-400 font-semibold">{customDuration} Minutes</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[1, 5, 10, 15].map((mins) => (
                <button
                  key={mins}
                  type="button"
                  onClick={() => setCustomDuration(mins)}
                  className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                    customDuration === mins
                      ? 'bg-amber-500 text-zinc-950 font-bold border-amber-500'
                      : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {mins === activeExam.durationMinutes ? `${mins}m (Official)` : `${mins}m`}
                </button>
              ))}
            </div>
          </div>

          {/* Passage selection */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-zinc-400 flex items-center gap-1">
              <FileText className="w-3.5 h-3.5" /> Exam Passage Selection:
            </label>
            <select
              value={selectedPassageId}
              onChange={(e) => setSelectedPassageId(e.target.value)}
              className="w-full py-2.5 px-3 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-200 text-xs focus:outline-none focus:border-amber-500"
            >
              <option value="random">⚡ Random Exam Passage ({effectivePassages.length} Available)</option>
              {effectivePassages.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title} ({p.wordCount} words)
                </option>
              ))}
            </select>
          </div>

          {/* Official Scoring Formula Notice */}
          <div className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-800/80 text-xs text-zinc-400 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-zinc-200 block mb-0.5">Evaluation Metric:</span>
              <span>{activeExam.scoringFormula}</span>
            </div>
          </div>

          {/* Big Start Exam CTA */}
          <button
            type="button"
            onClick={handleLaunch}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-bold text-sm shadow-lg shadow-amber-500/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4 fill-current" />
            Launch {activeExam.shortName} Exam Simulation
          </button>
        </div>
      </div>
    </div>
  );
};
