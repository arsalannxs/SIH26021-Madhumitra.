import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SupportedLanguage } from '../../services/i18n';
import { UserRole } from '../../types';
import {
  Settings,
  Globe,
  UserCheck,
  Radio,
  Sliders,
  Sparkles,
  RotateCcw,
  RefreshCw,
  CheckCircle2,
  Cpu,
  Lock,
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const {
    settings,
    updateSettings,
    language,
    setLanguage,
    currentRole,
    setCurrentRole,
    loadDemoData,
    resetDemoData,
  } = useApp();

  const [savedNotice, setSavedNotice] = useState(false);

  const [thresholds, setThresholds] = useState({
    tempMinC: settings.alertThresholds.tempMinC,
    tempMaxC: settings.alertThresholds.tempMaxC,
    humidityMaxPct: settings.alertThresholds.humidityMaxPct,
    weightDropKgAlert: settings.alertThresholds.weightDropKgAlert,
  });

  const [endpointUrl, setEndpointUrl] = useState(settings.iotEndpointUrl);

  const handleSaveThresholds = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      alertThresholds: {
        tempMinC: Number(thresholds.tempMinC),
        tempMaxC: Number(thresholds.tempMaxC),
        humidityMaxPct: Number(thresholds.humidityMaxPct),
        weightDropKgAlert: Number(thresholds.weightDropKgAlert),
      },
      iotEndpointUrl: endpointUrl,
    });
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-[#234638] flex items-center gap-2">
          <Settings className="w-5 h-5 text-[#E5A323]" />
          Platform Configuration & System Settings
        </h1>
        <p className="text-xs text-[#6C756D] mt-0.5">
          Manage language, telemetry ingestion modes, environmental thresholds, and user access roles
        </p>
      </div>

      {savedNotice && (
        <div className="p-3 bg-[#E5EEE5] text-[#2F7D50] text-xs rounded-xl border border-[#2F7D50]/30 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Configuration parameters saved successfully!</span>
        </div>
      )}

      {/* Grid of Settings Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Language & Regionalization */}
        <div className="bg-white rounded-xl border border-[#E8E0D0] p-5 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-2.5 border-b border-[#E8E0D0]">
            <Globe className="w-4 h-4 text-[#E5A323]" />
            <h2 className="text-sm font-bold text-[#234638]">Language & Localization</h2>
          </div>

          <p className="text-xs text-[#6C756D]">
            Switch interface language to assist rural beekeepers across Indian states.
          </p>

          <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
            {[
              { code: 'en' as SupportedLanguage, label: 'English' },
              { code: 'hi' as SupportedLanguage, label: 'हिन्दी (Hindi)' },
              { code: 'bn' as SupportedLanguage, label: 'বাংলা (Bengali)' },
              { code: 'mr' as SupportedLanguage, label: 'मराठी (Marathi)' },
            ].map((lang) => (
              <button
                key={lang.code}
                onClick={() => setLanguage(lang.code)}
                className={`p-3 rounded-lg border text-left transition-all cursor-pointer flex items-center justify-between ${
                  language === lang.code
                    ? 'bg-[#234638] text-white border-[#234638]'
                    : 'bg-[#FFF8E9] text-[#29332D] border-[#E8E0D0] hover:border-[#E5A323]'
                }`}
              >
                <span>{lang.label}</span>
                {language === lang.code && <span className="w-2 h-2 rounded-full bg-[#E5A323]"></span>}
              </button>
            ))}
          </div>
        </div>

        {/* User Role Simulation (RBAC) */}
        <div className="bg-white rounded-xl border border-[#E8E0D0] p-5 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-2.5 border-b border-[#E8E0D0]">
            <UserCheck className="w-4 h-4 text-[#234638]" />
            <h2 className="text-sm font-bold text-[#234638]">Role-Based Access Control (RBAC)</h2>
          </div>

          <p className="text-xs text-[#6C756D]">
            Test portal capabilities and permissions across different stakeholder personas.
          </p>

          <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
            {[
              { id: 'beekeeper' as UserRole, label: 'Rural Beekeeper', desc: 'Apiary & Harvest' },
              { id: 'processor' as UserRole, label: 'Honey Processor', desc: 'Extraction & Lab' },
              { id: 'buyer' as UserRole, label: 'Retail Buyer', desc: 'Enquiry & Sourcing' },
              { id: 'admin' as UserRole, label: 'Field Admin', desc: 'Full System Control' },
            ].map((r) => (
              <button
                key={r.id}
                onClick={() => setCurrentRole(r.id)}
                className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                  currentRole === r.id
                    ? 'bg-[#234638] text-white border-[#234638]'
                    : 'bg-[#FFF8E9] text-[#29332D] border-[#E8E0D0] hover:border-[#E5A323]'
                }`}
              >
                <div className="font-bold">{r.label}</div>
                <div className={`text-[10px] mt-0.5 ${currentRole === r.id ? 'text-[#E5EEE5]' : 'text-[#6C756D]'}`}>
                  {r.desc}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Environmental Alert Thresholds Form */}
      <div className="bg-white rounded-xl border border-[#E8E0D0] p-5 shadow-2xs space-y-4">
        <div className="flex items-center gap-2 pb-2.5 border-b border-[#E8E0D0]">
          <Sliders className="w-4 h-4 text-[#E5A323]" />
          <h2 className="text-sm font-bold text-[#234638]">Environmental Anomaly Alert Thresholds</h2>
        </div>

        <p className="text-xs text-[#6C756D]">
          Configure rule-based sensor alarms. Thresholds should be aligned with local agro-climatic conditions and bee species.
        </p>

        <form onSubmit={handleSaveThresholds} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block font-semibold text-[#29332D] mb-1">Min Safe Temp (°C)</label>
              <input
                type="number"
                step="0.5"
                value={thresholds.tempMinC}
                onChange={(e) => setThresholds({ ...thresholds, tempMinC: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-[#FFF8E9] border border-[#E8E0D0] rounded-lg font-mono"
              />
              <span className="text-[10px] text-[#6C756D]">Triggers chill warning</span>
            </div>

            <div>
              <label className="block font-semibold text-[#29332D] mb-1">Max Safe Temp (°C)</label>
              <input
                type="number"
                step="0.5"
                value={thresholds.tempMaxC}
                onChange={(e) => setThresholds({ ...thresholds, tempMaxC: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-[#FFF8E9] border border-[#E8E0D0] rounded-lg font-mono"
              />
              <span className="text-[10px] text-[#B94040]">Triggers heat stress alert</span>
            </div>

            <div>
              <label className="block font-semibold text-[#29332D] mb-1">Max Humidity (%RH)</label>
              <input
                type="number"
                step="1"
                value={thresholds.humidityMaxPct}
                onChange={(e) => setThresholds({ ...thresholds, humidityMaxPct: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-[#FFF8E9] border border-[#E8E0D0] rounded-lg font-mono"
              />
              <span className="text-[10px] text-[#6C756D]">Mold & condensation risk</span>
            </div>

            <div>
              <label className="block font-semibold text-[#29332D] mb-1">Weight Drop Alert (kg)</label>
              <input
                type="number"
                step="0.1"
                value={thresholds.weightDropKgAlert}
                onChange={(e) =>
                  setThresholds({ ...thresholds, weightDropKgAlert: Number(e.target.value) })
                }
                className="w-full px-3 py-2 bg-[#FFF8E9] border border-[#E8E0D0] rounded-lg font-mono"
              />
              <span className="text-[10px] text-[#B96A45]">Swarm or robbing alarm</span>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-[#29332D] mb-1">IoT Webhook Ingestion URL</label>
            <input
              type="url"
              value={endpointUrl}
              onChange={(e) => setEndpointUrl(e.target.value)}
              className="w-full px-3 py-2 bg-[#FFF8E9] border border-[#E8E0D0] rounded-lg font-mono"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-4 py-2 font-bold text-xs text-white bg-[#234638] hover:bg-[#1a352a] rounded-lg transition-colors shadow-2xs cursor-pointer"
            >
              Save Alert Thresholds
            </button>
          </div>
        </form>
      </div>

      {/* Demo Reset Panel */}
      <div className="bg-white rounded-xl border border-[#E8E0D0] p-5 shadow-2xs flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-[#234638]">Demonstration Cluster Reset</h2>
          <p className="text-xs text-[#6C756D] mt-0.5">
            Reset all local browser storage and reload clean baseline records for jury presentation
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={loadDemoData}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#234638] bg-[#FFF8E9] border border-[#E8E0D0] hover:border-[#E5A323] rounded-lg transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#E5A323]" />
            <span>Reload Demo</span>
          </button>
          <button
            onClick={resetDemoData}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-[#B94040] hover:bg-red-700 rounded-lg transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear & Reset All</span>
          </button>
        </div>
      </div>
    </div>
  );
};
