import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Apiary,
  Hive,
  HoneyBatch,
  TraceabilityEvent,
  QualityRecord,
  MarketListing,
  HiveAlert,
  SystemSettings,
  UserRole,
} from '../types';
import {
  createInitialDemoData,
  loadFromStorage,
  saveToStorage,
  DEFAULT_SETTINGS,
} from '../services/store';
import {
  verifyTraceabilityChain,
  IntegrityVerificationResult,
  createTraceabilityEvent,
} from '../services/blockchain';
import { translations, SupportedLanguage } from '../services/i18n';

interface AppContextType {
  apiaries: Apiary[];
  hives: Hive[];
  batches: HoneyBatch[];
  events: TraceabilityEvent[];
  qualityRecords: QualityRecord[];
  marketListings: MarketListing[];
  alerts: HiveAlert[];
  settings: SystemSettings;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedBatchIdForVerification: string | null;
  setSelectedBatchIdForVerification: (batchId: string | null) => void;

  // Language & Role
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  t: (key: keyof typeof translations['en']) => string;

  // Demo operations
  loadDemoData: () => Promise<void>;
  resetDemoData: () => void;

  // CRUD
  addApiary: (apiary: Omit<Apiary, 'id'>) => void;
  updateApiary: (id: string, apiary: Partial<Apiary>) => void;
  deleteApiary: (id: string) => void;

  addHive: (hive: Omit<Hive, 'id'>) => void;
  updateHive: (id: string, hive: Partial<Hive>) => void;
  deleteHive: (id: string) => void;

  createNewBatch: (data: {
    batch: Omit<HoneyBatch, 'id' | 'blockchainRootHash' | 'qrPayloadUrl'>;
    events: TraceabilityEvent[];
    qualityRecord?: Omit<QualityRecord, 'id' | 'batchId'>;
  }) => Promise<string>;

  updateBatchStatus: (batchId: string, status: HoneyBatch['batchStatus']) => void;
  addEventToBatch: (batchId: string, eventData: Omit<TraceabilityEvent, 'eventId' | 'sequenceNum' | 'prevHash' | 'currentHash'>) => Promise<TraceabilityEvent>;

  addQualityRecord: (record: Omit<QualityRecord, 'id'>) => void;
  addMarketListing: (listing: Omit<MarketListing, 'id' | 'enquiries'>) => void;
  submitBuyerEnquiry: (listingId: string, enquiry: {
    buyerName: string;
    buyerOrg: string;
    buyerPhone: string;
    buyerEmail: string;
    quantityRequestedKg: number;
    message: string;
  }) => void;
  updateEnquiryStatus: (listingId: string, enquiryId: string, status: 'Pending' | 'Contacted' | 'Accepted' | 'Declined') => void;

  resolveAlert: (alertId: string) => void;
  updateSettings: (newSettings: Partial<SystemSettings>) => void;

  // Blockchain Ledger Integrity & Hackathon Tamper Demonstrator
  verifyBatchChain: (batchId: string) => Promise<IntegrityVerificationResult>;
  simulateTamperEvent: (eventId: string, modifiedField: string, maliciousValue: string | number) => void;
  restoreOriginalChain: (batchId: string) => Promise<void>;
  appendCorrectionBlock: (
    batchId: string,
    correctedField: string,
    oldValue: string,
    newValue: string,
    reason: string
  ) => Promise<TraceabilityEvent>;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [apiaries, setApiaries] = useState<Apiary[]>([]);
  const [hives, setHives] = useState<Hive[]>([]);
  const [batches, setBatches] = useState<HoneyBatch[]>([]);
  const [events, setEvents] = useState<TraceabilityEvent[]>([]);
  const [qualityRecords, setQualityRecords] = useState<QualityRecord[]>([]);
  const [marketListings, setMarketListings] = useState<MarketListing[]>([]);
  const [alerts, setAlerts] = useState<HiveAlert[]>([]);
  const [settings, setSettings] = useState<SystemSettings>(DEFAULT_SETTINGS);
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [selectedBatchIdForVerification, setSelectedBatchIdForVerification] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize data on mount
  useEffect(() => {
    async function init() {
      const storedApiaries = loadFromStorage<Apiary[]>('madhumitra_apiaries_v1', []);
      const storedBatches = loadFromStorage<HoneyBatch[]>('madhumitra_batches_v1', []);
      const storedSettings = loadFromStorage<SystemSettings>('madhumitra_settings_v1', DEFAULT_SETTINGS);

      if (storedApiaries.length === 0 || storedBatches.length === 0) {
        // Seed default demo data
        const initial = await createInitialDemoData();
        setApiaries(initial.apiaries);
        setHives(initial.hives);
        setBatches(initial.batches);
        setEvents(initial.events);
        setQualityRecords(initial.quality);
        setMarketListings(initial.market);
        setAlerts(initial.alerts);
        setSettings(storedSettings);

        saveToStorage('madhumitra_apiaries_v1', initial.apiaries);
        saveToStorage('madhumitra_hives_v1', initial.hives);
        saveToStorage('madhumitra_batches_v1', initial.batches);
        saveToStorage('madhumitra_events_v1', initial.events);
        saveToStorage('madhumitra_quality_v1', initial.quality);
        saveToStorage('madhumitra_market_v1', initial.market);
        saveToStorage('madhumitra_alerts_v1', initial.alerts);
      } else {
        setApiaries(storedApiaries);
        setHives(loadFromStorage<Hive[]>('madhumitra_hives_v1', []));
        setBatches(storedBatches);
        setEvents(loadFromStorage<TraceabilityEvent[]>('madhumitra_events_v1', []));
        setQualityRecords(loadFromStorage<QualityRecord[]>('madhumitra_quality_v1', []));
        setMarketListings(loadFromStorage<MarketListing[]>('madhumitra_market_v1', []));
        setAlerts(loadFromStorage<HiveAlert[]>('madhumitra_alerts_v1', []));
        setSettings(storedSettings);
      }
      setIsInitialized(true);
    }
    init();
  }, []);

