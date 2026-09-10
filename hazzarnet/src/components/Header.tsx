import React from 'react';
import { ShieldAlert, Radio, ToggleLeft, ToggleRight } from 'lucide-react';

interface HeaderProps {
  isMockMode: boolean;
  onToggleMockMode: () => void;
  isOnline: boolean;
}

export const Header: React.FC<HeaderProps> = ({ isMockMode, onToggleMockMode, isOnline }) => {
  return (
    <header className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50 px-4 lg:px-8 py-4 shadow-xl">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Title Brand Section */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/20 text-white font-bold">
            <ShieldAlert className="w-6 h-6 animate-pulse" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                HazzardNet
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  SIH Prototype
                </span>
              </h1>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              ENVIRONMENTAL INTELLIGENCE NETWORK • Edge Sensor Monitoring
            </p>
          </div>
        </div>

        {/* Action Controls & Live Status */}
        <div className="flex items-center gap-4">
          
          {/* Status Indicator */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/60 text-xs font-semibold">
            <span className={`w-2.5 h-2.5 rounded-full ${isOnline ? 'bg-emerald-400 shadow-lg shadow-emerald-500/50 animate-pulse' : 'bg-rose-500'}`} />
            <span className={isOnline ? 'text-emerald-400' : 'text-rose-400'}>
              {isOnline ? '● SYSTEM ONLINE' : 'SYSTEM OFFLINE'}
            </span>
          </div>

          {/* Mock Mode Toggle Switch */}
          <button
            onClick={onToggleMockMode}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all shadow-sm ${
              isMockMode
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-300 hover:bg-amber-500/20'
                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20'
            }`}
            title="Toggle between Simulated Mock Data and Live Supabase/Hardware Data"
          >
            {isMockMode ? (
              <>
                <ToggleRight className="w-4 h-4 text-amber-400" />
                <span>MOCK DEMO MODE</span>
              </>
            ) : (
              <>
                <ToggleLeft className="w-4 h-4 text-emerald-400" />
                <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                <span>LIVE HARDWARE MODE</span>
              </>
            )}
          </button>
        </div>

      </div>
    </header>
  );
};
