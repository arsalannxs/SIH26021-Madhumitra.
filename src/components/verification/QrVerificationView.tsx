import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { APP_IMAGES } from '../../assets/images';
import {
  QrCode,
  Search,
  CheckCircle2,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  HelpCircle,
  FileCheck2,
  Calendar,
  MapPin,
  User,
  Layers,
  ArrowRight,
  Printer,
  Copy,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import QRCode from 'qrcode';

export const QrVerificationView: React.FC = () => {
  const { batches, events, qualityRecords, selectedBatchIdForVerification, verifyBatchChain } = useApp();
  const [queryBatchId, setQueryBatchId] = useState<string>(
    selectedBatchIdForVerification || batches[0]?.id || 'MM-2026-B108'
  );
  const [activeBatchId, setActiveBatchId] = useState<string>(queryBatchId);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [verificationResult, setVerificationResult] = useState<{
    isValid: boolean;
    errorReason: string | null;
  } | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const batch = batches.find((b) => b.id.toUpperCase() === activeBatchId.toUpperCase());
  const batchEvents = events
    .filter((e) => e.batchId === batch?.id)
    .sort((a, b) => a.sequenceNum - b.sequenceNum);
  const batchQuality = qualityRecords.filter((q) => q.batchId === batch?.id);

  // Generate QR code and run integrity check
  useEffect(() => {
    async function updateQrAndVerify() {
      if (!batch) {
        setVerificationResult(null);
        setQrDataUrl('');
        return;
      }

      // Generate real QR code image
      const verifyUrl = `${window.location.origin}/#verify/${batch.id}`;
      try {
        const url = await QRCode.toDataURL(verifyUrl, {
          width: 300,
          margin: 1,
          color: {
            dark: '#234638',
            light: '#FFFFFF',
          },
        });
        setQrDataUrl(url);
      } catch (e) {
        console.error('Failed to generate QR:', e);
      }

      // Verify chain
      const res = await verifyBatchChain(batch.id);
      setVerificationResult({ isValid: res.isValid, errorReason: res.errorReason });
    }
    updateQrAndVerify();
  }, [activeBatchId, batch, events]);

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveBatchId(queryBatchId.trim());
  };

  const handleCopyVerificationUrl = () => {
    const url = `${window.location.origin}/#verify/${activeBatchId}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // Determine Consumer Verification Status
  let statusBadge = {
    title: 'Traceability records complete',
    color: 'bg-[#E5EEE5] text-[#2F7D50] border-[#2F7D50]/30',
    icon: CheckCircle2,
    description: 'All harvest, extraction, accredited lab quality parameters and packaging blocks are verified.',
  };

  if (!batch) {
    statusBadge = {
      title: 'Batch not found',
      color: 'bg-stone-100 text-stone-700 border-stone-300',
      icon: HelpCircle,
      description: 'The requested Batch ID does not exist in the Madhumitra national honey registry.',
    };
  } else if (verificationResult && !verificationResult.isValid) {
    statusBadge = {
      title: 'Verification failed',
      color: 'bg-red-100 text-red-800 border-red-300',
      icon: ShieldAlert,
      description: 'Cryptographic hash mismatch detected! Historic records may have been tampered with.',
    };
  } else if (batch.batchStatus === 'Harvested' || batch.batchStatus === 'Draft' || batchQuality.length === 0) {
    statusBadge = {
      title: 'Partially documented',
      color: 'bg-amber-100 text-amber-800 border-amber-300',
      icon: AlertTriangle,
      description: 'Harvest recorded; awaiting final NABL laboratory testing or packaging dispatch blocks.',
    };
  }

  const StatusIcon = statusBadge.icon;

  return (
    <div className="space-y-6">
      {/* Search & Lookup Bar */}
      <div className="bg-white rounded-xl border border-[#E8E0D0] p-4 shadow-2xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="text-base font-bold text-[#234638] flex items-center gap-2">
            <QrCode className="w-5 h-5 text-[#E5A323]" />
            Consumer Honey QR Verification Portal
          </h1>
          <p className="text-xs text-[#6C756D] mt-0.5">
            Simulate what an Indian consumer sees upon scanning the QR seal on a retail honey jar
          </p>
        </div>

        <form onSubmit={handleLookup} className="flex items-center gap-2 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Enter Batch ID (e.g. MM-2026-B108)"
            value={queryBatchId}
            onChange={(e) => setQueryBatchId(e.target.value)}
            className="px-3 py-1.5 text-xs font-mono bg-[#FFF8E9] border border-[#E8E0D0] rounded-lg focus:outline-none focus:border-[#E5A323] w-48 sm:w-60"
          />
          <button
            type="submit"
            className="px-3 py-1.5 text-xs font-bold text-white bg-[#234638] hover:bg-[#1a352a] rounded-lg transition-colors cursor-pointer"
          >
            Verify
          </button>
        </form>
      </div>

      {/* Quick Batch Selector Pills */}
      <div className="flex items-center gap-2 text-xs">
        <span className="text-[#6C756D] font-medium">Quick Demo Samples:</span>
        {batches.map((b) => (
          <button
            key={b.id}
            onClick={() => {
              setQueryBatchId(b.id);
              setActiveBatchId(b.id);
            }}
            className={`px-2.5 py-1 rounded-md font-mono text-[11px] font-semibold border transition-colors cursor-pointer ${
              activeBatchId === b.id
                ? 'bg-[#234638] text-white border-[#234638]'
                : 'bg-white text-[#29332D] border-[#E8E0D0] hover:border-[#E5A323]'
            }`}
          >
            {b.id}
          </button>
        ))}
      </div>

      {batch ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Authentic Jar Label & QR Sticker Preview */}
          <div className="bg-white rounded-xl border border-[#E8E0D0] p-5 shadow-2xs space-y-4">
            <div className="text-center">
              <span className="text-[10px] font-mono font-bold text-[#E5A323] uppercase">
                Packaged Product Mockup
              </span>
              <h3 className="font-bold text-base text-[#234638] mt-0.5">{batch.floralSource}</h3>
              <p className="text-xs text-[#6C756D]">{batch.packagedUnits.jarSize}</p>
            </div>

            {/* Jar Image Mockup */}
            <div className="relative rounded-xl overflow-hidden border border-[#E8E0D0] max-h-56">
              <img
                src={APP_IMAGES.honeyJar}
                alt="Packaged Honey Jar"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-xs text-white text-[10px] font-mono px-2 py-0.5 rounded">
                Lot {batch.packagedUnits.batchSealCode}
              </div>
            </div>

            {/* Rendered Dynamic QR Code */}
            {qrDataUrl && (
              <div className="p-4 bg-[#FFF8E9] rounded-xl border border-[#E8E0D0] text-center space-y-2">
                <div className="text-[11px] font-bold text-[#234638] flex items-center justify-center gap-1.5">
                  <QrCode className="w-4 h-4 text-[#E5A323]" />
                  <span>Scan to Inspect Blockchain Provenance</span>
                </div>
                <img
                  src={qrDataUrl}
                  alt={`QR code for ${batch.id}`}
                  className="w-44 h-44 mx-auto border-2 border-[#234638] rounded-xl p-1 bg-white shadow-xs"
                />
                <div className="font-mono text-xs font-bold text-[#234638]">{batch.id}</div>
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={handleCopyVerificationUrl}
                className="flex-1 py-2 text-xs font-semibold text-[#234638] bg-[#FFF8E9] border border-[#E8E0D0] hover:border-[#E5A323] rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5 text-[#E5A323]" />
                <span>{copiedLink ? 'Copied URL!' : 'Copy Portal URL'}</span>
              </button>
              <button
                onClick={() => window.print()}
                className="py-2 px-3 text-xs font-semibold text-[#6C756D] hover:text-[#234638] bg-white border border-[#E8E0D0] rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                title="Print batch QR label"
              >
                <Printer className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Right Column: Mobile-Friendly Consumer Verification Dossier */}
          <div className="lg:col-span-2 space-y-5">
            {/* Consumer Status Card */}
            <div className={`p-4 rounded-xl border flex items-start gap-3.5 ${statusBadge.color}`}>
              <StatusIcon className="w-6 h-6 shrink-0 mt-0.5" />
              <div>
                <h2 className="font-bold text-base leading-tight">{statusBadge.title}</h2>
                <p className="text-xs mt-1 leading-relaxed opacity-90">{statusBadge.description}</p>
              </div>
            </div>

            {/* Three Critical Verification Truth Pillars */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Pillar 1: Valid QR Link */}
              <div className="p-3.5 bg-white rounded-xl border border-[#E8E0D0] text-xs space-y-1">
                <div className="flex items-center gap-1.5 text-[#2F7D50] font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>1. Valid QR Link</span>
                </div>
                <p className="text-[#6C756D] leading-snug">
                  Recognized serial hash registered with Ministry of MSME Madhumitra index.
                </p>
              </div>

              {/* Pillar 2: Blockchain Record Integrity */}
              <div className="p-3.5 bg-white rounded-xl border border-[#E8E0D0] text-xs space-y-1">
                <div
                  className={`flex items-center gap-1.5 font-bold ${
                    verificationResult?.isValid ? 'text-[#2F7D50]' : 'text-[#B94040]'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>2. Record Integrity</span>
                </div>
                <p className="text-[#6C756D] leading-snug">
                  {verificationResult?.isValid
                    ? `${batchEvents.length} sequential SHA-256 blocks validated without tampering.`
                    : 'Tamper detected: block hashes do not match!'}
                </p>
              </div>

              {/* Pillar 3: Chemical Laboratory Testing */}
              <div className="p-3.5 bg-white rounded-xl border border-[#E8E0D0] text-xs space-y-1">
                <div
                  className={`flex items-center gap-1.5 font-bold ${
                    batchQuality.length > 0 ? 'text-[#2F7D50]' : 'text-amber-700'
                  }`}
                >
                  <FileCheck2 className="w-4 h-4" />
                  <span>3. Verified Quality</span>
                </div>
                <p className="text-[#6C756D] leading-snug">
                  {batchQuality.length > 0
                    ? `Tested by ${batchQuality[0].labName.slice(0, 22)}... (Moisture ${batchQuality[0].moisturePercentage}%)`
                    : 'No accredited laboratory report recorded yet.'}
                </p>
              </div>
            </div>

            {/* Provenance Details */}
            <div className="bg-white rounded-xl border border-[#E8E0D0] p-5 shadow-2xs space-y-3">
              <h3 className="font-bold text-sm text-[#234638] pb-2 border-b border-[#E8E0D0]">
                Origin & Production Provenance
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[#6C756D] block">Certified Rural Apiary Cluster:</span>
                  <span className="font-bold text-[#234638] flex items-center gap-1.5 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-[#B96A45]" />
                    {batch.apiaryName}
                  </span>
                </div>

                <div>
                  <span className="text-[#6C756D] block">Harvest Location (Consumer General):</span>
                  <span className="font-medium text-[#29332D] mt-0.5 block">
                    {/* Excludes private GPS coordinates */}
                    General Region, India
                  </span>
                </div>

                <div>
                  <span className="text-[#6C756D] block">Lead Beekeeper & Cooperative:</span>
                  <span className="font-semibold text-[#29332D] flex items-center gap-1.5 mt-0.5">
                    <User className="w-3.5 h-3.5 text-[#234638]" />
                    {batch.beekeeperName} ({batch.cooperativeName})
                  </span>
                </div>

                <div>
                  <span className="text-[#6C756D] block">Harvest & Extraction Dates:</span>
                  <span className="font-mono text-[#29332D] mt-0.5 block">
                    {batch.harvestDate} · {batch.extractionMethod}
                  </span>
                </div>
              </div>
            </div>

            {/* Quality Test Results Card (if present) */}
            {batchQuality.length > 0 ? (
              <div className="bg-white rounded-xl border border-[#E8E0D0] p-5 shadow-2xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-[#E8E0D0]">
                  <h3 className="font-bold text-sm text-[#234638] flex items-center gap-2">
                    <FileCheck2 className="w-4 h-4 text-[#2F7D50]" />
                    Accredited Laboratory Test Parameters
                  </h3>
                  <span className="text-[10px] font-mono text-[#6C756D]">
                    {batchQuality[0].reportNumber}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-2.5 bg-[#FFF8E9] rounded-lg border border-[#E8E0D0]">
                    <span className="text-[#6C756D] block text-[11px]">Moisture</span>
                    <span className="text-base font-bold font-mono text-[#2F7D50]">
                      {batchQuality[0].moisturePercentage}%
                    </span>
                    <span className="text-[10px] text-[#6C756D] block">FSSAI Max 20.0%</span>
                  </div>

                  <div className="p-2.5 bg-[#FFF8E9] rounded-lg border border-[#E8E0D0]">
                    <span className="text-[#6C756D] block text-[11px]">HMF Value</span>
                    <span className="text-base font-bold font-mono text-[#234638]">
                      {batchQuality[0].hmfMgKg} <span className="text-[10px]">mg/kg</span>
                    </span>
                    <span className="text-[10px] text-[#6C756D] block">Freshness index</span>
                  </div>

                  <div className="p-2.5 bg-[#FFF8E9] rounded-lg border border-[#E8E0D0]">
                    <span className="text-[#6C756D] block text-[11px]">Sucrose</span>
                    <span className="text-base font-bold font-mono text-[#234638]">
                      {batchQuality[0].sucrosePercentage}%
                    </span>
                    <span className="text-[10px] text-[#6C756D] block">FSSAI Max 5.0%</span>
                  </div>

                  <div className="p-2.5 bg-[#FFF8E9] rounded-lg border border-[#E8E0D0]">
                    <span className="text-[#6C756D] block text-[11px]">C3/C4 Sugars</span>
                    <span className="text-xs font-bold text-[#2F7D50] block mt-1">
                      {batchQuality[0].c3c4SugarAdulteration}
                    </span>
                    <span className="text-[10px] text-[#6C756D] block">Zero corn/cane adulterants</span>
                  </div>
                </div>

                <div className="text-[11px] text-[#6C756D] italic">
                  Tested by {batchQuality[0].labName} using {batchQuality[0].testMethod}.
                </div>
              </div>
            ) : (
              <div className="p-4 bg-amber-50/70 rounded-xl border border-amber-200/60 text-xs text-[#B7791F]">
                <strong>Notice: </strong>No physical laboratory certificate recorded for this batch yet.
                Madhumitra does not falsely declare 100% purity without accredited lab evidence.
              </div>
            )}

            {/* Traceability Event Journey */}
            <div className="bg-white rounded-xl border border-[#E8E0D0] p-5 shadow-2xs space-y-3">
              <h3 className="font-bold text-sm text-[#234638] pb-2 border-b border-[#E8E0D0]">
                Verifiable Journey Timeline
              </h3>

              <div className="space-y-3">
                {batchEvents.map((evt) => (
                  <div key={evt.eventId} className="flex items-start gap-3 text-xs">
                    <span className="w-5 h-5 rounded-full bg-[#234638] text-white flex items-center justify-center font-mono font-bold text-[10px] shrink-0 mt-0.5">
                      {evt.sequenceNum}
                    </span>
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-[#234638]">{evt.title}</span>
                        <span className="text-[10px] text-[#6C756D] font-mono">
                          {new Date(evt.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-[#6C756D] mt-0.5">
                        {evt.actorName} ({evt.organization}) · {evt.location}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-12 text-center bg-white rounded-xl border border-[#E8E0D0]">
          <HelpCircle className="w-10 h-10 text-[#6C756D] mx-auto mb-2" />
          <h3 className="font-bold text-base text-[#234638]">Batch Not Found</h3>
          <p className="text-xs text-[#6C756D] mt-1 max-w-sm mx-auto">
            No honey batch with ID &quot;{activeBatchId}&quot; exists. Please verify the code on your jar label.
          </p>
        </div>
      )}
    </div>
  );
};
