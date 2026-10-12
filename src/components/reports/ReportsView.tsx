import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  FileSpreadsheet,
  Download,
  Printer,
  Calendar,
  CheckCircle2,
  FileCheck2,
  ShieldCheck,
  Boxes,
  Layers,
  Sparkles,
} from 'lucide-react';

export const ReportsView: React.FC = () => {
  const { batches, apiaries, hives, events, qualityRecords, marketListings } = useApp();
  const [selectedReportType, setSelectedReportType] = useState('traceability_ledger');
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  const reportCategories = [
    {
      id: 'traceability_ledger',
      title: 'Batch Traceability & Blockchain Ledger Audit',
      description: 'Export all cryptographically signed event blocks with SHA-256 hashes, sequence numbers, and actors.',
      recordCount: events.length,
    },
    {
      id: 'apiary_inventory',
      title: 'Apiary Cluster & Hive Box Inventory',
      description: 'Comprehensive inventory of registered beekeeping boxes, colony status, and queen health observations.',
      recordCount: hives.length,
    },
    {
      id: 'quality_certificates',
      title: 'Accredited Chemical Quality Certificates',
      description: 'Laboratory testing logs for moisture %, HMF levels, sucrose %, and C3/C4 adulteration evaluations.',
      recordCount: qualityRecords.length,
    },
    {
      id: 'harvest_production',
      title: 'Honey Harvest & Seasonal Production Log',
      description: 'Yield volumes (kg) broken down by date, apiary cluster, floral source, and cold extraction method.',
      recordCount: batches.length,
    },
  ];

  const handleDownloadCsv = (type: string) => {
    let headers: string[] = [];
    let rows: (string | number)[][] = [];
    let filename = `madhumitra_${type}_${new Date().toISOString().split('T')[0]}.csv`;

    if (type === 'traceability_ledger') {
      headers = ['Sequence #', 'Event ID', 'Batch ID', 'Event Type', 'Title', 'Timestamp', 'Actor', 'Org', 'Previous Hash', 'Block SHA-256 Hash'];
      rows = events.map((e) => [
        e.sequenceNum,
        e.eventId,
        e.batchId,
        e.eventType,
        `"${e.title}"`,
        e.timestamp,
        `"${e.actorName}"`,
        `"${e.organization}"`,
        e.prevHash,
        e.currentHash,
      ]);
    } else if (type === 'apiary_inventory') {
      headers = ['Hive Code', 'Apiary Name', 'Hive Type', 'Colony Status', 'Queen Status', 'Last Inspected', 'Temp (°C)', 'Humidity (%)', 'Weight (kg)'];
      rows = hives.map((h) => [
        h.code,
        `"${h.apiaryName}"`,
        h.hiveType,
        h.colonyStatus,
        h.queenStatus,
        h.lastInspectedDate,
        h.temperatureC,
        h.humidityPct,
        h.weightKg,
      ]);
    } else if (type === 'quality_certificates') {
      headers = ['Report ID', 'Batch ID', 'Lab Name', 'Test Date', 'Moisture %', 'HMF (mg/kg)', 'Sucrose %', 'C3/C4 Adulteration', 'Status'];
      rows = qualityRecords.map((q) => [
        q.reportNumber,
        q.batchId,
        `"${q.labName}"`,
        q.testDate,
        q.moisturePercentage,
        q.hmfMgKg,
        q.sucrosePercentage,
        `"${q.c3c4SugarAdulteration}"`,
        q.verificationStatus,
      ]);
    } else {
      headers = ['Batch ID', 'Harvest Date', 'Apiary Cluster', 'Lead Beekeeper', 'Quantity (kg)', 'Floral Source', 'Extraction Method', 'Status'];
      rows = batches.map((b) => [
        b.id,
        b.harvestDate,
        `"${b.apiaryName}"`,
        `"${b.beekeeperName}"`,
        b.honeyQuantityKg,
        `"${b.floralSource}"`,
        b.extractionMethod,
        b.batchStatus,
      ]);
    }

    const csvData = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encoded = encodeURI(csvData);
    const link = document.createElement('a');
    link.setAttribute('href', encoded);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setExportNotice(`Successfully exported ${filename}`);
    setTimeout(() => setExportNotice(null), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#234638] flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-[#E5A323]" />
            Regulatory Reports & Audit Data Export
          </h1>
          <p className="text-xs text-[#6C756D] mt-0.5">
            Official compliance datasets formatted for Ministry of MSME, KVIC, and FSSAI audits
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#234638] bg-white border border-[#E8E0D0] hover:border-[#E5A323] rounded-lg transition-colors shadow-2xs cursor-pointer"
        >
          <Printer className="w-4 h-4 text-[#E5A323]" />
          <span>Print Current Dossier</span>
        </button>
      </div>

      {exportNotice && (
        <div className="p-3 bg-[#E5EEE5] text-[#2F7D50] text-xs rounded-xl border border-[#2F7D50]/30 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{exportNotice}</span>
        </div>
      )}

      {/* Reports Catalog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reportCategories.map((cat) => (
          <div
            key={cat.id}
            className="bg-white rounded-xl border border-[#E8E0D0] p-5 shadow-2xs space-y-4 hover:border-[#E5A323] transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between pb-2.5 border-b border-[#E8E0D0]">
                <h3 className="font-bold text-sm text-[#234638]">{cat.title}</h3>
                <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-full bg-[#FFF8E9] text-[#234638]">
                  {cat.recordCount} Records
                </span>
              </div>
              <p className="text-xs text-[#6C756D] mt-2.5 leading-relaxed">
                {cat.description}
              </p>
            </div>

            <div className="pt-2 border-t border-[#E8E0D0] flex items-center justify-between">
              <span className="text-[11px] text-[#6C756D] font-mono">Format: RFC 4180 CSV</span>
              <button
                onClick={() => handleDownloadCsv(cat.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-[#234638] hover:bg-[#1a352a] rounded-lg transition-colors shadow-2xs cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-[#E5A323]" />
                <span>Download CSV</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Certificate Print Preview Mockup */}
      <div className="bg-white rounded-xl border border-[#E8E0D0] p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#E8E0D0]">
          <div>
            <span className="text-[10px] font-mono font-bold text-[#E5A323] uppercase">
              Compliance Certificate Generator
            </span>
            <h2 className="text-base font-bold text-[#234638] mt-0.5">
              Printable Honey Jar Batch Traceability Certificate
            </h2>
          </div>
          <button
            onClick={() => window.print()}
            className="px-3 py-1.5 text-xs font-bold text-white bg-[#2F7D50] hover:bg-[#256641] rounded-lg shadow-2xs flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Certificate</span>
          </button>
        </div>

        {/* Certificate Container */}
        <div className="p-6 bg-[#FFF8E9]/60 border-2 border-dashed border-[#234638]/30 rounded-xl space-y-4 max-w-2xl mx-auto text-xs">
          <div className="text-center pb-3 border-b border-[#E8E0D0]">
            <h3 className="font-extrabold text-base text-[#234638] tracking-wide">
              MADHUMITRA · PROVENANCE & QUALITY ATTESTATION
            </h3>
            <p className="text-[11px] text-[#6C756D]">
              Under Smart India Hackathon SIH26021 · Ministry of MSME
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-[#6C756D] block">Batch Identification:</span>
              <span className="font-mono font-bold text-sm text-[#234638]">
                {batches[0]?.id || 'MM-2026-B108'}
              </span>
            </div>
            <div>
              <span className="text-[#6C756D] block">Floral Variety:</span>
              <span className="font-semibold text-[#29332D]">
                {batches[0]?.floralSource || 'Wild Mustard Blossom'}
              </span>
            </div>
            <div>
              <span className="text-[#6C756D] block">Producing Cluster:</span>
              <span className="font-semibold text-[#29332D]">
                {batches[0]?.apiaryName || 'Shivalik Wilds Apiary'}
              </span>
            </div>
            <div>
              <span className="text-[#6C756D] block">Laboratory Result:</span>
              <span className="font-bold text-[#2F7D50]">
                Moisture 17.2% · Pure C3/C4 Negative
              </span>
            </div>
          </div>

          <div className="pt-3 border-t border-[#E8E0D0] text-[10px] font-mono text-[#6C756D] break-all">
            Blockchain Root SHA-256 Hash:{' '}
            <span className="text-[#234638] font-bold">
              {batches[0]?.blockchainRootHash || '3c0f99a8b1...'}
            </span>
          </div>

          <div className="text-[10px] text-[#6C756D] italic text-center pt-2">
            This digital attestation binds tamper-evident sensor telemetry with verified NABL laboratory records.
          </div>
        </div>
      </div>
    </div>
  );
};
