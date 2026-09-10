-- ========================================================
-- HAZZARDNET - SUPABASE DATABASE INITIALIZATION SCRIPT
-- Copy and run this script in the Supabase SQL Editor
-- ========================================================

-- 1. Create the `sensor_readings` table
CREATE TABLE IF NOT EXISTS public.sensor_readings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    node_id TEXT NOT NULL DEFAULT 'NODE-TN-001',
    distance_cm NUMERIC(6, 2) NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('NORMAL', 'WATCH', 'WARNING', 'CRITICAL', 'NO DATA')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Create index on node_id and created_at for fast query performance
CREATE INDEX IF NOT EXISTS idx_sensor_readings_node_time 
ON public.sensor_readings (node_id, created_at DESC);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.sensor_readings ENABLE ROW LEVEL SECURITY;

-- 4. Create RLS Policy to allow Anonymous Read access (Public Dashboard)
CREATE POLICY "Allow public read access to sensor readings"
ON public.sensor_readings
FOR SELECT
TO anon, authenticated
USING (true);

-- 5. Create RLS Policy to allow Anonymous Insert access (ESP32 / Frontend Stream)
CREATE POLICY "Allow public insert access to sensor readings"
ON public.sensor_readings
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- 6. Enable Supabase Realtime Publication for live dashboard updates
ALTER PUBLICATION supabase_realtime ADD TABLE public.sensor_readings;

-- ========================================================
-- SAMPLE INSERT DATA (TEST COMMANDS)
-- You can run these commands to simulate incoming ESP32 data
-- ========================================================

-- Sample 1: Normal Water Level (Distance = 34.5 cm -> Water Depth = 10.5 cm)
INSERT INTO public.sensor_readings (node_id, distance_cm, status)
VALUES ('NODE-TN-001', 34.50, 'NORMAL');

-- Sample 2: Watch Level (Distance = 24.2 cm -> Water Depth = 20.8 cm)
INSERT INTO public.sensor_readings (node_id, distance_cm, status)
VALUES ('NODE-TN-001', 24.20, 'WATCH');

-- Sample 3: Warning Level (Distance = 14.8 cm -> Water Depth = 30.2 cm)
INSERT INTO public.sensor_readings (node_id, distance_cm, status)
VALUES ('NODE-TN-001', 14.80, 'WARNING');

-- Sample 4: Critical Flood Level (Distance = 6.2 cm -> Water Depth = 38.8 cm)
INSERT INTO public.sensor_readings (node_id, distance_cm, status)
VALUES ('NODE-TN-001', 6.20, 'CRITICAL');
