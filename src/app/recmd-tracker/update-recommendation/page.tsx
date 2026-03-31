'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useIndexedDB, RecommendationRecord } from '@/src/hooks/useIndexedDB';
import RecommendationForm from '../create-recommendation/page';
import { RecommendationFormValues } from '../create-recommendation/page';

// ─── Helper: safely parse a date string/value into Date | null ───────────────
const toDate = (val: unknown): Date | null => {
  if (!val) return null;
  if (val instanceof Date) return isNaN(val.getTime()) ? null : val;
  const d = new Date(val as string);
  return isNaN(d.getTime()) ? null : d;
};

// ─── Map a DB record back to form values ─────────────────────────────────────
const recordToFormValues = (record: RecommendationRecord): RecommendationFormValues => ({
  source: record.source || '',
  plantName: record.plantName || '',
  location: record.location || '',
  section: record.section || '',
  equipmentId: record.equipmentId || '',
  equipmentType: record.equipmentType || '',
  equipmentDesc: record.equipmentDesc || '',
  repairreplacementrequired: record.repairreplacementrequired || '',
  recommendationDescription: record.recommendationDescription || '',
  recommendationType: record.recommendationType || '',
  consequenceSelectionType: record.consequenceSelectionType || '',
  initialConsequence: record.initialConsequence || '',
  initialLikelihood: record.initialLikelihood || '',
  initialRiskScore: record.initialRiskScore || '',
  injuryPotential: record.injuryPotential || '',
  assetRepairCost: record.assetRepairCost?.toString() || '',
  productionLossPerDay: record.productionLossPerDay?.toString() || '',
  potentialRiskImpactMin: record.potentialRiskImpactMin?.toString() || '',
  potentialRiskImpactMedium: record.potentialRiskImpactMedium?.toString() || '',
  potentialRiskImpactMax: record.potentialRiskImpactMax?.toString() || '',
  finalConsequence: record.finalConsequence || '',
  finalLikelihood: record.finalLikelihood || '',
  finalRiskScore: record.finalRiskScore || '',
  benefitOfImplementation: record.benefitOfImplementation || '',
  // FIX: was using estimatedCost (DB field), mapped to the correct form field
  estimatedCostForImplementation: record.estimatedCost?.toString() || '',
  shutdownRequirement: record.shutdownRequirement || '',
  dateOfRecommendation: toDate(record.dateOfRecommendation),
  // FIX: was incorrectly mapped to actualImplementationDate
  targetImplementationDate: toDate(record.targetImplementationDate),
  actualImplementationDate: toDate(record.actualImplementationDate),
  // FIX: was set to record.recommendationNo (wrong field entirely)
  ageOfRecommendation: record.ageOfRecommendation || '',
  benefitAnalysisTargetDate: toDate(record.benefitAnalysisTargetDate),
  numberOfOverdueDays: record.numberOfOverdueDays || '',
  recommendationInitiatedBy: record.recommendationInitiatedBy || '',
  discussedWithHOD: record.discussedWithHOD || '',
  dateOfDiscussion: toDate(record.dateOfDiscussion),
  responsiblePersonForClosure: record.responsiblePersonForClosure || '',
  // FIX: status lives on record.status, not record.recommendationStatus
  recommendationStatus: record.status || '',
  reasonForRejection: record.reasonForRejection || '',
  rejectedBy: record.rejectedBy || '',
  eligibleForRecommendation: record.eligibleForRecommendation || '',
  remarks: record.remarks || '',
});

