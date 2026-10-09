import React, { useState } from 'react';
import { 
  Bookmark, 
  Check, 
  Copy, 
  FileEdit, 
  Play, 
  Plus, 
  Save, 
  Sliders, 
  Trash2 
} from 'lucide-react';
import { CustomPreset, TestSessionConfig } from '../../types';
import { loadCustomPresets, saveCustomPreset } from '../../utils/storage';

interface CustomPracticeScreenProps {
  onStartCustomTest: (sessionConfig: TestSessionConfig) => void;
}

const SAMPLE_TEXT_LIBRARY = [
  {
    title: 'Indian Constitution: Directive Principles',
    category: 'Constitution',
    text: 'The State shall strive to promote the welfare of the people by securing and protecting as effectively as it may a social order in which justice, social, economic and political, shall inform all the institutions of national life. The State shall, in particular, strive to minimise the inequalities in income, and endeavour to eliminate inequalities in status, facilities and opportunities.',
  },
  {
    title: 'Supreme Court: Right to Privacy Judgement',
    category: 'Judicial',
    text: 'Privacy is the constitutional core of human dignity. It is an intrinsic element of life and personal liberty under Article 21 and as a part of the freedoms declared by Part III of the Constitution. Privacy recognizes the autonomy of the individual and guarantees an inviolable sphere where individuals can make choices concerning their bodies, thoughts and relationships.',
  },
  {
    title: 'Economic Survey: Startup Ecosystem in India',
    category: 'Economy',
    text: 'India has emerged as the third-largest ecosystem for startups globally with over one hundred unicorns spanning fintech, edtech, healthtech, and logistics. Favorable regulatory sandbox frameworks and digital public infrastructure have enabled grassroots entrepreneurs to scale innovative business solutions across both tier-two cities and metropolitan areas.',
  },
  {
    title: 'Technical Drill: Numerical Figures and Symbols',
    category: 'Drills',
    text: 'Receipt #94820 dated 15/08/2024 total Rs. 45,890.50 (inclusive of 18% GST @ standard rate). Section 12(3) subsection (iv) applies strictly to accounts 101 to 205. Error rate must stay below 0.5% for certification.',
  },
];

