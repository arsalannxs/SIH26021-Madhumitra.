import React, { useState } from 'react';
import { Info, X, ShieldAlert, Cpu, Sparkles } from 'lucide-react';

export const DemoBanner: React.FC = () => {
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) return null;

  return (
    <div className="bg-[#FFF8E9] border-b border-[#E8E0D0] px-4 py-2.5 text-xs text-[#29332D]">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="font-bold text-[#234638] flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-[#E5A323]" />
            Smart India Hackathon SIH26021 Prototype:
          </span>
          <span className="text-[#6C756D]">
            Simulated IoT telemetry & real cryptographic SHA-256 tamper-evident ledger.
          </span>
          <span className="text-[#2F7D50] font-medium hidden md:inline">
            · Physical laboratory quality certificates clearly separated from blockchain records.
          </span>
        </div>
        <button
          onClick={() => setIsDismissed(true)}
          className="text-[#6C756D] hover:text-[#29332D] p-1 rounded-md transition-colors cursor-pointer shrink-0"
          aria-label="Dismiss banner"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
