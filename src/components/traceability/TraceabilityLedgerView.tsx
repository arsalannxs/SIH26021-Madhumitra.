import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { TraceabilityEvent } from '../../types';
import { IntegrityVerificationResult } from '../../services/blockchain';
import {
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  Lock,
  Layers,
  ArrowDown,
  Hash,
  Clock,
  User,
  MapPin,
  FileCheck2,
  Sparkles,
  Info,
  PlusCircle,
  HelpCircle,
} from 'lucide-react';

export const TraceabilityLedgerView: React.FC = () => {
  const {
    batches,
    events,
    selectedBatchIdForVerification,
    setSelectedBatchIdForVerification,
    verifyBatchChain,
    simulateTamperEvent,
    restoreOriginalChain,
    appendCorrectionBlock,
  } = useApp();

  const [activeBatchId, setActiveBatchId] = useState<string>(
    selectedBatchIdForVerification || batches[0]?.id || 'MM-2026-B108'
  );
  const [verificationResult, setVerificationResult] = useState<IntegrityVerificationResult | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [showCorrectionModal, setShowCorrectionModal] = useState(false);
  const [correctionForm, setCorrectionForm] = useState({
    field: 'Moisture Percentage',
    oldVal: '19.8%',
    newVal: '17.2%',
    reason: 'FSSAI lab calibration certificate #NDDB-8941 recalibration verified lower moisture content.',
  });

  const batchEvents = events
    .filter((e) => e.batchId === activeBatchId)
    .sort((a, b) => a.sequenceNum - b.sequenceNum);

  // Run integrity verification on load or batch change
  useEffect(() => {
    async function runCheck() {
      setIsVerifying(true);
      const res = await verifyBatchChain(activeBatchId);
      setVerificationResult(res);
      setIsVerifying(false);
    }
    runCheck();
  }, [activeBatchId, events]);

  const handleManualVerify = async () => {
    setIsVerifying(true);
    const res = await verifyBatchChain(activeBatchId);
    setVerificationResult(res);
    setIsVerifying(false);
  };

  const handleTamperSimulation = () => {
    // Pick the first harvest or extraction event and maliciously alter details
    const targetEvent = batchEvents.find((e) => e.sequenceNum === 1 || e.sequenceNum === 4);
    if (!targetEvent) return;

    simulateTamperEvent(targetEvent.eventId, 'quantityKg', 9999);
  };

  const handleRestore = async () => {
    await restoreOriginalChain(activeBatchId);
  };

  const handleAppendCorrection = async (e: React.FormEvent) => {
    e.preventDefault();
    await appendCorrectionBlock(
      activeBatchId,
      correctionForm.field,
      correctionForm.oldVal,
      correctionForm.newVal,
      correctionForm.reason
    );
    setShowCorrectionModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#234638] flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#E5A323]" />
            Honey Traceability & Blockchain-Style Ledger
          </h1>
          <p className="text-xs text-[#6C756D] mt-0.5">
            Append-only cryptographically linked event blocks with SHA-256 fingerprint verification
          </p>
        </div>

        {/* Batch Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#6C756D] font-medium">Batch:</span>
          <select
            value={activeBatchId}
            onChange={(e) => {
              setActiveBatchId(e.target.value);
              setSelectedBatchIdForVerification(e.target.value);
            }}
            className="px-3 py-2 text-xs font-mono font-bold bg-white border border-[#E8E0D0] rounded-lg text-[#234638] focus:outline-none focus:border-[#E5A323]"
          >
            {batches.map((b) => (
              <option key={b.id} value={b.id}>
                {b.id} ({b.floralSource.slice(0, 20)}...)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Verification Status Banner */}
      <div
        className={`p-5 rounded-2xl border transition-all ${
          verificationResult?.isValid
            ? 'bg-[#E5EEE5] border-[#2F7D50]/30 text-[#234638]'
            : 'bg-red-50 border-red-300 text-[#B94040]'
        }`}
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-start gap-3.5">
            {verificationResult?.isValid ? (
              <div className="w-10 h-10 rounded-xl bg-[#2F7D50] text-white flex items-center justify-center shrink-0 shadow-xs">
                <CheckCircle2 className="w-6 h-6" />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-xl bg-[#B94040] text-white flex items-center justify-center shrink-0 shadow-xs">
                <ShieldAlert className="w-6 h-6" />
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base leading-tight">
                  {verificationResult?.isValid
                    ? 'Cryptographic Record Integrity: Verified Intact'
                    : 'Tampering Detected: Hash Mismatch in Chain!'}
                </h3>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-white/70 border border-current font-bold">
                  {batchEvents.length} Blocks Verified
                </span>
              </div>
              <p className="text-xs mt-1 leading-relaxed opacity-90 max-w-2xl">
                {verificationResult?.isValid
                  ? 'All sequential SHA-256 block hashes match their payload signatures and reference links back to Genesis.'
                  : verificationResult?.errorReason}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={handleManualVerify}
              disabled={isVerifying}
              className="px-3.5 py-2 text-xs font-bold text-white bg-[#234638] hover:bg-[#1a352a] rounded-lg shadow-2xs flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${isVerifying ? 'animate-spin' : ''}`} />
              <span>{isVerifying ? 'Verifying Hashes...' : 'Re-verify Chain'}</span>
            </button>

            {verificationResult?.isValid ? (
              <button
                onClick={handleTamperSimulation}
                className="px-3 py-2 text-xs font-bold text-[#B94040] bg-white border border-[#B94040]/30 hover:bg-red-50 rounded-lg shadow-2xs flex items-center gap-1.5 cursor-pointer"
                title="Demonstrate tamper detection for hackathon judges"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Simulate Malicious Tampering</span>
              </button>
            ) : (
              <button
                onClick={handleRestore}
                className="px-3 py-2 text-xs font-bold text-[#2F7D50] bg-white border border-[#2F7D50]/30 hover:bg-emerald-50 rounded-lg shadow-2xs flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restore Authentic State</span>
              </button>
            )}

            <button
              onClick={() => setShowCorrectionModal(true)}
              className="px-3 py-2 text-xs font-semibold text-[#234638] bg-white border border-[#E8E0D0] hover:border-[#E5A323] rounded-lg shadow-2xs flex items-center gap-1.5 cursor-pointer"
              title="Append an honest audit correction block"
            >
              <PlusCircle className="w-3.5 h-3.5 text-[#E5A323]" />
              <span>Append Audit Correction</span>
            </button>
          </div>
        </div>
      </div>

      {/* Critical Truth vs Integrity Epistemological Educational Box */}
      <div className="p-4 bg-[#FFF8E9] rounded-xl border border-[#E8E0D0] text-xs space-y-2">
        <div className="flex items-center gap-2 font-bold text-[#234638]">
          <Info className="w-4 h-4 text-[#E5A323]" />
          <span>Understanding Honey Traceability: Record Integrity vs. Physical Truth</span>
        </div>
        <p className="text-[#6C756D] leading-relaxed">
          <strong className="text-[#29332D]">Cryptographic Hash Integrity: </strong>
          Mathematically proves that the recorded event log has not been silently edited or rewritten since it was
          signed by the authorized actor.
        </p>
        <p className="text-[#6C756D] leading-relaxed">
          <strong className="text-[#29332D]">Physical Chemical Purity: </strong>
          Cannot be proven by blockchain hashing alone. True purity requires physical testing (AOAC refractometry,
          HPLC, C3/C4 isotopic analysis) by NABL/FSSAI-accredited laboratories, which Madhumitra links into the
          ledger as verifiable quality certificates.
        </p>
      </div>

      {/* Visual Blockchain Timeline Blocks */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-[#234638] flex items-center gap-2">
          <Layers className="w-4 h-4 text-[#E5A323]" />
          Sequential Event Blocks ({batchEvents.length})
        </h2>

        <div className="space-y-3">
          {batchEvents.map((event, idx) => {
            const isTampered = event.isTampered;
            return (
              <div key={event.eventId} className="relative">
                {/* Visual Chain Connector Line */}
                {idx > 0 && (
                  <div className="flex items-center justify-center -my-1 text-[#6C756D]">
                    <div className="flex items-center gap-1 text-[10px] font-mono bg-white px-2 py-0.5 rounded-full border border-[#E8E0D0] shadow-2xs z-10">
                      <ArrowDown className="w-3 h-3 text-[#E5A323]" />
                      <span>prevHash linked</span>
                    </div>
                  </div>
                )}

                {/* Event Block Card */}
                <div
                  className={`p-4 rounded-xl border transition-all ${
                    isTampered
                      ? 'bg-red-50/70 border-red-300 ring-2 ring-red-400'
                      : 'bg-white border-[#E8E0D0] shadow-2xs hover:border-[#E5A323]'
                  }`}
                >
                  {/* Top Bar of Block */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-2.5 border-b border-[#E8E0D0] gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-full bg-[#234638] text-white flex items-center justify-center font-mono font-bold text-xs">
                        #{event.sequenceNum}
                      </span>
                      <div>
                        <span className="text-[10px] font-mono font-bold text-[#E5A323] uppercase">
                          {event.eventType}
                        </span>
                        <h4 className="font-bold text-sm text-[#234638]">{event.title}</h4>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-[#6C756D]">
                      <Clock className="w-3.5 h-3.5" />
                      <span className="font-mono text-[11px]">
                        {new Date(event.timestamp).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Actor & Location Info */}
                  <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-2 text-xs text-[#6C756D]">
                    <div className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-[#234638]" />
                      <span className="font-semibold text-[#29332D]">{event.actorName}</span>
                      <span>({event.actorRole})</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#B96A45]" />
                      <span className="truncate">{event.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <FileCheck2 className="w-3.5 h-3.5 text-[#2F7D50]" />
                      <span className="truncate">{event.organization}</span>
                    </div>
                  </div>

                  {/* Event Detail Payload Badges */}
                  <div className="mt-3 p-3 bg-[#FFF8E9]/60 rounded-lg border border-[#E8E0D0] text-xs">
                    <div className="font-semibold text-[#234638] mb-1.5">Payload Data:</div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 font-mono text-[11px]">
                      {Object.entries(event.details).map(([k, v]) => (
                        <div key={k} className="p-1.5 bg-white rounded border border-[#E8E0D0] truncate">
                          <span className="text-[#6C756D]">{k}: </span>
                          <span className="font-bold text-[#234638]">{String(v)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Cryptographic Hashes Bar */}
                  <div className="mt-3 pt-2.5 border-t border-[#E8E0D0] grid grid-cols-1 md:grid-cols-2 gap-2 text-[10px] font-mono">
                    <div className="p-1.5 bg-stone-50 rounded border border-[#E8E0D0] flex items-center gap-1.5 overflow-hidden">
                      <span className="text-[#6C756D] shrink-0">prevHash:</span>
                      <span className="truncate text-stone-700">{event.prevHash}</span>
                    </div>
                    <div
                      className={`p-1.5 rounded border flex items-center gap-1.5 overflow-hidden ${
                        isTampered
                          ? 'bg-red-100 border-red-300 text-red-900 font-bold'
                          : 'bg-[#E5EEE5]/60 border-[#2F7D50]/20 text-[#234638]'
                      }`}
                    >
                      <Hash className="w-3 h-3 text-[#2F7D50] shrink-0" />
                      <span className="text-[#6C756D] shrink-0">currentHash:</span>
                      <span className="truncate font-semibold">{event.currentHash}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Append Correction Block Modal */}
      {showCorrectionModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-5 shadow-xl border border-[#E8E0D0]">
            <h3 className="text-base font-bold text-[#234638] mb-3">Append Compliant Audit Correction</h3>
            <p className="text-xs text-[#6C756D] mb-4">
              Blockchain best practice: errors are never rewritten silently. A new correction block is appended
              to the chain with an auditable justification.
            </p>
            <form onSubmit={handleAppendCorrection} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-[#29332D] mb-1">Field to Amend</label>
                <input
                  type="text"
                  required
                  value={correctionForm.field}
                  onChange={(e) => setCorrectionForm({ ...correctionForm, field: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FFF8E9] border border-[#E8E0D0] rounded-lg"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#29332D] mb-1">Previous Value</label>
                  <input
                    type="text"
                    required
                    value={correctionForm.oldVal}
                    onChange={(e) => setCorrectionForm({ ...correctionForm, oldVal: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FFF8E9] border border-[#E8E0D0] rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#29332D] mb-1">Amended Value</label>
                  <input
                    type="text"
                    required
                    value={correctionForm.newVal}
                    onChange={(e) => setCorrectionForm({ ...correctionForm, newVal: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FFF8E9] border border-[#E8E0D0] rounded-lg"
                  />
                </div>
              </div>
              <div>
                <label className="block font-semibold text-[#29332D] mb-1">Audit Justification</label>
                <textarea
                  rows={2}
                  required
                  value={correctionForm.reason}
                  onChange={(e) => setCorrectionForm({ ...correctionForm, reason: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FFF8E9] border border-[#E8E0D0] rounded-lg"
                />
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-[#E8E0D0]">
                <button
                  type="button"
                  onClick={() => setShowCorrectionModal(false)}
                  className="px-3 py-1.5 font-medium text-[#6C756D]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 font-bold text-white bg-[#234638] rounded-lg shadow-xs"
                >
                  Sign & Append Block
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
