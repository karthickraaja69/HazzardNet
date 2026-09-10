import { supabase, isSupabaseConfigured } from './supabase';
import type { SensorReading } from '../types/sensor';
import { DEFAULT_NODE_INFO } from '../config/thresholds';

export const fetchLatestReadings = async (
  nodeId = DEFAULT_NODE_INFO.id,
  limit = 40
): Promise<SensorReading[]> => {
  if (!isSupabaseConfigured() || !supabase) {
    return [];
  }

  try {
    const { data, error } = await supabase
      .from('sensor_readings')
      .select('*')
      .eq('node_id', nodeId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.warn('Supabase query error:', error.message);
      return [];
    }

    return (data as SensorReading[]).reverse();
  } catch (err) {
    console.warn('Failed to fetch sensor readings from Supabase:', err);
    return [];
  }
};

export const subscribeToSensorReadings = (
  onNewReading: (reading: SensorReading) => void,
  nodeId = DEFAULT_NODE_INFO.id
): (() => void) => {
  if (!isSupabaseConfigured() || !supabase) {
    return () => {};
  }

  const client = supabase;
  const channel = client
    .channel('sensor_readings_live')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'sensor_readings',
        filter: `node_id=eq.${nodeId}`,
      },
      (payload) => {
        if (payload.new) {
          onNewReading(payload.new as SensorReading);
        }
      }
    )
    .subscribe();

  return () => {
    client.removeChannel(channel);
  };
};

export const postSensorReading = async (reading: Omit<SensorReading, 'id' | 'created_at'>) => {
  if (!isSupabaseConfigured() || !supabase) {
    return false;
  }

  try {
    const { error } = await supabase.from('sensor_readings').insert([
      {
        node_id: reading.node_id,
        distance_cm: reading.distance_cm,
        status: reading.status,
      },
    ]);

    if (error) {
      console.error('Error posting sensor reading:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Failed posting reading:', err);
    return false;
  }
};
