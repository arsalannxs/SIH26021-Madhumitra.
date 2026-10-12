import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Boxes,
  Activity,
  Layers,
  ShieldCheck,
  QrCode,
  FileCheck2,
  TrendingUp,
  ShoppingBag,
  FileSpreadsheet,
  Settings,
  RefreshCw,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Info,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { activeTab, setActiveTab, loadDemoData, resetDemoData, alerts, batches, t } = useApp();
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [resetSuccessMessage, setResetSuccessMessage] = useState<string | null>(null);

  const activeAlertsCount = alerts.filter((a) => a.status === 'active').length;

  const menuItems = [
    { id: 'overview', label: t('overview'), icon: LayoutDashboard },
    { id: 'apiaries', label: t('apiaries'), icon: Boxes },
    {
      id: 'monitoring',
      label: t('hiveMonitoring'),
      icon: Activity,
      badge: activeAlertsCount > 0 ? activeAlertsCount : undefined,
      badgeColor: 'text-amber-800 bg-amber-100',
    },
    { id: 'batches', label: t('batches'), icon: Layers },
    { id: 'traceability', label: t('traceability'), icon: ShieldCheck },
    { id: 'verification', label: t('qrVerification'), icon: QrCode },
    { id: 'quality', label: t('qualityRecords'), icon: FileCheck2 },
    { id: 'harvest', label: t('harvestYield'), icon: TrendingUp },
    { id: 'market', label: t('market'), icon: ShoppingBag },
    { id: 'reports', label: t('reports'), icon: FileSpreadsheet },
    { id: 'settings', label: t('settings'), icon: Settings },
  ];

  const handleReset = () => {
    resetDemoData();
    setShowResetConfirm(false);
    setResetSuccessMessage('Demo records restored to baseline.');
    setTimeout(() => setResetSuccessMessage(null), 3000);
  };

  const handleLoadDemo = async () => {
    await loadDemoData();
    setResetSuccessMessage('Refreshed demonstration cluster data.');
    setTimeout(() => setResetSuccessMessage(null), 3000);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs lg:hidden"
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-[#FFFFFF] border-r border-[#E8E0D0] flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:static lg:z-20`}
      >
        {/* Brand header */}
        <div className="p-5 border-b border-[#E8E0D0] bg-[#FFF8E9]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-[#234638] flex items-center justify-center text-[#E5A323] font-bold text-lg shadow-xs">
              M
            </div>
            <div>
              <h2 className="font-bold text-[#234638] text-base leading-tight">Madhumitra</h2>
              <p className="text-xs text-[#6C756D] font-medium leading-tight">मधुमित्र · Honey Chain</p>
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-[#E8E0D0] text-[11px] text-[#6C756D] flex items-center gap-1.5">
            <span className="font-semibold text-[#234638]">SIH26021</span>
            <span>·</span>
            <span>Ministry of MSME</span>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  onClose();
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer min-h-[44px] ${
                  isActive
                    ? 'bg-[#234638] text-white shadow-xs'
                    : 'text-[#29332D] hover:bg-[#FFF8E9] hover:text-[#234638]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4.5 h-4.5 shrink-0 ${
                      isActive ? 'text-[#E5A323]' : 'text-[#6C756D]'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-semibold tabular-nums ${
                      isActive ? 'bg-amber-400 text-[#234638]' : item.badgeColor
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Demo control footer */}
        <div className="p-4 border-t border-[#E8E0D0] bg-[#FFF8E9]/50 space-y-2">
          {resetSuccessMessage && (
            <div className="p-2 text-xs text-[#2F7D50] bg-[#E5EEE5] rounded-md flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              <span>{resetSuccessMessage}</span>
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={handleLoadDemo}
              className="flex-1 flex items-center justify-center gap-1.5 px-2.5 py-2 text-xs font-medium text-[#234638] bg-white border border-[#E8E0D0] rounded-lg hover:border-[#E5A323] hover:bg-[#FFF8E9] transition-colors cursor-pointer min-h-[38px]"
              title="Reload pre-configured demonstration batches and sensor streams"
            >
              <RefreshCw className="w-3.5 h-3.5 text-[#E5A323]" />
              <span>{t('loadDemoData')}</span>
            </button>
            <button
              onClick={() => setShowResetConfirm(true)}
              className="flex items-center justify-center gap-1.5 px-2.5 py-2 text-xs font-medium text-[#B94040] bg-white border border-[#E8E0D0] rounded-lg hover:border-[#B94040] hover:bg-red-50 transition-colors cursor-pointer min-h-[38px]"
              title="Reset all demo data"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{t('resetDemoData')}</span>
            </button>
          </div>

          <div className="text-[11px] text-[#6C756D] leading-tight text-center pt-1">
            Prototype Blockchain Ledger & IoT Engine
          </div>
        </div>

        {/* Reset Confirmation Dialog */}
        {showResetConfirm && (
          <div className="fixed inset-0 z-60 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-sm w-full p-5 shadow-xl border border-[#E8E0D0]">
              <div className="flex items-center gap-2.5 text-[#B94040] mb-3">
                <AlertTriangle className="w-5 h-5 shrink-0" />
                <h3 className="font-bold text-base text-[#29332D]">Reset Demo Data?</h3>
              </div>
              <p className="text-xs text-[#6C756D] leading-relaxed mb-4">
                This will clear any newly recorded batches, events or test listings and restore the default
                demonstration dataset for Himachal, Sundarbans and Punjab.
              </p>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="px-3 py-1.5 text-xs font-medium text-[#29332D] hover:bg-[#FFF8E9] rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReset}
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#B94040] hover:bg-red-700 rounded-lg shadow-xs"
                >
                  Yes, Reset Data
                </button>
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};
