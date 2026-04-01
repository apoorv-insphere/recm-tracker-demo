"use client";
import React, { useState, useCallback, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import InputField from "@/src/components/Form/InputField";
import SelectField from "@/src/components/Form/SelectFields";
import DatePickerField from "@/src/components/Form/DatePickerField";
import { SelectOptions } from "@/src/components/interfaces";
import { useIndexedDB } from "@/src/hooks/useIndexedDB";
import { useRouter } from "next/navigation";

export interface RecommendationFormValues {
  source: string;
  plantName: string;
  location: string;
  section: string;
  equipmentId: string;
  equipmentType: string;
  equipmentDesc: string;
  repairreplacementrequired: string;
  recommendationDescription: string;
  recommendationType: string;
  consequenceSelectionType: string;
  initialConsequence: string;
  initialLikelihood: string;
  initialRiskScore: string;
  injuryPotential: string;
  assetRepairCost: string;
  productionLossPerDay: string;
  potentialRiskImpactMin: string;
  potentialRiskImpactMedium: string;
  potentialRiskImpactMax: string;
  finalConsequence: string;
  finalLikelihood: string;
  finalRiskScore: string;
  benefitOfImplementation: string;
  estimatedCostForImplementation: string;
  shutdownRequirement: string;
  dateOfRecommendation: Date | null;
  targetImplementationDate: Date | null;
  actualImplementationDate: Date | null;
  ageOfRecommendation: string;
  benefitAnalysisTargetDate: Date | null;
  numberOfOverdueDays: string;
  recommendationInitiatedBy: string;
  discussedWithHOD: string;
  dateOfDiscussion: Date | null;
  responsiblePersonForClosure: string;
  recommendationStatus: string;
  reasonForRejection: string;
  rejectedBy: string;
  eligibleForRecommendation: string;
  remarks: string;
}

const emptyValues: RecommendationFormValues = {
  source: "",
  plantName: "",
  location: "",
  section: "",
  equipmentId: "",
  equipmentType: "",
  equipmentDesc: "",
  repairreplacementrequired: "",
  recommendationDescription: "",
  recommendationType: "",
  consequenceSelectionType: "",
  initialConsequence: "",
  initialLikelihood: "",
  initialRiskScore: "",
  injuryPotential: "",
  assetRepairCost: "",
  productionLossPerDay: "",
  potentialRiskImpactMin: "",
  potentialRiskImpactMedium: "",
  potentialRiskImpactMax: "",
  finalConsequence: "",
  finalLikelihood: "",
  finalRiskScore: "",
  benefitOfImplementation: "",
  estimatedCostForImplementation: "",
  shutdownRequirement: "",
  dateOfRecommendation: null,
  targetImplementationDate: null,
  actualImplementationDate: null,
  ageOfRecommendation: "",
  benefitAnalysisTargetDate: null,
  numberOfOverdueDays: "",
  recommendationInitiatedBy: "",
  discussedWithHOD: "",
  dateOfDiscussion: null,
  responsiblePersonForClosure: "",
  recommendationStatus: "",
  reasonForRejection: "",
  rejectedBy: "",
  eligibleForRecommendation: "",
  remarks: "",
};

// ─── Options ────────────────────────────────────────────────────────────────
const sourceOptions: SelectOptions[] = [
  { value: "IM", label: "IM" },
  { value: "HRA", label: "HRA" },
  { value: "DSC", label: "DSC" },
  { value: "Legal", label: "Legal" },
  { value: "DSS", label: "DSS" },
  { value: "CSM", label: "CSM" },
  { value: "Internal Audit", label: "Internal Audit" },
  { value: "External Audit", label: "External Audit" },
  { value: "Linewalk", label: "Linewalk" },
  { value: "Apex", label: "Apex" },
  { value: "PSM", label: "PSM" },
  { value: "BHM", label: "BHM" },
  { value: "PSI", label: "PSI" },
  { value: "PHA", label: "PHA" },
  { value: "MOC", label: "MOC" },
  { value: "PSSR", label: "PSSR" },
  { value: "ERP", label: "ERP" },
  { value: "Training", label: "Training" },
  { value: "Communication", label: "Communication" },
  { value: "Governance", label: "Governance" },
  { value: "DSS BHM PSM", label: "DSS BHM PSM" },
  { value: "DSS HRA", label: "DSS HRA" },
  { value: "DSS DSC", label: "DSS DSC" },
  { value: "DSS SI", label: "DSS SI" },
  { value: "DSS IM", label: "DSS IM" },
  { value: "DSS Governance", label: "DSS Governance" },
  { value: "DSS R&T", label: "DSS R&T" },
  { value: "DSS CSM", label: "DSS CSM" },
  { value: "Fire Audit", label: "Fire Audit" },
];

const plantNameOptions: SelectOptions[] = [
  { value: "All", label: "All" },
  { value: "SMS1", label: "SMS1" },
  { value: "SMS2", label: "SMS2" },
  { value: "LDP1", label: "LDP1" },
  { value: "LDP2", label: "LDP2" },
  { value: "PP", label: "PP" },
  { value: "CE", label: "CE" },
  { value: "PM", label: "PM" },
  { value: "BM", label: "BM" },
  { value: "HSM", label: "HSM" },
  { value: "CRM", label: "CRM" },
  { value: "SSD", label: "SSD" },
  { value: "LOG", label: "LOG" },
  { value: "BF1", label: "BF1" },
  { value: "BF2", label: "BF2" },
  { value: "1710 O2", label: "1710 O2" },
  { value: "CO", label: "CO" },
  { value: "DRI", label: "DRI" },
  { value: "SP", label: "SP" },
  { value: "CO Project", label: "CO Project" },
  { value: "CGP", label: "CGP" },
  { value: "2400 O2", label: "2400 O2" },
  { value: "CU Project", label: "CU Project" },
  { value: "CU Opn", label: "CU Opn" },
  { value: "CHP", label: "CHP" },
  { value: "CW", label: "CW" },
  { value: "CC Project", label: "CC Project" },
  { value: "RMHS Opn", label: "RMHS Opn" },
  { value: "RMHS Project", label: "RMHS Project" },
  { value: "BF", label: "BF" },
  { value: "1200 O2", label: "1200 O2" },
  { value: "H2", label: "H2" },
  { value: "G11", label: "G11" },
  { value: "H11", label: "H11" },
  { value: "Shramik Vihar", label: "Shramik Vihar" },
  { value: "Hostel 3", label: "Hostel 3" },
  { value: "Pellet", label: "Pellet" },
  { value: "Pipe Conveyor Proj", label: "Pipe Conveyor Proj" },
  { value: "Township", label: "Township" },
  { value: "Hotel", label: "Hotel" }
];

const consequenceSelectionTypeOptions: SelectOptions[] = [
  { value: "People", label: "People" },
  { value: "Environment", label: "Environment" },
  { value: "Asset", label: "Asset" },
  { value: "Financial", label: "Financial" },
];

const recommendationTypeOptions: SelectOptions[] = [
  { value: "Risk Reduction", label: "Risk Reduction" },
  { value: "Safety Assurance", label: "Safety Assurance" },
  { value: "Quality Improvement", label: "Quality Improvement" },
  { value: "Productivity Improvement", label: "Productivity Improvement" },
  { value: "Environment Impact", label: "Environment Impact" },
  { value: "Financial Impact", label: "Financial Impact" },
  { value: "Legal Impact", label: "Legal Impact" },
];

const injuryPotentialOptions: SelectOptions[] = [
  { value: "MTC", label: "MTC" },
  { value: "LTI", label: "LTI" },
  { value: "Fatal", label: "Fatal" },
  { value: "First Aid", label: "First Aid" },
  { value: "Multiple Fatal", label: "Multiple Fatal" },
];

const shutdownOptions: SelectOptions[] = [
  { value: "Yes", label: "Yes" },
  { value: "No", label: "No" },
];

const repairreplacementrequiredOptions: SelectOptions[] = [
    { value: "Yes", label: "Yes" },
  { value: "No", label: "No" },
]

const statusOptions: SelectOptions[] = [
  { value: "Open", label: "Open" },
  { value: "Close", label: "Close" },
  { value: "Reject", label: "Reject" },
];

const yesNoOptions: SelectOptions[] = [
  { value: "Yes", label: "Yes" },
  { value: "No", label: "No" },
];

const equipmentTypeOptions: SelectOptions[] = [
   { value: "Type1", label: "Type 1" },
  { value: "Type2", label: "Type 2" },
    { value: "Type3", label: "Type 3" },

]

// ─── Sections ───────────────────────────────────────────────────────────────
const sections = [
  {
    title: "1. Basic Identification & Location Details",
    fields: ["source", "plantName", "location", "section", "equipmentId", "equipmentType", "equipmentDesc"],
    requiredFields: [],
  },
  {
    title: "2. Issue / Requirement Details",
    fields: ["recommendationDescription", "recommendationType", "repairreplacementrequired"],
    requiredFields: [],
  },
  {
    title: "3. Risk Assessment (Before Implementation)",
    fields: ["consequenceSelectionType", "initialConsequence", "initialLikelihood", "initialRiskScore", "injuryPotential"],
    requiredFields: [],
  },
  {
    title: "4. Financial Impact & Loss Estimation",
    fields: ["assetRepairCost", "productionLossPerDay", "potentialRiskImpactMin", "potentialRiskImpactMedium", "potentialRiskImpactMax"],
    requiredFields: [],
  },
  {
    title: "5. Post-Implementation Risk",
    fields: ["finalConsequence", "finalLikelihood", "finalRiskScore"],
    requiredFields: [],
  },
  {
    title: "6. Recommendation Cost-Benefit Analysis",
    fields: ["benefitOfImplementation", "estimatedCostForImplementation", "shutdownRequirement"],
    requiredFields: [],
  },
  {
    title: "7. Timeline & Dates",
    fields: ["dateOfRecommendation", "targetImplementationDate", "actualImplementationDate", "ageOfRecommendation", "benefitAnalysisTargetDate", "numberOfOverdueDays"],
    requiredFields: [],
  },
  {
    title: "8. Responsibility & Approval",
    fields: ["recommendationInitiatedBy", "discussedWithHOD", "dateOfDiscussion", "responsiblePersonForClosure"],
    requiredFields: [],
  },
  {
    title: "9. Status & Decision",
    fields: ["recommendationStatus", "reasonForRejection", "rejectedBy", "eligibleForRecommendation"],
    requiredFields: [],
  },
  {
    title: "10. Additional Notes",
    fields: ["remarks"],
    requiredFields: [],
  },
];

// ─── Validation ──────────────────────────────────────────────────────────────
const validationSchema = Yup.object().shape({
  source: Yup.string().required("Source is required"),
  plantName: Yup.string().required("Plant Name is required"),
  location: Yup.string().required("Location is required"),
  section: Yup.string(),
  equipmentId: Yup.string(),
  equipmentType: Yup.string(),
  repairreplacementrequired: Yup.string().required("Repair/Replacement Required is required"),
  recommendationDescription: Yup.string().required("Recommendation Description is required"),
  recommendationType: Yup.string().required("Recommendation Type is required"),
  consequenceSelectionType: Yup.string(),
  initialConsequence: Yup.string(),
  initialLikelihood: Yup.string(),
  initialRiskScore: Yup.string(),
  injuryPotential: Yup.string(),
  assetRepairCost: Yup.number().typeError("Must be a number").nullable(),
  productionLossPerDay: Yup.number().typeError("Must be a number").nullable(),
  potentialRiskImpactMin: Yup.number().typeError("Must be a number").nullable(),
  potentialRiskImpactMedium: Yup.number().typeError("Must be a number").nullable(),
  potentialRiskImpactMax: Yup.number().typeError("Must be a number").nullable(),
  finalConsequence: Yup.string(),
  finalLikelihood: Yup.string(),
  finalRiskScore: Yup.string(),
  benefitOfImplementation: Yup.string(),
  estimatedCostForImplementation: Yup.number().typeError("Must be a number").nullable(),
  shutdownRequirement: Yup.string(),
  dateOfRecommendation: Yup.date().nullable().required("Date of Recommendation is required"),
  targetImplementationDate: Yup.date()
    .nullable()
    .min(Yup.ref("dateOfRecommendation"), "Target date cannot be before recommendation date"),
  actualImplementationDate: Yup.date().nullable(),
  ageOfRecommendation: Yup.string(),
  benefitAnalysisTargetDate: Yup.date().nullable(),
  numberOfOverdueDays: Yup.number().typeError("Must be a number").nullable(),
  recommendationInitiatedBy: Yup.string().required("Initiated By is required"),
  discussedWithHOD: Yup.string(),
  dateOfDiscussion: Yup.date().nullable(),
  responsiblePersonForClosure: Yup.string(),
  recommendationStatus: Yup.string(),
  reasonForRejection: Yup.string().when("recommendationStatus", {
    is: "reject",
    then: (s) => s.required("Reason for rejection is required when status is Reject"),
    otherwise: (s) => s.notRequired(),
  }),
  rejectedBy: Yup.string().when("recommendationStatus", {
    is: "reject",
    then: (s) => s.required("Rejected By is required when status is Reject"),
    otherwise: (s) => s.notRequired(),
  }),
  eligibleForRecommendation: Yup.string(),
  remarks: Yup.string(),
});

// ─── Props ───────────────────────────────────────────────────────────────────
interface RecommendationFormProps {
  initialData?: Partial<RecommendationFormValues>;
  onSubmit: (values: RecommendationFormValues) => Promise<void> | void;
  isUpdate?: boolean;
}

// ─── Component ───────────────────────────────────────────────────────────────
const RecommendationForm: React.FC<RecommendationFormProps> = ({
  initialData,
  onSubmit,
  isUpdate = false,
}) => {
  const { saveRecommendation } = useIndexedDB();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [savedRecNo, setSavedRecNo] = useState("");

  // ── Accordion state ──
  // In update mode: all sections unlocked from the start
  // In create mode: only first section unlocked
  const [currentSection, setCurrentSection] = useState(0);
  const [completedSections, setCompletedSections] = useState<Set<number>>(
    () => (isUpdate ? new Set(sections.map((_, i) => i)) : new Set<number>())
  );

  // Keep completedSections in sync if isUpdate changes (e.g. data loads async)
  useEffect(() => {
    if (isUpdate) {
      setCompletedSections(new Set(sections.map((_, i) => i)));
    }
  }, [isUpdate]);

  const highestUnlocked =
    completedSections.size > 0
      ? Math.max(...Array.from(completedSections)) + 1
      : 0;

  const isSectionUnlocked = useCallback(
    (idx: number) => isUpdate || idx <= highestUnlocked,
    [isUpdate, highestUnlocked]
  );

  const isSectionDone = useCallback(
    (idx: number) => completedSections.has(idx),
    [completedSections]
  );

  const handleAccordionClick = (idx: number) => {
    if (!isSectionUnlocked(idx)) return;
    setCurrentSection((prev) => (prev === idx ? -1 : idx));
  };

  const handleSaveSection = (
    sectionIdx: number,
    values: RecommendationFormValues,
    validateForm: () => Promise<Record<string, string>>
  ) => {
    const required = sections[sectionIdx].requiredFields;
    const hasEmpty = required.some((field) => {
      const val = values[field as keyof RecommendationFormValues];
      if (val === null || val === undefined) return true;
      if (typeof val === "string") return val.trim() === "";
      return false;
    });

    if (hasEmpty) {
      validateForm();
      return;
    }

    setCompletedSections((prev) => {
      const next = new Set(prev);
      next.add(sectionIdx);
      return next;
    });

    if (sectionIdx < sections.length - 1) {
      setCurrentSection(sectionIdx + 1);
    } else {
      setCurrentSection(-1);
    }
  };

  // ── Create flow submit ──
  const handleCreateSubmit = async (values: RecommendationFormValues) => {
    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 400));
      const saved = await saveRecommendation({
        ...values,
        status: values.recommendationStatus || "Open",
        estimatedCost: Number(values.estimatedCostForImplementation) || 0,
        initialRiskScore: values.initialRiskScore || "0",
        finalRiskScore: values.finalRiskScore || "0",
        source: values.source || "IM",
        location: values.location,
        changeHistory: [
          {
            id: Date.now().toString(),
            changedBy: values.recommendationInitiatedBy || "System",
            changedAt: new Date().toISOString(),
            changeType: "creation",
            remarks: "Recommendation created",
          },
        ],
      });
      setSavedRecNo(saved.recommendationNo);
      setShowSuccess(true);
      setTimeout(() => router.push("/recmd-tracker"), 2000);
    } catch (error) {
      console.error("Failed to save:", error);
      alert("Failed to save recommendation. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Final submit handler — routes to correct function ──
  const handleFinalSubmit = async (values: RecommendationFormValues) => {
    if (isUpdate) {
      await onSubmit(values);
    } else {
      await handleCreateSubmit(values);
    }
  };

  const mergedInitialValues: RecommendationFormValues = {
    ...emptyValues,
    ...initialData,
  };

  // ── Render field by name ──
  const renderField = (
    fieldName: string,
    values: RecommendationFormValues,
    handleChange: React.ChangeEventHandler<HTMLInputElement>,
    handleBlur: React.FocusEventHandler<HTMLInputElement>,
    setFieldValue: (field: string, value: unknown) => void,
    touched: Record<string, boolean | undefined>,
    errors: Record<string, string | undefined>
  ) => {
    switch (fieldName) {
      case "source":
        return (
          <div className="col-md-3" key="source">
            <SelectField
              label="Source *"
              name="source"
              value={sourceOptions.find((o) => o.value === values.source) || null}
              options={sourceOptions}
              onChange={(opt: SelectOptions) => setFieldValue("source", opt.value)}
              
              errors={touched.source && errors.source}
              placeholder="Select Source"
            />
          </div>
        );
      case "plantName":
        return (
          <div className="col-md-3" key="plantName">
            <SelectField
              label="SP *"
              name="plantName"
              value={plantNameOptions.find((o) => o.value === values.plantName) || null}
              options={plantNameOptions}
              onChange={(opt: SelectOptions) => setFieldValue("plantName", opt.value)}
              
              errors={touched.plantName && errors.plantName}
              placeholder="Select Plant Name"
            />
          </div>
        );
      case "location":
        return (
          <div className="col-md-3" key="location">
            <InputField
              label="Location *"
              type="text"
              name="location"
              value={values.location}
              onChange={handleChange}
              
              touched={touched.location}
              errors={errors.location}
              placeholder="Enter Location"
            />
          </div>
        );
      case "section":
        return (
          <div className="col-md-3" key="section">
            <InputField
              label="Section"
              type="text"
              name="section"
              value={values.section}
              onChange={handleChange}
              touched={touched.section}
              errors={errors.section}
              placeholder="Enter Section Name"
            />
          </div>
        );


        case "equipmentId":
        return (
          <div className="col-md-3" key="equipmentId">
            <InputField
              label="Equipment ID *"
              type="text"
              name="equipmentId"
              value={values.equipmentId}
              onChange={handleChange}
              touched={touched.equipmentId}
              errors={errors.equipmentId}
              placeholder="Enter Equipment ID"
            />
          </div>
        );


         case "equipmentDesc":
        return (
          <div className="col-md-6" key="equipmentDesc">
            <InputField
              label="Equipment Description "
              type="text"
              name="equipmentDesc"
              value={values.equipmentDesc}
              onChange={handleChange}
              touched={touched.equipmentDesc}
              errors={errors.equipmentDesc}
              placeholder="Enter Equipment Desc"
            />
          </div>
        );

         case "equipmentType":
        return (
          <div className="col-md-3" key="equipmentType">
            <SelectField
              label="Equipment Type *"
              name="equipmentType"
              value={equipmentTypeOptions.find((o) => o.value === values.equipmentType) || null}
              options={equipmentTypeOptions}
              onChange={(opt: SelectOptions) => setFieldValue("equipmentType", opt.value)}
              placeholder="Select Equipment Type"
            />
          </div>
        );
        

         case "repairreplacementrequired":
        return (
          <div className="col-md-3" key="repairreplacementrequired">
            <SelectField
              label="Repair/Replacement Required *"
              name="repairreplacementrequired"
              value={repairreplacementrequiredOptions.find((o) => o.value === values.repairreplacementrequired) || null}
              options={repairreplacementrequiredOptions}
              onChange={(opt: SelectOptions) => setFieldValue("repairreplacementrequired", opt.value)}
              placeholder="Select Yes/No"
            />
          </div>
        );

      case "recommendationDescription":
        return (
          <div className="col-md-9" key="recommendationDescription">
            <InputField
              label="Recommendation Description "
              type="text"
              name="recommendationDescription"
              value={values.recommendationDescription}
              onChange={handleChange}
              
              touched={touched.recommendationDescription}
              errors={errors.recommendationDescription}
              placeholder="Enter recommendation description"
            />
          </div>
        );
      case "recommendationType":
        return (
          <div className="col-md-3" key="recommendationType">
            <SelectField
              label="Recommendation Type *"
              name="recommendationType"
              value={recommendationTypeOptions.find((o) => o.value === values.recommendationType) || null}
              options={recommendationTypeOptions}
              onChange={(opt: SelectOptions) => setFieldValue("recommendationType", opt.value)}
              errors={touched.recommendationType && errors.recommendationType}
              placeholder="Recommendation Type"
            />
          </div>
        );
      case "consequenceSelectionType":
        return (
          <div className="col-md-3" key="consequenceSelectionType">
            <SelectField
              label="Consequence Selection Type *"
              name="consequenceSelectionType"
              value={consequenceSelectionTypeOptions.find((o) => o.value === values.consequenceSelectionType) || null}
              options={consequenceSelectionTypeOptions}
              onChange={(opt: SelectOptions) => setFieldValue("consequenceSelectionType", opt.value)}
              placeholder="Select Type"
            />
          </div>
        );
      case "initialConsequence":
        return (
          <div className="col-md-3" key="initialConsequence">
            <InputField
              label="Initial Consequence *"
              type="number"
              name="initialConsequence"
              value={values.initialConsequence}
              onChange={handleChange}
              touched={touched.initialConsequence}
              errors={errors.initialConsequence}
              placeholder="Enter Initial Consequence"
            />
          </div>
        );
      case "initialLikelihood":
        return (
          <div className="col-md-3" key="initialLikelihood">
            <InputField
              label="Initial Likelihood *"
              type="number"
              name="initialLikelihood"
              value={values.initialLikelihood}
              onChange={handleChange}
              
              touched={touched.initialLikelihood}
              errors={errors.initialLikelihood}
              placeholder="Enter Initial Likelihood"
            />
          </div>
        );
      case "initialRiskScore":
        return (
          <div className="col-md-3" key="initialRiskScore">
            <InputField
              label="Initial Risk Score *"
              type="number"
              name="initialRiskScore"
              value={values.initialRiskScore}
              onChange={handleChange}
              
              touched={touched.initialRiskScore}
              errors={errors.initialRiskScore}
              placeholder="Enter Initial Risk Score"
            />
          </div>
        );
      case "injuryPotential":
        return (
          <div className="col-md-3" key="injuryPotential">
            <SelectField
              label="Injury Potential *"
              name="injuryPotential"
              value={injuryPotentialOptions.find((o) => o.value === values.injuryPotential) || null}
              options={injuryPotentialOptions}
              onChange={(opt: SelectOptions) => setFieldValue("injuryPotential", opt.value)}
              placeholder="Select Injury Potential"
            />
          </div>
        );
      case "assetRepairCost":
        return (
          <div className="col-md-3" key="assetRepairCost">
            <InputField
              label="Asset Repair/Replacement Cost (₹) *"
              name="assetRepairCost"
              type="number"
              value={values.assetRepairCost}
              onChange={handleChange}
              
              touched={touched.assetRepairCost}
              errors={errors.assetRepairCost}
              placeholder="Enter cost"
            />
          </div>
        );
      case "productionLossPerDay":
        return (
          <div className="col-md-3" key="productionLossPerDay">
            <InputField
              label="Cost of Production Loss per Day (₹) *"
              name="productionLossPerDay"
              type="number"
              value={values.productionLossPerDay}
              onChange={handleChange}
              
              touched={touched.productionLossPerDay}
              errors={errors.productionLossPerDay}
              placeholder="Enter cost"
            />
          </div>
        );
      case "potentialRiskImpactMin":
        return (
          <div className="col-md-3" key="potentialRiskImpactMin">
            <InputField
              label="Potential Risk Impact (Min) (in Cr) *"
              name="potentialRiskImpactMin"
              type="number"
              value={values.potentialRiskImpactMin}
              onChange={handleChange}
              
              touched={touched.potentialRiskImpactMin}
              errors={errors.potentialRiskImpactMin}
              placeholder="Enter min impact"
            />
          </div>
        );
      case "potentialRiskImpactMedium":
        return (
          <div className="col-md-3" key="potentialRiskImpactMedium">
            <InputField
              label="Potential Risk Impact (Medium) (in Cr) *"
              name="potentialRiskImpactMedium"
              type="number"
              value={values.potentialRiskImpactMedium}
              onChange={handleChange}
              
              touched={touched.potentialRiskImpactMedium}
              errors={errors.potentialRiskImpactMedium}
              placeholder="Enter medium impact"
            />
          </div>
        );
      case "potentialRiskImpactMax":
        return (
          <div className="col-md-3" key="potentialRiskImpactMax">
            <InputField
              label="Potential Risk Impact (Max) (in Cr) *"
              name="potentialRiskImpactMax"
              type="number"
              value={values.potentialRiskImpactMax}
              onChange={handleChange}
              
              touched={touched.potentialRiskImpactMax}
              errors={errors.potentialRiskImpactMax}
              placeholder="Enter max impact"
            />
          </div>
        );
      case "finalConsequence":
        return (
          <div className="col-md-3" key="finalConsequence">
            <InputField
              label="Final Consequence *"
              name="finalConsequence"
              type="number"
              value={values.finalConsequence}
              onChange={handleChange}
              
              touched={touched.finalConsequence}
              errors={errors.finalConsequence}
              placeholder="Enter final consequence"
            />
          </div>
        );
      case "finalLikelihood":
        return (
          <div className="col-md-3" key="finalLikelihood">
            <InputField
              label="Final Likelihood *"
              name="finalLikelihood"
              type="number"
              value={values.finalLikelihood}
              onChange={handleChange}
              
              touched={touched.finalLikelihood}
              errors={errors.finalLikelihood}
              placeholder="Enter final likelihood"
            />
          </div>
        );
      case "finalRiskScore":
        return (
          <div className="col-md-4" key="finalRiskScore">
            <InputField
              label="Final Risk Score (Post Implementation) *"
              type="number"
              name="finalRiskScore"
              value={values.finalRiskScore}
              onChange={handleChange}
              placeholder="Final Risk Score"
            />
          </div>
        );
      case "benefitOfImplementation":
        return (
          <div className="col-md-12" key="benefitOfImplementation">
            <InputField
              type="text"
              label="Benefit of Implementing Recommendation *"
              name="benefitOfImplementation"
              value={values.benefitOfImplementation}
              onChange={handleChange}
              
              touched={touched.benefitOfImplementation}
              errors={errors.benefitOfImplementation}
              placeholder="Describe the benefits"
            />
          </div>
        );
      case "estimatedCostForImplementation":
        return (
          <div className="col-md-3" key="estimatedCostForImplementation">
            <InputField
              label="Estimated Cost for Implementation (in Cr) *"
              name="estimatedCostForImplementation"
              type="number"
              value={values.estimatedCostForImplementation}
              onChange={handleChange}
              
              touched={touched.estimatedCostForImplementation}
              errors={errors.estimatedCostForImplementation}
              placeholder="Enter cost"
            />
          </div>
        );
      case "shutdownRequirement":
        return (
          <div className="col-md-3" key="shutdownRequirement">
            <SelectField
              label="Shutdown Requirement *"
              name="shutdownRequirement"
              value={shutdownOptions.find((o) => o.value === values.shutdownRequirement) || null}
              options={shutdownOptions}
              onChange={(opt: SelectOptions) => setFieldValue("shutdownRequirement", opt.value)}
              placeholder="Select Yes/No"
            />
          </div>
        );
      case "dateOfRecommendation":
        return (
          <div className="col-md-3" key="dateOfRecommendation">
            <DatePickerField
              label="Date of Recommendation *"
              name="dateOfRecommendation"
              value={values.dateOfRecommendation}
              onChange={(date: Date | null) => setFieldValue("dateOfRecommendation", date)}
              errors={errors.dateOfRecommendation}
              touched={touched.dateOfRecommendation}
              dateFormat="yyyy-MM-dd"
              placeholder="Select Date"
            />
          </div>
        );
      case "targetImplementationDate":
        return (
          <div className="col-md-3" key="targetImplementationDate">
            <DatePickerField
              label="Target Implementation Date *"
              name="targetImplementationDate"
              value={values.targetImplementationDate}
              onChange={(date: Date | null) => setFieldValue("targetImplementationDate", date)}
              errors={errors.targetImplementationDate}
              touched={touched.targetImplementationDate}
              dateFormat="yyyy-MM-dd"
              placeholder="Select Date"
            />
          </div>
        );
      case "actualImplementationDate":
        return (
          <div className="col-md-3" key="actualImplementationDate">
            <DatePickerField
              label="Actual Implementation Date *"
              name="actualImplementationDate"
              value={values.actualImplementationDate}
              onChange={(date: Date | null) => setFieldValue("actualImplementationDate", date)}
              dateFormat="yyyy-MM-dd"
              placeholder="Select Date"
            />
          </div>
        );
      case "ageOfRecommendation":
        return (
          <div className="col-md-3" key="ageOfRecommendation">
            <InputField
              label="Age of Recommendation (Days) *"
              type="number"
              name="ageOfRecommendation"
              value={values.ageOfRecommendation}
              onChange={handleChange}
              placeholder="Age of Recommendation (Days)"
            />
          </div>
        );
      case "benefitAnalysisTargetDate":
        return (
          <div className="col-md-3" key="benefitAnalysisTargetDate">
            <DatePickerField
              label="Benefit Analysis Target Date *"
              name="benefitAnalysisTargetDate"
              value={values.benefitAnalysisTargetDate}
              onChange={(date: Date | null) => setFieldValue("benefitAnalysisTargetDate", date)}
              dateFormat="yyyy-MM-dd"
              placeholder="Select Date"
            />
          </div>
        );
      case "numberOfOverdueDays":
        return (
          <div className="col-md-3" key="numberOfOverdueDays">
            <InputField
              label="Number of Overdue Days *"
              name="numberOfOverdueDays"
              type="number"
              value={values.numberOfOverdueDays}
              onChange={handleChange}
              placeholder="Number of Overdue Days"
            />
          </div>
        );
      case "recommendationInitiatedBy":
        return (
          <div className="col-md-3" key="recommendationInitiatedBy">
            <InputField
              label="Recommendation Initiated By *"
              type="text"
              name="recommendationInitiatedBy"
              value={values.recommendationInitiatedBy}
              onChange={handleChange}
              
              touched={touched.recommendationInitiatedBy}
              errors={errors.recommendationInitiatedBy}
              placeholder="Enter name"
            />
          </div>
        );
      case "discussedWithHOD":
        return (
          <div className="col-md-3" key="discussedWithHOD">
            <SelectField
              label="Recommendation Discussed With HOD *"
              name="discussedWithHOD"
              value={shutdownOptions.find((o) => o.value === values.discussedWithHOD) || null}
              options={shutdownOptions}
              onChange={(opt: SelectOptions) => setFieldValue("discussedWithHOD", opt.value)}
              placeholder="Select Yes/No"
            />
          </div>
        );
      case "dateOfDiscussion":
        return (
          <div className="col-md-3" key="dateOfDiscussion">
            <DatePickerField
              label="Date of Discussion *"
              name="dateOfDiscussion"
              value={values.dateOfDiscussion}
              onChange={(date: Date | null) => setFieldValue("dateOfDiscussion", date)}
              dateFormat="yyyy-MM-dd"
              placeholder="Select Date"
            />
          </div>
        );
      case "responsiblePersonForClosure":
        return (
          <div className="col-md-3" key="responsiblePersonForClosure">
            <InputField
              label="Responsible Person for Closure *"
              type="text"
              name="responsiblePersonForClosure"
              value={values.responsiblePersonForClosure}
              onChange={handleChange}
              placeholder="Enter name"
            />
          </div>
        );
      case "recommendationStatus":
        return (
          <div className="col-md-3" key="recommendationStatus">
            <SelectField
              label="Recommendation Status *"
              name="recommendationStatus"
              value={statusOptions.find((o) => o.value === values.recommendationStatus) || null}
              options={statusOptions}
              onChange={(opt: SelectOptions) => setFieldValue("recommendationStatus", opt.value)}
              placeholder="Select Status"
            />
          </div>
        );
      case "reasonForRejection":
        return (
          <div className="col-md-3" key="reasonForRejection">
            <InputField
              label="Reason for Rejection (if rejected) *"
              type="text"
              name="reasonForRejection"
              value={values.reasonForRejection}
              onChange={handleChange}
              
              touched={touched.reasonForRejection}
              errors={errors.reasonForRejection}
              placeholder="Enter reason for rejection"
            />
          </div>
        );
      case "rejectedBy":
        return (
          <div className="col-md-3" key="rejectedBy">
            <InputField
              label="Rejected By *"
              type="text"
              name="rejectedBy"
              value={values.rejectedBy}
              onChange={handleChange}
              
              touched={touched.rejectedBy}
              errors={errors.rejectedBy}
              placeholder="Enter name"
            />
          </div>
        );
      case "eligibleForRecommendation":
        return (
          <div className="col-md-3" key="eligibleForRecommendation">
            <SelectField
              label="Eligible for Recommendation *"
              name="eligibleForRecommendation"
              value={yesNoOptions.find((o) => o.value === values.eligibleForRecommendation) || null}
              options={yesNoOptions}
              onChange={(opt: SelectOptions) => setFieldValue("eligibleForRecommendation", opt.value)}
              placeholder="Select Yes/No"
            />
          </div>
        );
      case "remarks":
        return (
          <div className="col-md-12" key="remarks">
            <InputField
              label="Remarks"
              type="text"
              name="remarks"
              value={values.remarks}
              onChange={handleChange}
              placeholder="Enter any additional remarks"
            />
          </div>
        );
      default:
        return null;
    }
  };

  // ── Render ──
  return (
    <Formik
      initialValues={mergedInitialValues}
      validationSchema={validationSchema}
      onSubmit={handleFinalSubmit}
      enableReinitialize
    >
      {({ values, handleChange, handleBlur, setFieldValue, touched, errors, validateForm, isSubmitting: formikSubmitting }) => (
        <Form className="recommendation-form">

          {/* Header */}
          <div className="admin-boxContainer d3">
            <div className="adminAction">
              <a className="adminAction__title" href="/recmd-tracker">
                <span className="icon">
                  <img width="15" height="15" alt="icon" className="img-fluid u-image" src="/images/svg/arrow-left-grey.svg" />
                </span>
                {isUpdate ? "Update Recommendation" : "Create Recommendation"}
              </a>
            </div>
          </div>

          {/* Success Banner */}
          {showSuccess && (
            <div className="alert alert-success mx-3 mt-2" role="alert">
              ✅ Recommendation <strong>{savedRecNo}</strong> saved successfully! Redirecting…
            </div>
          )}

          {/* Progress */}
          <div className="accordion-progress" style={{ padding: "8px 16px 4px", fontSize: "13px", color: "#6b7280" }}>
            {isUpdate
              ? `Editing — modify any section below`
              : `${completedSections.size} / ${sections.length} sections completed`}
          </div>

          {/* Accordions */}
          <div className="c-accordion__wrapper">
            {sections.map((section, idx) => {
              const unlocked = isSectionUnlocked(idx);
              const done = isSectionDone(idx);
              const isOpen = currentSection === idx;

              return (
                <div
                  key={idx}
                  className={[
                    "c-accordion",
                    !unlocked ? "c-accordion--locked" : "",
                    done ? "c-accordion--done" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  {/* Head */}
                  <div
                    className="c-accordion__head"
                    onClick={() => handleAccordionClick(idx)}
                    style={{ cursor: unlocked ? "pointer" : "not-allowed" }}
                  >
                    <div className="c-accordion__head--title" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      {/* Done badge */}
                      {done && (
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: 18,
                            height: 18,
                            borderRadius: "50%",
                            backgroundColor: "#16a34a",
                            color: "#fff",
                            fontSize: 11,
                            fontWeight: 700,
                            flexShrink: 0,
                          }}
                        >
                          ✓
                        </span>
                      )}
                      {/* Locked badge */}
                      {!unlocked && (
                        <span style={{ color: "#9ca3af", fontSize: 14 }}></span>
                      )}
                      {section.title}
                    </div>

                    <button
                      type="button"
                      className="c-accordion__head--btn"
                      disabled={!unlocked}
                    >
                      <img
                        height={20}
                        width={20}
                        alt="toggle"
                        className="img-fluid u-image"
                        src={isOpen ? "/images/svg/up-arrow.svg" : "/images/svg/down-arrow.svg"}
                      />
                    </button>
                  </div>

                  {/* Body */}
                  {isOpen && unlocked && (
                    <div className="c-accordion__body">
                      <div className="filters">
                        <div className="row form_grider d1">
                          {section.fields.map((fieldName) =>
                            renderField(
                              fieldName,
                              values,
                              handleChange as any,
                              handleBlur as any,
                              setFieldValue,
                              touched as any,
                              errors as any
                            )
                          )}
                        </div>
                      </div>

                      {/* Section actions */}
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "flex-end",
                          padding: "12px 0 4px",
                          gap: "10px",
                        }}
                      >
                        <button
                          type="button"
                          className="iconBtn green"
                          onClick={() => handleSaveSection(idx, values, validateForm as any)}
                        >
                          {isUpdate ? "Save Section" : "Save & Next"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Submit */}
          <div className="actionWrapper mt-4">
            <button
              type="submit"
              className="iconBtn green v2"
              disabled={isSubmitting || formikSubmitting}
            >
              <span>
                {isSubmitting || formikSubmitting
                  ? isUpdate
                    ? "Updating…"
                    : "Saving…"
                  : isUpdate
                  ? "Update Recommendation"
                  : "Submit"}
              </span>
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default RecommendationForm;