import type { SensorReading } from '../types/sensor';
import { calculateStatus, DEFAULT_NODE_INFO } from '../config/thresholds';

let currentMockDistance = 34.5; // Starts at NORMAL
let trendDirection: 'rising' | 'falling' | 'stable' = 'rising'; // rising water = falling distance
let stepCount = 0;

export const generateInitialMockBuffer = (count = 35): SensorReading[] => {
  const readings: SensorReading[] = [];
  const now = Date.now();
  const tempDistance = 36.0;

  for (let i = count - 1; i >= 0; i--) {
    const timestamp = new Date(now - i * 2000).toISOString();
    const variation = (Math.sin(i * 0.4) * 0.6) + (Math.random() * 0.4 - 0.2);
    const distance = Math.max(5.0, Math.min(42.0, parseFloat((tempDistance + variation).toFixed(2))));

    readings.push({
      id: `mock-hist-${i}`,
      node_id: DEFAULT_NODE_INFO.id,
      distance_cm: distance,
      status: calculateStatus(distance),
      created_at: timestamp,
    });
  }

  return readings;
};

export const getNextMockReading = (): SensorReading => {
  stepCount++;

  if (stepCount % 18 === 0) {
    if (currentMockDistance > 32) {
      trendDirection = 'rising';
    } else if (currentMockDistance < 9) {
      trendDirection = 'falling';
    } else {
      trendDirection = Math.random() > 0.4 ? 'rising' : 'falling';
    }
  }

  const stepSize = trendDirection === 'rising' ? -0.8 : 0.6;
  const noise = (Math.random() * 0.4 - 0.2);
  currentMockDistance += stepSize + noise;

  if (currentMockDistance < 6.5) {
    currentMockDistance = 6.5;
    trendDirection = 'falling';
  } else if (currentMockDistance > 38.0) {
    currentMockDistance = 38.0;
    trendDirection = 'rising';
  }

  const distanceCm = parseFloat(currentMockDistance.toFixed(2));
  const status = calculateStatus(distanceCm);

  return {
    id: `mock-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    node_id: DEFAULT_NODE_INFO.id,
    distance_cm: distanceCm,
    status: status,
    created_at: new Date().toISOString(),
  };
};

export const resetMockSimulation = (initialDistance = 34.5) => {
  currentMockDistance = initialDistance;
  trendDirection = 'rising';
  stepCount = 0;
};
