import React from 'react';
import { useApp } from '../../context/AppContext';
import { APP_IMAGES } from '../../assets/images';
import {
  Boxes,
  Activity,
  Layers,
  Scale,
  ShieldCheck,
  AlertTriangle,
  PlusCircle,
  FileCheck2,
  ChevronRight,
  TrendingUp,
  Thermometer,
  Droplets,
  Calendar,
  Sparkles,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

interface OverviewDashboardProps {
  onOpenNewBatch: () => void;
  onOpenNewHive: () => void;
}

export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({
  onOpenNewBatch,
  onOpenNewHive,
}) => {
  const {
    apiaries,
    hives,
    batches,
    alerts,
    setActiveTab,
    setSelectedBatchIdForVerification,
    t,
  } = useApp();

  const totalHarvestKg = batches.reduce((sum, b) => sum + (b.honeyQuantityKg || 0), 0);
  const completeTraceabilityCount = batches.filter(
    (b) => b.batchStatus === 'Packaged' || b.batchStatus === 'Dispatched'
  ).length;
  const activeAlerts = alerts.filter((a) => a.status === 'active');

  // Chart data for 24-hour temperature and humidity trend
  const telemetryTrendData = [
    { time: '00:00', temp: 33.8, humidity: 62 },
    { time: '04:00', temp: 33.2, humidity: 66 },
    { time: '08:00', temp: 34.5, humidity: 59 },
    { time: '12:00', temp: 35.8, humidity: 54 },
    { time: '16:00', temp: 36.1, humidity: 52 },
    { time: '20:00', temp: 34.9, humidity: 58 },
    { time: 'Now', temp: 34.6, humidity: 58 },
  ];

  return (
    <div className="space-y-6">
      {/* Hero Welcome Banner */}
      <div className="relative rounded-2xl overflow-hidden border border-[#E8E0D0] bg-[#234638] text-white shadow-sm">
        <div className="absolute inset-0 z-0 opacity-25">
          <img
            src={APP_IMAGES.apiaryHero}
            alt="Rural Indian Smart Apiary"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#234638] via-[#234638]/90 to-transparent" />
        </div>

        <div className="relative z-10 p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E5A323]/20 text-[#E5A323] text-xs font-semibold mb-3 border border-[#E5A323]/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Smart India Hackathon 2026 · Ministry of MSME (SIH26021)</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white mb-2">
              {t('healthyHivesHeader')}
            </h1>
            <p className="text-sm md:text-base text-[#E5EEE5] leading-relaxed">
              Empowering rural beekeepers with transparent honey provenance, real-time IoT hive health monitoring,
              cryptographic tamper-evident batch ledgers, and verified QR codes for Indian consumers.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={onOpenNewBatch}
              className="px-4 py-2 text-xs font-bold text-[#234638] bg-[#E5A323] hover:bg-[#d89617] rounded-lg transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{t('recordHarvest')}</span>
            </button>
            <button
              onClick={() => setActiveTab('traceability')}
              className="px-4 py-2 text-xs font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-[#E5A323]" />
              <span>{t('traceability')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Primary KPI Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="p-4 bg-white rounded-xl border border-[#E8E0D0] shadow-2xs">
          <div className="flex items-center justify-between text-[#6C756D] mb-1.5">
            <span className="text-xs font-medium">Apiaries</span>
            <Boxes className="w-4 h-4 text-[#234638]" />
          </div>
          <div className="text-2xl font-bold text-[#234638] font-mono tabular-nums">
            {apiaries.length}
          </div>
          <div className="text-[11px] text-[#6C756D] mt-1">3 Rural Clusters</div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-[#E8E0D0] shadow-2xs">
          <div className="flex items-center justify-between text-[#6C756D] mb-1.5">
            <span className="text-xs font-medium">Active Hives</span>
            <Activity className="w-4 h-4 text-[#2F7D50]" />
          </div>
          <div className="text-2xl font-bold text-[#29332D] font-mono tabular-nums">
            {hives.length}
          </div>
          <div className="text-[11px] text-[#2F7D50] mt-1">5 IoT Monitored</div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-[#E8E0D0] shadow-2xs">
          <div className="flex items-center justify-between text-[#6C756D] mb-1.5">
            <span className="text-xs font-medium">Batches Logged</span>
            <Layers className="w-4 h-4 text-[#E5A323]" />
          </div>
          <div className="text-2xl font-bold text-[#29332D] font-mono tabular-nums">
            {batches.length}
          </div>
          <div className="text-[11px] text-[#6C756D] mt-1">Immutable Ledgers</div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-[#E8E0D0] shadow-2xs">
          <div className="flex items-center justify-between text-[#6C756D] mb-1.5">
            <span className="text-xs font-medium">Total Harvest</span>
            <Scale className="w-4 h-4 text-[#B96A45]" />
          </div>
          <div className="text-2xl font-bold text-[#234638] font-mono tabular-nums">
            {totalHarvestKg} <span className="text-xs font-normal text-[#6C756D]">kg</span>
          </div>
          <div className="text-[11px] text-[#6C756D] mt-1">Raw Pure Honey</div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-[#E8E0D0] shadow-2xs">
          <div className="flex items-center justify-between text-[#6C756D] mb-1.5">
            <span className="text-xs font-medium">Traceable Batches</span>
            <ShieldCheck className="w-4 h-4 text-[#2F7D50]" />
          </div>
          <div className="text-2xl font-bold text-[#2F7D50] font-mono tabular-nums">
            {completeTraceabilityCount}
          </div>
          <div className="text-[11px] text-[#6C756D] mt-1">SHA-256 Verified</div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-[#E8E0D0] shadow-2xs">
          <div className="flex items-center justify-between text-[#6C756D] mb-1.5">
            <span className="text-xs font-medium">Hive Alerts</span>
            <AlertTriangle className="w-4 h-4 text-[#B94040]" />
          </div>
          <div
            className={`text-2xl font-bold font-mono tabular-nums ${
              activeAlerts.length > 0 ? 'text-[#B94040]' : 'text-[#2F7D50]'
            }`}
          >
            {activeAlerts.length}
          </div>
          <div className="text-[11px] text-[#6C756D] mt-1">Action Required</div>
        </div>
      </div>

      {/* Middle Grid: Charts & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Real-time Environmental Telemetry Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-[#E8E0D0] p-5 shadow-2xs">
          <div className="flex items-center justify-between pb-4 border-b border-[#E8E0D0]">
            <div>
              <h2 className="text-base font-bold text-[#234638] flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#E5A323]" />
                Cluster IoT Telemetry Trends (24 Hours)
              </h2>
              <p className="text-xs text-[#6C756D] mt-0.5">
                Composite temperature (°C) & relative humidity (%RH) across registered apiaries
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-[#B96A45] font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-[#B96A45]" /> Temp (°C)
              </span>
              <span className="flex items-center gap-1.5 text-[#234638] font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-[#234638]" /> Humidity (%)
              </span>
            </div>
          </div>

          <div className="h-64 pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={telemetryTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#B96A45" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#B96A45" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="humGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#234638" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#234638" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8E0D0" />
                <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#6C756D' }} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#6C756D' }} domain={[20, 80]} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFF8E9',
                    borderRadius: '8px',
                    borderColor: '#E8E0D0',
                    fontSize: '12px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="temp"
                  name="Temperature (°C)"
                  stroke="#B96A45"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#tempGradient)"
                />
                <Area
                  type="monotone"
                  dataKey="humidity"
                  name="Humidity (%RH)"
                  stroke="#234638"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#humGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-3 pt-3 border-t border-[#E8E0D0] flex items-center justify-between text-xs text-[#6C756D]">
            <span>Optimal brood range: 34.0°C – 35.5°C · 50% – 65% RH</span>
            <button
              onClick={() => setActiveTab('monitoring')}
              className="text-[#234638] font-bold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Detailed Sensor Console</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Priority Colony Health Alerts */}
        <div className="bg-white rounded-xl border border-[#E8E0D0] p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E0D0]">
              <h2 className="text-base font-bold text-[#234638] flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-[#B94040]" />
                Recent Hive Alerts
              </h2>
              <span className="text-xs text-[#B94040] font-bold bg-red-50 px-2 py-0.5 rounded-full">
                {activeAlerts.length} Active
              </span>
            </div>

            <div className="mt-3 space-y-3">
              {activeAlerts.slice(0, 3).map((alert) => (
                <div
                  key={alert.id}
                  className="p-3 rounded-lg border border-[#E8E0D0] bg-[#FFF8E9] text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#234638]">{alert.hiveCode}</span>
                    <span className="text-[10px] text-[#6C756D]">{alert.apiaryName}</span>
                  </div>
                  <p className="text-[#29332D] leading-snug font-medium">{alert.reason}</p>
                  <div className="text-[11px] text-[#B96A45] flex items-center gap-1">
                    <span>Rec: {alert.recommendedAction.slice(0, 55)}...</span>
                  </div>
                </div>
              ))}

              {activeAlerts.length === 0 && (
                <div className="py-8 text-center text-xs text-[#6C756D]">
                  No active alerts. All colonies are operating within healthy baseline bounds.
                </div>
              )}
            </div>
          </div>

          <button
            onClick={() => setActiveTab('monitoring')}
            className="w-full mt-4 py-2 text-xs font-semibold text-[#234638] bg-[#E5EEE5] hover:bg-[#d8e5d8] rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Investigate All Hives</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Bottom Row: Recent Harvests & Batches */}
      <div className="bg-white rounded-xl border border-[#E8E0D0] p-5 shadow-2xs">
        <div className="flex items-center justify-between pb-4 border-b border-[#E8E0D0]">
          <div>
            <h2 className="text-base font-bold text-[#234638] flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#E5A323]" />
              Active Honey Batches & Traceability Status
            </h2>
            <p className="text-xs text-[#6C756D] mt-0.5">
              Each batch is tied to verifiable apiary harvest records and cryptographic event blocks
            </p>
          </div>
          <button
            onClick={() => setActiveTab('batches')}
            className="text-xs font-bold text-[#234638] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>View All Batches</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-[#6C756D] border-b border-[#E8E0D0] bg-[#FFF8E9]/60">
                <th className="py-2.5 px-3 font-semibold">Batch Code</th>
                <th className="py-2.5 px-3 font-semibold">Floral Source</th>
                <th className="py-2.5 px-3 font-semibold">Apiary Cluster</th>
                <th className="py-2.5 px-3 font-semibold">Quantity</th>
                <th className="py-2.5 px-3 font-semibold">Status</th>
                <th className="py-2.5 px-3 font-semibold">Blockchain Hash</th>
                <th className="py-2.5 px-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E0D0]">
              {batches.map((batch) => (
                <tr key={batch.id} className="hover:bg-[#FFF8E9]/40 transition-colors">
                  <td className="py-3 px-3 font-mono font-bold text-[#234638]">
                    {batch.id}
                  </td>
                  <td className="py-3 px-3 font-medium text-[#29332D]">
                    {batch.floralSource}
                  </td>
                  <td className="py-3 px-3 text-[#6C756D]">
                    {batch.apiaryName}
                  </td>
                  <td className="py-3 px-3 font-mono tabular-nums font-semibold">
                    {batch.honeyQuantityKg} kg
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                        batch.batchStatus === 'Dispatched' || batch.batchStatus === 'Packaged'
                          ? 'bg-[#E5EEE5] text-[#2F7D50]'
                          : batch.batchStatus === 'Lab Tested'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-stone-100 text-stone-700'
                      }`}
                    >
                      {batch.batchStatus}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono text-[11px] text-[#6C756D]">
                    {batch.blockchainRootHash.slice(0, 10)}...{batch.blockchainRootHash.slice(-6)}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => {
                        setSelectedBatchIdForVerification(batch.id);
                        setActiveTab('verification');
                      }}
                      className="px-2.5 py-1 text-[11px] font-semibold text-[#234638] bg-[#FFF8E9] border border-[#E8E0D0] hover:border-[#E5A323] rounded-md transition-colors cursor-pointer"
                    >
                      Verify QR
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
