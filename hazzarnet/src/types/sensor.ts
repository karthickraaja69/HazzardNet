export type SensorStatus = "NORMAL" | "WATCH" | "WARNING" | "CRITICAL" | "NO DATA";

export interface SensorReading {
  id?: string;
  node_id: string;
  distance_cm: number;
  status: SensorStatus;
  created_at: string;
}

export interface WaterDepthThresholds {
  normalMaxDepth: number;    // Depth <= 15cm -> NORMAL
  watchMaxDepth: number;     // Depth 15 - 25cm -> WATCH
  warningMaxDepth: number;   // Depth 25 - 35cm -> WARNING
  criticalMinDepth: number;  // Depth >= 35cm -> CRITICAL FLOOD
}

export interface WaterLevelThresholds {
  normalMinDistance: number; // distance >= 30 cm -> NORMAL
  watchMinDistance: number;  // 20 - 29.99 cm -> WATCH
  warningMinDistance: number;// 10 - 19.99 cm -> WARNING
  criticalMaxDistance: number; // < 10 cm -> CRITICAL
}

export interface NodeInfo {
  id: string;
  location: string;
  hazard: string;
  sensor: string;
  wifiSSID: string;
  ipAddress: string;
  firmware: string;
  echoPin: number;
  trigPin: number;
}

export interface SystemStatusState {
  esp32Node: boolean;
  sensorActive: boolean;
  databaseConnected: boolean;
  dataStreamLive: boolean;
  mockMode: boolean;
}

export interface AlertItem {
  id: string;
  status: SensorStatus;
  title: string;
  description: string;
  node_id: string;
  timestamp: string;
}
