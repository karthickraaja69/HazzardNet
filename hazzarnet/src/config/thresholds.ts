import type { SensorStatus, WaterLevelThresholds, WaterDepthThresholds, NodeInfo } from '../types/sensor';

// Ultrasonic Sensor Mounting Height above bottom of basin/container
export const MAX_SENSOR_HEIGHT_CM = 45;

/**
 * Water Depth Thresholds (measured from container bottom upwards):
 * - Normal: 0 to 15 cm depth (low water, safe level)
 * - Watch: 15 to 25 cm depth (elevated water)
 * - Warning: 25 to 35 cm depth (high water risk)
 * - Critical: >= 35 cm depth (critical flood / overflow)
 */
export const WATER_DEPTH_THRESHOLDS: WaterDepthThresholds = {
  normalMaxDepth: 15,    // Depth < 15cm = NORMAL
  watchMaxDepth: 25,     // Depth 15-25cm = WATCH
  warningMaxDepth: 35,   // Depth 25-35cm = WARNING
  criticalMinDepth: 35,  // Depth >= 35cm = CRITICAL FLOOD
};

/**
 * Air-gap Distance Thresholds (measured from ultrasonic sensor downwards):
 * distance = MAX_SENSOR_HEIGHT_CM - depth
 * - Normal: >= 30 cm distance (Depth <= 15cm)
 * - Watch: 20 to 30 cm distance (Depth 15-25cm)
 * - Warning: 10 to 20 cm distance (Depth 25-35cm)
 * - Critical: < 10 cm distance (Depth > 35cm)
 */
export const WATER_LEVEL_THRESHOLDS: WaterLevelThresholds = {
  normalMinDistance: MAX_SENSOR_HEIGHT_CM - WATER_DEPTH_THRESHOLDS.normalMaxDepth, // 30cm
  watchMinDistance: MAX_SENSOR_HEIGHT_CM - WATER_DEPTH_THRESHOLDS.watchMaxDepth,   // 20cm
  warningMinDistance: MAX_SENSOR_HEIGHT_CM - WATER_DEPTH_THRESHOLDS.warningMaxDepth,// 10cm
  criticalMaxDistance: MAX_SENSOR_HEIGHT_CM - WATER_DEPTH_THRESHOLDS.criticalMinDepth // 10cm
};

export const DEFAULT_NODE_INFO: NodeInfo = {
  id: 'NODE-TN-001',
  location: 'Tamil Nadu, IN',
  hazard: 'FLOOD MONITORING',
  sensor: 'ULTRASONIC WATER LEVEL (HC-SR04)',
  wifiSSID: 'SIH-ENV-NODE',
  ipAddress: '192.168.4.1',
  firmware: 'v1.0.4-edge',
  trigPin: 5,
  echoPin: 18,
};

/**
 * Convert sensor distance (cm) to calculated water level depth (cm)
 */
export const distanceToWaterDepth = (distanceCm: number): number => {
  return Math.max(0, parseFloat((MAX_SENSOR_HEIGHT_CM - distanceCm).toFixed(2)));
};

/**
 * Calculate status from Water Depth (measured from bottom up)
 */
export const calculateStatusByDepth = (depthCm: number): SensorStatus => {
  if (depthCm < 0) return 'NO DATA';
  if (depthCm >= WATER_DEPTH_THRESHOLDS.criticalMinDepth) {
    return 'CRITICAL';
  } else if (depthCm >= WATER_DEPTH_THRESHOLDS.watchMaxDepth) {
    return 'WARNING';
  } else if (depthCm >= WATER_DEPTH_THRESHOLDS.normalMaxDepth) {
    return 'WATCH';
  } else {
    return 'NORMAL';
  }
};

/**
 * Calculate status from ultrasonic sensor distance
 */
export const calculateStatus = (distanceCm: number): SensorStatus => {
  if (distanceCm < 0) return 'NO DATA';
  const depth = distanceToWaterDepth(distanceCm);
  return calculateStatusByDepth(depth);
};

export const getStatusColor = (status: SensorStatus) => {
  switch (status) {
    case 'NORMAL':
      return {
        bg: 'bg-emerald-500/10',
        text: 'text-emerald-400',
        border: 'border-emerald-500/30',
        badgeBg: 'bg-emerald-500',
        glow: 'shadow-emerald-500/20',
        barColor: '#10b981',
        label: 'NORMAL (Low Water)',
      };
    case 'WATCH':
      return {
        bg: 'bg-blue-500/10',
        text: 'text-blue-400',
        border: 'border-blue-500/30',
        badgeBg: 'bg-blue-500',
        glow: 'shadow-blue-500/20',
        barColor: '#3b82f6',
        label: 'WATCH (Elevated Water)',
      };
    case 'WARNING':
      return {
        bg: 'bg-amber-500/10',
        text: 'text-amber-400',
        border: 'border-amber-500/30',
        badgeBg: 'bg-amber-500',
        glow: 'shadow-amber-500/20',
        barColor: '#f59e0b',
        label: 'WARNING (High Water)',
      };
    case 'CRITICAL':
      return {
        bg: 'bg-rose-500/10',
        text: 'text-rose-400',
        border: 'border-rose-500/30',
        badgeBg: 'bg-rose-500',
        glow: 'shadow-rose-500/20',
        barColor: '#ef4444',
        label: 'CRITICAL (Flood Risk)',
      };
    case 'NO DATA':
    default:
      return {
        bg: 'bg-slate-500/10',
        text: 'text-slate-400',
        border: 'border-slate-500/30',
        badgeBg: 'bg-slate-500',
        glow: 'shadow-slate-500/20',
        barColor: '#64748b',
        label: 'NO DATA',
      };
  }
};
