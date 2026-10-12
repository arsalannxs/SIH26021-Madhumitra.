import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { HoneyBatch, TraceabilityEvent, QualityRecord } from '../../types';
import { GENESIS_HASH, createTraceabilityEvent } from '../../services/blockchain';
import {
  X,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Layers,
  Sparkles,
  ShieldCheck,
  Scale,
  FileCheck2,
  Boxes,
  QrCode,
  Save,
} from 'lucide-react';
import QRCode from 'qrcode';

interface NewBatchWizardProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewBatchWizard: React.FC<NewBatchWizardProps> = ({ isOpen, onClose }) => {
  const { apiaries, hives, createNewBatch, setActiveTab, setSelectedBatchIdForVerification } = useApp();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdBatchId, setCreatedBatchId] = useState<string | null>(null);
  const [generatedQrDataUrl, setGeneratedQrDataUrl] = useState<string | null>(null);

  // Form states across the 7 steps
  const [harvestData, setHarvestData] = useState({
    apiaryId: apiaries[0]?.id || 'API-001',
    hiveIds: [] as string[],
    harvestDate: new Date().toISOString().split('T')[0],
    honeyQuantityKg: 80,
    floralSource: 'Wild Mustard Blossom',
    weatherNotes: 'Clear sky, 23°C, optimal nectar foraging conditions',
  });

  const [extractionData, setExtractionData] = useState({
    extractionDate: new Date().toISOString().split('T')[0],
    extractionMethod: 'Centrifugal Cold Extraction' as const,
    equipmentSanitized: true,
    filterMesh: '80 Mesh Food-Grade Stainless Strainer',
    temperatureMaxC: 22,
    settlingHours: 48,
    processingDetails: 'Unheated raw honey, gravity settled for 48h to separate coarse wax particles while preserving bio-active pollen enzymes.',
  });

  const [qualityData, setQualityData] = useState({
    hasLabReport: true,
    labName: 'National Dairy Development Board (NDDB) Honey Lab',
    testDate: new Date().toISOString().split('T')[0],
    reportNumber: `NDDB-TEST-${Date.now().toString().slice(-4)}`,
    moisturePercentage: 17.8, // FSSAI max 20%
    hmfMgKg: 14.2,
    sucrosePct: 2.4,
    c3c4SugarAdulteration: 'Not Detected (Pure)' as const,
    assessorNotes: 'Sample satisfies all national Codex and FSSAI standards for natural floral honey.',
  });

  const [packagingData, setPackagingData] = useState({
    jarSize: '500g Glass Jar with tamper-evident seal',
    totalUnits: 160,
    batchSealCode: `LOT-2026-MM${Math.floor(100 + Math.random() * 900)}`,
    storageConditions: 'Food-grade stainless storage drum in dry, shaded warehouse (20-22°C)',
    isDraftOnly: false,
  });

  if (!isOpen) return null;

  const selectedApiary = apiaries.find((a) => a.id === harvestData.apiaryId) || apiaries[0];
  const apiaryHives = hives.filter((h) => h.apiaryId === selectedApiary?.id);

  const toggleHiveSelection = (hiveId: string) => {
    setHarvestData((prev) => ({
      ...prev,
      hiveIds: prev.hiveIds.includes(hiveId)
        ? prev.hiveIds.filter((id) => id !== hiveId)
        : [...prev.hiveIds, hiveId],
    }));
  };

  const handleFinishAndCommit = async (saveAsDraft = false) => {
    setIsSubmitting(true);
    try {
      const batchCode = `MM-2026-B${Math.floor(111 + Math.random() * 88)}`;

      // Construct append-only events
      const events: TraceabilityEvent[] = [];

      // 1. Harvest Event
      const evt1 = await createTraceabilityEvent({
        batchId: batchCode,
        sequenceNum: 1,
        eventType: 'HARVEST_RECORDED',
        title: 'Apiary Frame Harvest & Cold Weigh-in',
        actorName: selectedApiary?.beekeeperName || 'Lead Beekeeper',
        actorRole: 'Certified Rural Beekeeper',
        organization: selectedApiary?.cooperativeName || 'Regional Cooperative',
        location: selectedApiary?.generalLocation || 'Apiary Zone',
        details: {
          quantityKg: harvestData.honeyQuantityKg,
          floralSource: harvestData.floralSource,
          harvestDate: harvestData.harvestDate,
          apiaryCode: selectedApiary?.code || 'AP-01',
          sourceHivesCount: harvestData.hiveIds.length || 1,
          weatherNotes: harvestData.weatherNotes,
        },
        prevHash: GENESIS_HASH,
      });
      events.push(evt1);

      // 2. Extraction & Processing Event
      const evt2 = await createTraceabilityEvent({
        batchId: batchCode,
        sequenceNum: 2,
        eventType: 'EXTRACTION_RECORDED',
        title: 'Cold Centrifugal Extraction & Micro-Straining',
        actorName: 'Cooperative Extraction Specialist',
        actorRole: 'Extraction Supervisor',
        organization: selectedApiary?.cooperativeName || 'Regional Cooperative',
        location: `${selectedApiary?.district || 'District'} Processing Unit`,
        details: {
          method: extractionData.extractionMethod,
          filterMesh: extractionData.filterMesh,
          maxTempC: extractionData.temperatureMaxC,
          settlingHours: extractionData.settlingHours,
          processingNotes: extractionData.processingDetails,
        },
        prevHash: evt1.currentHash,
      });
      events.push(evt2);

      // 3. Quality Event (if tested)
      let prevHashForNext = evt2.currentHash;
      let qualityRecordCandidate: Omit<QualityRecord, 'id' | 'batchId'> | undefined = undefined;

      if (qualityData.hasLabReport) {
        const evt3 = await createTraceabilityEvent({
          batchId: batchCode,
          sequenceNum: 3,
          eventType: 'QUALITY_ATTACHED',
          title: 'Accredited Lab Chemical Purity Certification',
          actorName: 'Chief Analyst',
          actorRole: 'Analytical Food Chemist',
          organization: qualityData.labName,
          location: 'Accredited Honey Testing Facility',
          details: {
            moisturePercentage: qualityData.moisturePercentage,
            fssaiStandardLimit: 'Max 20.0%',
            hmfMgKg: qualityData.hmfMgKg,
            sucrosePct: qualityData.sucrosePct,
            c3c4PurityStatus: qualityData.c3c4SugarAdulteration,
            reportNumber: qualityData.reportNumber,
          },
          prevHash: evt2.currentHash,
        });
        events.push(evt3);
        prevHashForNext = evt3.currentHash;

        qualityRecordCandidate = {
          testDate: qualityData.testDate,
          labName: qualityData.labName,
          testMethod: 'AOAC 969.38 & HPLC Analysis',
          reportNumber: qualityData.reportNumber,
          moisturePercentage: Number(qualityData.moisturePercentage),
          hmfMgKg: Number(qualityData.hmfMgKg),
          sucrosePercentage: Number(qualityData.sucrosePct),
          electricalConductivityMsCm: 0.42,
          pollenAnalysis: `${harvestData.floralSource} dominant`,
          c3c4SugarAdulteration: qualityData.c3c4SugarAdulteration,
          verificationStatus: 'Accredited Lab Passed',
          assessorNotes: qualityData.assessorNotes,
        };
      }

      // 4. Packaging Event
      if (!saveAsDraft) {
        const evt4 = await createTraceabilityEvent({
          batchId: batchCode,
          sequenceNum: events.length + 1,
          eventType: 'PACKAGING_RECORDED',
          title: 'Packaging & Tamper-Evident QR Application',
          actorName: 'Packaging Lead',
          actorRole: 'FPO Packaging Technician',
          organization: selectedApiary?.cooperativeName || 'Regional Cooperative',
          location: `${selectedApiary?.district || 'District'} Packaging Centre`,
          details: {
            jarSize: packagingData.jarSize,
            totalUnits: packagingData.totalUnits,
            batchSealCode: packagingData.batchSealCode,
            storageConditions: packagingData.storageConditions,
          },
          prevHash: prevHashForNext,
        });
        events.push(evt4);
      }

      // Create batch
      const newBatchId = await createNewBatch({
        batch: {
          harvestDate: harvestData.harvestDate,
          apiaryId: selectedApiary?.id || 'API-001',
          apiaryName: selectedApiary?.name || 'Apiary',
          hiveIds: harvestData.hiveIds.length > 0 ? harvestData.hiveIds : [apiaryHives[0]?.id || 'HIVE-101'],
          beekeeperName: selectedApiary?.beekeeperName || 'Lead Beekeeper',
          cooperativeName: selectedApiary?.cooperativeName || 'Cooperative',
          honeyQuantityKg: Number(harvestData.honeyQuantityKg),
          floralSource: harvestData.floralSource,
          extractionDate: extractionData.extractionDate,
          extractionMethod: extractionData.extractionMethod,
          processingDetails: extractionData.processingDetails,
          storageConditions: packagingData.storageConditions,
          packagingDate: saveAsDraft ? 'Pending' : new Date().toISOString().split('T')[0],
          packagedUnits: {
            jarSize: packagingData.jarSize,
            totalUnits: Number(packagingData.totalUnits),
            batchSealCode: packagingData.batchSealCode,
          },
          batchStatus: saveAsDraft ? 'Draft' : qualityData.hasLabReport ? 'Packaged' : 'Harvested',
          qualityRecordIds: [],
          notes: harvestData.weatherNotes,
        },
        events,
        qualityRecord: qualityRecordCandidate,
      });

      // Generate visual QR code data URL
      const qrUrl = `${window.location.origin}/#verify/${newBatchId}`;
      const qrDataUrl = await QRCode.toDataURL(qrUrl, { width: 240, margin: 1 });
      setGeneratedQrDataUrl(qrDataUrl);
      setCreatedBatchId(newBatchId);
      setCurrentStep(7); // Jump to Step 7 (Success & QR Preview)
    } catch (err) {
      console.error('Failed to create batch:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-[#E8E0D0] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-[#234638] text-white p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#E5A323] flex items-center justify-center text-[#234638] font-bold">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">Guided Honey Batch Workflow</h3>
              <p className="text-xs text-[#E5EEE5]">From apiary harvest to tamper-evident QR packaging</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Tabs */}
        <div className="bg-[#FFF8E9] px-6 py-3 border-b border-[#E8E0D0] overflow-x-auto shrink-0 flex items-center gap-4 text-xs font-semibold">
          {[
            '1. Harvest',
            '2. Source Hives',
            '3. Extraction',
            '4. Quality Test',
            '5. Packaging',
            '6. Review',
            '7. QR Code',
          ].map((label, idx) => (
            <div
              key={idx}
              className={`whitespace-nowrap flex items-center gap-1.5 ${
                currentStep === idx + 1
                  ? 'text-[#234638] font-bold pb-0.5 border-b-2 border-[#E5A323]'
                  : currentStep > idx + 1
                  ? 'text-[#2F7D50]'
                  : 'text-[#6C756D]'
              }`}
            >
              <span>{label}</span>
              {currentStep > idx + 1 && <CheckCircle2 className="w-3.5 h-3.5" />}
            </div>
          ))}
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4 text-xs">
          {/* Step 1: Harvest */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-[#234638]">Step 1: Apiary Cluster & Harvest Details</h4>
              <p className="text-[#6C756D]">
                Select the producing apiary cluster and specify the freshly harvested raw honey weight.
              </p>

              <div>
                <label className="block font-semibold text-[#29332D] mb-1">Producing Apiary Cluster</label>
                <select
                  value={harvestData.apiaryId}
                  onChange={(e) => setHarvestData({ ...harvestData, apiaryId: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FFF8E9] border border-[#E8E0D0] rounded-lg"
                >
                  {apiaries.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name} ({a.generalLocation})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#29332D] mb-1">Harvest Date</label>
                  <input
                    type="date"
                    value={harvestData.harvestDate}
                    onChange={(e) => setHarvestData({ ...harvestData, harvestDate: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FFF8E9] border border-[#E8E0D0] rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#29332D] mb-1">Honey Quantity (kg)</label>
                  <input
                    type="number"
                    min={1}
                    value={harvestData.honeyQuantityKg}
                    onChange={(e) => setHarvestData({ ...harvestData, honeyQuantityKg: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-[#FFF8E9] border border-[#E8E0D0] rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#29332D] mb-1">Primary Floral Source</label>
                <input
                  type="text"
                  placeholder="e.g. Wild Mustard Blossom, Himalayan Acacia, Mangrove Khalsi"
                  value={harvestData.floralSource}
                  onChange={(e) => setHarvestData({ ...harvestData, floralSource: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FFF8E9] border border-[#E8E0D0] rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#29332D] mb-1">Weather & Comb Observations</label>
                <textarea
                  rows={2}
                  value={harvestData.weatherNotes}
                  onChange={(e) => setHarvestData({ ...harvestData, weatherNotes: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FFF8E9] border border-[#E8E0D0] rounded-lg"
                />
              </div>
            </div>
          )}

          {/* Step 2: Source Hives */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-[#234638]">Step 2: Associated Hive Boxes</h4>
              <p className="text-[#6C756D]">
                Select the individual hive boxes harvested for this specific batch for granular lot traceability.
              </p>

              <div className="space-y-2">
                {apiaryHives.map((hive) => {
                  const isChecked = harvestData.hiveIds.includes(hive.id);
                  return (
                    <div
                      key={hive.id}
                      onClick={() => toggleHiveSelection(hive.id)}
                      className={`p-3 rounded-lg border transition-all cursor-pointer flex items-center justify-between ${
                        isChecked
                          ? 'bg-[#E5EEE5] border-[#2F7D50]'
                          : 'bg-[#FFF8E9] border-[#E8E0D0] hover:border-[#E5A323]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}} // handled by parent div
                          className="w-4 h-4 text-[#234638] rounded"
                        />
                        <div>
                          <div className="font-bold text-[#234638] font-mono">{hive.code}</div>
                          <div className="text-[11px] text-[#6C756D]">{hive.hiveType} · {hive.combHealth}</div>
                        </div>
                      </div>
                      <span className="font-mono text-xs tabular-nums text-[#29332D]">
                        {hive.temperatureC}°C · {hive.weightKg} kg
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 3: Extraction & Processing */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-[#234638]">Step 3: Extraction & Filtration Standards</h4>
              <p className="text-[#6C756D]">
                Record cold extraction parameters. Pure raw honey must not be exposed to excessive thermal heat.
              </p>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#29332D] mb-1">Extraction Method</label>
                  <select
                    value={extractionData.extractionMethod}
                    onChange={(e) =>
                      setExtractionData({
                        ...extractionData,
                        extractionMethod: e.target.value as 'Centrifugal Cold Extraction',
                      })
                    }
                    className="w-full px-3 py-2 bg-[#FFF8E9] border border-[#E8E0D0] rounded-lg"
                  >
                    <option value="Centrifugal Cold Extraction">Centrifugal Cold Extraction (Raw)</option>
                    <option value="Traditional Manual Gravity Strain">Traditional Manual Gravity Strain</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-[#29332D] mb-1">Filtration Mesh Size</label>
                  <input
                    type="text"
                    value={extractionData.filterMesh}
                    onChange={(e) => setExtractionData({ ...extractionData, filterMesh: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FFF8E9] border border-[#E8E0D0] rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#29332D] mb-1">
                    Maximum Processing Temp (°C)
                  </label>
                  <input
                    type="number"
                    value={extractionData.temperatureMaxC}
                    onChange={(e) =>
                      setExtractionData({ ...extractionData, temperatureMaxC: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 bg-[#FFF8E9] border border-[#E8E0D0] rounded-lg"
                  />
                  <span className="text-[10px] text-[#6C756D]">Below 40°C maintains raw enzymes</span>
                </div>
                <div>
                  <label className="block font-semibold text-[#29332D] mb-1">Gravity Settling Period (Hours)</label>
                  <input
                    type="number"
                    value={extractionData.settlingHours}
                    onChange={(e) =>
                      setExtractionData({ ...extractionData, settlingHours: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 bg-[#FFF8E9] border border-[#E8E0D0] rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#29332D] mb-1">Processing Notes</label>
                <textarea
                  rows={2}
                  value={extractionData.processingDetails}
                  onChange={(e) => setExtractionData({ ...extractionData, processingDetails: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FFF8E9] border border-[#E8E0D0] rounded-lg"
                />
              </div>
            </div>
          )}

          {/* Step 4: Quality & Lab Data */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-[#234638]">Step 4: Chemical Quality & Laboratory Verification</h4>
              <p className="text-[#6C756D]">
                Attach accredited lab test parameters. FSSAI gazetted limit for raw honey moisture is max 20.0%.
              </p>

              <div className="flex items-center gap-2 p-3 bg-[#FFF8E9] rounded-lg border border-[#E8E0D0]">
                <input
                  type="checkbox"
                  id="hasLab"
                  checked={qualityData.hasLabReport}
                  onChange={(e) => setQualityData({ ...qualityData, hasLabReport: e.target.checked })}
                  className="w-4 h-4 text-[#234638] rounded"
                />
                <label htmlFor="hasLab" className="font-semibold text-[#29332D] cursor-pointer">
                  Accredited Laboratory Certificate available for this batch
                </label>
              </div>

              {qualityData.hasLabReport ? (
                <div className="space-y-3 p-3.5 bg-white rounded-lg border border-[#E8E0D0]">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-[#29332D] mb-1">Testing Laboratory</label>
                      <input
                        type="text"
                        value={qualityData.labName}
                        onChange={(e) => setQualityData({ ...qualityData, labName: e.target.value })}
                        className="w-full px-3 py-2 bg-[#FFF8E9] border border-[#E8E0D0] rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-[#29332D] mb-1">Report Serial ID</label>
                      <input
                        type="text"
                        value={qualityData.reportNumber}
                        onChange={(e) => setQualityData({ ...qualityData, reportNumber: e.target.value })}
                        className="w-full px-3 py-2 bg-[#FFF8E9] border border-[#E8E0D0] rounded-lg font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block font-semibold text-[#29332D] mb-1">Moisture (%)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={qualityData.moisturePercentage}
                        onChange={(e) =>
                          setQualityData({ ...qualityData, moisturePercentage: Number(e.target.value) })
                        }
                        className="w-full px-3 py-2 bg-[#FFF8E9] border border-[#E8E0D0] rounded-lg font-mono"
                      />
                      <span className="text-[10px] text-[#2F7D50]">FSSAI max 20%</span>
                    </div>
                    <div>
                      <label className="block font-semibold text-[#29332D] mb-1">HMF (mg/kg)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={qualityData.hmfMgKg}
                        onChange={(e) => setQualityData({ ...qualityData, hmfMgKg: Number(e.target.value) })}
                        className="w-full px-3 py-2 bg-[#FFF8E9] border border-[#E8E0D0] rounded-lg font-mono"
                      />
                      <span className="text-[10px] text-[#6C756D]">Max 80 mg/kg</span>
                    </div>
                    <div>
                      <label className="block font-semibold text-[#29332D] mb-1">C3/C4 Adulterants</label>
                      <select
                        value={qualityData.c3c4SugarAdulteration}
                        onChange={(e) =>
                          setQualityData({
                            ...qualityData,
                            c3c4SugarAdulteration: e.target.value as 'Not Detected (Pure)',
                          })
                        }
                        className="w-full px-3 py-2 bg-[#FFF8E9] border border-[#E8E0D0] rounded-lg font-medium"
                      >
                        <option value="Not Detected (Pure)">Not Detected (Pure)</option>
                        <option value="Detected (Adulterated)">Detected (Adulterated)</option>
                      </select>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-3 text-xs text-[#B7791F] bg-amber-50 rounded-lg border border-amber-200">
                  Batch will be marked &quot;Partially Documented&quot; until certified lab results are logged.
                </div>
              )}
            </div>
          )}

          {/* Step 5: Packaging */}
          {currentStep === 5 && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-[#234638]">Step 5: Retail Packaging & Seal Allocation</h4>
              <p className="text-[#6C756D]">
                Define jar formats, tamper-evident seals, and warehouse storage conditions.
              </p>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#29332D] mb-1">Packaging Format</label>
                  <input
                    type="text"
                    value={packagingData.jarSize}
                    onChange={(e) => setPackagingData({ ...packagingData, jarSize: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FFF8E9] border border-[#E8E0D0] rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#29332D] mb-1">Total Jars Packaged</label>
                  <input
                    type="number"
                    value={packagingData.totalUnits}
                    onChange={(e) => setPackagingData({ ...packagingData, totalUnits: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-[#FFF8E9] border border-[#E8E0D0] rounded-lg font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#29332D] mb-1">Batch Seal / Lot Identifier</label>
                <input
                  type="text"
                  value={packagingData.batchSealCode}
                  onChange={(e) => setPackagingData({ ...packagingData, batchSealCode: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FFF8E9] border border-[#E8E0D0] rounded-lg font-mono font-bold text-[#234638]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#29332D] mb-1">Storage Environmental Guidelines</label>
                <textarea
                  rows={2}
                  value={packagingData.storageConditions}
                  onChange={(e) => setPackagingData({ ...packagingData, storageConditions: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FFF8E9] border border-[#E8E0D0] rounded-lg"
                />
              </div>
            </div>
          )}

          {/* Step 6: Review & Blockchain Commit */}
          {currentStep === 6 && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-[#234638]">Step 6: Cryptographic Blockchain Ledger Review</h4>
              <p className="text-[#6C756D]">
                Verify all batch metrics. Committing will calculate sequential SHA-256 integrity hashes for each event block.
              </p>

              <div className="p-4 bg-[#FFF8E9] rounded-xl border border-[#E8E0D0] space-y-2">
                <div className="flex justify-between pb-2 border-b border-[#E8E0D0]">
                  <span className="font-semibold text-[#6C756D]">Apiary Cluster:</span>
                  <span className="font-bold text-[#234638]">{selectedApiary?.name}</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-[#E8E0D0]">
                  <span className="font-semibold text-[#6C756D]">Floral Source:</span>
                  <span className="font-bold text-[#234638]">{harvestData.floralSource}</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-[#E8E0D0]">
                  <span className="font-semibold text-[#6C756D]">Harvest Volume:</span>
                  <span className="font-bold font-mono text-[#234638]">{harvestData.honeyQuantityKg} kg</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-[#E8E0D0]">
                  <span className="font-semibold text-[#6C756D]">Quality Moisture:</span>
                  <span className="font-bold font-mono text-[#2F7D50]">
                    {qualityData.hasLabReport ? `${qualityData.moisturePercentage}% (Passed)` : 'Pending'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-[#6C756D]">Packaged Units:</span>
                  <span className="font-bold font-mono text-[#234638]">
                    {packagingData.totalUnits} Units ({packagingData.jarSize})
                  </span>
                </div>
              </div>

              <div className="p-3 bg-[#E5EEE5] rounded-xl border border-[#2F7D50]/30 text-xs text-[#234638] flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-[#2F7D50] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Append-Only Cryptographic Signature: </span>
                  Upon confirmation, 4 sequential blocks will be signed with SHA-256 hashes linking back to Genesis.
                </div>
              </div>
            </div>
          )}

          {/* Step 7: QR Code Generated & Printable Preview */}
          {currentStep === 7 && createdBatchId && (
            <div className="space-y-4 text-center py-2">
              <div className="w-12 h-12 rounded-full bg-[#E5EEE5] text-[#2F7D50] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h4 className="text-base font-bold text-[#234638]">Batch Successfully Committed to Ledger!</h4>
              <p className="text-xs text-[#6C756D] max-w-md mx-auto">
                Batch <span className="font-mono font-bold text-[#234638]">{createdBatchId}</span> is now active with
                cryptographic tamper-evident verification.
              </p>

              {generatedQrDataUrl && (
                <div className="p-4 bg-white rounded-xl border border-[#E8E0D0] max-w-xs mx-auto shadow-sm space-y-3">
                  <div className="text-[10px] font-mono text-[#6C756D] uppercase">
                    Madhumitra Consumer QR
                  </div>
                  <img
                    src={generatedQrDataUrl}
                    alt={`QR Code for ${createdBatchId}`}
                    className="w-44 h-44 mx-auto border border-stone-200 rounded-lg p-1 bg-white"
                  />
                  <div className="font-mono font-bold text-sm text-[#234638]">{createdBatchId}</div>
                  <div className="text-[11px] text-[#6C756D]">
                    {harvestData.floralSource} · {harvestData.honeyQuantityKg} kg
                  </div>
                </div>
              )}

              <div className="flex justify-center gap-3 pt-2">
                <button
                  onClick={() => {
                    setSelectedBatchIdForVerification(createdBatchId);
                    setActiveTab('verification');
                    onClose();
                  }}
                  className="px-4 py-2 text-xs font-bold text-white bg-[#234638] hover:bg-[#1a352a] rounded-lg shadow-sm flex items-center gap-1.5 cursor-pointer"
                >
                  <QrCode className="w-4 h-4 text-[#E5A323]" />
                  <span>Open Consumer Verification Portal</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 bg-[#FFF8E9] border-t border-[#E8E0D0] flex items-center justify-between shrink-0">
          {currentStep < 7 ? (
            <>
              <button
                type="button"
                onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
                disabled={currentStep === 1}
                className={`flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg ${
                  currentStep === 1 ? 'opacity-40 cursor-not-allowed' : 'text-[#234638] hover:bg-white'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleFinishAndCommit(true)}
                  disabled={isSubmitting}
                  className="px-3 py-1.5 text-xs font-medium text-[#6C756D] hover:text-[#234638] border border-[#E8E0D0] bg-white rounded-lg cursor-pointer"
                >
                  Save as Draft
                </button>

                {currentStep < 6 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentStep((prev) => Math.min(6, prev + 1))}
                    className="flex items-center gap-1 px-4 py-1.5 text-xs font-bold text-white bg-[#234638] hover:bg-[#1a352a] rounded-lg cursor-pointer"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleFinishAndCommit(false)}
                    disabled={isSubmitting}
                    className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-white bg-[#2F7D50] hover:bg-[#256641] rounded-lg shadow-xs cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4 text-[#E5A323]" />
                    <span>{isSubmitting ? 'Signing Ledger...' : 'Commit to Blockchain'}</span>
                  </button>
                )}
              </div>
            </>
          ) : (
            <button
              onClick={onClose}
              className="w-full py-2 text-xs font-bold text-[#234638] bg-white border border-[#E8E0D0] hover:bg-stone-50 rounded-lg cursor-pointer"
            >
              Close Wizard
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