  // Save changes when state updates
  useEffect(() => {
    if (!isInitialized) return;
    saveToStorage('madhumitra_apiaries_v1', apiaries);
  }, [apiaries, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;
    saveToStorage('madhumitra_hives_v1', hives);
  }, [hives, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;
    saveToStorage('madhumitra_batches_v1', batches);
  }, [batches, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;
    saveToStorage('madhumitra_events_v1', events);
  }, [events, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;
    saveToStorage('madhumitra_quality_v1', qualityRecords);
  }, [qualityRecords, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;
    saveToStorage('madhumitra_market_v1', marketListings);
  }, [marketListings, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;
    saveToStorage('madhumitra_alerts_v1', alerts);
  }, [alerts, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;
    saveToStorage('madhumitra_settings_v1', settings);
  }, [settings, isInitialized]);

  // Load demo data
  const loadDemoData = async () => {
    const initial = await createInitialDemoData();
    setApiaries(initial.apiaries);
    setHives(initial.hives);
    setBatches(initial.batches);
    setEvents(initial.events);
    setQualityRecords(initial.quality);
    setMarketListings(initial.market);
    setAlerts(initial.alerts);
  };

  // Reset demo data
  const resetDemoData = () => {
    localStorage.clear();
    loadDemoData();
  };

  // Language & Role
  const language = settings.language;
  const setLanguage = (lang: SupportedLanguage) => {
    setSettings((prev) => ({ ...prev, language: lang }));
  };

  const currentRole = settings.currentRole;
  const setCurrentRole = (role: UserRole) => {
    setSettings((prev) => ({ ...prev, currentRole: role }));
  };

  const t = (key: keyof typeof translations['en']): string => {
    const dict = translations[language] || translations.en;
    return dict[key] || translations.en[key] || (key as string);
  };

  // CRUD for Apiaries
  const addApiary = (apiary: Omit<Apiary, 'id'>) => {
    const id = `API-00${apiaries.length + 1}`;
    const newApiary: Apiary = { ...apiary, id };
    setApiaries((prev) => [newApiary, ...prev]);
  };

  const updateApiary = (id: string, updated: Partial<Apiary>) => {
    setApiaries((prev) => prev.map((a) => (a.id === id ? { ...a, ...updated } : a)));
  };

  const deleteApiary = (id: string) => {
    setApiaries((prev) => prev.filter((a) => a.id !== id));
  };

  // CRUD for Hives
  const addHive = (hive: Omit<Hive, 'id'>) => {
    const id = `HIVE-${Date.now().toString().slice(-4)}`;
    const newHive: Hive = { ...hive, id };
    setHives((prev) => [newHive, ...prev]);
    // update hivesCount in apiary
    setApiaries((prev) =>
      prev.map((a) => (a.id === hive.apiaryId ? { ...a, hivesCount: a.hivesCount + 1 } : a))
    );
  };

  const updateHive = (id: string, updated: Partial<Hive>) => {
    setHives((prev) => prev.map((h) => (h.id === id ? { ...h, ...updated } : h)));
  };

