# Madhumitra (मधुमित्र)
### *“From Hive to Home, With Trust.”*

A digital ecosystem combining honey provenance, beekeeper operations, IoT hive monitoring, and verifiable QR batch verification for rural beekeeping clusters.

---

## 1. Problem Statement Details

- **Problem Statement ID**: SIH26021
- **Title**: Honey Chain: A blockchain-based system for honey traceability and smart beekeeping management
- **Organization**: Ministry of Micro, Small & Medium Enterprises (MSME)
- **Department**: Coordination Section
- **Category**: Software
- **Theme**: Agriculture, FoodTech & Rural Development

---

## 2. Problem Overview

Rural beekeepers across Indian states face acute structural challenges:
1. **Counterfeit & Adulterated Honey**: Rampant market dilution with high-fructose corn syrup, inverted rice syrup, and cane sugar erodes genuine consumer trust and forces farmgate honey prices below subsistence levels.
2. **Missing Farm-to-Fork Traceability**: Traditional supply chains mix honeys indiscriminately, erasing floral origins and apiary credit.
3. **Colony Mortality & Lack of Hive Monitoring**: Brood overheating, seasonal pests (Varroa mites, wax moths), and sudden swarming cause up to 40% annual colony losses without early warning telemetry.
4. **Weak Market Connections**: Rural beekeeping clusters lack direct verifiable links to ethical pharmaceutical, Ayurvedic, and export buyers.

---

## 3. Proposed Solution: Madhumitra Ecosystem

Madhumitra delivers a transparent digital bridge between rural apicultural cooperatives and consumers:
- **Tamper-Evident Cryptographic Ledger**: Lightweight append-only hash chains (SHA-256) tracking harvest, cold extraction, settling, accredited laboratory results, bottling, and dispatch.
- **Consumer QR Verification**: Instant public mobile view proving record integrity, floral source, and FSSAI chemical tests without disclosing sensitive GPS apiary coordinates.
- **IoT Micro-Climate Hive Monitoring**: Live telemetry for internal brood temperature (°C), relative humidity (%RH), colony weight (kg), and acoustic buzz frequency (Hz).
- **Rule-Based Colony Health Alarms & AI Guidance**: Immediate anomaly detection for swarming risk, heat stress, and brood chill, coupled with responsible apicultural inspection guidelines.
- **MSME Honey Fair B2B Marketplace**: Direct enquiry channels between certified beekeeper groups and corporate buyers.

---

## 4. Key Features

| Module | Core Functionality | Status |
| :--- | :--- | :--- |
| **Overview Dashboard** | Real-time KPI counters, 24h environmental charts, recent harvests, alert status | Fully Functional |
| **Apiary Management** | Multi-apiary registry, hive inventory, queen health, generalized public regions | Fully Functional |
| **IoT Telemetry Console** | 24h diurnal temp/humidity/weight graphs, rule-based alarms, ingestion webhook | Fully Functional (Demo + API mode) |
| **Guided Batch Wizard** | 7-step wizard (Harvest, Hive Link, Extraction, Lab Tests, Packaging, Ledger Sign, QR) | Fully Functional |
| **Tamper-Evident Ledger** | Sequential SHA-256 cryptographic chain, tampering simulation & audit corrections | Fully Functional |
| **Consumer QR Portal** | Dynamic vector QR code generation, 3-pillar truth breakdown, test parameters | Fully Functional |
| **FSSAI Quality Records** | Moisture %, HMF, Sucrose %, C3/C4 sugar isotopic adulteration logs | Fully Functional |
| **Yield Analytics** | Seasonal production charts, transparent baseline yield model, CSV export | Fully Functional |
| **MSME Market Discovery** | Producer profiles, asking price (₹/kg), buyer sourcing enquiry workflow | Fully Functional |
| **Multi-Language Support** | English, हिन्दी (Hindi), বাংলা (Bengali), and मराठी (Marathi) | Fully Functional |
| **Jury Demo Tour** | 3-minute guided walkthrough modal for hackathon evaluation | Fully Functional |

---

## 5. User Roles (RBAC)

