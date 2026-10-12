import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Apiary, Hive, HiveType, ColonyStatus } from '../../types';
import {
  Boxes,
  Plus,
  Search,
  MapPin,
  Calendar,
  Layers,
  Thermometer,
  Trash2,
  Edit2,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Cpu,
  Info,
} from 'lucide-react';

export const ApiariesView: React.FC = () => {
  const { apiaries, hives, addApiary, updateApiary, deleteApiary, addHive, deleteHive, setActiveTab } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedApiaryId, setSelectedApiaryId] = useState<string>(apiaries[0]?.id || 'API-001');
  const [isAddApiaryModalOpen, setIsAddApiaryModalOpen] = useState(false);
  const [isAddHiveModalOpen, setIsAddHiveModalOpen] = useState(false);
  const [apiaryToDelete, setApiaryToDelete] = useState<string | null>(null);

  // Form states for adding apiary
  const [newApiaryForm, setNewApiaryForm] = useState({
    name: '',
    code: '',
    beekeeperName: '',
    cooperativeName: '',
    generalLocation: '',
    district: '',
    state: '',
    lat: 32.1,
    lng: 76.3,
    primaryFlora: 'Wildflower, Mustard',
    notes: '',
  });

  // Form states for adding hive
  const [newHiveForm, setNewHiveForm] = useState({
    code: '',
    hiveType: 'Langstroth 10-Frame' as HiveType,
    colonyStatus: 'healthy' as ColonyStatus,
    queenStatus: 'Marked & Active' as const,
    combHealth: 'Full Brood' as const,
    sensorAvailable: true,
    sensorHardwareId: 'IOT-ESP32-NEW',
    notes: '',
  });

  const selectedApiary = apiaries.find((a) => a.id === selectedApiaryId) || apiaries[0];
  const apiaryHives = hives.filter((h) => h.apiaryId === selectedApiary?.id);

  const filteredApiaries = apiaries.filter(
    (a) =>
      a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.generalLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.beekeeperName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateApiary = (e: React.FormEvent) => {
    e.preventDefault();
    addApiary({
      name: newApiaryForm.name,
      code: newApiaryForm.code || `AP-${Date.now().toString().slice(-4)}`,
      beekeeperName: newApiaryForm.beekeeperName,
      cooperativeName: newApiaryForm.cooperativeName,
      generalLocation: newApiaryForm.generalLocation,
      district: newApiaryForm.district,
      state: newApiaryForm.state,
      coordinates: { lat: Number(newApiaryForm.lat), lng: Number(newApiaryForm.lng) },
      hivesCount: 0,
      registeredDate: new Date().toISOString().split('T')[0],
      primaryFlora: newApiaryForm.primaryFlora.split(',').map((s) => s.trim()),
      notes: newApiaryForm.notes,
    });
    setIsAddApiaryModalOpen(false);
  };

  const handleCreateHive = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApiary) return;
    addHive({
      code: newHiveForm.code || `HIVE-${Date.now().toString().slice(-3)}`,
      apiaryId: selectedApiary.id,
      apiaryName: selectedApiary.name,
      hiveType: newHiveForm.hiveType,
      colonyStatus: newHiveForm.colonyStatus,
      colonyEstablishedDate: new Date().toISOString().split('T')[0],
      sensorAvailable: newHiveForm.sensorAvailable,
      sensorHardwareId: newHiveForm.sensorHardwareId,
      lastInspectedDate: new Date().toISOString().split('T')[0],
      queenStatus: newHiveForm.queenStatus,
      combHealth: newHiveForm.combHealth,
      notes: newHiveForm.notes,
      temperatureC: 34.4,
      humidityPct: 56.0,
      weightKg: 25.0,
      acousticHz: 210,
      lastMeasurementTimestamp: new Date().toISOString(),
    });
    setIsAddHiveModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Search */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#234638] flex items-center gap-2">
            <Boxes className="w-5 h-5 text-[#E5A323]" />
            Apiary & Colony Management
          </h1>
          <p className="text-xs text-[#6C756D] mt-0.5">
            Register and monitor beekeeping clusters across agro-climatic zones
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#6C756D]" />
            <input
              type="text"
              placeholder="Search cluster, beekeeper..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-[#E8E0D0] rounded-lg focus:outline-none focus:border-[#E5A323]"
            />
          </div>
          <button
            onClick={() => setIsAddApiaryModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-[#234638] hover:bg-[#1a352a] rounded-lg transition-colors shadow-2xs whitespace-nowrap cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#E5A323]" />
            <span>Add Apiary</span>
          </button>
        </div>
      </div>

      {/* Apiary Cluster Cards Carousel / List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filteredApiaries.map((apiary) => {
          const isSelected = apiary.id === selectedApiary?.id;
          const hiveList = hives.filter((h) => h.apiaryId === apiary.id);
          return (
            <div
              key={apiary.id}
              onClick={() => setSelectedApiaryId(apiary.id)}
              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-white border-[#234638] ring-1 ring-[#234638] shadow-sm'
                  : 'bg-white/80 border-[#E8E0D0] hover:border-[#E5A323] hover:bg-white'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-mono font-bold text-[#E5A323] uppercase">
                    {apiary.code}
                  </span>
                  <h3 className="font-bold text-sm text-[#234638] mt-0.5">{apiary.name}</h3>
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#E5EEE5] text-[#2F7D50] tabular-nums">
                  {hiveList.length} Hives
                </span>
              </div>

              <div className="mt-3 space-y-1 text-xs text-[#6C756D]">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#B96A45] shrink-0" />
                  <span className="truncate">{apiary.generalLocation}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="font-medium text-[#29332D]">Lead:</span>
                  <span>{apiary.beekeeperName} ({apiary.cooperativeName})</span>
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-[#E8E0D0] flex items-center justify-between text-[11px] text-[#6C756D]">
                <span>Flora: {apiary.primaryFlora.slice(0, 2).join(', ')}</span>
                <span className="font-mono text-[10px] text-[#2F7D50]">Geo-Protected</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Apiary Detailed Inspection Panel */}
      {selectedApiary && (
        <div className="bg-white rounded-xl border border-[#E8E0D0] p-5 shadow-2xs space-y-5">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-[#E8E0D0] gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-[#234638]">
                  {selectedApiary.name} · Colony Inventory
                </h2>
                <span className="text-xs px-2 py-0.5 bg-[#FFF8E9] border border-[#E8E0D0] text-[#6C756D] rounded-md font-mono">
                  {selectedApiary.code}
                </span>
              </div>
              <p className="text-xs text-[#6C756D] mt-1">
                Public general location: {selectedApiary.generalLocation}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsAddHiveModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#234638] bg-[#E5EEE5] hover:bg-[#d8e5d8] rounded-lg transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Hive Box</span>
              </button>
            </div>
          </div>

          {/* Privacy & Coordinates Disclosure Box */}
          <div className="p-3 bg-[#FFF8E9] border border-[#E8E0D0] rounded-lg text-xs flex items-start gap-3">
            <Lock className="w-4 h-4 text-[#234638] shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-[#234638]">Privacy Protection Compliance: </span>
              <span className="text-[#6C756D]">
                Exact GPS coordinates (Lat {selectedApiary.coordinates.lat.toFixed(4)}, Lng{' '}
                {selectedApiary.coordinates.lng.toFixed(4)}) are encrypted and withheld from public QR consumer scans.
                Consumers view only the certified agricultural district/cluster.
              </span>
            </div>
          </div>

          {/* Hive Boxes Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-[#6C756D] border-b border-[#E8E0D0] bg-[#FFF8E9]/60">
                  <th className="py-2.5 px-3 font-semibold">Hive Code</th>
                  <th className="py-2.5 px-3 font-semibold">Type</th>
                  <th className="py-2.5 px-3 font-semibold">Colony Status</th>
                  <th className="py-2.5 px-3 font-semibold">Queen Status</th>
                  <th className="py-2.5 px-3 font-semibold">IoT Sensor</th>
                  <th className="py-2.5 px-3 font-semibold">Brood / Comb</th>
                  <th className="py-2.5 px-3 font-semibold">Last Inspect</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E0D0]">
                {apiaryHives.map((hive) => (
                  <tr key={hive.id} className="hover:bg-[#FFF8E9]/40 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-[#234638]">
                      {hive.code}
                    </td>
                    <td className="py-3 px-3 text-[#29332D]">{hive.hiveType}</td>
                    <td className="py-3 px-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                          hive.colonyStatus === 'healthy'
                            ? 'bg-[#E5EEE5] text-[#2F7D50]'
                            : hive.colonyStatus === 'attention_needed'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {hive.colonyStatus.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-[#6C756D]">{hive.queenStatus}</td>
                    <td className="py-3 px-3">
                      {hive.sensorAvailable ? (
                        <span className="flex items-center gap-1 text-[#2F7D50] font-mono text-[11px]">
                          <Cpu className="w-3 h-3" />
                          <span>{hive.sensorHardwareId}</span>
                        </span>
                      ) : (
                        <span className="text-[#6C756D]">Manual Only</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-[#29332D]">{hive.combHealth}</td>
                    <td className="py-3 px-3 font-mono text-[#6C756D]">
                      {hive.lastInspectedDate}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => deleteHive(hive.id)}
                        className="p-1 text-[#6C756D] hover:text-[#B94040] rounded transition-colors"
                        title="Delete Hive Record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
                {apiaryHives.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-[#6C756D]">
                      No hives registered in this apiary yet. Click &quot;Add Hive Box&quot; to begin.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Apiary Modal */}
      {isAddApiaryModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-5 shadow-xl border border-[#E8E0D0]">
            <h3 className="text-base font-bold text-[#234638] mb-4">Register New Apiary Cluster</h3>
            <form onSubmit={handleCreateApiary} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-[#29332D] mb-1">Apiary Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dhauladhar Pine Bee Farm"
                  value={newApiaryForm.name}
                  onChange={(e) => setNewApiaryForm({ ...newApiaryForm, name: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FFF8E9] border border-[#E8E0D0] rounded-lg"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#29332D] mb-1">Lead Beekeeper</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rameshwar Sharma"
                    value={newApiaryForm.beekeeperName}
                    onChange={(e) => setNewApiaryForm({ ...newApiaryForm, beekeeperName: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FFF8E9] border border-[#E8E0D0] rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#29332D] mb-1">FPO / Cooperative</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Himachal Honey FPO"
                    value={newApiaryForm.cooperativeName}
                    onChange={(e) => setNewApiaryForm({ ...newApiaryForm, cooperativeName: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FFF8E9] border border-[#E8E0D0] rounded-lg"
                  />
                </div>
              </div>
              <div>
                <label className="block font-semibold text-[#29332D] mb-1">
                  General Location (Consumer Safe)
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kangra Valley Foothills, Himachal Pradesh"
                  value={newApiaryForm.generalLocation}
                  onChange={(e) => setNewApiaryForm({ ...newApiaryForm, generalLocation: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FFF8E9] border border-[#E8E0D0] rounded-lg"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#29332D] mb-1">District</label>
                  <input
                    type="text"
                    required
                    placeholder="Kangra"
                    value={newApiaryForm.district}
                    onChange={(e) => setNewApiaryForm({ ...newApiaryForm, district: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FFF8E9] border border-[#E8E0D0] rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#29332D] mb-1">State</label>
                  <input
                    type="text"
                    required
                    placeholder="Himachal Pradesh"
                    value={newApiaryForm.state}
                    onChange={(e) => setNewApiaryForm({ ...newApiaryForm, state: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FFF8E9] border border-[#E8E0D0] rounded-lg"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-[#E8E0D0]">
                <button
                  type="button"
                  onClick={() => setIsAddApiaryModalOpen(false)}
                  className="px-3 py-1.5 font-medium text-[#6C756D]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 font-bold text-white bg-[#234638] rounded-lg"
                >
                  Save Apiary
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Hive Modal */}
      {isAddHiveModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-5 shadow-xl border border-[#E8E0D0]">
            <h3 className="text-base font-bold text-[#234638] mb-3">Add Hive to {selectedApiary.name}</h3>
            <form onSubmit={handleCreateHive} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-[#29332D] mb-1">Hive Identifier Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SHV-BOX-06"
                  value={newHiveForm.code}
                  onChange={(e) => setNewHiveForm({ ...newHiveForm, code: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FFF8E9] border border-[#E8E0D0] rounded-lg"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#29332D] mb-1">Hive Box Type</label>
                  <select
                    value={newHiveForm.hiveType}
                    onChange={(e) => setNewHiveForm({ ...newHiveForm, hiveType: e.target.value as HiveType })}
                    className="w-full px-3 py-2 bg-[#FFF8E9] border border-[#E8E0D0] rounded-lg"
                  >
                    <option value="Langstroth 10-Frame">Langstroth 10-Frame</option>
                    <option value="Langstroth 8-Frame">Langstroth 8-Frame</option>
                    <option value="Top Bar Hive">Top Bar Hive</option>
                    <option value="Traditional Clay / Wall">Traditional Clay / Wall</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-[#29332D] mb-1">Colony Status</label>
                  <select
                    value={newHiveForm.colonyStatus}
                    onChange={(e) => setNewHiveForm({ ...newHiveForm, colonyStatus: e.target.value as ColonyStatus })}
                    className="w-full px-3 py-2 bg-[#FFF8E9] border border-[#E8E0D0] rounded-lg"
                  >
                    <option value="healthy">Healthy</option>
                    <option value="attention_needed">Attention Needed</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block font-semibold text-[#29332D] mb-1">Initial Inspection Notes</label>
                <textarea
                  rows={2}
                  placeholder="Frames drawn, honey comb capping percentage, bee temperament..."
                  value={newHiveForm.notes}
                  onChange={(e) => setNewHiveForm({ ...newHiveForm, notes: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FFF8E9] border border-[#E8E0D0] rounded-lg"
                />
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-[#E8E0D0]">
                <button
                  type="button"
                  onClick={() => setIsAddHiveModalOpen(false)}
                  className="px-3 py-1.5 font-medium text-[#6C756D]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 font-bold text-white bg-[#234638] rounded-lg"
                >
                  Register Hive Box
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
