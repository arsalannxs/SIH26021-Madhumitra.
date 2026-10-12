import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { QualityRecord } from '../../types';
import {
  FileCheck2,
  Plus,
  Search,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Info,
  Calendar,
  FileText,
} from 'lucide-react';

export const QualityRecordsView: React.FC = () => {
  const { qualityRecords, batches, addQualityRecord } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [form, setForm] = useState({
    batchId: batches[0]?.id || 'MM-2026-B108',
    testDate: new Date().toISOString().split('T')[0],
    labName: 'National Dairy Development Board (NDDB) Honey Lab',
    testMethod: 'AOAC 969.38 Refractometry & HPLC Analysis',
    reportNumber: `NDDB/HONEY/2026/${Math.floor(1000 + Math.random() * 9000)}`,
    moisturePercentage: 17.5,
    hmfMgKg: 12.0,
    sucrosePercentage: 2.2,
    electricalConductivityMsCm: 0.4,
    pollenAnalysis: 'Brassica yellow mustard dominant (76%)',
    c3c4SugarAdulteration: 'Not Detected (Pure)' as const,
    verificationStatus: 'Accredited Lab Passed' as const,
    assessorNotes: 'Sample complies with FSSAI Honey Gazette 2020 specifications for raw natural flora honey.',
  });

  const filteredRecords = qualityRecords.filter(
    (q) =>
      q.batchId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.labName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.reportNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    addQualityRecord({
      batchId: form.batchId,
      testDate: form.testDate,
      labName: form.labName,
      testMethod: form.testMethod,
      reportNumber: form.reportNumber,
      moisturePercentage: Number(form.moisturePercentage),
      hmfMgKg: Number(form.hmfMgKg),
      sucrosePercentage: Number(form.sucrosePercentage),
      electricalConductivityMsCm: Number(form.electricalConductivityMsCm),
      pollenAnalysis: form.pollenAnalysis,
      c3c4SugarAdulteration: form.c3c4SugarAdulteration,
      verificationStatus: form.verificationStatus,
      assessorNotes: form.assessorNotes,
    });
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#234638] flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-[#E5A323]" />
            Accredited Laboratory Quality Records
          </h1>
          <p className="text-xs text-[#6C756D] mt-0.5">
            Physical chemical test certificates benchmarked against Food Safety & Standards Authority of India (FSSAI) standards
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#6C756D]" />
            <input
              type="text"
              placeholder="Search lab, report #..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-[#E8E0D0] rounded-lg focus:outline-none focus:border-[#E5A323]"
            />
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-[#234638] hover:bg-[#1a352a] rounded-lg transition-colors shadow-2xs whitespace-nowrap cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#E5A323]" />
            <span>Add Lab Report</span>
          </button>
        </div>
      </div>

      {/* Regulatory Context Citation Notice */}
      <div className="p-4 bg-[#FFF8E9] rounded-xl border border-[#E8E0D0] text-xs space-y-1.5">
        <div className="flex items-center gap-2 font-bold text-[#234638]">
          <Info className="w-4 h-4 text-[#E5A323]" />
          <span>Statutory Testing Standards: FSSAI Gazette Notification (2020 Amendment)</span>
        </div>
        <p className="text-[#6C756D] leading-relaxed">
          Parameters are evaluated against the Food Safety and Standards (Food Products Standards and Food Additives)
          Regulations. Raw natural honey must meet: <strong>Moisture: Max 20.0%</strong> by mass;{' '}
          <strong>HMF (Hydroxymethylfurfural): Max 80 mg/kg</strong>;{' '}
          <strong>Apparent Reducing Sugars: Min 65%</strong>;{' '}
          <strong>Sucrose: Max 5.0%</strong>; and negative C3/C4 isotopic sugar adulteration.
        </p>
      </div>

      {/* Quality Records Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredRecords.map((qr) => {
          const isPassed = qr.moisturePercentage <= 20.0 && qr.c3c4SugarAdulteration === 'Not Detected (Pure)';
          return (
            <div
              key={qr.id}
              className="bg-white rounded-xl border border-[#E8E0D0] p-5 shadow-2xs space-y-4 hover:border-[#E5A323] transition-all"
            >
              <div className="flex items-start justify-between pb-3 border-b border-[#E8E0D0]">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm text-[#234638]">Batch: {qr.batchId}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-stone-100 text-stone-600">
                      {qr.id}
                    </span>
                  </div>
                  <h4 className="font-bold text-xs text-[#6C756D] mt-1">{qr.labName}</h4>
                </div>

                <span
                  className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                    isPassed ? 'bg-[#E5EEE5] text-[#2F7D50]' : 'bg-red-100 text-red-700'
                  }`}
                >
                  {qr.verificationStatus}
                </span>
              </div>

              {/* Chemical Metrics Cards */}
              <div className="grid grid-cols-3 gap-2.5 text-center">
                <div className="p-2 bg-[#FFF8E9] rounded-lg border border-[#E8E0D0]">
                  <span className="text-[10px] text-[#6C756D] block">Moisture</span>
                  <span className="text-base font-bold font-mono text-[#234638]">{qr.moisturePercentage}%</span>
                  <span className="text-[9px] text-[#2F7D50] block">≤ 20% limit</span>
                </div>
                <div className="p-2 bg-[#FFF8E9] rounded-lg border border-[#E8E0D0]">
                  <span className="text-[10px] text-[#6C756D] block">HMF Level</span>
                  <span className="text-base font-bold font-mono text-[#234638]">{qr.hmfMgKg}</span>
                  <span className="text-[9px] text-[#6C756D] block">mg/kg</span>
                </div>
                <div className="p-2 bg-[#FFF8E9] rounded-lg border border-[#E8E0D0]">
                  <span className="text-[10px] text-[#6C756D] block">Sucrose</span>
                  <span className="text-base font-bold font-mono text-[#234638]">{qr.sucrosePercentage}%</span>
                  <span className="text-[9px] text-[#6C756D] block">≤ 5% limit</span>
                </div>
              </div>

              {/* Pollen & C3/C4 Adulteration */}
              <div className="space-y-1.5 text-xs text-[#6C756D]">
                <div className="flex justify-between py-1 border-b border-[#E8E0D0]">
                  <span>C3 / C4 Adulterants:</span>
                  <span className="font-bold text-[#2F7D50]">{qr.c3c4SugarAdulteration}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#E8E0D0]">
                  <span>Pollen Microscopy:</span>
                  <span className="font-medium text-[#29332D] truncate max-w-xs">{qr.pollenAnalysis}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#E8E0D0]">
                  <span>Testing Methodology:</span>
                  <span className="text-[#29332D] truncate max-w-xs">{qr.testMethod}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span>Report Serial Code:</span>
                  <span className="font-mono text-[#29332D]">{qr.reportNumber}</span>
                </div>
              </div>

              {/* Assessor remarks */}
              <div className="p-2.5 bg-stone-50 rounded-lg border border-[#E8E0D0] text-[11px] text-[#6C756D]">
                <span className="font-bold text-[#29332D]">Remarks: </span>
                {qr.assessorNotes}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Quality Report Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-5 shadow-xl border border-[#E8E0D0] max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-bold text-[#234638] mb-3">Attach Laboratory Test Certificate</h3>
            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-[#29332D] mb-1">Target Batch ID</label>
                <select
                  value={form.batchId}
                  onChange={(e) => setForm({ ...form, batchId: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FFF8E9] border border-[#E8E0D0] rounded-lg"
                >
                  {batches.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.id} ({b.floralSource})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#29332D] mb-1">Testing Lab Name</label>
                  <input
                    type="text"
                    required
                    value={form.labName}
                    onChange={(e) => setForm({ ...form, labName: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FFF8E9] border border-[#E8E0D0] rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#29332D] mb-1">Report Serial ID</label>
                  <input
                    type="text"
                    required
                    value={form.reportNumber}
                    onChange={(e) => setForm({ ...form, reportNumber: e.target.value })}
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
                    required
                    value={form.moisturePercentage}
                    onChange={(e) => setForm({ ...form, moisturePercentage: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-[#FFF8E9] border border-[#E8E0D0] rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#29332D] mb-1">HMF (mg/kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={form.hmfMgKg}
                    onChange={(e) => setForm({ ...form, hmfMgKg: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-[#FFF8E9] border border-[#E8E0D0] rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#29332D] mb-1">Sucrose (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={form.sucrosePercentage}
                    onChange={(e) => setForm({ ...form, sucrosePercentage: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-[#FFF8E9] border border-[#E8E0D0] rounded-lg font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#29332D] mb-1">Pollen Analysis</label>
                <input
                  type="text"
                  value={form.pollenAnalysis}
                  onChange={(e) => setForm({ ...form, pollenAnalysis: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FFF8E9] border border-[#E8E0D0] rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#29332D] mb-1">Assessor Observations</label>
                <textarea
                  rows={2}
                  value={form.assessorNotes}
                  onChange={(e) => setForm({ ...form, assessorNotes: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FFF8E9] border border-[#E8E0D0] rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#E8E0D0]">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-1.5 font-medium text-[#6C756D]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 font-bold text-white bg-[#234638] rounded-lg shadow-xs"
                >
                  Save Quality Certificate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