export const CustomPracticeScreen: React.FC<CustomPracticeScreenProps> = ({
  onStartCustomTest,
}) => {
  const [customText, setCustomText] = useState<string>(SAMPLE_TEXT_LIBRARY[0].text);
  const [testTitle, setTestTitle] = useState<string>(SAMPLE_TEXT_LIBRARY[0].title);
  const [modeType, setModeType] = useState<'time' | 'words'>('time');
  const [durationMinutes, setDurationMinutes] = useState<number>(2);
  const [wordTarget, setWordTarget] = useState<number>(50);
  const [allowBackspace, setAllowBackspace] = useState<boolean>(true);
  const [blindMode, setBlindMode] = useState<boolean>(false);
  const [instantDeath, setInstantDeath] = useState<boolean>(false);
  const [presets, setPresets] = useState<CustomPreset[]>(() => loadCustomPresets());
  const [newPresetName, setNewPresetName] = useState<string>('');
  const [showSaveModal, setShowSaveModal] = useState<boolean>(false);

  const handleStart = () => {
    const trimmed = customText.trim();
    if (!trimmed) return;

    let targetText = trimmed;
    if (modeType === 'words') {
      const words = trimmed.split(/\s+/);
      if (words.length > wordTarget) {
        targetText = words.slice(0, wordTarget).join(' ');
      }
    }

    const session: TestSessionConfig = {
      mode: 'custom',
      title: testTitle || 'Custom Typing Practice',
      text: targetText,
      durationSeconds: modeType === 'time' ? durationMinutes * 60 : 0,
      wordLimit: modeType === 'words' ? wordTarget : undefined,
      allowBackspace,
      blindMode,
      instantDeath,
      language: 'en',
    };

    onStartCustomTest(session);
  };

  const handleSelectSample = (sample: typeof SAMPLE_TEXT_LIBRARY[0]) => {
    setCustomText(sample.text);
    setTestTitle(sample.title);
  };

  const handleApplyPreset = (p: CustomPreset) => {
    if (p.durationMinutes > 0) {
      setModeType('time');
      setDurationMinutes(p.durationMinutes);
    } else {
      setModeType('words');
      setWordTarget(p.wordCount || 100);
    }
    setAllowBackspace(p.allowBackspace);
    setBlindMode(p.blindMode);
    setInstantDeath(p.instantDeath);
  };

  const handleSavePreset = () => {
    if (!newPresetName.trim()) return;
    const newP: CustomPreset = {
      id: `pre_${Date.now()}`,
      name: newPresetName.trim(),
      durationMinutes: modeType === 'time' ? durationMinutes : 0,
      wordCount: modeType === 'words' ? wordTarget : 0,
      allowBackspace,
      blindMode,
      instantDeath,
    };
    saveCustomPreset(newP);
    setPresets(loadCustomPresets());
    setNewPresetName('');
    setShowSaveModal(false);
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto pb-6">
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-zinc-800/60 bg-zinc-900/40">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              Custom Practice Arena
              <span className="text-[10px] font-semibold text-purple-400 bg-purple-500/10 border border-purple-500/30 px-2 py-0.5 rounded-full">
                Full Control
              </span>
            </h1>
            <p className="text-xs text-zinc-400">
              Type custom passages, tweak exam constraints, or test blind mode
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowSaveModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-semibold hover:bg-purple-500/20 active:scale-95 transition-all"
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Save Preset</span>
          </button>
        </div>
      </div>

      <div className="p-4 flex flex-col gap-4">
        {/* Presets Strip */}
        {presets.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            <span className="text-xs text-zinc-500 font-mono shrink-0">Presets:</span>
            {presets.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => handleApplyPreset(p)}
                className="shrink-0 px-3 py-1.5 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 text-xs font-medium transition-colors"
              >
                {p.name}
              </button>
            ))}
          </div>
        )}

        {/* Text Input Area */}
        <div className="p-4 rounded-2xl bg-zinc-900/70 border border-zinc-800 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
              <FileEdit className="w-3.5 h-3.5 text-amber-400" />
              Practice Passage Text
            </label>
            <span className="text-xs font-mono text-zinc-400">
              {customText.trim().split(/\s+/).filter(Boolean).length} words · {customText.length} characters
            </span>
          </div>

          <textarea
            rows={5}
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            placeholder="Paste your legal brief, editorial, government notice, or custom text here..."
            className="w-full p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-200 text-xs font-mono leading-relaxed focus:outline-none focus:border-purple-500"
          />

          {/* Quick Library Picks */}
          <div className="flex flex-col gap-1.5 pt-1">
            <span className="text-[11px] text-zinc-400 font-medium">Or Pick From Library:</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {SAMPLE_TEXT_LIBRARY.map((s, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectSample(s)}
                  className={`p-2.5 rounded-xl text-left border transition-all ${
                    customText === s.text
                      ? 'bg-purple-500/10 border-purple-500/40 text-purple-300'
                      : 'bg-zinc-950 border-zinc-800/80 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <span className="text-xs font-semibold block">{s.title}</span>
                  <span className="text-[10px] text-zinc-400 block line-clamp-1">{s.text}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Test Controls (Timer vs Word count, Backspace, Blind Mode) */}
        <div className="p-4 rounded-2xl bg-zinc-900/70 border border-zinc-800 flex flex-col gap-4">
          <h3 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-purple-400" />
            Mode & Challenge Rules
          </h3>

          {/* Time vs Words toggle */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setModeType('time')}
              className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                modeType === 'time'
                  ? 'bg-purple-500/20 border-purple-500/50 text-purple-300'
                  : 'bg-zinc-950 border-zinc-800 text-zinc-400'
              }`}
            >
              Time Countdown Mode
            </button>
            <button
              type="button"
              onClick={() => setModeType('words')}
              className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                modeType === 'words'
                  ? 'bg-purple-500/20 border-purple-500/50 text-purple-300'
                  : 'bg-zinc-950 border-zinc-800 text-zinc-400'
              }`}
            >
              Word Count Target Mode
            </button>
          </div>

          {/* Mode Sub-selectors */}
          {modeType === 'time' ? (
            <div className="flex flex-col gap-1.5">
              <span className="text-xs text-zinc-400">Duration Preset:</span>
              <div className="grid grid-cols-6 gap-1.5">
                {[1, 2, 5, 10, 15, 30].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setDurationMinutes(m)}
                    className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                      durationMinutes === m
                        ? 'bg-purple-500 text-zinc-950 font-bold border-purple-500'
                        : 'bg-zinc-950 border-zinc-800 text-zinc-400'
                    }`}
                  >
                    {m}m
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-1.5">
              <span className="text-xs text-zinc-400">Word Count Target:</span>
              <div className="grid grid-cols-6 gap-1.5">
                {[10, 25, 50, 100, 200, 500].map((w) => (
                  <button
                    key={w}
                    type="button"
                    onClick={() => setWordTarget(w)}
                    className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                      wordTarget === w
                        ? 'bg-purple-500 text-zinc-950 font-bold border-purple-500'
                        : 'bg-zinc-950 border-zinc-800 text-zinc-400'
                    }`}
                  >
                    {w}w
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Strict Exam Rule Switches */}
          <div className="flex flex-col gap-2 pt-2 border-t border-zinc-800">
            <label className="flex items-center justify-between p-2 rounded-xl bg-zinc-950 border border-zinc-800/80 cursor-pointer">
              <div className="flex flex-col">
                <span className="text-xs font-medium text-zinc-200">Allow Backspace</span>
                <span className="text-[10px] text-zinc-400">Disable to simulate strict real-life exam typing restrictions</span>
              </div>
              <input
                type="checkbox"
                checked={allowBackspace}
                onChange={(e) => setAllowBackspace(e.target.checked)}
                className="w-4 h-4 accent-purple-500"
              />
            </label>

            <label className="flex items-center justify-between p-2 rounded-xl bg-zinc-950 border border-zinc-800/80 cursor-pointer">
              <div className="flex flex-col">
                <span className="text-xs font-medium text-zinc-200">Blind Mode (Monkeytype Style)</span>
                <span className="text-[10px] text-zinc-400">Hides color feedback until completion to prevent hesitation</span>
              </div>
              <input
                type="checkbox"
                checked={blindMode}
                onChange={(e) => setBlindMode(e.target.checked)}
                className="w-4 h-4 accent-purple-500"
              />
            </label>

            <label className="flex items-center justify-between p-2 rounded-xl bg-zinc-950 border border-zinc-800/80 cursor-pointer">
              <div className="flex flex-col">
                <span className="text-xs font-medium text-rose-300">Instant Death Mode</span>
                <span className="text-[10px] text-zinc-400">Fails immediately on the first mistake for hardcore accuracy training</span>
              </div>
              <input
                type="checkbox"
                checked={instantDeath}
                onChange={(e) => setInstantDeath(e.target.checked)}
                className="w-4 h-4 accent-rose-500"
              />
            </label>
          </div>

          {/* Launch Button */}
          <button
            type="button"
            onClick={handleStart}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-purple-500/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2 mt-2"
          >
            <Play className="w-4 h-4 fill-current" />
            Start Custom Session
          </button>
        </div>
      </div>

      {/* Save Preset Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-zinc-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 max-w-sm w-full flex flex-col gap-3">
            <h3 className="text-sm font-bold text-white">Save Current Setup as Preset</h3>
            <input
              type="text"
              value={newPresetName}
              onChange={(e) => setNewPresetName(e.target.value)}
              placeholder="e.g. My 10-Min Strict Drill"
              className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-200 text-xs focus:outline-none focus:border-purple-500"
            />
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowSaveModal(false)}
                className="flex-1 py-2 rounded-xl bg-zinc-800 text-zinc-400 text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSavePreset}
                className="flex-1 py-2 rounded-xl bg-purple-500 text-white font-bold text-xs"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