// ─── Component ────────────────────────────────────────────────────────────────
const UpdateRecommendationPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get('id');

  const { getRecommendationById, updateRecommendation, isReady } = useIndexedDB();

  const [initialData, setInitialData] = useState<RecommendationFormValues | null>(null);
  const [existingRecord, setExistingRecord] = useState<RecommendationRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  // Load on mount once DB is ready
  useEffect(() => {
    if (!isReady) return;
    if (!id) {
      setError('No recommendation ID provided in the URL.');
      setLoading(false);
      return;
    }
    loadRecommendation();
  }, [isReady, id]);

  const loadRecommendation = async () => {
    setLoading(true);
    setError(null);
    try {
      const record = await getRecommendationById(id!);
      if (!record) {
        setError('Recommendation not found. It may have been deleted.');
        return;
      }
      setExistingRecord(record);
      setInitialData(recordToFormValues(record));
    } catch (err) {
      console.error('Failed to load recommendation:', err);
      setError('Failed to load recommendation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (values: RecommendationFormValues) => {
    if (!id || !existingRecord) return;

    // Build a change history entry
    const changeEntry = {
      id: Date.now().toString(),
      changedBy: values.recommendationInitiatedBy || 'System',
      changedAt: new Date().toISOString(),
      changeType: 'update' as const,
      fieldName: 'Multiple fields',
      oldValue: 'Previous values',
      newValue: 'Updated values',
      remarks: 'Recommendation updated via form',
    };

    try {
      await updateRecommendation(id, {
        // Spread all form values directly
        ...values,
        // Map form fields back to DB fields correctly
        status: values.recommendationStatus || existingRecord.status,
        estimatedCost: Number(values.estimatedCostForImplementation) || 0,
        // Preserve existing system fields
        recommendationNo: existingRecord.recommendationNo,
        createdAt: existingRecord.createdAt,
        updatedAt: new Date().toISOString(),
        // Append to change history — never overwrite it
        changeHistory: [...(existingRecord.changeHistory || []), changeEntry],
      });

      setUpdateSuccess(true);

      // Brief success flash then redirect
      setTimeout(() => {
        router.push('/recmd-tracker?updated=true');
      }, 1500);
    } catch (err) {
      console.error('Failed to update:', err);
      alert('Failed to update recommendation. Please try again.');
    }
  };

  // ── Loading state ──
  if (!isReady || loading) {
    return (
      <div className="container-fluid">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2 text-muted">Loading recommendation data…</p>
        </div>
      </div>
    );
  }

  // ── Error state ──
  if (error) {
    return (
      <div className="container-fluid">
        <div className="alert alert-danger m-3">
          <h5>Error loading recommendation</h5>
          <p className="mb-3">{error}</p>
          <div className="d-flex gap-2">
            <button className="btn btn-outline-secondary" onClick={loadRecommendation}>
              Try Again
            </button>
            <button className="btn btn-primary" onClick={() => router.push('/recmd-tracker')}>
              Back to Recommendations
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── No data (should be caught above, safety net) ──
  if (!initialData) {
    return null;
  }

  // ── Success banner ──
  if (updateSuccess) {
    return (
      <div className="container-fluid">
        <div className="alert alert-success m-3">
          <h5>✅ Recommendation Updated</h5>
          <p>Changes saved successfully. Redirecting back to the tracker…</p>
        </div>
      </div>
    );
  }

  // ── Main render ──
  return (
    <div className="container-fluid">
      {existingRecord && (
        <div
          className="mx-3 mt-3 p-3 rounded"
          style={{ backgroundColor: '#f0f9ff', border: '1px solid #bae6fd', fontSize: 13 }}
        >
          <span style={{ color: '#0369a1', fontWeight: 600 }}>
            Editing: {existingRecord.recommendationNo}
          </span>
          <span className="ms-3 text-muted">
            Created: {new Date(existingRecord.createdAt).toLocaleDateString()}
          </span>
          <span className="ms-3 text-muted">
            Last updated: {new Date(existingRecord.updatedAt).toLocaleDateString()}
          </span>
        </div>
      )}

      <RecommendationForm
        initialData={initialData}
        onSubmit={handleUpdate}
        isUpdate={true}
      />
    </div>
  );
};

export default UpdateRecommendationPage;