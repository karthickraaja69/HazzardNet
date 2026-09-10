# SIH Environmental Monitoring Dashboard

Build a modern environmental monitoring dashboard using:

- React
- Vite
- TypeScript
- Tailwind CSS
- Supabase
- Recharts or another lightweight charting library

The project is a prototype for an SIH environmental monitoring system.

---

# 1. PROJECT GOAL

Create a clean, professional dashboard for a physical ESP32 environmental sensor node.

The current physical hardware consists of:

- ESP32 DevKit
- HC-SR04-style ultrasonic sensor
- The ultrasonic sensor is being used as a water-level sensor.

The dashboard must display the live distance measured by the ultrasonic sensor and convert it into a simple water-level status.

The UI should look like a professional disaster/environment monitoring control dashboard rather than a generic IoT dashboard.

---

# 2. CURRENT ESP32 HARDWARE

The physical ESP32 wiring is ALREADY DONE.

DO NOT change the pin assignments.

### Ultrasonic Sensor → ESP32

| HC-SR04 Pin | ESP32 Pin |
|-------------|-----------|
| VCC | 5V / VIN |
| GND | GND |
| TRIG | GPIO 5 |
| ECHO | GPIO 18 |

The ECHO signal is connected through a voltage divider before reaching GPIO 18.

The ESP32 firmware currently uses:

```cpp
#define TRIG_PIN 5
#define ECHO_PIN 18
```

---

# 3. CURRENT ESP32 FIRMWARE BEHAVIOUR

The ESP32 currently creates its own Wi-Fi access point:

```text
Wi-Fi SSID:
SIH-ENV-NODE

Password:
12345678

ESP32 Web Server:
192.168.4.1
```

The ESP32 hosts a basic webpage itself.

It also exposes:

```text
/data
```

which returns JSON similar to:

```json
{
  "distance": 23.45,
  "status": "WATCH"
}
```

The ESP32 measures distance using:

```text
distance = duration × 0.0343 / 2
```

---

# 4. IMPORTANT NETWORK LIMITATION

The current ESP32 uses:

```cpp
WiFi.mode(WIFI_AP);
WiFi.softAP(...);
```

Therefore, the ESP32 creates its own local Wi-Fi network.

It is NOT currently connected to the internet.

Therefore:

DO NOT attempt to directly connect the current ESP32 firmware to Supabase.

For the current React prototype:

- React dashboard can use Supabase for storing/displaying sensor data.
- Provide a MOCK SENSOR MODE for development.
- Keep the data layer modular so that the ESP32 can be integrated later.

Later we will modify the ESP32 networking architecture so sensor data can reach Supabase/backend.

---

# 5. SUPABASE DATABASE

Create a table:

```text
sensor_readings
```

Suggested columns:

```text
id
node_id
distance_cm
status
created_at
```

Recommended types:

```text
id            UUID / bigint
node_id       text
distance_cm   numeric
status        text
created_at    timestamptz
```

Enable Row Level Security appropriately for the prototype.

Do NOT expose Supabase service-role keys in the React frontend.

Only use the Supabase anon/public key on the frontend.

---

# 6. SENSOR DATA MODEL

Use this structure throughout the React application:

```ts
interface SensorReading {
  id?: string;
  node_id: string;
  distance_cm: number;
  status: "NORMAL" | "WATCH" | "WARNING" | "CRITICAL" | "NO DATA";
  created_at: string;
}
```

Do NOT create different data formats for mock data and real data.

Everything should use this same structure.

---

# 7. WATER LEVEL STATUS

The ultrasonic sensor measures the distance between itself and the water surface.

Therefore:

```text
Larger distance = lower water level
Smaller distance = higher water level
```

For the prototype, use configurable thresholds:

```text
distance >= 30 cm
NORMAL

20–29.99 cm
WATCH

10–19.99 cm
WARNING

< 10 cm
CRITICAL
```

These values are ONLY prototype thresholds.

Put them in one configuration file so they can easily be changed after physical calibration.

Example:

```ts
const WATER_LEVEL_THRESHOLDS = {
  watch: 30,
  warning: 20,
  critical: 10
};
```

---

# 8. DASHBOARD DESIGN

Create a single polished dashboard.

Main sections:

## Header

Display:

```text
ENVIRONMENTAL INTELLIGENCE NETWORK
Edge Sensor Monitoring
```

Show:

```text
● SYSTEM ONLINE
```

---

## Node Information

Display:

```text
NODE-TN-001

Location:
Tamil Nadu

Hazard:
FLOOD MONITORING

Sensor:
ULTRASONIC WATER LEVEL
```

---

# 9. MAIN SENSOR CARD

Make this the most visually prominent component.

Display:

```text
LIVE WATER LEVEL

23.45 cm

WATCH
```

Include a subtle visual indicator showing that the sensor is updating.

Also display:

```text
Last updated:
2 seconds ago
```

The reading should update automatically.

---

# 10. WATER LEVEL VISUALIZATION

Create a simple visual representation of a water container/tank.

The water should visually rise/fall based on the sensor reading.

For example:

```text
       SENSOR
         ↓
    ┌─────────┐
    │         │
    │         │
    │~~~~~~~~~│
    │~~~~~~~~~│
    └─────────┘
```

