import {
  Apiary,
  Hive,
  HoneyBatch,
  TraceabilityEvent,
  QualityRecord,
  MarketListing,
  HiveAlert,
  SystemSettings,
  SensorReading,
} from '../types';
import { GENESIS_HASH, createTraceabilityEvent } from './blockchain';

const STORAGE_KEYS = {
  APIARIES: 'madhumitra_apiaries_v1',
  HIVES: 'madhumitra_hives_v1',
  BATCHES: 'madhumitra_batches_v1',
  EVENTS: 'madhumitra_events_v1',
  QUALITY: 'madhumitra_quality_v1',
  MARKET: 'madhumitra_market_v1',
  ALERTS: 'madhumitra_alerts_v1',
  SETTINGS: 'madhumitra_settings_v1',
  SENSOR_HISTORY: 'madhumitra_sensors_v1',
};

export const DEFAULT_SETTINGS: SystemSettings = {
  language: 'en',
  currentRole: 'beekeeper',
  iotMode: 'demo',
  iotEndpointUrl: 'https://api.madhumitra.gov.in/v1/sensors/ingest',
  alertThresholds: {
    tempMinC: 32.0,
    tempMaxC: 36.0,
    humidityMaxPct: 65.0,
    weightDropKgAlert: 1.5,
  },
  enableAiAdvisor: true,
};

// Generate 24 hours of realistic telemetry for a hive
export function generate24HourTelemetry(baseTemp = 34.5, baseHum = 56, baseWeight = 28.0): SensorReading[] {
  const readings: SensorReading[] = [];
  const now = Date.now();
  for (let i = 24; i >= 0; i--) {
    const timestamp = new Date(now - i * 3600 * 1000).toISOString();
    // Diurnal variation: warmer in afternoon, cooler at night
    const hour = new Date(timestamp).getHours();
    const diurnalFactor = Math.sin(((hour - 6) / 24) * 2 * Math.PI);
    const temp = Number((baseTemp + diurnalFactor * 1.8 + (Math.random() * 0.4 - 0.2)).toFixed(1));
    const hum = Number((baseHum - diurnalFactor * 5 + (Math.random() * 1.5 - 0.7)).toFixed(1));
    const weight = Number((baseWeight + (hour > 10 && hour < 17 ? 0.3 : 0) + (Math.random() * 0.05)).toFixed(2));
    const acoustic = Math.round(200 + Math.random() * 35 + (diurnalFactor > 0 ? 30 : 0));
    const battery = Math.max(20, Math.min(100, Math.round(92 - i * 0.2)));

    readings.push({
      timestamp,
      temperatureC: temp,
      humidityPct: hum,
      weightKg: weight,
      acousticHz: acoustic,
      batteryPct: battery,
      signalQuality: 'strong',
    });
  }
  return readings;
}

