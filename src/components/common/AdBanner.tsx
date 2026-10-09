import React from 'react';

interface AdBannerProps {
  placement?: 'bottom' | 'inline';
}

export const AdBanner: React.FC<AdBannerProps> = ({ placement = 'bottom' }) => {
  if (placement === 'inline') {
    return (
      <div className="w-full my-3 p-3 rounded-xl border border-zinc-800/80 bg-zinc-900/40 flex items-center justify-between text-xs text-zinc-500">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold tracking-wider uppercase px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700/60">
            Ad
          </span>
          <div className="flex flex-col">
            <span className="font-semibold text-zinc-300">Ace SSC & CPCT with TestSeries Pro</span>
            <span className="text-[11px] text-zinc-500">10,000+ Previous Year Mock Question Papers</span>
          </div>
        </div>
        <button
          type="button"
          onClick={() => {}}
          className="px-3 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-lg text-xs font-medium transition-colors"
        >
          Install
        </button>
      </div>
    );
  }

  return (
    <div className="w-full h-[50px] shrink-0 border-t border-zinc-800/80 bg-zinc-950 flex items-center justify-between px-3 text-xs text-zinc-500">
      <div className="flex items-center gap-2">
        <span className="text-[9px] font-bold uppercase tracking-wider px-1 rounded bg-zinc-800 text-zinc-400">
          Ad
        </span>
        <span className="truncate max-w-[200px] text-zinc-400">
          Mechanical Keyboards for Speed Typists · Flat 30% Off
        </span>
      </div>
      <span className="text-[11px] text-amber-400 font-medium whitespace-nowrap">
        Shop Now →
      </span>
    </div>
  );
};
