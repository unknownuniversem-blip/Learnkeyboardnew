import React, { useState } from 'react';
import { 
  Award, 
  Battery, 
  BookOpen, 
  Home, 
  Monitor, 
  RotateCw, 
  Sliders, 
  Smartphone, 
  TrendingUp, 
  User, 
  Wifi 
} from 'lucide-react';
import { ScreenType, UserSettings } from '../../types';

interface DeviceFrameProps {
  children: React.ReactNode;
  activeScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
  settings: UserSettings;
  onUpdateSettings: (s: UserSettings) => void;
  isTesting: boolean;
}

export const DeviceFrame: React.FC<DeviceFrameProps> = ({
  children,
  activeScreen,
  onNavigate,
  settings,
  onUpdateSettings,
  isTesting,
}) => {
  const [currentTime, setCurrentTime] = useState<string>(() => {
    const now = new Date();
    return `${now.getHours()}:${now.getMinutes() < 10 ? '0' : ''}${now.getMinutes()}`;
  });

  const isAndroidFrame = settings.viewportMode === 'android_frame';
  const isLandscape = settings.mobileOrientation === 'landscape';

  const toggleViewport = () => {
    onUpdateSettings({
      ...settings,
      viewportMode: isAndroidFrame ? 'fullscreen' : 'android_frame',
    });
  };

  const toggleOrientation = () => {
    onUpdateSettings({
      ...settings,
      mobileOrientation: isLandscape ? 'portrait' : 'landscape',
    });
  };

  const navItems = [
    { id: 'home' as ScreenType, label: 'Home', icon: Home },
    { id: 'learn' as ScreenType, label: 'Learn', icon: BookOpen },
    { id: 'exams' as ScreenType, label: 'Exams', icon: Award },
    { id: 'custom' as ScreenType, label: 'Custom', icon: Sliders },
    { id: 'stats' as ScreenType, label: 'Stats', icon: TrendingUp },
    { id: 'profile' as ScreenType, label: 'Profile', icon: User },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-0 md:p-4 select-none">
      {/* Top Bar Switcher between Android Frame & Fullscreen Desktop Lab */}
      <header className="w-full max-w-5xl flex items-center justify-between gap-4 py-2 px-4 mb-2 text-xs text-zinc-400">
        <div className="flex items-center gap-2">
          <span className="font-bold text-zinc-100 tracking-tight">TypeMaster Pro</span>
          <span className="text-[10px] text-zinc-400">v2.4 Indian Exam Edition</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Orientation switch for mobile */}
          {isAndroidFrame && (
            <button
              type="button"
              onClick={toggleOrientation}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white transition-colors"
              title="Flip Portrait / Landscape"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{isLandscape ? 'Portrait' : 'Landscape'}</span>
            </button>
          )}

          {/* Viewport switch */}
          <button
            type="button"
            onClick={toggleViewport}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-amber-400 hover:bg-zinc-800 transition-colors font-medium"
          >
            {isAndroidFrame ? (
              <>
                <Monitor className="w-3.5 h-3.5" />
                <span>Fullscreen Lab View</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5" />
                <span>Android Phone View</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div
        className={`
          transition-all duration-300 flex flex-col relative overflow-hidden bg-zinc-950
          ${
            isAndroidFrame
              ? isLandscape
                ? 'w-full max-w-[840px] h-[480px] rounded-[36px] border-[10px] border-zinc-900 shadow-2xl ring-1 ring-zinc-800'
                : 'w-full max-w-[420px] h-[860px] max-h-[92vh] rounded-[44px] border-[12px] border-zinc-900 shadow-2xl ring-1 ring-zinc-800'
              : 'w-full max-w-5xl h-[88vh] rounded-2xl border border-zinc-800 shadow-xl'
          }
        `}
      >
        {/* Android Top Status Bar (Only in Phone Frame) */}
        {isAndroidFrame && (
          <div className="h-7 w-full shrink-0 flex items-center justify-between px-6 pt-1 text-[11px] font-medium text-zinc-400 bg-zinc-950 z-30 select-none">
            <span className="font-mono text-zinc-300">{currentTime}</span>

            {/* Camera Punch-hole */}
            <div className="w-3.5 h-3.5 rounded-full bg-zinc-900 border border-zinc-800/80 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-zinc-950" />
            </div>

            <div className="flex items-center gap-1.5 text-zinc-400">
              <Wifi className="w-3 h-3" />
              <Battery className="w-3.5 h-3.5" />
            </div>
          </div>
        )}

        {/* Screen Content Area */}
        <main className="flex-1 overflow-hidden relative flex flex-col">
          {children}
        </main>

        {/* Android Material 3 Bottom Navigation Bar (Hidden during active test for zero distraction) */}
        {!isTesting && (
          <nav className="h-16 shrink-0 border-t border-zinc-900 bg-zinc-950/95 backdrop-blur-md grid grid-cols-6 items-center px-2 z-30 select-none">
            {navItems.map((item) => {
              const isActive = activeScreen === item.id;
              const Icon = item.icon;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onNavigate(item.id)}
                  className={`
                    flex flex-col items-center justify-center h-full gap-1 transition-all
                    ${
                      isActive
                        ? 'text-amber-400 font-bold scale-105'
                        : 'text-zinc-500 hover:text-zinc-300'
                    }
                  `}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                  <span className="text-[10px] tracking-tight">{item.label}</span>
                </button>
              );
            })}
          </nav>
        )}

        {/* Android Home Gesture Pill Indicator (Only in Phone Frame) */}
        {isAndroidFrame && (
          <div className="h-3.5 w-full bg-zinc-950 flex items-center justify-center shrink-0">
            <div className="w-28 h-1 rounded-full bg-zinc-700/60" />
          </div>
        )}
      </div>
    </div>
  );
};