1. **Rural Beekeeper**: Logs harvests, monitors hive box status, tracks apiary telemetry, views alerts.
2. **Honey Processor / Packager**: Records cold centrifugal extraction, micro-filtration, lot bottling, and tamper seals.
3. **Retail / Industrial Buyer**: Discovers transparent batches, inspects accredited lab certificates, sends sourcing enquiries.
4. **Field Coordinator / Admin**: Oversees cluster data, configures anomaly thresholds, reviews compliance.
5. **Consumer**: Scans QR code on retail honey jar to verify provenance without needing login credentials.

---

## 6. System Architecture

```
                    +------------------------------------------+
                    |           Consumer Honey Jar             |
                    |            (Scannable QR Code)           |
                    +--------------------+---------------------+
                                         |
                                         v
+-----------------------------------------------------------------------------------+
|                        Madhumitra Client Application                              |
|  - Plus Jakarta Sans + Tailwind CSS Design System                                |
|  - React 19 + TypeScript + Vite                                                   |
|  - Recharts Visual Telemetry & Analytics                                          |
|  - QRCode Vector Generation Engine                                                |
+--------------------+-----------------------------+--------------------------------+
                     |                             |
                     v                             v
+------------------------------------+   +------------------------------------------+
|   Cryptographic Blockchain Engine   |   |        IoT Environmental Engine          |
|  - Web Crypto API SHA-256          |   |  - Brood Temperature (32-36°C)           |
|  - Sequential Event Blocks         |   |  - Relative Humidity (50-65% RH)         |
|  - Genesis Linked prevHash         |   |  - Acoustic Frequency (Hz)               |
|  - Tamper Detection Algorithm      |   |  - Load Cell Precision Weight (kg)       |
|  - Append-Only Correction Events   |   |  - Synthetic Diurnal & Connected Webhook |
+------------------------------------+   +------------------------------------------+
                     |                             |
                     +--------------+--------------+
                                    |
                                    v
+-----------------------------------------------------------------------------------+
|                       Client Storage & API Layer                                 |
|  - Persistent LocalStorage State Engine                                           |
|  - Gemini AI Apicultural Advisor (Responsible Non-Diagnostic Model)              |
|  - NABL / FSSAI Quality Parameter Benchmarking                                    |
+-----------------------------------------------------------------------------------+
```

---

## 7. Technology Stack

- **Frontend Core**: React `^19.0.1`, TypeScript `^7.0.2`, Vite `^8.3.0`
- **Styling & Design System**: Tailwind CSS `^4.3.3`, `@tailwindcss/vite`
- **Iconography**: Lucide React (`lucide-react` `^0.546.0`)
- **Visual Analytics**: Recharts (`recharts` `^2.15.1`)
- **QR Engine**: `qrcode` `^1.5.4`
- **Cryptographic Hashing**: Web Crypto API standard SHA-256 (`crypto.subtle.digest`)
- **AI Integration**: `@google/genai` `^2.4.0` (`gemini-3.8-flash`) with deterministic rule-based apicultural engine fallback
- **Runtime Server**: Express `^4.21.2` (optional proxy server for full-stack deployment)

---

## 8. Actual Project Folder Structure

