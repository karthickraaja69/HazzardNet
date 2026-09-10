import React from 'react';
import type { SensorReading } from '../types/sensor';
import { getStatusColor, distanceToWaterDepth } from '../config/thresholds';
import { Waves, Clock, RefreshCw, AlertTriangle } from 'lucide-react';

interface SensorCardProps {
  reading: SensorReading | null;
  secondsAgo: number;
  isPulseActive: boolean;
}

export const SensorCard: React.FC<SensorCardProps> = ({ reading, secondsAgo, isPulseActive }) => {
  if (!reading) {
    return (
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 flex items-center justify-center text-slate-500 animate-pulse">
        Waiting for sensor stream data...
      </div>
    );
  }

  const statusStyle = getStatusColor(reading.status);
  const waterDepth = distanceToWaterDepth(reading.distance_cm);

  return (
    <div className={`bg-slate-900/90 border ${statusStyle.border} rounded-2xl p-6 shadow-xl relative overflow-hidden backdrop-blur-md transition-all duration-300`}>
      
      {/* Top pulsing edge accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-slate-800 overflow-hidden">
        <div 
          className={`h-full transition-all duration-300 ${isPulseActive ? 'w-full bg-cyan-400 opacity-100' : 'w-0 opacity-0'}`} 
        />
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-slate-800/80 text-cyan-400 border border-slate-700/50">
            <Waves className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h2 className="text-sm font-bold tracking-wider text-slate-300 uppercase">Live Water Level (Depth)</h2>
            <p className="text-[11px] text-slate-400">Flood Hazard Monitoring Parameter</p>
          </div>
        </div>

        {/* Live Status Badge */}
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${statusStyle.bg} ${statusStyle.border} ${statusStyle.text} font-bold text-xs shadow-lg ${statusStyle.glow}`}>
          <span className={`w-2.5 h-2.5 rounded-full ${statusStyle.badgeBg} ${isPulseActive ? 'animate-ping' : 'animate-pulse'}`} />
          <span>{reading.status}</span>
        </div>
      </div>

      {/* Main Metric Value: Primary Water Depth Level */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-baseline my-3 py-2">
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl lg:text-6xl font-extrabold tracking-tight text-white font-mono">
              {waterDepth.toFixed(2)}
            </span>
            <span className="text-xl font-bold text-cyan-400">cm depth</span>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-medium flex items-center gap-1">
            <span>Water Height in Monitored Basin</span>
            {reading.status === 'CRITICAL' && <AlertTriangle className="w-3.5 h-3.5 text-rose-400 animate-bounce inline" />}
          </p>
        </div>

        <div className="sm:border-l sm:border-slate-800 sm:pl-6">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-300 font-mono">
              {reading.distance_cm.toFixed(2)}
            </span>
            <span className="text-base font-semibold text-slate-400">cm air-gap</span>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-medium">
            Ultrasonic Sensor Distance to Surface
          </p>
        </div>
      </div>

      {/* Footer live status bar */}
      <div className="pt-4 mt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>Last updated:</span>
          <span className="font-semibold text-slate-200">
            {secondsAgo === 0 ? 'Just now' : `${secondsAgo}s ago`}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${isPulseActive ? 'animate-spin' : ''}`} />
          <span className="font-mono text-[11px] text-cyan-400">AUTO-STREAMING</span>
        </div>
      </div>

    </div>
  );
};
