import { useSensorData } from './hooks/useSensorData';
import { DEFAULT_NODE_INFO } from './config/thresholds';
import { Header } from './components/Header';
import { NodeCard } from './components/NodeCard';
import { SensorCard } from './components/SensorCard';
import { WaterLevelVisual } from './components/WaterLevelVisual';
import { SensorChart } from './components/SensorChart';
import { AlertPanel } from './components/AlertPanel';
import { SystemStatus } from './components/SystemStatus';
import { AlertCircle, Terminal } from 'lucide-react';

export function App() {
  const {
    latestReading,
    readingsHistory,
    systemStatus,
    alerts,
    secondsAgo,
    isPulseActive,
    isMockMode,
    toggleMockMode,
  } = useSensorData();

  return (
    <div className="min-h-screen flex flex-col bg-[#070c19] text-slate-100 selection:bg-cyan-500 selection:text-white">
      
      {/* Header Navigation */}
      <Header
        isMockMode={isMockMode}
        onToggleMockMode={toggleMockMode}
        isOnline={systemStatus.esp32Node}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6 space-y-6">
        
        {/* Mock Mode Banner Alert */}
        {isMockMode && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 px-4 flex items-center justify-between text-xs text-amber-300 shadow-lg">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                <strong>SIMULATION DEMO ACTIVE:</strong> Generating realistic ultrasonic water-level readings for presentation. Switch to <strong>LIVE HARDWARE MODE</strong> when physical ESP32 access point is connected.
              </span>
            </div>
            <button
              onClick={toggleMockMode}
              className="text-[11px] font-bold underline hover:text-amber-200 shrink-0 ml-2"
            >
              Toggle Mode
            </button>
          </div>
        )}

        {/* Infrastructure Health Status Bar */}
        <SystemStatus status={systemStatus} />

        {/* Top Grid: Node Metadata & Main Sensor Metric & Water Basin Visualizer */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column (5 cols): Edge Node Details & Basin Visual */}
          <div className="lg:col-span-5 space-y-6 flex flex-col justify-between">
            <NodeCard nodeInfo={DEFAULT_NODE_INFO} />
            <WaterLevelVisual reading={latestReading} />
          </div>

          {/* Right Column (7 cols): Hero Sensor Card & Telemetry Chart */}
          <div className="lg:col-span-7 space-y-6 flex flex-col justify-between">
            <SensorCard
              reading={latestReading}
              secondsAgo={secondsAgo}
              isPulseActive={isPulseActive}
            />
            <SensorChart readings={readingsHistory} />
          </div>

        </div>

        {/* Bottom Section: System Alerts & Architecture Reference */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Alert Log Panel (7 cols) */}
          <div className="lg:col-span-7">
            <AlertPanel alerts={alerts} />
          </div>

          {/* ESP32 Wiring & Architecture Reference Card (5 cols) */}
          <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 border-b border-slate-800 pb-3 mb-3">
                <Terminal className="w-4 h-4 text-cyan-400" />
                <h3 className="font-bold text-xs font-mono text-slate-300 tracking-wider uppercase">
                  Hardware Wiring & Firmware Specs
                </h3>
              </div>

              <div className="space-y-2 text-xs text-slate-300">
                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 font-mono text-[11px] space-y-1">
                  <div className="text-cyan-400 font-bold"># ESP32 Pin Assignment</div>
                  <div className="text-slate-400">TRIG_PIN = 5  → HC-SR04 TRIG</div>
                  <div className="text-slate-400">ECHO_PIN = 18 → HC-SR04 ECHO (Divider)</div>
                </div>

                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 font-mono text-[11px] space-y-1">
                  <div className="text-emerald-400 font-bold"># WiFi SoftAP Configuration</div>
                  <div className="text-slate-400">SSID: SIH-ENV-NODE</div>
                  <div className="text-slate-400">IP: 192.168.4.1 /data</div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
              <span>SIH Environmental Sensor Node</span>
              <span className="font-mono text-cyan-400">HazzardNet v1.0</span>
            </div>
          </div>

        </div>

      </main>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 py-4 px-6 text-center text-xs text-slate-500">
        <p>HazzardNet Environmental Intelligence Dashboard • Built for SIH ESP32 Ultrasonic Water Level Monitoring</p>
      </footer>

    </div>
  );
}

export default App;