```
├── .env.example                      # Environment variables template
├── .gitignore                         # Git ignore configuration
├── index.html                         # Application entrypoint with SEO meta
├── metadata.json                      # AI Studio manifest
├── package.json                       # Dependencies and build scripts
├── tsconfig.json                      # TypeScript strict compiler options
├── vite.config.ts                     # Vite build configuration with Tailwind
├── src/
│   ├── main.tsx                       # React application bootstrap
│   ├── App.tsx                        # Layout coordination and router
│   ├── index.css                      # Tailwind base and theme variables
│   ├── types.ts                       # Complete domain TypeScript interfaces
│   ├── assets/
│   │   └── images/                    # Authentic generated high-resolution assets
│   ├── context/
│   │   └── AppContext.tsx             # State management, CRUD, integrity checks
│   ├── services/
│   │   ├── blockchain.ts              # Cryptographic SHA-256 ledger engine
│   │   ├── store.ts                   # Seed data, telemetry generator, storage
│   │   ├── ai.ts                      # Gemini AI apicultural inspection engine
│   │   └── i18n.ts                    # Multilingual dictionaries (EN, HI, BN, MR)
│   └── components/
│       ├── layout/
│       │   ├── Navbar.tsx             # 3-zone Top Bar Contract implementation
│       │   └── Sidebar.tsx            # Navigation with touch-friendly controls
│       ├── common/
│       │   └── DemoBanner.tsx         # Transparent technical honesty banner
│       ├── demo/
│       │   └── WalkthroughModal.tsx   # 3-minute jury demonstration guide
│       ├── overview/
│       │   └── OverviewDashboard.tsx  # KPI cards, telemetry trends, batches
│       ├── apiaries/
│       │   └── ApiariesView.tsx       # Apiaries & hives with privacy controls
│       ├── monitoring/
│       │   └── HiveMonitoringView.tsx # IoT graphs, rule alarms, AI advisor
│       ├── batches/
│       │   ├── HoneyBatchesView.tsx   # Batch listing and dossier view
│       │   └── NewBatchWizard.tsx     # 7-step guided creation wizard
│       ├── traceability/
│       │   └── TraceabilityLedgerView.tsx # SHA-256 chain, tampering demo
│       ├── verification/
│       │   └── QrVerificationView.tsx # Public consumer portal with 3 truth pillars
│       ├── quality/
│       │   └── QualityRecordsView.tsx # FSSAI chemical quality certificates
│       ├── analytics/
│       │   └── HarvestYieldView.tsx   # Production charts & CSV export
│       ├── market/
│       │   └── MarketConnectionsView.tsx # B2B discovery & buyer enquiry modal
│       ├── reports/
│       │   └── ReportsView.tsx        # Audit exports & printable certificates
│       └── settings/
│           └── SettingsView.tsx       # RBAC preview, thresholds, language
```

---

## 9. Traceability & Cryptographic Ledger Design

### The Event Block Structure
Every physical step in the honey journey is modeled as an immutable block:
```typescript
interface TraceabilityEvent {
  sequenceNum: number;           // 1, 2, 3...
  eventId: string;               // EVT-MM-2026-B108-XYZ
  batchId: string;               // MM-2026-B108
  eventType: TraceabilityEventType;
  title: string;
  timestamp: string;             // ISO-8601 UTC
  actorName: string;
  actorRole: string;
  organization: string;
  location: string;
  details: Record<string, any>;  // Canonical key-sorted payload
  prevHash: string;              // Points to preceding block (Genesis for Block #1)
  currentHash: string;           // SHA-256 of canonical payload
}
```

### Hash Linkage Formula
$$\text{Payload} = \text{CanonicalJSON}(\text{seq}, \text{id}, \text{batch}, \text{type}, \text{time}, \text{actor}, \text{role}, \text{org}, \text{loc}, \text{prevHash}, \text{sortedDetails})$$
$$\text{CurrentHash} = \text{SHA-256}(\text{Payload})$$

### Epistemological Truth vs. Ledger Integrity
Madhumitra makes a clear and honest scientific distinction:
- **Ledger Integrity** proves that records have not been altered or deleted since they were digitally signed.
- **Physical Honey Purity** cannot be proven by hashing alone; it requires NABL-accredited laboratory test certificates (AOAC 969.38 refractometry, HPLC, and carbon isotopic analysis for C3/C4 sugars). Both pillars are clearly surfaced to the consumer.

---

## 10. QR Verification Workflow

1. **Beekeeper/Processor** completes packaging of a honey batch.
2. The platform commits event blocks to the ledger and calculates the **Root SHA-256 Fingerprint**.
3. A unique URL payload (`https://domain/#verify/BATCH-ID`) is encoded into a high-density QR code.
4. When scanned by a smartphone camera, the consumer sees:
   - **Pillar 1: Valid QR Link**: Verified serial link.
   - **Pillar 2: Record Integrity**: Hash validation status.
   - **Pillar 3: Verified Laboratory Quality**: Moisture %, HMF, and purity.
   - **Origin & Journey**: Producing apiary cluster (general district) without revealing private coordinates.

---

## 11. Hive Monitoring & IoT Telemetry Logic

