export type UserRole = 'beekeeper' | 'processor' | 'buyer' | 'admin' | 'consumer';

export type ColonyStatus = 'healthy' | 'attention_needed' | 'critical' | 'dormant';
export type HiveType = 'Langstroth 10-Frame' | 'Langstroth 8-Frame' | 'Top Bar Hive' | 'Traditional Clay / Wall' | 'Warre Hive';

export interface Apiary {
  id: string;
  name: string;
  code: string;
  beekeeperName: string;
  cooperativeName: string;
  generalLocation: string; // Publicly safe general region, e.g. "Kangra Valley, Himachal Pradesh"
  district: string;
  state: string;
  coordinates: {
    lat: number;
    lng: number;
  }; // Kept private, not exposed on consumer QR pages
  hivesCount: number;
  registeredDate: string;
  primaryFlora: string[];
  notes?: string;
}

export interface Hive {
  id: string;
  code: string;
  apiaryId: string;
  apiaryName: string;
  hiveType: HiveType;
  colonyStatus: ColonyStatus;
  colonyEstablishedDate: string;
  sensorAvailable: boolean;
  sensorHardwareId?: string;
  lastInspectedDate: string;
  queenStatus: 'Marked & Active' | 'Unmarked' | 'Supersedure' | 'Re-queening Needed';
  combHealth: 'Full Brood' | 'Moderate Brood' | 'Honey Bound' | 'Pest Signs';
  notes: string;
  temperatureC: number;
  humidityPct: number;
  weightKg: number;
  acousticHz: number;
  lastMeasurementTimestamp: string;
}

export interface SensorReading {
  timestamp: string;
  temperatureC: number;
  humidityPct: number;
  weightKg: number;
  acousticHz: number;
  batteryPct: number;
  signalQuality: 'strong' | 'moderate' | 'weak';
}

export interface HiveAlert {
  id: string;
  hiveId: string;
  hiveCode: string;
  apiaryName: string;
  alertType: 'temperature_anomaly' | 'humidity_spike' | 'sudden_weight_drop' | 'inspection_overdue' | 'sensor_offline' | 'pest_swarming_risk';
  severity: 'high' | 'medium' | 'low';
  timestamp: string;
  reason: string;
  recommendedAction: string;
  status: 'active' | 'resolved';
}

export type TraceabilityEventType =
  | 'HARVEST_RECORDED'
  | 'EXTRACTION_RECORDED'
  | 'PROCESSING_COMPLETED'
  | 'QUALITY_ATTACHED'
  | 'PACKAGING_RECORDED'
  | 'TRANSFER_CUSTODY'
  | 'DISPATCH_RECORDED'
  | 'CORRECTION_RECORDED';

export interface TraceabilityEvent {
  eventId: string;
  batchId: string;
  sequenceNum: number;
  eventType: TraceabilityEventType;
  title: string;
  timestamp: string;
  actorName: string;
  actorRole: string;
  organization: string;
  location: string;
  details: Record<string, string | number | boolean>;
  prevHash: string;
  currentHash: string;
  isTampered?: boolean; // Used for interactive demo tamper simulation
}

export interface QualityRecord {
  id: string;
  batchId: string;
  testDate: string;
  labName: string;
  testMethod: string;
  reportNumber: string;
  moisturePercentage: number; // e.g. 17.4% (FSSAI standard max 20%)
  hmfMgKg: number; // Hydroxymethylfurfural (Freshness indicator, FSSAI max 80 mg/kg)
  sucrosePercentage: number; // FSSAI max 5%
  electricalConductivityMsCm: number;
  pollenAnalysis: string; // e.g., "Dominant Brassica campestris (Mustard) 78%"
  c3c4SugarAdulteration: 'Not Detected (Pure)' | 'Detected (Adulterated)' | 'Not Tested';
  verificationStatus: 'Accredited Lab Passed' | 'Field Refractometer' | 'Pending Verification';
  assessorNotes: string;
  reportUrl?: string;
}

export type BatchStatus = 'Draft' | 'Harvested' | 'Processed' | 'Lab Tested' | 'Packaged' | 'Dispatched' | 'Delivered';

export interface HoneyBatch {
  id: string; // Unique batch code, e.g. MM-2026-B108
  harvestDate: string;
  apiaryId: string;
  apiaryName: string;
  hiveIds: string[];
  beekeeperName: string;
  cooperativeName: string;
  honeyQuantityKg: number;
  floralSource: string; // e.g. "Wild Mustard Blossom", "Himalayan Acacia", "Kashmir White Clover"
  extractionDate: string;
  extractionMethod: 'Centrifugal Cold Extraction' | 'Traditional Manual Gravity Strain';
  processingDetails: string;
  storageConditions: string;
  packagingDate: string;
  packagedUnits: {
    jarSize: string; // "500g Glass Jar"
    totalUnits: number; // 240
    batchSealCode: string;
  };
  batchStatus: BatchStatus;
  qualityRecordIds: string[];
  blockchainRootHash: string;
  qrPayloadUrl: string;
  notes: string;
  isTampered?: boolean;
}

export interface MarketListing {
  id: string;
  batchId: string;
  producerName: string;
  cooperativeName: string;
  floralSource: string;
  quantityAvailableKg: number;
  minimumOrderKg: number;
  askingPriceInrPerKg: number;
  generalLocation: string;
  packagingFormat: string;
  traceabilityScore: 'Complete' | 'Partial';
  qualitySummary: string;
  listingStatus: 'Active' | 'Under Enquiry' | 'Sold';
  contactPhone: string;
  contactEmail: string;
  enquiries: Array<{
    id: string;
    buyerName: string;
    buyerOrg: string;
    buyerPhone: string;
    buyerEmail: string;
    quantityRequestedKg: number;
    message: string;
    date: string;
    status: 'Pending' | 'Contacted' | 'Accepted' | 'Declined';
  }>;
}

export interface SystemSettings {
  language: 'en' | 'hi' | 'bn' | 'mr';
  currentRole: UserRole;
  iotMode: 'demo' | 'connected';
  iotEndpointUrl: string;
  alertThresholds: {
    tempMinC: number;
    tempMaxC: number;
    humidityMaxPct: number;
    weightDropKgAlert: number;
  };
  enableAiAdvisor: boolean;
}
