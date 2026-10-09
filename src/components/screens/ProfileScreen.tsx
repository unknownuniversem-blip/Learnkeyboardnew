import React, { useState } from 'react';
import { 
  Check, 
  Download, 
  HelpCircle, 
  Moon, 
  RefreshCw, 
  ShieldAlert, 
  Sliders, 
  Smartphone, 
  Sun, 
  Target, 
  Type, 
  Upload, 
  User, 
  Volume2 
} from 'lucide-react';
import { EXAM_CONFIGS } from '../../data/examsData';
import { ExamId, FontType, SoundType, ThemeType, UserProfile, UserSettings } from '../../types';
import { playKeySound, triggerHaptic } from '../../utils/audio';
import { resetAllData } from '../../utils/storage';
import { AdBanner } from '../common/AdBanner';

interface ProfileScreenProps {
  profile: UserProfile;
  settings: UserSettings;
  onUpdateProfile: (p: UserProfile) => void;
  onUpdateSettings: (s: UserSettings) => void;
  onResetData: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  profile,
  settings,
  onUpdateProfile,
  onUpdateSettings,
  onResetData,
}) => {
  const [userName, setUserName] = useState<string>(profile.name);
  const [targetExam, setTargetExam] = useState<ExamId>(profile.targetExamId);
  const [targetWpm, setTargetWpm] = useState<number>(profile.targetWpm);
  const [dailyMinutes, setDailyMinutes] = useState<number>(profile.dailyGoalMinutes);
  const [showSavedToast, setShowSavedToast] = useState<boolean>(false);

  const handleSaveProfile = () => {
    onUpdateProfile({
      ...profile,
      name: userName,
      targetExamId: targetExam,
      targetWpm,
      dailyGoalMinutes: dailyMinutes,
    });
    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 2000);
  };

  const handlePreviewSound = (snd: SoundType) => {
    playKeySound(snd, settings.soundVolume);
    if (settings.hapticFeedback) triggerHaptic('key');
  };

  const handleExportDataJson = () => {
    const backup = {
      profile,
      settings,
      results: localStorage.getItem('typemaster_test_results'),
      progress: localStorage.getItem('typemaster_lesson_progress'),
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `TypeMaster_Backup_${Date.now()}.json`;
    a.click();
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto pb-6">
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-zinc-800/60 bg-zinc-900/40 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-white tracking-tight">Candidate Profile & Settings</h1>
          <p className="text-xs text-zinc-400">Personalize exam goals, switch sounds, and tactile themes</p>
        </div>
        {showSavedToast && (
          <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full animate-in fade-in">
            Saved!
          </span>
        )}
      </div>

      <div className="p-4 flex flex-col gap-4">
        {/* Profile Details Card */}
        <div className="p-4 rounded-2xl bg-zinc-900/70 border border-zinc-800 flex flex-col gap-3">
          <h2 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-amber-400" />
            Aspirant Profile
          </h2>

          <div className="flex flex-col gap-2.5">
            <div>
              <label className="text-[11px] text-zinc-400 block mb-1">Aspirant Name</label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-200 text-xs focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] text-zinc-400 block mb-1">Target Indian Exam</label>
                <select
                  value={targetExam}
                  onChange={(e) => setTargetExam(e.target.value as ExamId)}
                  className="w-full p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-200 text-xs focus:outline-none focus:border-amber-500"
                >
                  {EXAM_CONFIGS.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.shortName} ({e.cutoffWpm} WPM)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] text-zinc-400 block mb-1">Target Speed (WPM)</label>
                <input
                  type="number"
                  value={targetWpm}
                  onChange={(e) => setTargetWpm(parseInt(e.target.value, 10) || 35)}
                  className="w-full p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-200 text-xs font-mono focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] text-zinc-400 block mb-1">Daily Practice Goal (Minutes)</label>
              <div className="grid grid-cols-4 gap-2">
                {[10, 15, 20, 30].map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => setDailyMinutes(mins)}
                    className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                      dailyMinutes === mins
                        ? 'bg-amber-500 text-zinc-950 font-bold border-amber-500'
                        : 'bg-zinc-950 border-zinc-800 text-zinc-400'
                    }`}
                  >
                    {mins} mins
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={handleSaveProfile}
              className="mt-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs transition-colors"
            >
              Update Goal Settings
            </button>
          </div>
        </div>

        {/* Typing Mechanical Sounds Engine */}
        <div className="p-4 rounded-2xl bg-zinc-900/70 border border-zinc-800 flex flex-col gap-3">
          <h2 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
            <Volume2 className="w-3.5 h-3.5 text-amber-400" />
            Mechanical Keyboard Switches (Web Audio API)
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              { id: 'cherry_blue', label: 'Cherry MX Blue', desc: 'Crisp tactile click + clack' },
              { id: 'cherry_brown', label: 'Cherry MX Brown', desc: 'Subtle tactile bump' },
              { id: 'cherry_red', label: 'Cherry MX Red', desc: 'Smooth linear quiet thud' },
              { id: 'typewriter', label: 'Vintage Typewriter', desc: 'Metallic mechanical hammer' },
              { id: 'muted', label: 'Muted / Silent', desc: 'Zero keystroke audio' },
            ].map((snd) => {
              const isSelected = settings.soundType === snd.id;
              return (
                <button
                  key={snd.id}
                  type="button"
                  onClick={() => {
                    onUpdateSettings({ ...settings, soundType: snd.id as SoundType });
                    handlePreviewSound(snd.id as SoundType);
                  }}
                  className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                    isSelected
                      ? 'bg-amber-500/15 border-amber-500/50 text-white'
                      : 'bg-zinc-950 border-zinc-800/80 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-zinc-200">{snd.label}</span>
                    <span className="text-[10px] text-zinc-400">{snd.desc}</span>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-amber-400" />}
                </button>
              );
            })}
          </div>

          {/* Volume Slider & Haptics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-zinc-800">
            <div>
              <div className="flex items-center justify-between text-xs text-zinc-400 mb-1">
                <span>Sound Volume</span>
                <span className="font-mono text-zinc-300">{Math.round(settings.soundVolume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={settings.soundVolume}
                onChange={(e) =>
                  onUpdateSettings({ ...settings, soundVolume: parseFloat(e.target.value) })
                }
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>

            <label className="flex items-center justify-between p-2 rounded-xl bg-zinc-950 border border-zinc-800 cursor-pointer">
              <div className="flex flex-col">
                <span className="text-xs font-medium text-zinc-200">Haptic Vibration</span>
                <span className="text-[10px] text-zinc-400">Vibrate on errors & key taps</span>
              </div>
              <input
                type="checkbox"
                checked={settings.hapticFeedback}
                onChange={(e) =>
                  onUpdateSettings({ ...settings, hapticFeedback: e.target.checked })
                }
                className="w-4 h-4 accent-amber-500"
              />
            </label>
          </div>
        </div>

        {/* Monospace Typing Font & Appearance */}
        <div className="p-4 rounded-2xl bg-zinc-900/70 border border-zinc-800 flex flex-col gap-3">
          <h2 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
            <Type className="w-3.5 h-3.5 text-blue-400" />
            Typing Font & Display
          </h2>

          <div className="grid grid-cols-3 gap-2">
            {(['JetBrains Mono', 'Fira Code', 'Roboto Mono'] as FontType[]).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => onUpdateSettings({ ...settings, fontFamily: f })}
                className={`py-2 px-3 rounded-xl border text-xs font-mono transition-all ${
                  settings.fontFamily === f
                    ? 'bg-blue-500/20 border-blue-500/60 text-blue-300 font-bold'
                    : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Theme Presets */}
          <div className="pt-2 border-t border-zinc-800">
            <span className="text-xs text-zinc-400 block mb-2">Color Atmosphere</span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'amoled', label: 'AMOLED Black', border: 'border-zinc-800' },
                { id: 'obsidian', label: 'Obsidian Slate', border: 'border-zinc-700' },
                { id: 'material', label: 'Material Amber', border: 'border-amber-600' },
                { id: 'cyber', label: 'Cyber Teal', border: 'border-emerald-600' },
              ].map((th) => (
                <button
                  key={th.id}
                  type="button"
                  onClick={() => onUpdateSettings({ ...settings, theme: th.id as ThemeType })}
                  className={`py-2 px-2.5 rounded-xl text-xs font-semibold border transition-all ${
                    settings.theme === th.id
                      ? 'bg-zinc-800 text-white ring-2 ring-amber-400'
                      : 'bg-zinc-950 text-zinc-400 hover:text-zinc-200 border-zinc-800'
                  }`}
                >
                  {th.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Data Backup & Reset */}
        <div className="p-4 rounded-2xl bg-zinc-900/70 border border-zinc-800 flex flex-col gap-3">
          <h2 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-zinc-400" />
            Storage & Progress Management
          </h2>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleExportDataJson}
              className="flex-1 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 hover:bg-zinc-800 text-zinc-200 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Backup Progress (JSON)
            </button>
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Reset all progress, streaks, and test history?')) {
                  resetAllData();
                  onResetData();
                }
              }}
              className="py-2.5 px-4 rounded-xl bg-rose-500/10 border border-rose-500/30 hover:bg-rose-500/20 text-rose-400 text-xs font-medium transition-colors"
            >
              Reset All
            </button>
          </div>
        </div>

        {/* Bottom Ad Banner */}
        <AdBanner />
      </div>
    </div>
  );
};