export async function createInitialDemoData(): Promise<{
  apiaries: Apiary[];
  hives: Hive[];
  batches: HoneyBatch[];
  events: TraceabilityEvent[];
  quality: QualityRecord[];
  market: MarketListing[];
  alerts: HiveAlert[];
}> {
  // 1. Apiaries
  const apiaries: Apiary[] = [
    {
      id: 'API-001',
      code: 'HP-KNG-01',
      name: 'Shivalik Wilds Apiary',
      beekeeperName: 'Rameshwar Sharma',
      cooperativeName: 'Pahadi Madhu Utpadak Sahakari',
      generalLocation: 'Kangra Valley Foothills, Himachal Pradesh',
      district: 'Kangra',
      state: 'Himachal Pradesh',
      coordinates: { lat: 32.0998, lng: 76.2691 },
      hivesCount: 18,
      registeredDate: '2024-03-15',
      primaryFlora: ['Wild Mustard', 'Himalayan Acacia (Khair)', 'Blackberry'],
      notes: 'Organic certified forest edge cluster with natural spring water forage.',
    },
    {
      id: 'API-002',
      code: 'WB-SDN-04',
      name: 'Sundarbans Mangrove Fringe Apiary',
      beekeeperName: 'Tapan Mondal',
      cooperativeName: 'Sundarbans Mouli Honey Federation',
      generalLocation: 'Gosaba & Kultali Buffer Zone, West Bengal',
      district: 'South 24 Parganas',
      state: 'West Bengal',
      coordinates: { lat: 22.1287, lng: 88.8519 },
      hivesCount: 14,
      registeredDate: '2024-08-20',
      primaryFlora: ['Khalsi (Aegiceras)', 'Bain', 'Gewa Mangrove'],
      notes: 'Deep saline delta buffer zone honey, harvested with traditional sustainable smokers.',
    },
    {
      id: 'API-003',
      code: 'PB-HSH-02',
      name: 'Doaba Mustard Agricultural Belt',
      beekeeperName: 'Gurpreet Singh Gill',
      cooperativeName: 'Doaba Bee Farmers Welfare Trust',
      generalLocation: 'Dasuya Tehsil, Hoshiarpur, Punjab',
      district: 'Hoshiarpur',
      state: 'Punjab',
      coordinates: { lat: 31.5273, lng: 75.9142 },
      hivesCount: 24,
      registeredDate: '2023-11-10',
      primaryFlora: ['Brassica Yellow Mustard', 'Berseem Clover', 'Eucalyptus'],
      notes: 'High-density winter flowering crop apiary with automated solar telemetry boxes.',
    },
  ];

  // 2. Hives
  const hives: Hive[] = [
    {
      id: 'HIVE-101',
      code: 'SHV-BOX-01',
      apiaryId: 'API-001',
      apiaryName: 'Shivalik Wilds Apiary',
      hiveType: 'Langstroth 10-Frame',
      colonyStatus: 'healthy',
      colonyEstablishedDate: '2024-04-01',
      sensorAvailable: true,
      sensorHardwareId: 'IOT-ESP32-9481',
      lastInspectedDate: '2026-10-09',
      queenStatus: 'Marked & Active',
      combHealth: 'Full Brood',
      notes: 'Vigorous Apis cerana / mellifera cross colony, excellent comb drawing pace.',
      temperatureC: 34.6,
      humidityPct: 58.2,
      weightKg: 28.4,
      acousticHz: 215,
      lastMeasurementTimestamp: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
    },
    {
      id: 'HIVE-102',
      code: 'SHV-BOX-02',
      apiaryId: 'API-001',
      apiaryName: 'Shivalik Wilds Apiary',
      hiveType: 'Langstroth 10-Frame',
      colonyStatus: 'attention_needed',
      colonyEstablishedDate: '2024-04-10',
      sensorAvailable: true,
      sensorHardwareId: 'IOT-ESP32-9482',
      lastInspectedDate: '2026-10-06',
      queenStatus: 'Marked & Active',
      combHealth: 'Moderate Brood',
      notes: 'Direct afternoon sunlight causing internal heat spikes. Added natural bamboo shade cover.',
      temperatureC: 37.8, // Alert threshold > 36.0°C
      humidityPct: 63.4,
      weightKg: 26.1,
      acousticHz: 265,
      lastMeasurementTimestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    },
    {
      id: 'HIVE-103',
      code: 'SHV-BOX-03',
      apiaryId: 'API-001',
      apiaryName: 'Shivalik Wilds Apiary',
      hiveType: 'Langstroth 8-Frame',
      colonyStatus: 'attention_needed',
      colonyEstablishedDate: '2024-05-15',
      sensorAvailable: true,
      sensorHardwareId: 'IOT-ESP32-9483',
      lastInspectedDate: '2026-10-04',
      queenStatus: 'Supersedure',
      combHealth: 'Moderate Brood',
      notes: 'Weight dropped 2.2 kg over 8 hours! Swarming risk alert flagged.',
      temperatureC: 33.4,
      humidityPct: 56.1,
      weightKg: 21.3,
      acousticHz: 290, // Higher frequency agitation
      lastMeasurementTimestamp: new Date(Date.now() - 18 * 60 * 1000).toISOString(),
    },
    {
      id: 'HIVE-201',
      code: 'SND-BOX-01',
      apiaryId: 'API-002',
      apiaryName: 'Sundarbans Mangrove Fringe Apiary',
      hiveType: 'Traditional Clay / Wall',
      colonyStatus: 'healthy',
      colonyEstablishedDate: '2024-09-02',
      sensorAvailable: true,
      sensorHardwareId: 'IOT-ESP32-8810',
      lastInspectedDate: '2026-10-02',
      queenStatus: 'Unmarked',
      combHealth: 'Full Brood',
      notes: 'Native Apis dorsata / cerana indigenous management; mangrove pollen nectar flow high.',
      temperatureC: 32.8,
      humidityPct: 71.0,
      weightKg: 24.5,
      acousticHz: 198,
      lastMeasurementTimestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    },
    {
      id: 'HIVE-301',
      code: 'DOA-BOX-01',
      apiaryId: 'API-003',
      apiaryName: 'Doaba Mustard Agricultural Belt',
      hiveType: 'Langstroth 10-Frame',
      colonyStatus: 'healthy',
      colonyEstablishedDate: '2024-01-20',
      sensorAvailable: true,
      sensorHardwareId: 'IOT-ESP32-7201',
      lastInspectedDate: '2026-10-10',
      queenStatus: 'Marked & Active',
      combHealth: 'Full Brood',
      notes: 'Yellow mustard harvest ready. Moisture level in capped comb tested at 17%.',
      temperatureC: 34.2,
      humidityPct: 51.5,
      weightKg: 32.4,
      acousticHz: 205,
      lastMeasurementTimestamp: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
    },
  ];

  // 3. Alerts
  const alerts: HiveAlert[] = [
    {
      id: 'ALT-102',
      hiveId: 'HIVE-102',
      hiveCode: 'SHV-BOX-02',
      apiaryName: 'Shivalik Wilds Apiary',
      alertType: 'temperature_anomaly',
      severity: 'high',
      timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
      reason: 'Core brood box temperature exceeded safe threshold (measured 37.8°C > limit 36.0°C).',
      recommendedAction: 'Inspect top ventilation entrance, verify hive shade cover, and check water foraging source availability.',
      status: 'active',
    },
    {
      id: 'ALT-103',
      hiveId: 'HIVE-103',
      hiveCode: 'SHV-BOX-03',
      apiaryName: 'Shivalik Wilds Apiary',
      alertType: 'sudden_weight_drop',
      severity: 'high',
      timestamp: new Date(Date.now() - 140 * 60 * 1000).toISOString(),
      reason: 'Sudden colony weight drop of 2.2 kg detected alongside increased acoustic frequency (290 Hz).',
      recommendedAction: 'Immediate visual check for swarming departure or robbing by neighbouring wasps or bees. Check for queen cells.',
      status: 'active',
    },
    {
      id: 'ALT-201',
      hiveId: 'HIVE-201',
      hiveCode: 'SND-BOX-01',
      apiaryName: 'Sundarbans Mangrove Fringe Apiary',
      alertType: 'humidity_spike',
      severity: 'medium',
      timestamp: new Date(Date.now() - 320 * 60 * 1000).toISOString(),
      reason: 'Internal humidity maintained above 70% for 18 consecutive hours.',
      recommendedAction: 'Ensure bottom board clearance and tilt hive slightly forward to prevent rainwater condensation ingress.',
      status: 'active',
    },
  ];

  // 4. Quality Records
  const quality: QualityRecord[] = [
    {
      id: 'QR-2026-081',
      batchId: 'MM-2026-B108',
      testDate: '2026-09-28',
      labName: 'National Dairy Development Board (NDDB) Honey Quality Centre',
      testMethod: 'AOAC 969.38 Refractometry & HPLC Analysis',
      reportNumber: 'NDDB/CAL/HONEY/2026/8941',
      moisturePercentage: 17.2, // FSSAI Max 20.0%
      hmfMgKg: 11.4, // FSSAI Max 80 mg/kg
      sucrosePercentage: 2.1, // FSSAI Max 5.0%
      electricalConductivityMsCm: 0.38,
      pollenAnalysis: 'Authentic Brassica campestris (Mustard) dominant 82%, Himalayan Acacia 12%',
      c3c4SugarAdulteration: 'Not Detected (Pure)',
      verificationStatus: 'Accredited Lab Passed',
      assessorNotes: 'Batch complies fully with Food Safety and Standards (Food Products Standards and Food Additives) Regulations for Raw Natural Honey.',
      reportUrl: 'https://nddb.coop/reports/NDDB-CAL-2026-8941.pdf',
    },
    {
      id: 'QR-2026-082',
      batchId: 'MM-2026-B109',
      testDate: '2026-10-04',
      labName: 'West Bengal State Agricultural Testing Directorate',
      testMethod: 'FSSAI Manual of Methods of Analysis of Foods',
      reportNumber: 'WB/AGR/LAB/2026/104',
      moisturePercentage: 18.6,
      hmfMgKg: 16.5,
      sucrosePercentage: 3.4,
      electricalConductivityMsCm: 0.65,
      pollenAnalysis: 'Wild Aegiceras corniculatum (Khalsi) 74%, Avicennia (Bain) 18%',
      c3c4SugarAdulteration: 'Not Detected (Pure)',
      verificationStatus: 'Accredited Lab Passed',
      assessorNotes: 'Characteristic light amber colour, distinct floral aroma, within standard delta moisture parameters.',
      reportUrl: 'https://wb.gov.in/lab/WB-AGR-2026-104.pdf',
    },
  ];

  // 5. Blockchain Traceability Events for Batch MM-2026-B108
  const batchId = 'MM-2026-B108';
  const events: TraceabilityEvent[] = [];

  // Block #1: HARVEST_RECORDED
  const evt1 = await createTraceabilityEvent({
    batchId,
    sequenceNum: 1,
    eventType: 'HARVEST_RECORDED',
    title: 'Sunrise Honey Frame Harvest & Weigh-in',
    actorName: 'Rameshwar Sharma',
    actorRole: 'Certified Beekeeper (Reg: KVIC-HP-2021)',
    organization: 'Pahadi Madhu Utpadak Sahakari',
    location: 'Shivalik Wilds Apiary, Kangra, HP',
    details: {
      harvestQuantityKg: 120,
      sourceHives: 'SHV-BOX-01, SHV-BOX-04, SHV-BOX-05',
      floralDominance: 'Wild Mustard Blossom',
      combCappingPct: 88,
      weatherConditions: 'Sunny, 24°C, 48% RH',
    },
    prevHash: GENESIS_HASH,
    customTimestamp: '2026-09-22T07:30:00.000Z',
  });
  events.push(evt1);

  // Block #2: EXTRACTION_RECORDED
  const evt2 = await createTraceabilityEvent({
    batchId,
    sequenceNum: 2,
    eventType: 'EXTRACTION_RECORDED',
    title: 'Cold Centrifugal Extraction in SS Vessel',
    actorName: 'Sunita Devi',
    actorRole: 'Cooperative Extraction Supervisor',
    organization: 'Pahadi Madhu Processing Cluster',
    location: 'Kotla Rural Cluster Unit, Kangra',
    details: {
      extractedVolumeKg: 118.5,
      extractionTechnique: 'Centrifugal Cold Extraction',
      uncappingMethod: 'Electric Hot Knife (42°C maximum)',
      tankMaterial: 'SS-304 Food Grade Sanitized Drum',
    },
    prevHash: evt1.currentHash,
    customTimestamp: '2026-09-23T11:15:00.000Z',
  });
  events.push(evt2);

  // Block #3: PROCESSING_COMPLETED
  const evt3 = await createTraceabilityEvent({
    batchId,
    sequenceNum: 3,
    eventType: 'PROCESSING_COMPLETED',
    title: 'Micro-Filtration & Gravity Settling (Raw Unpasteurized)',
    actorName: 'Harish Chander',
    actorRole: 'Quality & Processing Manager',
    organization: 'Pahadi Madhu Processing Cluster',
    location: 'Kotla Rural Cluster Unit, Kangra',
    details: {
      filterMeshSize: '80 Mesh Food-Grade Stainless Strainer',
      pasteurizationApplied: false,
      heatingTemperatureC: 0,
      settlingHours: 48,
      waxParticlesRemoved: true,
      naturalPollenPreserved: true,
    },
    prevHash: evt2.currentHash,
    customTimestamp: '2026-09-25T14:00:00.000Z',
  });
  events.push(evt3);

  // Block #4: QUALITY_ATTACHED
  const evt4 = await createTraceabilityEvent({
    batchId,
    sequenceNum: 4,
    eventType: 'QUALITY_ATTACHED',
    title: 'FSSAI Accredited Laboratory Quality Certificate Verification',
    actorName: 'Dr. Anand Verma',
    actorRole: 'Senior Analytical Chemist',
    organization: 'NDDB Honey Quality Centre of Excellence',
    location: 'Anand Testing Facility (NABL Accredited)',
    details: {
      moisturePercentage: 17.2,
      fssaiMoistureLimit: 'Max 20.0%',
      hmfValueMgKg: 11.4,
      sucrosePct: 2.1,
      c3c4Adulterants: 'Not Detected (Pure)',
      reportId: 'NDDB/CAL/HONEY/2026/8941',
      certificatePassed: true,
    },
    prevHash: evt3.currentHash,
    customTimestamp: '2026-09-28T16:45:00.000Z',
  });
  events.push(evt4);

  // Block #5: PACKAGING_RECORDED
  const evt5 = await createTraceabilityEvent({
    batchId,
    sequenceNum: 5,
    eventType: 'PACKAGING_RECORDED',
    title: 'Jar Bottling, Tamper-Evident Foil & QR Label Application',
    actorName: 'Priya Sharma',
    actorRole: 'Packaging Line Lead',
    organization: 'Pahadi Madhu Bottling Facility',
    location: 'Kangra MSME Khadi Kendra',
    details: {
      jarSpecification: '500g Food-Grade Hexagonal Flint Glass',
      totalUnitsSealed: 236,
      sealType: 'Induction Heat Foil + Tamper Tear Strip',
      lotCode: 'LOT-2026-MM108',
      qrSerialRange: 'QR-MM108-001 to QR-MM108-236',
    },
    prevHash: evt4.currentHash,
    customTimestamp: '2026-09-30T10:20:00.000Z',
  });
  events.push(evt5);

  // Block #6: DISPATCH_RECORDED
  const evt6 = await createTraceabilityEvent({
    batchId,
    sequenceNum: 6,
    eventType: 'DISPATCH_RECORDED',
    title: 'Consignment Handover to State Khadi Emporium Hub',
    actorName: 'Mohan Lal Negi',
    actorRole: 'Logistics Coordinator',
    organization: 'HP State Co-operative Marketing Federation (HIMFED)',
    location: 'Shimla Distribution Central Depot',
    details: {
      transportVehicle: 'HP-68-T-4912 Temperature-Monitored Van',
      consignmentWaybill: 'WB-HIMFED-99824',
      storageTempGuideline: 'Keep dry, store at 18-24°C, avoid direct sunlight',
      destination: 'Government MSME Organic Outlet, Mall Road',
    },
    prevHash: evt5.currentHash,
    customTimestamp: '2026-10-02T13:00:00.000Z',
  });
  events.push(evt6);

  // 6. Batches
  const batches: HoneyBatch[] = [
    {
      id: 'MM-2026-B108',
      harvestDate: '2026-09-22',
      apiaryId: 'API-001',
      apiaryName: 'Shivalik Wilds Apiary',
      hiveIds: ['HIVE-101', 'HIVE-102'],
      beekeeperName: 'Rameshwar Sharma',
      cooperativeName: 'Pahadi Madhu Utpadak Sahakari',
      honeyQuantityKg: 120,
      floralSource: 'Wild Mustard & Himalayan Acacia Blossom',
      extractionDate: '2026-09-23',
      extractionMethod: 'Centrifugal Cold Extraction',
      processingDetails: 'Single coarse micro-filter (80 mesh), unheated raw, gravity settled 48 hours.',
      storageConditions: 'Food-grade SS drum, dry ventilated warehouse, 21°C.',
      packagingDate: '2026-09-30',
      packagedUnits: {
        jarSize: '500g Glass Jar',
        totalUnits: 236,
        batchSealCode: 'LOT-2026-MM108',
      },
      batchStatus: 'Dispatched',
      qualityRecordIds: ['QR-2026-081'],
      blockchainRootHash: evt6.currentHash,
      qrPayloadUrl: `${window.location.origin}/#verify/MM-2026-B108`,
      notes: 'Premium unheated raw mountain honey with high natural pollen count.',
    },
    {
      id: 'MM-2026-B109',
      harvestDate: '2026-10-01',
      apiaryId: 'API-002',
      apiaryName: 'Sundarbans Mangrove Fringe Apiary',
      hiveIds: ['HIVE-201'],
      beekeeperName: 'Tapan Mondal',
      cooperativeName: 'Sundarbans Mouli Honey Federation',
      honeyQuantityKg: 85,
      floralSource: 'Sundarbans Wild Mangrove Khalsi Honey',
      extractionDate: '2026-10-02',
      extractionMethod: 'Centrifugal Cold Extraction',
      processingDetails: 'Traditional gravity decanting, cloth filtered, no synthetic treatment.',
      storageConditions: 'Sealed stainless drum, ambient shaded depot, 24°C.',
      packagingDate: '2026-10-05',
      packagedUnits: {
        jarSize: '500g Glass Jar',
        totalUnits: 170,
        batchSealCode: 'LOT-2026-MM109',
      },
      batchStatus: 'Lab Tested',
      qualityRecordIds: ['QR-2026-082'],
      blockchainRootHash: 'PENDING_FINAL_DISPATCH',
      qrPayloadUrl: `${window.location.origin}/#verify/MM-2026-B109`,
      notes: 'Distinct floral nectar from virgin mangrove blossoms in coastal West Bengal.',
    },
    {
      id: 'MM-2026-B110',
      harvestDate: '2026-10-10',
      apiaryId: 'API-003',
      apiaryName: 'Doaba Mustard Agricultural Belt',
      hiveIds: ['HIVE-301'],
      beekeeperName: 'Gurpreet Singh Gill',
      cooperativeName: 'Doaba Bee Farmers Welfare Trust',
      honeyQuantityKg: 310,
      floralSource: 'Brassica Yellow Mustard Winter Crop',
      extractionDate: '2026-10-11',
      extractionMethod: 'Centrifugal Cold Extraction',
      processingDetails: 'In settling tanks, pending certified lab report.',
      storageConditions: 'Bulk food-grade holding silo.',
      packagingDate: 'Pending',
      packagedUnits: {
        jarSize: '1kg Glass / 500g Glass',
        totalUnits: 0,
        batchSealCode: 'DRAFT',
      },
      batchStatus: 'Harvested',
      qualityRecordIds: [],
      blockchainRootHash: 'IN_PROGRESS',
      qrPayloadUrl: `${window.location.origin}/#verify/MM-2026-B110`,
      notes: 'Large winter single-source mustard harvest, natural crystallization expected.',
    },
  ];

  // 7. Market Listings
  const market: MarketListing[] = [
    {
      id: 'MKT-001',
      batchId: 'MM-2026-B108',
      producerName: 'Rameshwar Sharma',
      cooperativeName: 'Pahadi Madhu Utpadak Sahakari',
      floralSource: 'Wild Mustard & Himalayan Acacia Blossom',
      quantityAvailableKg: 80,
      minimumOrderKg: 10,
      askingPriceInrPerKg: 480,
      generalLocation: 'Kangra Valley Foothills, Himachal Pradesh',
      packagingFormat: '500g Glass Jars (Tamper-Proof Induction Seal)',
      traceabilityScore: 'Complete',
      qualitySummary: 'Moisture 17.2% | HMF 11.4 mg/kg | Pure C3/C4 Certified (NDDB Lab)',
      listingStatus: 'Active',
      contactPhone: '+91 98160 44219',
      contactEmail: 'pahadi.madhu.fpo@gmail.com',
      enquiries: [
        {
          id: 'ENQ-01',
          buyerName: 'Vikramaditya Singhania',
          buyerOrg: 'Patanjali Organic / Organic India Sourcing Desk',
          buyerPhone: '+91 98201 55901',
          buyerEmail: 'sourcing@organicindia.co.in',
          quantityRequestedKg: 50,
          message: 'Interested in the Himalayan Acacia batch. The QR code lab report matches our retail shelf criteria.',
          date: '2026-10-08',
          status: 'Accepted',
        },
      ],
    },
    {
      id: 'MKT-002',
      batchId: 'MM-2026-B109',
      producerName: 'Tapan Mondal',
      cooperativeName: 'Sundarbans Mouli Honey Federation',
      floralSource: 'Sundarbans Wild Mangrove Khalsi Honey',
      quantityAvailableKg: 85,
      minimumOrderKg: 20,
      askingPriceInrPerKg: 650,
      generalLocation: 'Gosaba & Kultali Buffer Zone, West Bengal',
      packagingFormat: 'Bulk 25kg Food Grade SS Can / 500g Jars',
      traceabilityScore: 'Complete',
      qualitySummary: 'Moisture 18.6% | Rare Wild Mangrove Pollen 74% | Zero Adulteration',
      listingStatus: 'Active',
      contactPhone: '+91 94330 81290',
      contactEmail: 'sundarbans.mouli.honey@wb.org',
      enquiries: [],
    },
    {
      id: 'MKT-003',
      batchId: 'MM-2026-B110',
      producerName: 'Gurpreet Singh Gill',
      cooperativeName: 'Doaba Bee Farmers Welfare Trust',
      floralSource: 'Brassica Yellow Mustard Winter Crop',
      quantityAvailableKg: 250,
      minimumOrderKg: 50,
      askingPriceInrPerKg: 390,
      generalLocation: 'Dasuya Tehsil, Hoshiarpur, Punjab',
      packagingFormat: '50kg SS Drum / 1kg Jars Available',
      traceabilityScore: 'Partial',
      qualitySummary: 'Fresh harvest cold extracted; pending final lab report issuance',
      listingStatus: 'Under Enquiry',
      contactPhone: '+91 98722 30114',
      contactEmail: 'gill.beekeeping@doabafarmers.in',
      enquiries: [
        {
          id: 'ENQ-02',
          buyerName: 'Sunil Aggarwal',
          buyerOrg: 'Amritsar Pure Food Products',
          buyerPhone: '+91 98140 22019',
          buyerEmail: 'aggarwal.foods@gmail.com',
          quantityRequestedKg: 150,
          message: 'We require 150kg mustard honey for local retail packing. Please confirm delivery timeline.',
          date: '2026-10-11',
          status: 'Contacted',
        },
      ],
    },
  ];

  return { apiaries, hives, batches, events, quality, market, alerts };
}

// Storage helpers
export function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw);
  } catch (e) {
    console.error(`Error loading key ${key} from localStorage:`, e);
    return defaultValue;
  }
}

export function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error saving key ${key} to localStorage:`, e);
  }
}
