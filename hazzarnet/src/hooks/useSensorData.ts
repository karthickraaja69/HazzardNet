import { useState, useEffect, useCallback, useRef } from 'react';
import type { SensorReading, SystemStatusState, AlertItem, SensorStatus } from '../types/sensor';
import { generateInitialMockBuffer, getNextMockReading } from '../data/mockSensorData';
import { isSupabaseConfigured } from '../services/supabase';
import { fetchLatestReadings, subscribeToSensorReadings, postSensorReading } from '../services/sensorService';
import { DEFAULT_NODE_INFO, distanceToWaterDepth } from '../config/thresholds';

export const useSensorData = () => {
  const [isMockMode, setIsMockMode] = useState<boolean>(false);
  const [readingsHistory, setReadingsHistory] = useState<SensorReading[]>(() => generateInitialMockBuffer(35));
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [secondsAgo, setSecondsAgo] = useState<number>(0);
  const [isPulseActive, setIsPulseActive] = useState<boolean>(false);

  const prevStatusRef = useRef<SensorStatus | null>(null);

  const [systemStatus, setSystemStatus] = useState<SystemStatusState>({
    esp32Node: true,
    sensorActive: true,
    databaseConnected: isSupabaseConfigured(),
    dataStreamLive: true,
    mockMode: false,
  });

  const latestReading = readingsHistory.length > 0 ? readingsHistory[readingsHistory.length - 1] : null;

  const checkAndTriggerAlert = useCallback((newReading: SensorReading) => {
    const prev = prevStatusRef.current;
    prevStatusRef.current = newReading.status;

    if (!prev || prev === newReading.status) return;

    let alertTitle = '';
    let alertDesc = '';
    const waterDepth = distanceToWaterDepth(newReading.distance_cm);

    if (newReading.status === 'CRITICAL') {
      alertTitle = 'CRITICAL FLOOD RISK DETECTED';
      alertDesc = `Water height rose to ${waterDepth} cm (sensor distance ${newReading.distance_cm} cm). Immediate flood alert!`;
    } else if (newReading.status === 'WARNING') {
      alertTitle = 'High Water Warning';
      alertDesc = `Water level rising rapidly to ${waterDepth} cm (sensor distance ${newReading.distance_cm} cm).`;
    } else if (newReading.status === 'WATCH') {
      alertTitle = 'Watch Level Alert';
      alertDesc = `Elevated water level detected at ${waterDepth} cm depth (${newReading.distance_cm} cm air-gap).`;
    } else if (newReading.status === 'NORMAL' && (prev === 'CRITICAL' || prev === 'WARNING' || prev === 'WATCH')) {
      alertTitle = 'Status Normalized';
      alertDesc = `Water level receded to safe depth (${waterDepth} cm).`;
    }

    if (alertTitle) {
      const newAlert: AlertItem = {
        id: `alert-${Date.now()}`,
        status: newReading.status,
        title: alertTitle,
        description: alertDesc,
        node_id: newReading.node_id,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      };

      setAlerts((prevAlerts) => [newAlert, ...prevAlerts.slice(0, 19)]);
    }
  }, []);

  const pushReading = useCallback((reading: SensorReading) => {
    setReadingsHistory((prev) => {
      const updated = [...prev, reading];
      if (updated.length > 50) {
        return updated.slice(updated.length - 50);
      }
      return updated;
    });

    setSecondsAgo(0);
    setIsPulseActive(true);
    setTimeout(() => setIsPulseActive(false), 600);

    checkAndTriggerAlert(reading);
  }, [checkAndTriggerAlert]);

  useEffect(() => {
    if (latestReading && alerts.length === 0) {
      const initDepth = distanceToWaterDepth(latestReading.distance_cm);
      setAlerts([
        {
          id: 'alert-init-1',
          status: 'WATCH',
          title: 'Elevated Water Level Detected',
          description: `Initial monitoring scan registered water depth at ${initDepth} cm.`,
          node_id: DEFAULT_NODE_INFO.id,
          timestamp: '2 min ago',
        },
      ]);
      prevStatusRef.current = latestReading.status;
    }
  }, [latestReading, alerts.length]);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsAgo((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!isMockMode) return;

    const interval = setInterval(() => {
      const reading = getNextMockReading();
      pushReading(reading);

      if (systemStatus.databaseConnected) {
        postSensorReading(reading).catch(() => {});
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [isMockMode, pushReading, systemStatus.databaseConnected]);

  useEffect(() => {
    if (isMockMode) return;

    let unsubscribe: (() => void) | undefined;

    const initSupabaseStream = async () => {
      const initial = await fetchLatestReadings(DEFAULT_NODE_INFO.id, 40);
      if (initial.length > 0) {
        setReadingsHistory(initial);
      }

      unsubscribe = subscribeToSensorReadings((newReading) => {
        pushReading(newReading);
      }, DEFAULT_NODE_INFO.id);
    };

    initSupabaseStream();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [isMockMode, pushReading]);

  const toggleMockMode = () => {
    setIsMockMode((prev) => {
      const next = !prev;
      setSystemStatus((curr) => ({
        ...curr,
        mockMode: next,
      }));
      return next;
    });
  };

  return {
    latestReading,
    readingsHistory,
    systemStatus,
    alerts,
    secondsAgo,
    isPulseActive,
    isMockMode,
    toggleMockMode,
  };
};
