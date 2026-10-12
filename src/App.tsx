import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { DemoBanner } from './components/common/DemoBanner';
import { WalkthroughModal } from './components/demo/WalkthroughModal';
import { NewBatchWizard } from './components/batches/NewBatchWizard';

import { OverviewDashboard } from './components/overview/OverviewDashboard';
import { ApiariesView } from './components/apiaries/ApiariesView';
import { HiveMonitoringView } from './components/monitoring/HiveMonitoringView';
import { HoneyBatchesView } from './components/batches/HoneyBatchesView';
import { TraceabilityLedgerView } from './components/traceability/TraceabilityLedgerView';
import { QrVerificationView } from './components/verification/QrVerificationView';
import { QualityRecordsView } from './components/quality/QualityRecordsView';
import { HarvestYieldView } from './components/analytics/HarvestYieldView';
import { MarketConnectionsView } from './components/market/MarketConnectionsView';
import { ReportsView } from './components/reports/ReportsView';
import { SettingsView } from './components/settings/SettingsView';

const MainLayout: React.FC = () => {
  const { activeTab, setActiveTab, setSelectedBatchIdForVerification } = useApp();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isWalkthroughOpen, setIsWalkthroughOpen] = useState(false);
  const [isNewBatchModalOpen, setIsNewBatchModalOpen] = useState(false);

  // Check URL hash for direct QR code links (e.g. #verify/MM-2026-B108)
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#verify/')) {
        const batchId = hash.replace('#verify/', '');
        if (batchId) {
          setSelectedBatchIdForVerification(batchId);
          setActiveTab('verification');
        }
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, [setActiveTab, setSelectedBatchIdForVerification]);

  const renderActiveView = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <OverviewDashboard
            onOpenNewBatch={() => setIsNewBatchModalOpen(true)}
            onOpenNewHive={() => setActiveTab('apiaries')}
          />
        );
      case 'apiaries':
        return <ApiariesView />;
      case 'monitoring':
        return <HiveMonitoringView />;
      case 'batches':
        return <HoneyBatchesView onOpenNewBatchModal={() => setIsNewBatchModalOpen(true)} />;
      case 'traceability':
        return <TraceabilityLedgerView />;
      case 'verification':
        return <QrVerificationView />;
      case 'quality':
        return <QualityRecordsView />;
      case 'harvest':
        return <HarvestYieldView />;
      case 'market':
        return <MarketConnectionsView />;
      case 'reports':
        return <ReportsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return (
          <OverviewDashboard
            onOpenNewBatch={() => setIsNewBatchModalOpen(true)}
            onOpenNewHive={() => setActiveTab('apiaries')}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF8E9] text-[#29332D] flex flex-col">
      {/* Top Demo Context Banner */}
      <DemoBanner />

      {/* Strict 3-zone Top Bar Contract */}
      <Navbar
        onOpenWalkthrough={() => setIsWalkthroughOpen(true)}
        onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        isMobileMenuOpen={isMobileMenuOpen}
        onOpenNewBatchModal={() => setIsNewBatchModalOpen(true)}
      />

      {/* Main Container: Sidebar + Content */}
      <div className="flex-1 flex max-w-[1600px] w-full mx-auto">
        <Sidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {renderActiveView()}
        </main>
      </div>

      {/* Modals */}
      <WalkthroughModal
        isOpen={isWalkthroughOpen}
        onClose={() => setIsWalkthroughOpen(false)}
        onOpenNewBatchModal={() => setIsNewBatchModalOpen(true)}
      />

      <NewBatchWizard
        isOpen={isNewBatchModalOpen}
        onClose={() => setIsNewBatchModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
