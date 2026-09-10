import React from 'react';
import type { AlertItem } from '../types/sensor';
import { getStatusColor } from '../config/thresholds';
import { Bell, AlertOctagon, AlertTriangle, Info, CheckCircle2 } from 'lucide-react';

interface AlertPanelProps {
  alerts: AlertItem[];
}

export const AlertPanel: React.FC<AlertPanelProps> = ({ alerts }) => {
  const getAlertIcon = (status: AlertItem['status']) => {
    switch (status) {
      case 'CRITICAL':
        return <AlertOctagon className="w-4 h-4 text-rose-400" />;
      case 'WARNING':
        return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      case 'WATCH':
        return <Info className="w-4 h-4 text-blue-400" />;
      case 'NORMAL':
      default:
        return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-md flex flex-col justify-between">
      
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-amber-400" />
          <h3 className="font-bold text-sm text-slate-200 uppercase tracking-wider">
            System Alerts Log
          </h3>
        </div>
        <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
          {alerts.length} ALERTS
        </span>
      </div>

      <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
        {alerts.length === 0 ? (
          <div className="text-xs text-slate-500 py-6 text-center italic">
            No active water level alerts logged.
          </div>
        ) : (
          alerts.map((item) => {
            const style = getStatusColor(item.status);
            return (
              <div
                key={item.id}
                className={`p-3 rounded-xl border ${style.bg} ${style.border} transition-all duration-200 flex items-start gap-3`}
              >
                <div className="mt-0.5">{getAlertIcon(item.status)}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-bold ${style.text}`}>{item.title}</span>
                    <span className="text-[10px] font-mono text-slate-400">{item.timestamp}</span>
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5 leading-snug">{item.description}</p>
                  <div className="mt-1.5 flex items-center gap-2 text-[10px] font-mono text-slate-400">
                    <span>Node: <strong className="text-slate-300">{item.node_id}</strong></span>
                    <span>•</span>
                    <span className={`font-bold ${style.text}`}>{item.status}</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
