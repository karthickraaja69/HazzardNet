import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  CartesianGrid,
} from 'recharts';
import type { SensorReading } from '../types/sensor';
import { WATER_DEPTH_THRESHOLDS, distanceToWaterDepth } from '../config/thresholds';
import { TrendingUp } from 'lucide-react';

interface SensorChartProps {
  readings: SensorReading[];
}

export const SensorChart: React.FC<SensorChartProps> = ({ readings }) => {
  const chartData = readings.map((item) => {
    const date = new Date(item.created_at);
    const timeLabel = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const waterDepth = distanceToWaterDepth(item.distance_cm);

    return {
      time: timeLabel,
      waterDepth: waterDepth,
      distance: item.distance_cm,
      status: item.status,
    };
  });

  // Depth thresholds (measured from basin bottom up)
  const normalDepthThreshold = WATER_DEPTH_THRESHOLDS.normalMaxDepth; // 15cm
  const watchDepthThreshold = WATER_DEPTH_THRESHOLDS.watchMaxDepth;   // 25cm
  const criticalDepthThreshold = WATER_DEPTH_THRESHOLDS.criticalMinDepth; // 35cm

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-md flex flex-col justify-between">
      
      {/* Chart Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-800 pb-4 mb-4 gap-2">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-cyan-400" />
            <h3 className="font-bold text-sm text-slate-200 uppercase tracking-wider">
              Real-Time Flood Level Telemetry
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Water Depth Level Over Time (Rising Line = Flood Risk)
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 text-[11px] font-medium text-slate-400">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-0.5 bg-emerald-400" /> Normal (&lt;=15cm)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-0.5 bg-blue-400" /> Watch (15-25cm)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-0.5 bg-amber-400" /> Warning (25-35cm)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-0.5 bg-rose-400" /> Critical (&gt;35cm)
          </span>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 15, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="waterDepthGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0284c7" stopOpacity={0.5} />
                <stop offset="95%" stopColor="#0284c7" stopOpacity={0.05} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />

            <XAxis
              dataKey="time"
              stroke="#64748b"
              tick={{ fontSize: 10 }}
              tickLine={false}
              axisLine={{ stroke: '#334155' }}
            />

            <YAxis
              domain={[0, 45]}
              stroke="#64748b"
              tick={{ fontSize: 10 }}
              tickFormatter={(val) => `${val}cm`}
              tickLine={false}
              axisLine={{ stroke: '#334155' }}
            />

            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-slate-900 border border-slate-700 p-3 rounded-lg shadow-xl text-xs space-y-1">
                      <div className="font-mono text-slate-400">{data.time}</div>
                      <div className="text-cyan-300 font-bold font-mono text-sm">
                        Water Level: {data.waterDepth} cm
                      </div>
                      <div className="text-slate-400 text-[11px]">
                        Sensor Distance: {data.distance} cm
                      </div>
                      <div className="text-slate-300">
                        Status: <strong className="text-cyan-400">{data.status}</strong>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />

            {/* Threshold Reference Lines */}
            <ReferenceLine
              y={normalDepthThreshold}
              stroke="#10b981"
              strokeDasharray="3 3"
              label={{ value: 'NORMAL (15cm depth)', fill: '#10b981', fontSize: 10, position: 'insideBottomRight' }}
            />
            <ReferenceLine
              y={watchDepthThreshold}
              stroke="#3b82f6"
              strokeDasharray="3 3"
              label={{ value: 'WATCH (25cm depth)', fill: '#3b82f6', fontSize: 10, position: 'insideTopRight' }}
            />
            <ReferenceLine
              y={criticalDepthThreshold}
              stroke="#ef4444"
              strokeDasharray="3 3"
              label={{ value: 'CRITICAL FLOOD (>35cm depth)', fill: '#ef4444', fontSize: 10, position: 'insideTopRight' }}
            />

            <Area
              type="monotone"
              dataKey="waterDepth"
              stroke="#0ea5e9"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#waterDepthGradient)"
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
};
