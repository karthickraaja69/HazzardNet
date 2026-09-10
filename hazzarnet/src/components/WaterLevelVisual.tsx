import React from 'react';
import type { SensorReading } from '../types/sensor';
import { MAX_SENSOR_HEIGHT_CM, WATER_DEPTH_THRESHOLDS, distanceToWaterDepth, getStatusColor } from '../config/thresholds';
import { Waves, ArrowDown, ShieldAlert } from 'lucide-react';

interface WaterLevelVisualProps {
  reading: SensorReading | null;
}

export const WaterLevelVisual: React.FC<WaterLevelVisualProps> = ({ reading }) => {
  const distance = reading ? reading.distance_cm : 35;
  const depth = distanceToWaterDepth(distance);
  const status = reading ? reading.status : 'NORMAL';
  const statusStyle = getStatusColor(status);

  const fillPercentage = Math.max(0, Math.min(100, Math.round((depth / MAX_SENSOR_HEIGHT_CM) * 100)));

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between backdrop-blur-md relative overflow-hidden">
      
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <Waves className="w-5 h-5 text-cyan-400" />
          <h3 className="font-bold text-sm text-slate-200 uppercase tracking-wider">
            Water Basin Simulator
          </h3>
        </div>
        <span className="text-xs font-mono text-cyan-400 font-semibold px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">
          {fillPercentage}% CAPACITY
        </span>
      </div>

      <div className="relative w-full h-64 bg-slate-950/80 rounded-xl border-2 border-slate-800 p-2 overflow-hidden flex flex-col justify-between">
        
        <div className="z-20 w-full flex flex-col items-center">
          <div className="bg-slate-800 border border-cyan-500/40 rounded-lg px-4 py-1.5 flex items-center gap-3 shadow-lg shadow-cyan-500/10">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-slate-950 border border-cyan-400 flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
              </div>
              <div className="w-3 h-3 rounded-full bg-slate-950 border border-cyan-400" />
            </div>
            <span className="text-[11px] font-mono text-cyan-300 font-bold tracking-wider">
              HC-SR04 ULTRASONIC
            </span>
          </div>

          <div className="w-full flex justify-center py-1 opacity-70">
            <div className="w-0.5 bg-gradient-to-b from-cyan-400 to-transparent h-12 animate-pulse flex flex-col items-center">
              <ArrowDown className="w-3 h-3 text-cyan-400 -mt-1 animate-bounce" />
            </div>
          </div>
        </div>

        {/* Real-Time Metrics Badge */}
        <div className="absolute top-14 right-4 z-20 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 px-3 py-1.5 rounded-lg text-right shadow-lg space-y-0.5">
          <div className="text-[10px] text-slate-400 font-mono uppercase">Water Depth</div>
          <div className="text-base font-extrabold font-mono text-cyan-300">{depth.toFixed(1)} cm</div>
          <div className="text-[9px] text-slate-500 font-mono">Air gap: {distance.toFixed(1)} cm</div>
        </div>

        {/* Physical Basin Depth Levels (Ordered from Basin Top to Bottom) */}
        <div className="absolute left-2 top-10 bottom-2 z-20 flex flex-col justify-between text-[10px] font-mono select-none">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-0.5 bg-rose-500 rounded" />
            <span className="text-rose-400 font-semibold">Critical (&ge;{WATER_DEPTH_THRESHOLDS.criticalMinDepth}cm depth)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-0.5 bg-amber-500 rounded" />
            <span className="text-amber-400 font-semibold">Warning ({WATER_DEPTH_THRESHOLDS.watchMaxDepth}-{WATER_DEPTH_THRESHOLDS.warningMaxDepth}cm)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-0.5 bg-blue-500 rounded" />
            <span className="text-blue-400 font-semibold">Watch ({WATER_DEPTH_THRESHOLDS.normalMaxDepth}-{WATER_DEPTH_THRESHOLDS.watchMaxDepth}cm)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-0.5 bg-emerald-500 rounded" />
            <span className="text-emerald-400 font-semibold">Normal (&lt;{WATER_DEPTH_THRESHOLDS.normalMaxDepth}cm depth)</span>
          </div>
        </div>

        {/* Dynamic Water Surface & Volume */}
        <div 
          className="absolute bottom-0 left-0 right-0 transition-all duration-700 ease-out z-10 overflow-hidden"
          style={{ height: `${fillPercentage}%` }}
        >
          <div className="w-full h-3 bg-cyan-400/40 relative opacity-80 animate-wave">
            <div className="absolute top-0 inset-x-0 h-1 bg-cyan-200/80" />
          </div>

          <div className={`w-full h-full bg-gradient-to-t ${
            status === 'CRITICAL' 
              ? 'from-rose-950 via-rose-700/80 to-rose-500/90'
              : status === 'WARNING'
              ? 'from-amber-950 via-amber-700/80 to-amber-500/90'
              : status === 'WATCH'
              ? 'from-blue-950 via-blue-700/80 to-blue-500/90'
              : 'from-cyan-950 via-cyan-700/80 to-teal-500/90'
          } p-3 flex flex-col justify-between`}>
            
            <div className="text-center font-bold text-xs text-white drop-shadow-md tracking-wider flex items-center justify-center gap-1">
              <span>WATER SURFACE ({depth.toFixed(1)} cm)</span>
            </div>
          </div>
        </div>

      </div>

      <div className={`mt-4 p-3 rounded-xl border ${statusStyle.bg} ${statusStyle.border} flex items-center justify-between text-xs`}>
        <div className="flex items-center gap-2">
          <ShieldAlert className={`w-4 h-4 ${statusStyle.text}`} />
          <span className="text-slate-300 font-medium">Physical Depth Status:</span>
        </div>
        <span className={`font-bold ${statusStyle.text}`}>{status} LEVEL ({depth.toFixed(1)} cm depth)</span>
      </div>

    </div>
  );
};
