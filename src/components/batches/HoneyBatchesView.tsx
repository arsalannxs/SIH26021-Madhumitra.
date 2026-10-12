import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { HoneyBatch } from '../../types';
import {
  Layers,
  Plus,
  Search,
  ShieldCheck,
  QrCode,
  Calendar,
  FileCheck2,
  Package,
  TrendingUp,
  ExternalLink,
} from 'lucide-react';

interface HoneyBatchesViewProps {
  onOpenNewBatchModal: () => void;
}

export const HoneyBatchesView: React.FC<HoneyBatchesViewProps> = ({ onOpenNewBatchModal }) => {
  const { batches, setActiveTab, setSelectedBatchIdForVerification, updateBatchStatus } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedBatch, setSelectedBatch] = useState<HoneyBatch | null>(batches[0] || null);

  const filteredBatches = batches.filter((b) => {
    const matchesSearch =
      b.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.floralSource.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.apiaryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.beekeeperName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || b.batchStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#234638] flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#E5A323]" />
            Honey Batch Production Records
          </h1>
          <p className="text-xs text-[#6C756D] mt-0.5">
            Traceable production batches logged from apiary comb extraction to packaged jars
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#6C756D]" />
            <input
              type="text"
              placeholder="Search batch ID, floral source..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-[#E8E0D0] rounded-lg focus:outline-none focus:border-[#E5A323]"
            />
          </div>

          <button
            onClick={onOpenNewBatchModal}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-[#234638] hover:bg-[#1a352a] rounded-lg transition-colors shadow-2xs whitespace-nowrap cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#E5A323]" />
            <span>Create Batch</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-white border border-[#E8E0D0] rounded-xl overflow-x-auto text-xs font-medium">
        {['all', 'Harvested', 'Processed', 'Lab Tested', 'Packaged', 'Dispatched', 'Draft'].map(
          (status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                statusFilter === status
                  ? 'bg-[#234638] text-white font-bold'
                  : 'text-[#6C756D] hover:text-[#234638]'
              }`}
            >
              {status === 'all' ? 'All Batches' : status}
            </button>
          )
        )}
      </div>

      {/* Batches Table and Details Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Table of Batches */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-[#E8E0D0] p-5 shadow-2xs space-y-4">
          <h2 className="text-sm font-bold text-[#234638] pb-2 border-b border-[#E8E0D0]">
            Batch Registry ({filteredBatches.length})
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-[#6C756D] border-b border-[#E8E0D0] bg-[#FFF8E9]/60">
                  <th className="py-2.5 px-3 font-semibold">Batch Code</th>
                  <th className="py-2.5 px-3 font-semibold">Flora & Origin</th>
                  <th className="py-2.5 px-3 font-semibold">Volume</th>
                  <th className="py-2.5 px-3 font-semibold">Status</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E0D0]">
                {filteredBatches.map((batch) => {
                  const isSelected = selectedBatch?.id === batch.id;
                  return (
                    <tr
                      key={batch.id}
                      onClick={() => setSelectedBatch(batch)}
                      className={`cursor-pointer transition-colors ${
                        isSelected ? 'bg-[#E5EEE5]/60' : 'hover:bg-[#FFF8E9]/40'
                      }`}
                    >
                      <td className="py-3 px-3 font-mono font-bold text-[#234638]">
                        {batch.id}
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-semibold text-[#29332D]">{batch.floralSource}</div>
                        <div className="text-[11px] text-[#6C756D]">{batch.apiaryName}</div>
                      </td>
                      <td className="py-3 px-3 font-mono tabular-nums font-semibold text-[#29332D]">
                        {batch.honeyQuantityKg} kg
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            batch.batchStatus === 'Dispatched' || batch.batchStatus === 'Packaged'
                              ? 'bg-[#E5EEE5] text-[#2F7D50]'
                              : batch.batchStatus === 'Lab Tested'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-stone-100 text-stone-700'
                          }`}
                        >
                          {batch.batchStatus}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedBatchIdForVerification(batch.id);
                              setActiveTab('traceability');
                            }}
                            className="p-1.5 text-[#234638] hover:bg-[#E5EEE5] rounded transition-colors"
                            title="View Cryptographic Ledger"
                          >
                            <ShieldCheck className="w-4 h-4 text-[#2F7D50]" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedBatchIdForVerification(batch.id);
                              setActiveTab('verification');
                            }}
                            className="p-1.5 text-[#234638] hover:bg-[#FFF8E9] rounded transition-colors"
                            title="Open Consumer QR Portal"
                          >
                            <QrCode className="w-4 h-4 text-[#E5A323]" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {filteredBatches.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-[#6C756D]">
                      No batches match the selected criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Selected Batch Detailed Card */}
        {selectedBatch && (
          <div className="bg-white rounded-xl border border-[#E8E0D0] p-5 shadow-2xs space-y-4">
            <div className="flex items-start justify-between pb-3 border-b border-[#E8E0D0]">
              <div>
                <span className="text-[10px] font-mono font-bold text-[#E5A323] uppercase">
                  Batch Dossier
                </span>
                <h3 className="text-lg font-bold font-mono text-[#234638] mt-0.5">
                  {selectedBatch.id}
                </h3>
              </div>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#E5EEE5] text-[#2F7D50]">
                {selectedBatch.batchStatus}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-[#E8E0D0]">
                <span className="text-[#6C756D]">Floral Origin:</span>
                <span className="font-semibold text-[#29332D]">{selectedBatch.floralSource}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#E8E0D0]">
                <span className="text-[#6C756D]">Source Cluster:</span>
                <span className="font-semibold text-[#29332D]">{selectedBatch.apiaryName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#E8E0D0]">
                <span className="text-[#6C756D]">Lead Producer:</span>
                <span className="font-semibold text-[#29332D]">{selectedBatch.beekeeperName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#E8E0D0]">
                <span className="text-[#6C756D]">Harvest Date:</span>
                <span className="font-mono text-[#29332D]">{selectedBatch.harvestDate}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#E8E0D0]">
                <span className="text-[#6C756D]">Harvest Quantity:</span>
                <span className="font-mono font-bold text-[#234638]">{selectedBatch.honeyQuantityKg} kg</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#E8E0D0]">
                <span className="text-[#6C756D]">Extraction Method:</span>
                <span className="font-medium text-[#29332D]">{selectedBatch.extractionMethod}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#E8E0D0]">
                <span className="text-[#6C756D]">Packaging Lot:</span>
                <span className="font-mono text-[#29332D]">{selectedBatch.packagedUnits.batchSealCode}</span>
              </div>
            </div>

            <div className="p-3 bg-[#FFF8E9] rounded-lg border border-[#E8E0D0] text-xs space-y-1">
              <div className="font-bold text-[#234638]">Filtration & Storage:</div>
              <p className="text-[#6C756D] leading-relaxed">{selectedBatch.processingDetails}</p>
            </div>

            {/* Quick Actions */}
            <div className="space-y-2 pt-2">
              <button
                onClick={() => {
                  setSelectedBatchIdForVerification(selectedBatch.id);
                  setActiveTab('traceability');
                }}
                className="w-full py-2 text-xs font-bold text-white bg-[#234638] hover:bg-[#1a352a] rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <ShieldCheck className="w-4 h-4 text-[#E5A323]" />
                <span>Verify Event Hash Chain</span>
              </button>

              <button
                onClick={() => {
                  setSelectedBatchIdForVerification(selectedBatch.id);
                  setActiveTab('verification');
                }}
                className="w-full py-2 text-xs font-bold text-[#234638] bg-[#E5EEE5] hover:bg-[#d8e5d8] rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <QrCode className="w-4 h-4 text-[#2F7D50]" />
                <span>Preview Consumer QR Page</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
