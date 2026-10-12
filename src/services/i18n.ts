export type SupportedLanguage = 'en' | 'hi' | 'bn' | 'mr';

export interface TranslationDictionary {
  appName: string;
  tagline: string;
  problemStatement: string;
  overview: string;
  apiaries: string;
  hiveMonitoring: string;
  batches: string;
  traceability: string;
  qrVerification: string;
  qualityRecords: string;
  harvestYield: string;
  market: string;
  reports: string;
  settings: string;
  healthyHivesHeader: string;
  loadDemoData: string;
  resetDemoData: string;
  demoModeNotice: string;
  recordHarvest: string;
  addHive: string;
  newBatch: string;
  verifyIntegrity: string;
  intactLedger: string;
  tamperDetected: string;
  activeAlerts: string;
  viewDetails: string;
  searchPlaceholder: string;
  save: string;
  cancel: string;
  confirm: string;
  roleBeekeeper: string;
  roleProcessor: string;
  roleBuyer: string;
  roleAdmin: string;
}

export const translations: Record<SupportedLanguage, TranslationDictionary> = {
  en: {
    appName: 'Madhumitra',
    tagline: 'From Hive to Home, With Trust.',
    problemStatement: 'SIH26021 · Ministry of MSME',
    overview: 'Overview',
    apiaries: 'My Apiaries',
    hiveMonitoring: 'Hive Monitoring',
    batches: 'Honey Batches',
    traceability: 'Batch Traceability',
    qrVerification: 'QR Verification',
    qualityRecords: 'Quality Records',
    harvestYield: 'Harvest & Yield',
    market: 'Market Connections',
    reports: 'Reports',
    settings: 'Settings',
    healthyHivesHeader: 'Healthy Hives. Trusted Honey. Better Livelihoods.',
    loadDemoData: 'Load Demo Data',
    resetDemoData: 'Reset Demo',
    demoModeNotice: 'Demonstration Mode · Clearly labelled synthetic telemetry and verifiable prototype blockchain ledger.',
    recordHarvest: 'Record Harvest',
    addHive: 'Add Hive',
    newBatch: 'Create Honey Batch',
    verifyIntegrity: 'Verify Record Integrity',
    intactLedger: 'Cryptographic Integrity Intact',
    tamperDetected: 'Integrity Breach Detected',
    activeAlerts: 'Hive Alerts Requiring Attention',
    viewDetails: 'View Details',
    searchPlaceholder: 'Search hives, batches, or locations...',
    save: 'Save',
    cancel: 'Cancel',
    confirm: 'Confirm',
    roleBeekeeper: 'Rural Beekeeper',
    roleProcessor: 'Honey Processor',
    roleBuyer: 'Retail Buyer',
    roleAdmin: 'Field Admin',
  },
  hi: {
    appName: 'मधुमित्र',
    tagline: 'छत्ते से घर तक, विश्वास के साथ।',
    problemStatement: 'SIH26021 · सूक्ष्म, लघु एवं मध्यम उद्यम मंत्रालय (MSME)',
    overview: 'अवलोकन (होम)',
    apiaries: 'मेरी मधुवाटिकाएं',
    hiveMonitoring: 'छत्ते की निगरानी (IoT)',
    batches: 'शहद के लॉट (बैच)',
    traceability: 'ट्रैसेबिलिटी लेजर',
    qrVerification: 'QR सत्यापन',
    qualityRecords: 'गुणवत्ता रिकॉर्ड',
    harvestYield: 'उत्पादन व उपज',
    market: 'बाजार संपर्क (खरीदार)',
    reports: 'रिपोर्ट व प्रमाण पत्र',
    settings: 'सेटिंग्स',
    healthyHivesHeader: 'स्वस्थ छत्ते। शुद्ध शहद। समृद्ध आजीविका।',
    loadDemoData: 'डेमो डेटा लोड करें',
    resetDemoData: 'रीसेट करें',
    demoModeNotice: 'डेमो मोड · स्पष्ट रूप से चिह्नित सिम्युलेटेड सेंसर और प्रामाणिक ब्लॉकचेन लेजर।',
    recordHarvest: 'शहद कटाई दर्ज करें',
    addHive: 'नया छत्ता जोड़ें',
    newBatch: 'नया बैच बनाएं',
    verifyIntegrity: 'रिकॉर्ड अखंडता जांचें',
    intactLedger: 'लेजर सुरक्षित व अखंड है',
    tamperDetected: 'छेड़छाड़ पकड़ी गई!',
    activeAlerts: 'तत्काल ध्यान देने योग्य अलर्ट',
    viewDetails: 'विवरण देखें',
    searchPlaceholder: 'छत्ता, बैच या स्थान खोजें...',
    save: 'सुरक्षित करें',
    cancel: 'रद्द करें',
    confirm: 'पुष्टि करें',
    roleBeekeeper: 'मधुमक्खी पालक',
    roleProcessor: 'शहद प्रसंस्करणकर्ता',
    roleBuyer: 'थोक / खुदरा खरीदार',
    roleAdmin: 'समन्वयक अधिकारी',
  },
  bn: {
    appName: 'মধুমিত্র',
    tagline: 'মৌচাক থেকে ঘরে, আস্থার সাথে।',
    problemStatement: 'SIH26021 · এমএসএমই মন্ত্রণালয়',
    overview: 'ওভারভিউ',
    apiaries: 'আমার মৌ-খামার',
    hiveMonitoring: 'মৌচাক পর্যবেক্ষণ',
    batches: 'মধুর ব্যাচ',
    traceability: 'ট্রেসেবিলিটি লেজার',
    qrVerification: 'কিউআর যাচাইকরণ',
    qualityRecords: 'গুণমান রেকর্ড',
    harvestYield: 'উৎপাদন ও ফলন',
    market: 'বাজার সংযোগ',
    reports: 'রিপোর্ট',
    settings: 'সেটিংস',
    healthyHivesHeader: 'সুস্থ মৌচাক। খাঁটি মধু। উন্নত জীবিকা।',
    loadDemoData: 'ডেমো ডেটা লোড',
    resetDemoData: 'রিসেট',
    demoModeNotice: 'ডেমো মোড · স্পষ্টভাবে চিহ্নিত সিমুলেটেড পরিমাপ।',
    recordHarvest: 'মধু সংগ্রহ লিপিবদ্ধ করুন',
    addHive: 'নতুন মৌচাক যুক্ত করুন',
    newBatch: 'নতুন ব্যাচ তৈরি করুন',
    verifyIntegrity: 'লেজার যাচাই করুন',
    intactLedger: 'লেজার অক্ষত ও প্রমাণিত',
    tamperDetected: 'পরিবর্তন সনাক্ত হয়েছে!',
    activeAlerts: 'সতর্কবার্তা',
    viewDetails: 'বিস্তারিত দেখুন',
    searchPlaceholder: 'অনুসন্ধান করুন...',
    save: 'সংরক্ষণ',
    cancel: 'বাতিল',
    confirm: 'নিশ্চিত করুন',
    roleBeekeeper: 'মৌমাছি পালক',
    roleProcessor: 'মধু প্রক্রিয়াকরণকারী',
    roleBuyer: 'ক্রেতা',
    roleAdmin: 'প্রশাসক',
  },
  mr: {
    appName: 'मधुमित्र',
    tagline: 'पोळ्यापासून घरापर्यंत, विश्वासाने.',
    problemStatement: 'SIH26021 · एमएसएमई मंत्रालय',
    overview: 'आढावा',
    apiaries: 'माझ्या मधमाश्यांच्या पेट्या',
    hiveMonitoring: 'पेटी निरीक्षण (IoT)',
    batches: 'मधाच्या बॅचेस',
    traceability: 'ट्रेसेबिलिटी लेजर',
    qrVerification: 'QR पडताळणी',
    qualityRecords: 'गुणवत्ता नोंदी',
    harvestYield: 'उत्पादन व पीक',
    market: 'बाजारपेठ जोडणी',
    reports: 'अहवाल',
    settings: 'सेटिंग्ज',
    healthyHivesHeader: 'निरोगी पोळी. शुद्ध मध. उत्तम उपजीविका.',
    loadDemoData: 'डेमो डेटा लोड करा',
    resetDemoData: 'रीसेट करा',
    demoModeNotice: 'डेमो मोड · स्पष्टपणे नमूद केलेले नमुने आणि ब्लॉकचेन लेजर.',
    recordHarvest: 'मध काढणी नोंदवा',
    addHive: 'नवीन पेटी जोडा',
    newBatch: 'नवीन बॅच तयार करा',
    verifyIntegrity: 'लेजर अखंडता तपासा',
    intactLedger: 'लेजर अखंड व सुरक्षित',
    tamperDetected: 'बदल आढळला!',
    activeAlerts: 'तातडीचे अलर्ट',
    viewDetails: 'तपशील पहा',
    searchPlaceholder: 'शोधा...',
    save: 'जतन करा',
    cancel: 'रद्द करा',
    confirm: 'नक्की करा',
    roleBeekeeper: 'मधपाळ (शेतकरी)',
    roleProcessor: 'मध प्रक्रियादार',
    roleBuyer: 'खरेदीदार',
    roleAdmin: 'अधिकारी',
  },
};
