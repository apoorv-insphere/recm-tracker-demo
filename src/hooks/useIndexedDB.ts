// hooks/useIndexedDB.ts
import { useState, useEffect } from 'react';

const DB_NAME = 'RecommendationDB';
const DB_VERSION = 1;
const STORE_NAME = 'recommendations';

export interface RecommendationRecord {
  // ── Identity ──────────────────────────────────────────────────────────────
  id: string;
  recommendationNo: string;
  sn: string;
  date: string;
  createdAt: string;
  updatedAt: string;
  changeHistory: ChangeHistoryEntry[];

  // ── Section 1: Basic identification ──────────────────────────────────────
  source: string;
  plantName: string;
  location: string;
  section: string;
  equipmentId: string;
  equipmentDescription: string;
  equipmentType: string

  // ── Section 2: Issue details ──────────────────────────────────────────────
  recommendationDescription: string;
  recommendationType: string;
  repairreplacementrequired: string;

  // ── Section 3: Risk assessment ────────────────────────────────────────────
  consequenceSelectionType: string;
  initialConsequence: string;
  initialLikelihood: string;
  initialRiskScore: string;
  injuryPotential: string;

  // ── Section 4: Financial impact ───────────────────────────────────────────
  assetRepairCost: any;
  productionLossPerDay: any;
  potentialRiskImpactMin: any;
  potentialRiskImpactMedium: any;
  potentialRiskImpactMax: any;

  // ── Section 5: Post-implementation risk ───────────────────────────────────
  finalConsequence: string;
  finalLikelihood: string;
  finalRiskScore: string;

  // ── Section 6: Cost-benefit ───────────────────────────────────────────────
  benefitOfImplementation: string;
  estimatedCost: number;          // DB field (mapped from estimatedCostForImplementation)
  shutdownRequirement: any;

  // ── Section 7: Timeline ───────────────────────────────────────────────────
  dateOfRecommendation: any;
  targetImplementationDate: any;  // FIX: was missing, causing wrong mapping
  actualImplementationDate: any;
  ageOfRecommendation: string;    // FIX: was missing, causing wrong mapping
  benefitAnalysisTargetDate: any;
  numberOfOverdueDays: string;

  // ── Section 8: Responsibility ─────────────────────────────────────────────
  recommendationInitiatedBy: string;
  discussedWithHOD: any;
  dateOfDiscussion: any;
  responsiblePersonForClosure: string;

  // ── Section 9: Status ─────────────────────────────────────────────────────
  status: string;                 // DB field (mapped from recommendationStatus)
  reasonForRejection: string;
  rejectedBy: string;
  eligibleForRecommendation: any;

  // ── Section 10: Notes ─────────────────────────────────────────────────────
  remarks: string;

  // ── Legacy / unused ───────────────────────────────────────────────────────

  roi?: string;
}

export interface ChangeHistoryEntry {
  id: string;
  changedBy: string;
  changedAt: string;
  changeType: 'creation' | 'update' | 'status_change' | 'approval';
  fieldName?: string;
  oldValue?: string;
  newValue?: string;
  remarks?: string;
}

// ── DB open ──────────────────────────────────────────────────────────────────
const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('createdAt', 'createdAt');
        store.createIndex('status', 'status');
        store.createIndex('recommendationNo', 'recommendationNo');
      }
    };
  });
};

// ── Hook ─────────────────────────────────────────────────────────────────────
export const useIndexedDB = () => {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        await openDB();
        setIsReady(true);
      } catch (err) {
        setError('Failed to initialize database');
        console.error(err);
      }
    };
    init();
  }, []);

  // ── Save ──
  const saveRecommendation = async (data: any): Promise<RecommendationRecord> => {
    const db = await openDB();
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);

    const now = new Date().toISOString();
    const record: RecommendationRecord = {
      ...data,
      id: Date.now().toString(),
      recommendationNo: `REC-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
      date: now,
      createdAt: now,
      updatedAt: now,
      changeHistory: data.changeHistory || [],
    };

    return new Promise((resolve, reject) => {
      const request = store.add(record);
      request.onsuccess = () => resolve(record);
      request.onerror = () => reject(request.error);
    });
  };

  // ── Get all ──
  const getAllRecommendations = async (): Promise<RecommendationRecord[]> => {
    const db = await openDB();
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);

    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  };

  // ── Get by ID ──
  const getRecommendationById = async (id: string): Promise<RecommendationRecord | null> => {
    const db = await openDB();
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);

    return new Promise((resolve, reject) => {
      const request = store.get(id);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  };

  // ── Update ──
  const updateRecommendation = async (
    id: string,
    data: Partial<RecommendationRecord>
  ): Promise<void> => {
    const db = await openDB();

    // Must use two separate transactions: one read then one write
    const readTx = db.transaction([STORE_NAME], 'readonly');
    const readStore = readTx.objectStore(STORE_NAME);

    const existing = await new Promise<RecommendationRecord | null>((resolve, reject) => {
      const req = readStore.get(id);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error);
    });

    if (!existing) {
      throw new Error(`Record with id "${id}" not found`);
    }

    const updated: RecommendationRecord = {
      ...existing,
      ...data,
      id: existing.id,                        // never overwrite id
      recommendationNo: existing.recommendationNo, // never overwrite rec no
      createdAt: existing.createdAt,          // never overwrite creation time
      updatedAt: new Date().toISOString(),
    };

    const writeTx = db.transaction([STORE_NAME], 'readwrite');
    const writeStore = writeTx.objectStore(STORE_NAME);

    return new Promise((resolve, reject) => {
      const req = writeStore.put(updated);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  };

  // ── Delete ──
  const deleteRecommendation = async (id: string): Promise<void> => {
    const db = await openDB();
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);

    return new Promise((resolve, reject) => {
      const request = store.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  };

  return {
    isReady,
    error,
    saveRecommendation,
    getAllRecommendations,
    getRecommendationById,
    updateRecommendation,
    deleteRecommendation,
  };
};