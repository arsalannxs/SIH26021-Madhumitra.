import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  X,
  ExternalLink,
  ShieldCheck,
  Activity,
  QrCode,
  Layers,
  FileCheck2,
  AlertTriangle,
  PlayCircle,
  FileSpreadsheet,
} from 'lucide-react';

interface WalkthroughModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenNewBatchModal: () => void;
}

export const WalkthroughModal: React.FC<WalkthroughModalProps> = ({
  isOpen,
  onClose,
  onOpenNewBatchModal,
}) => {
  const { setActiveTab, setSelectedBatchIdForVerification } = useApp();
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const steps = [
    {
      stepNumber: 1,
      title: 'Beekeeper Overview Dashboard',
      description: 'Explore live KPI cards, production trends, registered cluster apiaries, and active hive alerts.',
      actionLabel: 'Go to Overview',
      icon: Layers,
      action: () => {
        setActiveTab('overview');
        onClose();
      },
    },
    {
      stepNumber: 2,
      title: 'Select Apiary & Inspect Hive Health',
      description: 'Review apiary cluster locations (generalised for consumer privacy) and individual wooden hive boxes.',
      actionLabel: 'View Apiaries',
      icon: Activity,
      action: () => {
        setActiveTab('apiaries');
        onClose();
      },
    },
    {
      stepNumber: 3,
      title: 'Real-time IoT Telemetry & Alert Checks',
      description: 'Inspect 24-hour temperature, humidity, acoustic frequencies, and hive weight. Test configured threshold alarms.',
      actionLabel: 'Open Hive Monitoring',
      icon: Activity,
      action: () => {
        setActiveTab('monitoring');
        onClose();
      },
    },
    {
      stepNumber: 4,
      title: 'Record Harvest & Create Honey Batch',
      description: 'Launch the guided 7-step batch creation wizard for rural beekeepers with cold extraction & filtration notes.',
      actionLabel: 'Open Batch Wizard',
      icon: Layers,
      action: () => {
        onClose();
        onOpenNewBatchModal();
      },
    },
    {
      stepNumber: 5,
      title: 'Traceability Ledger & SHA-256 Hashes',
      description: 'Review append-only event blocks. Each block signs previous hash, event payload, and actor credential.',
      actionLabel: 'Inspect Ledger',
      icon: ShieldCheck,
      action: () => {
        setActiveTab('traceability');
        onClose();
      },
    },
    {
      stepNumber: 6,
      title: 'Live Record Tampering Simulation',
      description: 'Simulate a malicious alteration of historic moisture/weight records to watch the cryptographic hash verify fail.',
      actionLabel: 'Test Tampering Check',
      icon: AlertTriangle,
      action: () => {
        setActiveTab('traceability');
        onClose();
      },
    },
    {
      stepNumber: 7,
      title: 'Consumer QR Code Verification Portal',
      description: 'Scan or click batch MM-2026-B108 to open the consumer verification page showing origin, timeline, and lab parameters.',
      actionLabel: 'Open QR Verification',
      icon: QrCode,
      action: () => {
        setSelectedBatchIdForVerification('MM-2026-B108');
        setActiveTab('verification');
        onClose();
      },
    },
    {
      stepNumber: 8,
      title: 'Accredited Lab Quality Certificate',
      description: 'Inspect moisture (17.2% vs FSSAI 20%), HMF freshness indicator, and learn what lab testing proves vs what ledger proves.',
      actionLabel: 'View Quality Lab Records',
      icon: FileCheck2,
      action: () => {
        setActiveTab('quality');
        onClose();
      },
    },
    {
      stepNumber: 9,
      title: 'Export Audit Reports & CSV',
      description: 'Generate audit-ready CSV exports and print-formatted honey jar batch compliance certificates.',
      actionLabel: 'Open Reports & Exports',
      icon: FileSpreadsheet,
      action: () => {
        setActiveTab('reports');
        onClose();
      },
    },
  ];

  const current = steps[currentStep];
  const StepIcon = current.icon;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-[#E8E0D0] overflow-hidden">
        {/* Header */}
        <div className="bg-[#234638] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#E5A323] flex items-center justify-center text-[#234638]">
              <PlayCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">3-Minute Jury Demonstration</h3>
              <p className="text-xs text-[#E5EEE5]/80">SIH26021 Evaluator Walkthrough</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step progress pills */}
        <div className="px-6 pt-4 pb-2 bg-[#FFF8E9] border-b border-[#E8E0D0]">
          <div className="flex items-center justify-between text-xs text-[#6C756D] font-medium mb-2">
            <span>Step {currentStep + 1} of {steps.length}</span>
            <span className="font-semibold text-[#234638]">
              {Math.round(((currentStep + 1) / steps.length) * 100)}% Complete
            </span>
          </div>
          <div className="w-full bg-[#E8E0D0] h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-[#E5A323] h-full transition-all duration-300 rounded-full"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#E5EEE5] flex items-center justify-center text-[#234638] shrink-0 border border-[#234638]/20">
              <StepIcon className="w-6 h-6 text-[#234638]" />
            </div>
            <div>
              <span className="text-xs font-semibold text-[#E5A323] uppercase tracking-wider">
                Demonstration Phase {current.stepNumber}
              </span>
              <h4 className="text-lg font-bold text-[#234638] mt-0.5 mb-2">
                {current.title}
              </h4>
              <p className="text-sm text-[#29332D] leading-relaxed">
                {current.description}
              </p>
            </div>
          </div>

          <div className="p-3.5 bg-[#FFF8E9] rounded-xl border border-[#E8E0D0] flex items-center justify-between mt-2">
            <span className="text-xs text-[#6C756D]">Jump directly to this module:</span>
            <button
              onClick={current.action}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-[#234638] rounded-lg hover:bg-[#1a352a] transition-colors shadow-xs cursor-pointer"
            >
              <span>{current.actionLabel}</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#E5A323]" />
            </button>
          </div>
        </div>

        {/* Footer controls */}
        <div className="p-4 bg-white border-t border-[#E8E0D0] flex items-center justify-between">
          <button
            onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
            disabled={currentStep === 0}
            className={`flex items-center gap-1 px-3 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              currentStep === 0
                ? 'text-[#6C756D]/40 cursor-not-allowed'
                : 'text-[#234638] hover:bg-[#FFF8E9]'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <div className="flex gap-1">
            {steps.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentStep(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                  currentStep === idx ? 'bg-[#234638] scale-125' : 'bg-[#E8E0D0] hover:bg-[#6C756D]'
                }`}
              />
            ))}
          </div>

          {currentStep < steps.length - 1 ? (
            <button
              onClick={() => setCurrentStep((prev) => Math.min(steps.length - 1, prev + 1))}
              className="flex items-center gap-1 px-4 py-2 text-xs font-bold text-white bg-[#E5A323] hover:bg-[#d4941a] rounded-lg transition-colors shadow-xs cursor-pointer"
            >
              <span>Next Step</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={onClose}
              className="flex items-center gap-1 px-4 py-2 text-xs font-bold text-white bg-[#2F7D50] hover:bg-[#256641] rounded-lg transition-colors shadow-xs cursor-pointer"
            >
              <span>Finish Tour</span>
              <CheckCircle2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
