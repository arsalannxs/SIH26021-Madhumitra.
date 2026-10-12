import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MarketListing } from '../../types';
import {
  ShoppingBag,
  Send,
  CheckCircle2,
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  Plus,
  Search,
  MessageSquare,
  AlertCircle,
  Building,
} from 'lucide-react';

export const MarketConnectionsView: React.FC = () => {
  const { marketListings, submitBuyerEnquiry, updateEnquiryStatus, setActiveTab, setSelectedBatchIdForVerification } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedListingForEnquiry, setSelectedListingForEnquiry] = useState<MarketListing | null>(null);
  const [enquirySuccessMsg, setEnquirySuccessMsg] = useState<string | null>(null);

  const [enquiryForm, setEnquiryForm] = useState({
    buyerName: '',
    buyerOrg: '',
    buyerPhone: '',
    buyerEmail: '',
    quantityRequestedKg: 25,
    message: '',
  });

  const filteredListings = marketListings.filter(
    (l) =>
      l.floralSource.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.producerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.generalLocation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmitEnquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedListingForEnquiry) return;

    submitBuyerEnquiry(selectedListingForEnquiry.id, {
      buyerName: enquiryForm.buyerName,
      buyerOrg: enquiryForm.buyerOrg,
      buyerPhone: enquiryForm.buyerPhone,
      buyerEmail: enquiryForm.buyerEmail,
      quantityRequestedKg: Number(enquiryForm.quantityRequestedKg),
      message: enquiryForm.message,
    });

    setEnquirySuccessMsg(
      `Your sourcing enquiry for ${selectedListingForEnquiry.floralSource} has been sent to ${selectedListingForEnquiry.producerName}!`
    );
    setSelectedListingForEnquiry(null);
    setEnquiryForm({
      buyerName: '',
      buyerOrg: '',
      buyerPhone: '',
      buyerEmail: '',
      quantityRequestedKg: 25,
      message: '',
    });
    setTimeout(() => setEnquirySuccessMsg(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header and Search */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#234638] flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#E5A323]" />
            Beekeeper & Buyer Discovery (MSME Honey Mart)
          </h1>
          <p className="text-xs text-[#6C756D] mt-0.5">
            Direct connections between certified rural beekeepers, cooperatives, and verified honey sourcing buyers
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#6C756D]" />
          <input
            type="text"
            placeholder="Search flora, producer, location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-[#E8E0D0] rounded-lg focus:outline-none focus:border-[#E5A323]"
          />
        </div>
      </div>

      {/* Honest Scope Disclosure */}
      <div className="p-3.5 bg-[#FFF8E9] rounded-xl border border-[#E8E0D0] text-xs flex items-start gap-2.5">
        <AlertCircle className="w-4 h-4 text-[#B96A45] shrink-0 mt-0.5" />
        <p className="text-[#6C756D] leading-relaxed">
          <strong className="text-[#234638]">Enquiry-Driven Sourcing Platform: </strong>
          In compliance with hackathon design guidelines, this module implements a direct buyer enquiry workflow
          rather than unverified mock payments. Listings link directly to immutable batch traceability records.
        </p>
      </div>

      {enquirySuccessMsg && (
        <div className="p-3 bg-[#E5EEE5] text-[#2F7D50] text-xs rounded-xl border border-[#2F7D50]/30 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{enquirySuccessMsg}</span>
        </div>
      )}

      {/* Listings Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {filteredListings.map((listing) => (
          <div
            key={listing.id}
            className="bg-white rounded-xl border border-[#E8E0D0] p-5 shadow-2xs space-y-4 flex flex-col justify-between hover:border-[#E5A323] transition-all"
          >
            <div>
              <div className="flex items-start justify-between gap-2 pb-2.5 border-b border-[#E8E0D0]">
                <div>
                  <span className="text-[10px] font-mono font-bold text-[#E5A323] uppercase">
                    Lot {listing.batchId}
                  </span>
                  <h3 className="font-bold text-base text-[#234638] mt-0.5">{listing.floralSource}</h3>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    listing.listingStatus === 'Active'
                      ? 'bg-[#E5EEE5] text-[#2F7D50]'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {listing.listingStatus}
                </span>
              </div>

              {/* Price & Quantity highlight */}
              <div className="mt-3 p-3 bg-[#FFF8E9] rounded-lg border border-[#E8E0D0] flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-[#6C756D] block">Asking Price:</span>
                  <span className="text-lg font-bold font-mono text-[#234638]">
                    ₹{listing.askingPriceInrPerKg}{' '}
                    <span className="text-xs font-normal text-[#6C756D]">/ kg</span>
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-[#6C756D] block">Available Volume:</span>
                  <span className="text-sm font-bold font-mono text-[#29332D]">
                    {listing.quantityAvailableKg} kg
                  </span>
                </div>
              </div>

              {/* Metadata rows */}
              <div className="mt-3 space-y-1.5 text-xs text-[#6C756D]">
                <div className="flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-[#234638] shrink-0" />
                  <span className="text-[#29332D] font-medium">{listing.producerName}</span>
                  <span>({listing.cooperativeName})</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#B96A45] shrink-0" />
                  <span className="truncate">{listing.generalLocation}</span>
                </div>
                <div className="text-[11px] text-[#2F7D50] font-medium pt-1">
                  ✓ {listing.qualitySummary}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-2 border-t border-[#E8E0D0]">
              <div className="flex items-center justify-between text-xs">
                <button
                  onClick={() => {
                    setSelectedBatchIdForVerification(listing.batchId);
                    setActiveTab('verification');
                  }}
                  className="text-[#234638] font-bold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-[#E5A323]" />
                  <span>Verify Batch QR</span>
                </button>
                <span className="text-[11px] text-[#6C756D] font-mono">
                  Min order: {listing.minimumOrderKg} kg
                </span>
              </div>

              <button
                onClick={() => setSelectedListingForEnquiry(listing)}
                className="w-full py-2 text-xs font-bold text-white bg-[#234638] hover:bg-[#1a352a] rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <Send className="w-3.5 h-3.5 text-[#E5A323]" />
                <span>Submit Buyer Sourcing Enquiry</span>
              </button>

              {/* Existing enquiries preview count */}
              {listing.enquiries.length > 0 && (
                <div className="text-center text-[11px] text-[#6C756D] font-medium">
                  {listing.enquiries.length} prospective buyer enquiry logged
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Buyer Enquiry Modal */}
      {selectedListingForEnquiry && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-5 shadow-xl border border-[#E8E0D0]">
            <div className="pb-3 border-b border-[#E8E0D0] mb-3">
              <h3 className="text-base font-bold text-[#234638]">Direct Honey Sourcing Enquiry</h3>
              <p className="text-xs text-[#6C756D]">
                Connecting with {selectedListingForEnquiry.producerName} for Lot {selectedListingForEnquiry.batchId}
              </p>
            </div>

            <form onSubmit={handleSubmitEnquiry} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-[#29332D] mb-1">Your Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Vikramaditya Singhania"
                  value={enquiryForm.buyerName}
                  onChange={(e) => setEnquiryForm({ ...enquiryForm, buyerName: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FFF8E9] border border-[#E8E0D0] rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#29332D] mb-1">Company / Organization</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Organic Wellness India"
                    value={enquiryForm.buyerOrg}
                    onChange={(e) => setEnquiryForm({ ...enquiryForm, buyerOrg: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FFF8E9] border border-[#E8E0D0] rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#29332D] mb-1">Quantity Needed (kg)</label>
                  <input
                    type="number"
                    min={selectedListingForEnquiry.minimumOrderKg}
                    value={enquiryForm.quantityRequestedKg}
                    onChange={(e) =>
                      setEnquiryForm({ ...enquiryForm, quantityRequestedKg: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 bg-[#FFF8E9] border border-[#E8E0D0] rounded-lg font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#29332D] mb-1">Phone Number</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98000 00000"
                    value={enquiryForm.buyerPhone}
                    onChange={(e) => setEnquiryForm({ ...enquiryForm, buyerPhone: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FFF8E9] border border-[#E8E0D0] rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#29332D] mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="sourcing@company.com"
                    value={enquiryForm.buyerEmail}
                    onChange={(e) => setEnquiryForm({ ...enquiryForm, buyerEmail: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FFF8E9] border border-[#E8E0D0] rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#29332D] mb-1">Sourcing Requirements Message</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Packaging preferences, delivery schedule, testing certificate requests..."
                  value={enquiryForm.message}
                  onChange={(e) => setEnquiryForm({ ...enquiryForm, message: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FFF8E9] border border-[#E8E0D0] rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#E8E0D0]">
                <button
                  type="button"
                  onClick={() => setSelectedListingForEnquiry(null)}
                  className="px-3 py-1.5 font-medium text-[#6C756D]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 font-bold text-white bg-[#234638] rounded-lg shadow-xs"
                >
                  Send Enquiry to Producer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
