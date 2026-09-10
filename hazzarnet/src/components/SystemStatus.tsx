import React from 'react';
import type { SystemStatusState } from '../types/sensor';
import { Cpu, Radio, Database, Activity } from 'lucide-react';

interface SystemStatusProps {
  status: SystemStatusState;
}

export const SystemStatus: React.FC<SystemStatusProps> = ({ status }) => {
  const items = [
    {
      label: 'ESP32 NODE',
      subtext: 'Hardware MCU AP',
      online: status.esp32Node,
      icon: Cpu,
    },
    {
      label: 'ULTRASONIC SENSOR',
      subtext: 'HC-SR04 Active',
      online: status.sensorActive,
      icon: Radio,
    },
    {
      label: 'DATABASE LAYER',
      subtext: status.databaseConnected ? 'Supabase Realtime' : 'Local Mock Storage',
      online: status.databaseConnected,
      icon: Database,
    },
    {
      label: 'TELEMETRY STREAM',
      subtext: status.mockMode ? 'Simulated Stream' : 'Hardware WebSocket',
      online: status.dataStreamLive,
      icon: Activity,
    },
  ];

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg backdrop-blur-sm">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
        <h3 className="font-bold text-xs font-mono text-slate-400 tracking-wider uppercase">
          System Infrastructure Health
        </h3>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          HEALTHY
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {items.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="bg-slate-950/60 border border-slate-800/80 p-3 rounded-xl flex items-center justify-between"
            >
              <div className="flex items-center gap-2.5">
                <div className={`p-2 rounded-lg ${item.online ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-400'}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-200">{item.label}</div>
                  <div className="text-[10px] text-slate-400">{item.subtext}</div>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <span className={`w-2 h-2 rounded-full ${item.online ? 'bg-emerald-400 shadow-sm shadow-emerald-500/50 animate-pulse' : 'bg-amber-500'}`} />
                <span className={`text-[10px] font-mono font-bold ${item.online ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {item.online ? 'ONLINE' : 'MOCK'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
