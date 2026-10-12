import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { generate24HourTelemetry } from '../../services/store';
import { generateColonyAdvice, ColonyAdviceResult } from '../../services/ai';
import { Hive, SensorReading } from '../../types';
import {
  Activity,
  Thermometer,
  Droplets,
  Scale,
  Volume2,
  AlertTriangle,
  Cpu,
  CheckCircle2,
  Sparkles,
  RefreshCw,
  Sliders,
  Radio,
  Clock,
  ShieldAlert,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from 'recharts';

export const HiveMonitoringView: React.FC = () => {
  const { hives, alerts, settings, updateSettings, resolveAlert } = useApp();
  const [selectedHiveId, setSelectedHiveId] = useState<string>(hives[0]?.id || 'HIVE-101');
  const [telemetry, setTelemetry] = useState<SensorReading[]>([]);
  const [aiAdvice, setAiAdvice] = useState<ColonyAdviceResult | null>(null);
  const [isLoadingAdvice, setIsLoadingAdvice] = useState(false);
  const [simulatedIngestionMsg, setSimulatedIngestionMsg] = useState<string | null>(null);

  const selectedHive = hives.find((h) => h.id === selectedHiveId) || hives[0];
  const hiveAlerts = alerts.filter((a) => a.hiveId === selectedHive?.id);

  // Load telemetry when selected hive changes
  useEffect(() => {
    if (!selectedHive) return;
    const data = generate24HourTelemetry(
      selectedHive.temperatureC,
      selectedHive.humidityPct,
      selectedHive.weightKg
    );
    setTelemetry(data);

    // Initial rule-based or AI advice
    async function loadAdvice() {
      setIsLoadingAdvice(true);
      const advice = await generateColonyAdvice(selectedHive, data);
      setAiAdvice(advice);
      setIsLoadingAdvice(false);
    }
    loadAdvice();
  }, [selectedHiveId]);

  // Handle IoT mode toggle
  const handleToggleIotMode = (mode: 'demo' | 'connected') => {
    updateSettings({ iotMode: mode });
  };

  // Simulate pushing a new sensor telemetry payload
  const handleSimulateNewReading = () => {
    if (!selectedHive) return;
    const newTemp = Number((selectedHive.temperatureC + (Math.random() * 0.8 - 0.4)).toFixed(1));
    const newHum = Number((selectedHive.humidityPct + (Math.random() * 2 - 1)).toFixed(1));
    const newWeight = Number((selectedHive.weightKg + (Math.random() * 0.1 - 0.05)).toFixed(2));
    const newAcoustic = Math.round(selectedHive.acousticHz + (Math.random() * 10 - 5));

    const newReading: SensorReading = {
      timestamp: new Date().toISOString(),
      temperatureC: newTemp,
      humidityPct: newHum,
      weightKg: newWeight,
      acousticHz: newAcoustic,
      batteryPct: 88,
      signalQuality: 'strong',
    };

    setTelemetry((prev) => [...prev.slice(1), newReading]);
    setSimulatedIngestionMsg(
      `Ingested payload from ${selectedHive.sensorHardwareId || 'ESP32'}: Temp ${newTemp}°C, Hum ${newHum}%`
    );
    setTimeout(() => setSimulatedIngestionMsg(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & IoT Mode Toggle */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#234638] flex items-center gap-2">
            <Activity className="w-5 h-5 text-[#E5A323]" />
            Hive Telemetry & Environmental Monitoring
          </h1>
          <p className="text-xs text-[#6C756D] mt-0.5">
            Micro-climate tracking inside the brood nest: thermal balance, humidity, weight & acoustics
          </p>
        </div>

        {/* Mode Switcher */}
        <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-[#E8E0D0] shadow-2xs">
          <button
            onClick={() => handleToggleIotMode('demo')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              settings.iotMode === 'demo'
                ? 'bg-[#234638] text-white shadow-2xs'
                : 'text-[#6C756D] hover:text-[#234638]'
            }`}
          >
            <Radio className="w-3.5 h-3.5 text-[#E5A323]" />
            <span>Demo Synthetic Telemetry</span>
          </button>
          <button
            onClick={() => handleToggleIotMode('connected')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              settings.iotMode === 'connected'
                ? 'bg-[#234638] text-white shadow-2xs'
                : 'text-[#6C756D] hover:text-[#234638]'
            }`}
          >
            <Cpu className="w-3.5 h-3.5 text-[#2F7D50]" />
            <span>Connected-Device Mode</span>
          </button>
        </div>
      </div>

      {/* Mode Status Disclosure Notice */}
      <div
        className={`p-3.5 rounded-xl border text-xs flex items-center justify-between gap-3 ${
          settings.iotMode === 'demo'
            ? 'bg-[#FFF8E9] border-[#E8E0D0] text-[#29332D]'
            : 'bg-[#E5EEE5] border-[#2F7D50]/30 text-[#234638]'
        }`}
      >
        <div className="flex items-center gap-2.5">
          <Cpu className="w-4 h-4 shrink-0 text-[#E5A323]" />
          <div>
            <span className="font-bold">
              {settings.iotMode === 'demo' ? 'Demonstration Mode: ' : 'Connected Hardware API: '}
            </span>
            <span className="text-[#6C756D]">
              {settings.iotMode === 'demo'
                ? 'Displaying synthetic diurnal curves for hackathon demonstration. Data does not claim real physical hardware.'
                : `Listening for HTTP POST JSON on ${settings.iotEndpointUrl}. ESP32 / LoRaWAN gateway active.`}
            </span>
          </div>
        </div>

        <button
          onClick={handleSimulateNewReading}
          className="flex items-center gap-1.5 px-3 py-1 text-xs font-bold text-[#234638] bg-white border border-[#E8E0D0] hover:border-[#E5A323] rounded-lg transition-colors shrink-0 shadow-2xs cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5 text-[#E5A323]" />
          <span>Trigger Ingestion Ping</span>
        </button>
      </div>

      {simulatedIngestionMsg && (
        <div className="p-2.5 bg-[#E5EEE5] text-[#2F7D50] text-xs rounded-lg border border-[#2F7D50]/20 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{simulatedIngestionMsg}</span>
        </div>
      )}

      {/* Hive Selector Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {hives.map((h) => {
          const isSelected = h.id === selectedHive?.id;
          const hasActiveAlert = alerts.some((a) => a.hiveId === h.id && a.status === 'active');
          return (
            <button
              key={h.id}
              onClick={() => setSelectedHiveId(h.id)}
              className={`px-4 py-2 text-xs font-bold rounded-xl border transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
                isSelected
                  ? 'bg-[#234638] text-white border-[#234638] shadow-xs'
                  : 'bg-white text-[#29332D] border-[#E8E0D0] hover:border-[#E5A323]'
              }`}
            >
              <span>{h.code}</span>
              <span className="text-[10px] opacity-75 font-normal">({h.apiaryName.slice(0, 14)}...)</span>
              {hasActiveAlert && (
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              )}
            </button>
          );
        })}
      </div>

      {/* Selected Hive Live Metric Cards */}
      {selectedHive && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-white rounded-xl border border-[#E8E0D0] shadow-2xs">
            <div className="flex items-center justify-between text-[#6C756D] mb-1">
              <span className="text-xs font-medium">Brood Temperature</span>
              <Thermometer className="w-4 h-4 text-[#B96A45]" />
            </div>
            <div className="text-2xl font-bold font-mono text-[#234638] tabular-nums">
              {selectedHive.temperatureC}°C
            </div>
            <div className="text-[11px] text-[#6C756D] mt-1">
              Target: 34.0°C – 35.5°C
              {selectedHive.temperatureC > 36.0 && (
                <span className="text-[#B94040] font-bold ml-1">· Warm</span>
              )}
            </div>
          </div>

          <div className="p-4 bg-white rounded-xl border border-[#E8E0D0] shadow-2xs">
            <div className="flex items-center justify-between text-[#6C756D] mb-1">
              <span className="text-xs font-medium">Relative Humidity</span>
              <Droplets className="w-4 h-4 text-[#234638]" />
            </div>
            <div className="text-2xl font-bold font-mono text-[#29332D] tabular-nums">
              {selectedHive.humidityPct}%
            </div>
            <div className="text-[11px] text-[#6C756D] mt-1">
              Safe: 50% – 65% RH
            </div>
          </div>

          <div className="p-4 bg-white rounded-xl border border-[#E8E0D0] shadow-2xs">
            <div className="flex items-center justify-between text-[#6C756D] mb-1">
              <span className="text-xs font-medium">Colony Weight</span>
              <Scale className="w-4 h-4 text-[#E5A323]" />
            </div>
            <div className="text-2xl font-bold font-mono text-[#234638] tabular-nums">
              {selectedHive.weightKg} kg
            </div>
            <div className="text-[11px] text-[#6C756D] mt-1">
              Load Cell Precision ±50g
            </div>
          </div>

          <div className="p-4 bg-white rounded-xl border border-[#E8E0D0] shadow-2xs">
            <div className="flex items-center justify-between text-[#6C756D] mb-1">
              <span className="text-xs font-medium">Acoustic Activity</span>
              <Volume2 className="w-4 h-4 text-[#2F7D50]" />
            </div>
            <div className="text-2xl font-bold font-mono text-[#29332D] tabular-nums">
              {selectedHive.acousticHz} Hz
            </div>
            <div className="text-[11px] text-[#6C756D] mt-1">
              Colony Buzz Freq (180-240Hz)
            </div>
          </div>
        </div>
      )}

      {/* Main Charts: Temperature, Humidity, and Weight curves */}
      <div className="bg-white rounded-xl border border-[#E8E0D0] p-5 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-3 border-b border-[#E8E0D0] gap-2">
          <div>
            <h2 className="text-base font-bold text-[#234638] flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#E5A323]" />
              24-Hour Micro-Climate & Colony Weight Profile
            </h2>
            <p className="text-xs text-[#6C756D]">
              Measurements logged at 60-minute intervals by onboard solar ESP32 controller
            </p>
          </div>
          <div className="text-xs text-[#6C756D] font-mono">
            Last Ping: {new Date().toLocaleTimeString()}
          </div>
        </div>

        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={telemetry.map((t) => ({
                time: new Date(t.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                temp: t.temperatureC,
                humidity: t.humidityPct,
                weight: t.weightKg,
              }))}
              margin={{ top: 10, right: 20, left: -10, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8E0D0" />
              <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#6C756D' }} tickLine={false} />
              <YAxis
                yAxisId="left"
                tick={{ fontSize: 11, fill: '#6C756D' }}
                domain={[20, 80]}
                tickLine={false}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                tick={{ fontSize: 11, fill: '#6C756D' }}
                domain={[15, 40]}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFF8E9',
                  borderRadius: '8px',
                  borderColor: '#E8E0D0',
                  fontSize: '12px',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="temp"
                name="Temperature (°C)"
                stroke="#B96A45"
                strokeWidth={2.5}
                dot={false}
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="humidity"
                name="Humidity (%RH)"
                stroke="#234638"
                strokeWidth={2}
                dot={false}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="weight"
                name="Hive Weight (kg)"
                stroke="#E5A323"
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Colony Health Alerts & AI-Assisted Advisor */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Rule-Based Alert System */}
        <div className="bg-white rounded-xl border border-[#E8E0D0] p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-[#E8E0D0]">
            <h3 className="text-base font-bold text-[#234638] flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-[#B94040]" />
              Colony Health Preliminary Alarms
            </h3>
            <span className="text-xs text-[#6C756D]">Configured Rules Engine</span>
          </div>

          <div className="space-y-3">
            {hiveAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-3.5 rounded-xl border text-xs space-y-2 ${
                  alert.status === 'active'
                    ? 'bg-red-50/60 border-red-200'
                    : 'bg-[#E5EEE5]/40 border-[#2F7D50]/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#B94040] uppercase tracking-wider text-[11px]">
                    {alert.alertType.replace('_', ' ')}
                  </span>
                  <span className="text-[#6C756D] font-mono text-[10px]">
                    {new Date(alert.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-[#29332D] font-medium leading-relaxed">{alert.reason}</p>
                <div className="p-2 bg-white rounded-lg border border-[#E8E0D0] text-[#234638] font-medium">
                  <span className="font-bold">Next Check: </span>
                  {alert.recommendedAction}
                </div>

                {alert.status === 'active' && (
                  <div className="flex justify-end pt-1">
                    <button
                      onClick={() => resolveAlert(alert.id)}
                      className="px-2.5 py-1 text-[11px] font-semibold text-[#2F7D50] bg-white border border-[#2F7D50]/30 hover:bg-[#E5EEE5] rounded-md transition-colors cursor-pointer"
                    >
                      Mark Check Completed
                    </button>
                  </div>
                )}
              </div>
            ))}

            {hiveAlerts.length === 0 && (
              <div className="p-6 text-center text-xs text-[#6C756D]">
                <CheckCircle2 className="w-6 h-6 text-[#2F7D50] mx-auto mb-2" />
                No active anomaly alarms for this hive. Measurements comply with configured thresholds.
              </div>
            )}
          </div>

          <div className="p-3 bg-[#FFF8E9] rounded-lg border border-[#E8E0D0] text-[11px] text-[#6C756D]">
            Threshold rules: Temp Max {settings.alertThresholds.tempMaxC}°C · Temp Min{' '}
            {settings.alertThresholds.tempMinC}°C · Humidity Max {settings.alertThresholds.humidityMaxPct}% · Weight
            Drop {settings.alertThresholds.weightDropKgAlert} kg.
          </div>
        </div>

        {/* AI-Assisted Apicultural Advisor */}
        <div className="bg-white rounded-xl border border-[#E8E0D0] p-5 shadow-2xs space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E0D0]">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#E5A323]" />
                <h3 className="text-base font-bold text-[#234638]">
                  AI-Assisted Apicultural Advisor
                </h3>
              </div>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#E5EEE5] text-[#234638] font-semibold">
                Gemini Advisory Engine
              </span>
            </div>

            {aiAdvice ? (
              <div className="mt-3 space-y-3 text-xs">
                <div className="p-3 bg-[#FFF8E9] rounded-lg border border-[#E8E0D0] leading-relaxed text-[#29332D]">
                  <p className="font-medium">{aiAdvice.summary}</p>
                </div>

                <div>
                  <h4 className="font-bold text-[#234638] mb-1.5">
                    Recommended Frame Inspection Inquiries:
                  </h4>
                  <ul className="space-y-1.5 pl-1">
                    {aiAdvice.recommendedInspectionQuestions.map((q, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-[#29332D]">
                        <span className="text-[#E5A323] font-bold">·</span>
                        <span>{q}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-2 border-t border-[#E8E0D0]">
                  <span className="text-[10px] font-bold text-[#6C756D] uppercase">Risk Tier: </span>
                  <span className="text-xs font-bold text-[#234638]">{aiAdvice.riskAssessment}</span>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-xs text-[#6C756D]">
                Loading colony telemetry assessment...
              </div>
            )}
          </div>

          {/* Honest Disclaimer */}
          <div className="p-3 rounded-lg bg-amber-50/70 border border-amber-200/60 text-[11px] text-[#B7791F] flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Mandatory Scientific Disclosure: </span>
              Outputs are AI-assisted recommendations. A sensor anomaly is an indicator for physical inspection,
              not verified proof of disease or swarming. Always conduct tactile frame checks.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