### Anomaly Rule Matrix
| Parameter | Safe Baseline | Alert Condition | Potential Diagnosis |
| :--- | :--- | :--- | :--- |
| **Brood Temperature** | 34.0°C – 35.5°C | $> 36.0^\circ\text{C}$ or $< 32.0^\circ\text{C}$ | Heat stress (fanning required) or colony chill |
| **Relative Humidity** | 50% – 65% RH | $> 68\%\text{ RH}$ for $> 12\text{h}$ | Condensation, damp floorboard, mold risk |
| **Colony Weight** | Stable / Gradual gain | Drop $> 1.5\text{ kg}$ in $< 8\text{h}$ | Swarm departure or predatory robbing |
| **Acoustics** | 180 – 240 Hz | $> 260\text{ Hz}$ sustained | Queen piping, colony distress, swarm preparation |

---

## 12. AI & IoT Implementation Status

- **Simulated vs. Real Hardware**:
  - The default mode uses **Clearly Labelled Synthetic Diurnal Curves** for evaluation without requiring physical hardware.
  - An optional **Connected-Device Mode** allows pushing live readings to a designated REST webhook URL (`/api/sensors/ingest`).
- **AI Advisory Guidance**:
  - Leverages `@google/genai` (`gemini-3.8-flash`) to generate structured inspection suggestions based on current telemetry.
  - Transparent fallback rule engine ensures full reliability when an API key is not supplied.
  - Outputs are strictly labelled as **AI-Assisted Guidance** and never claim automatic diagnostic disease certification.

---

## 13. Prerequisites & Installation

### Requirements
- Node.js (version 18.0 or newer)
- npm or yarn

### Setup Commands
```bash
# Clone the repository
git clone https://github.com/your-org/madhumitra.git
cd madhumitra

# Install packages
npm install

# Configure environment variables
cp .env.example .env

# Run local development server
npm run dev
```

Visit `http://localhost:3000` in your browser.

---

## 14. Demo Walkthrough (3-Minute Hackathon Script)

1. **Dashboard (0:00 - 0:30)**: Click **"3-Min Demo Tour"** in the top bar. Review overall KPI metrics, real-time 24h temperature/humidity curves, and active alarms.
2. **Apiaries & Privacy (0:30 - 0:50)**: Navigate to **My Apiaries**. View Shivalik Wilds and Sundarbans clusters. Observe how GPS coordinates are kept private while public general locations are displayed.
3. **IoT Telemetry (0:50 - 1:15)**: Open **Hive Monitoring**. Switch between hives, examine the 24h micro-climate chart, and review the AI-assisted inspection queries.
4. **Create a Batch (1:15 - 1:45)**: Click **"New Honey Batch"**. Walk through the 7-step wizard: select apiary, cold extraction parameters, enter moisture %, and commit to blockchain to generate the QR code.
5. **Ledger & Tamper Proof (1:45 - 2:20)**: Open **Batch Traceability**. Click **"Simulate Malicious Tampering"** to witness an immediate red hash mismatch alert. Then click **"Restore"** or append an audit correction block.
6. **Consumer QR Portal (2:20 - 2:45)**: Open **QR Verification**. Review the 3 verification truth pillars, lab certificates, and printable honey jar sticker.
7. **Export & Reports (2:45 - 3:00)**: Go to **Reports** and click **"Download CSV"** to export the audit trail.

---

## 15. Security & Privacy Hygiene

- **Sensitive GPS Protection**: Raw coordinates are retained exclusively on the beekeeper management layer and stripped from public consumer verification responses.
- **Input Sanitization**: Batch creation forms enforce numeric boundary checks (moisture $\ge 0\%$, quantity $> 0$).
- **No Secret Key Leakage**: No private keys or authentication tokens are stored in the client repository.
- **Append-Only Corrections**: Historical events cannot be edited; amendments require a dedicated signed audit block.

---

## 16. Known Limitations & Roadmap

- **Smart Contract Mainnet**: The current ledger runs client/server-side cryptographic SHA-256 hash chains. Direct EVM or Hyperledger Fabric chaincode deployment is planned for Phase 2.
- **Physical Sensor Dongle**: Production field rollout will use solar-powered LoRaWAN ESP32 telemetry nodes.

---

## 17. License

Built for the **Smart India Hackathon (SIH 2026)** under problem statement **SIH26021** (Ministry of MSME). Apache-2.0 License.
