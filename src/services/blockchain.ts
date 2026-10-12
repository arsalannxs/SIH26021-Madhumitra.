import { TraceabilityEvent, TraceabilityEventType } from '../types';

export const GENESIS_HASH = '0000000000000000000000000000000000000000000000000000000000000000';

/**
 * Computes a genuine SHA-256 hex string using browser Web Crypto API.
 */
export async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Standardized canonical string representation for calculating the event's cryptographic hash.
 */
export function getEventPayloadString(event: {
  eventId: string;
  batchId: string;
  sequenceNum: number;
  eventType: string;
  timestamp: string;
  actorName: string;
  actorRole: string;
  organization: string;
  location: string;
  details: Record<string, string | number | boolean>;
  prevHash: string;
}): string {
  // Sort keys in details for canonical consistency
  const sortedDetails = Object.keys(event.details || {})
    .sort()
    .reduce<Record<string, string | number | boolean>>((acc, key) => {
      acc[key] = event.details[key];
      return acc;
    }, {});

  return JSON.stringify({
    seq: event.sequenceNum,
    id: event.eventId,
    batch: event.batchId,
    type: event.eventType,
    time: event.timestamp,
    actor: event.actorName,
    role: event.actorRole,
    org: event.organization,
    loc: event.location,
    prev: event.prevHash,
    details: sortedDetails,
  });
}

/**
 * Computes the SHA-256 cryptographic hash of a traceability event.
 */
export async function computeEventHash(
  event: Omit<TraceabilityEvent, 'currentHash'>
): Promise<string> {
  const payload = getEventPayloadString(event);
  return sha256(payload);
}

/**
 * Creates and cryptographically signs an append-only traceability event.
 */
export async function createTraceabilityEvent(params: {
  batchId: string;
  sequenceNum: number;
  eventType: TraceabilityEventType;
  title: string;
  actorName: string;
  actorRole: string;
  organization: string;
  location: string;
  details: Record<string, string | number | boolean>;
  prevHash: string;
  customTimestamp?: string;
}): Promise<TraceabilityEvent> {
  const eventId = `EVT-${params.batchId}-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`.toUpperCase();
  const timestamp = params.customTimestamp || new Date().toISOString();

  const eventCandidate: Omit<TraceabilityEvent, 'currentHash'> = {
    eventId,
    batchId: params.batchId,
    sequenceNum: params.sequenceNum,
    eventType: params.eventType,
    title: params.title,
    timestamp,
    actorName: params.actorName,
    actorRole: params.actorRole,
    organization: params.organization,
    location: params.location,
    details: params.details,
    prevHash: params.prevHash,
  };

  const currentHash = await computeEventHash(eventCandidate);

  return {
    ...eventCandidate,
    currentHash,
  };
}

export interface IntegrityVerificationResult {
  isValid: boolean;
  totalEventsVerified: number;
  tamperedEventIndex: number | null;
  tamperedEventId: string | null;
  errorReason: string | null;
  computedHashes: string[];
  expectedHashes: string[];
  lastVerifiedAt: string;
}

/**
 * Verifies the mathematical integrity of a batch's chain of events.
 * Returns detailed diagnostics on whether hashes match and links are intact.
 */
export async function verifyTraceabilityChain(
  events: TraceabilityEvent[]
): Promise<IntegrityVerificationResult> {
  if (!events || events.length === 0) {
    return {
      isValid: true,
      totalEventsVerified: 0,
      tamperedEventIndex: null,
      tamperedEventId: null,
      errorReason: 'No events in ledger chain to verify.',
      computedHashes: [],
      expectedHashes: [],
      lastVerifiedAt: new Date().toISOString(),
    };
  }

  // Sort by sequence number
  const sorted = [...events].sort((a, b) => a.sequenceNum - b.sequenceNum);
  const computedHashes: string[] = [];
  const expectedHashes: string[] = [];

  for (let i = 0; i < sorted.length; i++) {
    const event = sorted[i];
    expectedHashes.push(event.currentHash);

    // 1. Verify prevHash link
    if (i === 0) {
      if (event.prevHash !== GENESIS_HASH) {
        return {
          isValid: false,
          totalEventsVerified: i,
          tamperedEventIndex: 0,
          tamperedEventId: event.eventId,
          errorReason: `Genesis event has invalid previous hash (Expected: ${GENESIS_HASH.slice(0, 10)}..., Found: ${event.prevHash.slice(0, 10)}...)`,
          computedHashes,
          expectedHashes,
          lastVerifiedAt: new Date().toISOString(),
        };
      }
    } else {
      const prevEvent = sorted[i - 1];
      if (event.prevHash !== prevEvent.currentHash) {
        return {
          isValid: false,
          totalEventsVerified: i,
          tamperedEventIndex: i,
          tamperedEventId: event.eventId,
          errorReason: `Broken chain link at Block #${event.sequenceNum}. Previous hash does not match hash of Block #${prevEvent.sequenceNum}.`,
          computedHashes,
          expectedHashes,
          lastVerifiedAt: new Date().toISOString(),
        };
      }
    }

    // 2. Recompute currentHash from the content
    const recomputed = await computeEventHash(event);
    computedHashes.push(recomputed);

    if (recomputed !== event.currentHash) {
      return {
        isValid: false,
        totalEventsVerified: i,
        tamperedEventIndex: i,
        tamperedEventId: event.eventId,
        errorReason: `Data Tampering Detected in Block #${event.sequenceNum} (${event.title})! The event payload was modified after signing. Stored hash [${event.currentHash.slice(0, 12)}...] does not match recomputed cryptographic fingerprint [${recomputed.slice(0, 12)}...].`,
        computedHashes,
        expectedHashes,
        lastVerifiedAt: new Date().toISOString(),
      };
    }
  }

  return {
    isValid: true,
    totalEventsVerified: sorted.length,
    tamperedEventIndex: null,
    tamperedEventId: null,
    errorReason: null,
    computedHashes,
    expectedHashes,
    lastVerifiedAt: new Date().toISOString(),
  };
}
