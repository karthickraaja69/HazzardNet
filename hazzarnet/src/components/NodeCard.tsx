import React from 'react';
import { Cpu, MapPin, AlertTriangle, Waves, Wifi, CpuIcon } from 'lucide-react';
import type { NodeInfo } from '../types/sensor';

interface NodeCardProps {
  nodeInfo: NodeInfo;
}

export const NodeCard: React.FC<NodeCardProps> = ({ nodeInfo }) => {
  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden backdrop-blur-sm">
      <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />

      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-4">
        <div className="flex items-center gap-2.5">
          <Cpu className="w-5 h-5 text-cyan-400" />
          <span className="font-mono text-xs text-slate-400 tracking-wider">EDGE NODE IDENTIFIER</span>
        </div>
        <span className="text-xs font-mono px-2.5 py-1 rounded-md bg-cyan-500/10 text-cyan-300 font-semibold border border-cyan-500/20">
          {nodeInfo.id}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 text-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-slate-400">
            <MapPin className="w-3.5 h-3.5 text-rose-400" />
            <span>Location</span>
          </div>
          <p className="font-semibold text-slate-200">{nodeInfo.location}</p>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-slate-400">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span>Monitored Hazard</span>
          </div>
          <p className="font-semibold text-amber-400">{nodeInfo.hazard}</p>
        </div>

        <div className="space-y-1 col-span-2">
          <div className="flex items-center gap-1.5 text-slate-400">
            <Waves className="w-3.5 h-3.5 text-blue-400" />
            <span>Active Sensor Hardware</span>
          </div>
          <p className="font-semibold text-slate-200">{nodeInfo.sensor}</p>
        </div>

        <div className="col-span-2 pt-2 border-t border-slate-800/60 flex flex-wrap items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1">
            <Wifi className="w-3 h-3 text-cyan-400" /> SSID: <strong className="text-slate-300">{nodeInfo.wifiSSID}</strong>
          </span>
          <span className="flex items-center gap-1">
            <CpuIcon className="w-3 h-3 text-slate-400" /> GPIO: <strong className="text-slate-300">T{nodeInfo.trigPin}/E{nodeInfo.echoPin}</strong>
          </span>
          <span className="font-mono text-slate-500">{nodeInfo.ipAddress}</span>
        </div>
      </div>
    </div>
  );
};