As the distance decreases, visually increase the water level.

This should make the physical ultrasonic sensor concept immediately understandable to a judge.

---

# 11. LIVE GRAPH

Create a line chart showing:

```text
Water Level / Distance
vs
Time
```

Display approximately the most recent 30–50 readings.

Example:

```text
30 cm ─────────╮
               │
25 cm ─────────╯╲
                  ╲
20 cm              ╲
                    ╲
15 cm                ╲
```

The graph should update as new sensor readings arrive.

---

# 12. ALERT SYSTEM

Create an alert panel.

Example:

```text
ALERTS

WARNING
Water level rising rapidly
NODE-TN-001
Just now

WATCH
Elevated water level detected
NODE-TN-001
2 min ago
```

For now, generate alerts based on status changes.

Do NOT create fake emergency alerts constantly.

---

# 13. SYSTEM STATUS

Display:

```text
ESP32 NODE
● ONLINE

SENSOR
● ACTIVE

DATABASE
● CONNECTED

DATA STREAM
● LIVE
```

If Supabase cannot be reached:

```text
DATABASE
● OFFLINE
```

The dashboard should continue operating using local/mock data.

---

# 14. MOCK MODE

Implement:

```ts
USE_MOCK_DATA = true
```

in configuration.

When mock mode is enabled:

- Generate realistic ultrasonic readings.
- Simulate gradual water-level changes.
- Occasionally increase the water level.
- Update the graph.
- Trigger status transitions naturally.

Example:

```text
35 cm
33 cm
31 cm
29 cm
26 cm
23 cm
19 cm
15 cm
```

This allows the entire UI to be demonstrated without the physical ESP32.

IMPORTANT:

Mock data must use exactly the same `SensorReading` interface as Supabase data.

---

# 15. SUPABASE REALTIME

Prepare the application so Supabase Realtime can be used.

When a new row is inserted into:

```text
sensor_readings
```

the dashboard should be able to update without refreshing the page.

Use a clean subscription/service layer.

Do not put Supabase logic directly into UI components.

---

# 16. PROJECT STRUCTURE

Use a clean structure similar to:

```text
src/
│
├── components/
│   ├── Header.tsx
│   ├── NodeCard.tsx
│   ├── SensorCard.tsx
│   ├── WaterLevelVisual.tsx
│   ├── SensorChart.tsx
│   ├── AlertPanel.tsx
│   └── SystemStatus.tsx
│
├── services/
│   ├── supabase.ts
│   └── sensorService.ts
│
├── hooks/
│   └── useSensorData.ts
│
├── types/
│   └── sensor.ts
│
├── config/
│   └── thresholds.ts
│
├── data/
│   └── mockSensorData.ts
│
├── App.tsx
└── main.tsx
```

Keep components modular.

---

# 17. DESIGN LANGUAGE

Use:

- White/light background
- Dark navy text
- Clean cards
- Subtle borders
- Minimal shadows
- Professional typography
- Blue/teal environmental accents
- Clear warning/critical indicators
- Responsive design

Avoid:

- Excessive gradients
- Huge decorative graphics
- Too much text
- Generic admin-dashboard appearance
- Excessive animations

The dashboard should look suitable for an SIH presentation.

---

# 18. FUTURE ARCHITECTURE

Design the code with this future architecture in mind:

```text
             PHYSICAL ENVIRONMENT
                     ↓
              ESP32 SENSOR NODE
                     ↓
             EDGE PROCESSING
                     ↓
              SENSOR READING
                     ↓
              COMMUNICATION
                     ↓
                 SUPABASE
                     ↓
             REGIONAL DASHBOARD
                     ↓
        WEATHER + HISTORICAL DATA
                     ↓
             RISK PREDICTION
```

Future sensors will include:

- Temperature
- Humidity
- Soil moisture
- Rainfall
- Smoke/gas
- PM2.5/PM10

Do not implement these yet.

Only make the architecture extensible for them.

---

# 19. VERY IMPORTANT CURRENT PRIORITY

Do NOT overbuild the application.

The first working milestone is:

```text
ESP32
  ↓
HC-SR04
  ↓
Distance reading
  ↓
React dashboard
  ↓
Live visual update
```

Then:

```text
React dashboard
  ↓
Supabase
  ↓
Historical readings
```

After that we will integrate the real ESP32 data path.

Focus on making the current ultrasonic water-level node extremely reliable and visually convincing.

---

# 20. ACCEPTANCE CRITERIA

The implementation is successful when:

1. React application starts successfully.
2. Dashboard loads without errors.
3. NODE-TN-001 is displayed.
4. Live distance is displayed prominently.
5. Water-level visual changes according to distance.
6. Status changes between NORMAL/WATCH/WARNING/CRITICAL.
7. Graph updates with sensor readings.
8. Alerts appear when status changes.
9. Mock mode works without Supabase.
10. Supabase mode can read `sensor_readings`.
11. Supabase logic is isolated from UI components.
12. No ESP32 pin assignments are changed.
13. No additional hardware is assumed.
14. The UI is responsive and presentation-ready.

Build the first version now. Keep it simple, modular, and ready for future ESP32 integration.