  const deleteHive = (id: string) => {
    const target = hives.find((h) => h.id === id);
    if (target) {
      setApiaries((prev) =>
        prev.map((a) =>
          a.id === target.apiaryId ? { ...a, hivesCount: Math.max(0, a.hivesCount - 1) } : a
        )
      );
    }
    setHives((prev) => prev.filter((h) => h.id !== id));
  };

  // Batch creation workflow
  const createNewBatch = async (data: {
    batch: Omit<HoneyBatch, 'id' | 'blockchainRootHash' | 'qrPayloadUrl'>;
    events: TraceabilityEvent[];
    qualityRecord?: Omit<QualityRecord, 'id' | 'batchId'>;
  }): Promise<string> => {
    const batchId = `MM-2026-B${108 + batches.length + 1}`;
    const qualityRecordIds: string[] = [];

    if (data.qualityRecord) {
      const qId = `QR-2026-${String(80 + qualityRecords.length + 1).padStart(3, '0')}`;
      const newQR: QualityRecord = {
        ...data.qualityRecord,
        id: qId,
        batchId,
      };
      setQualityRecords((prev) => [newQR, ...prev]);
      qualityRecordIds.push(qId);
    }

    // Set batch IDs on events and verify hash linkage
    const preparedEvents = data.events.map((e) => ({ ...e, batchId }));
    const rootHash = preparedEvents.length > 0 ? preparedEvents[preparedEvents.length - 1].currentHash : 'GENESIS';

    const newBatch: HoneyBatch = {
      ...data.batch,
      id: batchId,
      qualityRecordIds,
      blockchainRootHash: rootHash,
      qrPayloadUrl: `${window.location.origin}/#verify/${batchId}`,
    };

    setBatches((prev) => [newBatch, ...prev]);
    setEvents((prev) => [...prev, ...preparedEvents]);

    return batchId;
  };

  const updateBatchStatus = (batchId: string, status: HoneyBatch['batchStatus']) => {
    setBatches((prev) => prev.map((b) => (b.id === batchId ? { ...b, batchStatus: status } : b)));
  };

  const addEventToBatch = async (
    batchId: string,
    eventData: Omit<TraceabilityEvent, 'eventId' | 'sequenceNum' | 'prevHash' | 'currentHash'>
  ): Promise<TraceabilityEvent> => {
    const batchEvents = events.filter((e) => e.batchId === batchId).sort((a, b) => a.sequenceNum - b.sequenceNum);
    const lastEvent = batchEvents[batchEvents.length - 1];
    const prevHash = lastEvent ? lastEvent.currentHash : '0000000000000000000000000000000000000000000000000000000000000000';
    const sequenceNum = batchEvents.length + 1;

    const newEvent = await createTraceabilityEvent({
      batchId,
      sequenceNum,
      eventType: eventData.eventType,
      title: eventData.title,
      actorName: eventData.actorName,
      actorRole: eventData.actorRole,
      organization: eventData.organization,
      location: eventData.location,
      details: eventData.details,
      prevHash,
    });

    setEvents((prev) => [...prev, newEvent]);
    setBatches((prev) =>
      prev.map((b) => (b.id === batchId ? { ...b, blockchainRootHash: newEvent.currentHash } : b))
    );

    return newEvent;
  };

  const addQualityRecord = (record: Omit<QualityRecord, 'id'>) => {
    const id = `QR-2026-${String(85 + qualityRecords.length).padStart(3, '0')}`;
    const newQR: QualityRecord = { ...record, id };
    setQualityRecords((prev) => [newQR, ...prev]);

    // link to batch if present
    setBatches((prev) =>
      prev.map((b) =>
        b.id === record.batchId
          ? {
              ...b,
              qualityRecordIds: [...b.qualityRecordIds, id],
              batchStatus: b.batchStatus === 'Harvested' ? 'Lab Tested' : b.batchStatus,
            }
          : b
      )
    );
  };

  const addMarketListing = (listing: Omit<MarketListing, 'id' | 'enquiries'>) => {
    const id = `MKT-${String(marketListings.length + 1).padStart(3, '0')}`;
    const newListing: MarketListing = { ...listing, id, enquiries: [] };
    setMarketListings((prev) => [newListing, ...prev]);
  };

  const submitBuyerEnquiry = (
    listingId: string,
    enquiryData: {
      buyerName: string;
      buyerOrg: string;
      buyerPhone: string;
      buyerEmail: string;
      quantityRequestedKg: number;
      message: string;
    }
  ) => {
    const newEnquiry = {
      id: `ENQ-${Date.now().toString(36).toUpperCase()}`,
      ...enquiryData,
      date: new Date().toISOString().split('T')[0],
      status: 'Pending' as const,
    };

    setMarketListings((prev) =>
      prev.map((m) =>
        m.id === listingId ? { ...m, enquiries: [newEnquiry, ...m.enquiries] } : m
      )
    );
  };

  const updateEnquiryStatus = (
    listingId: string,
    enquiryId: string,
    status: 'Pending' | 'Contacted' | 'Accepted' | 'Declined'
  ) => {
    setMarketListings((prev) =>
      prev.map((m) =>
        m.id === listingId
          ? {
              ...m,
              enquiries: m.enquiries.map((e) => (e.id === enquiryId ? { ...e, status } : e)),
            }
          : m
      )
    );
  };

  const resolveAlert = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, status: 'resolved' } : a))
    );
  };

  const updateSettings = (newSettings: Partial<SystemSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  // Blockchain Ledger Integrity Check
  const verifyBatchChain = async (batchId: string): Promise<IntegrityVerificationResult> => {
    const batchEvents = events
      .filter((e) => e.batchId === batchId)
      .sort((a, b) => a.sequenceNum - b.sequenceNum);
    return verifyTraceabilityChain(batchEvents);
  };

  // Simulate malicious ledger tampering for Hackathon judges demo
  const simulateTamperEvent = (
    eventId: string,
    modifiedField: string,
    maliciousValue: string | number
  ) => {
    setEvents((prev) =>
      prev.map((evt) => {
        if (evt.eventId === eventId) {
          return {
            ...evt,
            details: {
              ...evt.details,
              [modifiedField]: maliciousValue,
            },
            isTampered: true,
          };
        }
        return evt;
      })
    );
  };

  // Restore the original verified hash states from seed
  const restoreOriginalChain = async (batchId: string) => {
    const initial = await createInitialDemoData();
    const cleanEvents = initial.events.filter((e) => e.batchId === batchId);
    if (cleanEvents.length > 0) {
      setEvents((prev) => {
        const otherEvents = prev.filter((e) => e.batchId !== batchId);
        return [...otherEvents, ...cleanEvents];
      });
    }
  };

  // Append honest correction block (Blockchain best practice)
  const appendCorrectionBlock = async (
    batchId: string,
    correctedField: string,
    oldValue: string,
    newValue: string,
    reason: string
  ): Promise<TraceabilityEvent> => {
    const batchEvents = events
      .filter((e) => e.batchId === batchId)
      .sort((a, b) => a.sequenceNum - b.sequenceNum);
    const lastEvent = batchEvents[batchEvents.length - 1];
    const prevHash = lastEvent ? lastEvent.currentHash : '0000000000000000000000000000000000000000000000000000000000000000';
    const sequenceNum = batchEvents.length + 1;

    const correctionEvent = await createTraceabilityEvent({
      batchId,
      sequenceNum,
      eventType: 'CORRECTION_RECORDED',
      title: `Audit Ledger Amendment: ${correctedField} Corrected`,
      actorName: 'Audit & Compliance Officer',
      actorRole: 'MSME Regulatory Officer',
      organization: 'Khadi & Village Industries Commission (KVIC)',
      location: 'Regional Compliance Office',
      details: {
        fieldCorrected: correctedField,
        previousRecordedValue: oldValue,
        amendedAccurateValue: newValue,
        amendmentReason: reason,
        correctionTimestamp: new Date().toISOString(),
        auditedBy: 'National Honey Board Standards Cell',
      },
      prevHash,
    });

    setEvents((prev) => [...prev, correctionEvent]);
    setBatches((prev) =>
      prev.map((b) => (b.id === batchId ? { ...b, blockchainRootHash: correctionEvent.currentHash } : b))
    );

    return correctionEvent;
  };

  return (
    <AppContext.Provider
      value={{
        apiaries,
        hives,
        batches,
        events,
        qualityRecords,
        marketListings,
        alerts,
        settings,
        activeTab,
        setActiveTab,
        selectedBatchIdForVerification,
        setSelectedBatchIdForVerification,
        language,
        setLanguage,
        currentRole,
        setCurrentRole,
        t,
        loadDemoData,
        resetDemoData,
        addApiary,
        updateApiary,
        deleteApiary,
        addHive,
        updateHive,
        deleteHive,
        createNewBatch,
        updateBatchStatus,
        addEventToBatch,
        addQualityRecord,
        addMarketListing,
        submitBuyerEnquiry,
        updateEnquiryStatus,
        resolveAlert,
        updateSettings,
        verifyBatchChain,
        simulateTamperEvent,
        restoreOriginalChain,
        appendCorrectionBlock,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
