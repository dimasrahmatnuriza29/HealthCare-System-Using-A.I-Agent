import { useMemo, useState } from 'react';
import { useCustomers } from '../contexts/CustomerContext.jsx';
import { branches } from '../data/branches.js';
import { isoMonographs, isoConditionContraindications } from '../data/isoReference.js';
import { medicines } from '../data/medicines.js';
import { mimsDrugInteractions, checkAllergyRisk } from '../data/mimsReference.js';
import { aiSafetyCheck } from '../services/huggingFaceService.js';
import {
  defaultEducationChecks,
  educationOptions,
} from '../components/dispensing/dispensingConfig.js';
import {
  buildCounselingDetails,
  buildInventoryRow,
  buildServiceRecordUpdate,
  getGroupDispensingDecision,
  getOverallSafetyStatus,
} from '../components/dispensing/dispensingUtils.js';

/**
 * Manages the staff dispensing workflow state and action handlers.
 *
 * @returns {object} Workflow state, computed data, setters, and actions.
 */
export default function useDispensingWorkflow() {
  const { customers, updateCustomer } = useCustomers();
  const [currentStep, setCurrentStep] = useState('customer');
  const [activeBranchId, setActiveBranchId] = useState('JKT001');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [selectedMedicineIds, setSelectedMedicineIds] = useState([]);
  const [safetyReviewedMedicineKey, setSafetyReviewedMedicineKey] = useState('');
  const [activeCustomerId, setActiveCustomerId] = useState(null);
  const [closingStep, setClosingStep] = useState('picking');
  const [pickedAt, setPickedAt] = useState(null);
  const [educationChecks, setEducationChecks] = useState(() => ({ ...defaultEducationChecks }));
  const [staffNote, setStaffNote] = useState('');
  const [servedBy, setServedBy] = useState('Demo Staff');
  const [serviceStatus, setServiceStatus] = useState('dispensed');
  const [completedRecord, setCompletedRecord] = useState(null);
  const [pharmacistRequested, setPharmacistRequested] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [aiError, setAiError] = useState(null);
  const [paymentData, setPaymentData] = useState(null);

  const activeBranch = useMemo(
    () => branches.find((branch) => branch.id === activeBranchId) ?? branches[0] ?? null,
    [activeBranchId],
  );

  const inventoryRows = useMemo(
    () => medicines.map((medicine) => buildInventoryRow(medicine, activeBranchId)),
    [activeBranchId],
  );

  const filteredRows = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const filtered = inventoryRows.filter((item) => {
      const categoryMatch = activeCategory === 'Semua' || item.medicine.category === activeCategory;
      const haystack = [
        item.medicine.name,
        item.medicine.dose,
        item.medicine.form,
        item.medicine.category,
        item.medicine.indications.join(' '),
        item.medicine.tags.join(' '),
      ]
        .join(' ')
        .toLowerCase();
      const searchMatch = !query || haystack.includes(query);
      return categoryMatch && searchMatch;
    });

    return [...filtered].sort((first, second) => {
      const direction = sortConfig.direction === 'asc' ? 1 : -1;
      if (sortConfig.key === 'stock') {
        return (first.stock - second.stock) * direction;
      }
      if (sortConfig.key === 'price') {
        return (first.price - second.price) * direction;
      }
      return first.medicine.name.localeCompare(second.medicine.name) * direction;
    });
  }, [activeCategory, inventoryRows, searchQuery, sortConfig]);

  const selectedItems = useMemo(
    () =>
      selectedMedicineIds
        .map((medicineId) => inventoryRows.find((item) => item.id === medicineId))
        .filter(Boolean),
    [inventoryRows, selectedMedicineIds],
  );

  const selectedMedicineKey = useMemo(() => selectedMedicineIds.join('|'), [selectedMedicineIds]);

  const activeCustomer = useMemo(
    () => customers.find((customer) => customer.id === activeCustomerId) ?? null,
    [activeCustomerId, customers],
  );

  const advisoryItems = useMemo(
    () =>
      selectedItems.map((item) => {
        const medId = item.id;
        const mono = isoMonographs[medId];
        const ageCategory = activeCustomer?.age <= 12 ? 'Anak' : activeCustomer?.age >= 60 ? 'Lansia' : 'Dewasa';
        const aiOk = aiResult?.success === true && aiResult?.source === 'ai';

        // =====================================================================
        // JIKA AI BERHASIL → pakai keputusan AI (berbasis ISO/MIMS di prompt)
        // =====================================================================
        if (aiOk) {
          const aiChecks = aiResult.checks || [];
          const findCheck = (type) => aiChecks.find(
            (c) => c.type === type && (c.medicineId === medId || c.medicineName === item.medicine.name || !c.medicineId)
          );

          const aiAllergy = findCheck('allergy');
          const aiContra = findCheck('contraindication');
          const aiInteraction = findCheck('interaction');
          const aiDosage = findCheck('dosage');

          const allergyCheck = aiAllergy
            ? { status: aiAllergy.status, message: `🤖 AI: ${aiAllergy.message} (Ref: ${aiAllergy.ref || 'MIMS'})` }
            : localAllergyCheck(activeCustomer, medId);

          const contraindicationCheck = aiContra
            ? { status: aiContra.status, message: `🤖 AI: ${aiContra.message} (Ref: ${aiContra.ref || 'ISO'})` }
            : localContraindicationCheck(activeCustomer, medId);

          const interactionCheck = aiInteraction
            ? { status: aiInteraction.status, message: `🤖 AI: ${aiInteraction.message} (Ref: ${aiInteraction.ref || 'MIMS'})` }
            : localInteractionCheck(selectedItems, activeCustomer, medId);

          const doseRecommendation = {
            dose: aiResult.doseRecommendation || aiDosage?.message || localDose(mono, ageCategory).dose,
            category: ageCategory,
            maxDaily: localDose(mono, ageCategory).maxDaily,
            notes: aiDosage?.message || mono?.warnings?.[0] || '',
          };

          const aiSafetyStatus = aiResult.safetyStatus || 'safe';
          const localStatuses = [allergyCheck.status, contraindicationCheck.status, interactionCheck.status];
          let safetyStatus = aiSafetyStatus;
          if (localStatuses.includes('danger')) safetyStatus = 'danger';
          else if (localStatuses.includes('warning') && safetyStatus === 'safe') safetyStatus = 'warning';

          return {
            item,
            advisory: {
              safetyStatus,
              doseRecommendation,
              allergyCheck,
              contraindicationCheck,
              interactionCheck,
              suggestion: `🤖 ${aiResult.staffAdvice || aiResult.summary || 'Analisa AI selesai.'}`,
              previousNotes: activeCustomer?.notes?.length ? activeCustomer.notes[0].text : 'Belum ada catatan.',
              ref: mono?.ref || '',
              source: 'ai',
              aiAlternatives: aiResult.alternatives || [],
              aiEducation: aiResult.educationPoints || [],
            },
          };
        }

        // =====================================================================
        // FALLBACK LOKAL → pakai data ISO/MIMS langsung (tanpa AI)
        // =====================================================================
        const allergyCheck = localAllergyCheck(activeCustomer, medId);
        const contraindicationCheck = localContraindicationCheck(activeCustomer, medId);
        const interactionCheck = localInteractionCheck(selectedItems, activeCustomer, medId);
        const doseRecommendation = localDose(mono, ageCategory);

        const statuses = [allergyCheck.status, contraindicationCheck.status, interactionCheck.status];
        let safetyStatus = 'safe';
        if (statuses.includes('danger')) safetyStatus = 'danger';
        else if (statuses.includes('warning')) safetyStatus = 'warning';

        const suggestion =
          safetyStatus === 'danger' ? 'JANGAN berikan obat ini. Konsultasi apoteker.' :
          safetyStatus === 'warning' ? 'Perlu perhatian khusus. Pastikan dosis tepat.' :
          'Obat aman untuk diberikan sesuai dosis.';

        return {
          item,
          advisory: {
            safetyStatus,
            doseRecommendation,
            allergyCheck,
            contraindicationCheck,
            interactionCheck,
            suggestion,
            previousNotes: activeCustomer?.notes?.length ? activeCustomer.notes[0].text : 'Belum ada catatan.',
            ref: mono?.ref || '',
            source: 'local',
          },
        };
      }),
    [activeCustomer, selectedItems, aiResult],
  );

  // ===========================================================================
  // Helper functions — cek lokal ISO/MIMS (fallback jika AI tidak tersedia)
  // ===========================================================================
  function localAllergyCheck(customer, medId) {
    let result = { status: 'safe', message: 'Tidak ada konflik alergi terdeteksi' };
    for (const allergy of (customer?.allergies || [])) {
      const risk = checkAllergyRisk(allergy, medId);
      if (risk?.risk === 'high') return { status: 'danger', message: `Alergi ${allergy}: ${risk.note} (Ref: ${risk.ref || 'MIMS'})` };
      if (risk?.risk === 'moderate') result = { status: 'warning', message: `Perhatian alergi ${allergy}: ${risk.note}` };
    }
    return result;
  }

  function localContraindicationCheck(customer, medId) {
    let result = { status: 'safe', message: 'Tidak ada kontraindikasi terdeteksi' };
    for (const cond of (customer?.conditions || [])) {
      const condData = isoConditionContraindications[cond];
      if (condData?.forbidden?.includes(medId)) return { status: 'danger', message: `KONTRAINDIKASI: ${cond.replace(/_/g, ' ')} — obat ini DILARANG (Ref: ISO)` };
      if (condData?.caution?.includes(medId)) result = { status: 'warning', message: `Perhatian: ${cond.replace(/_/g, ' ')} — perlu monitor (Ref: ISO)` };
    }
    return result;
  }

  function localInteractionCheck(items, customer, medId) {
    let result = { status: 'safe', message: 'Tidak ada interaksi berbahaya terdeteksi' };
    for (const other of items.filter((s) => s.id !== medId)) {
      const inter = mimsDrugInteractions.find(
        (i) => (i.drugA === medId && i.drugB === other.id) || (i.drugA === other.id && i.drugB === medId)
      );
      if (inter?.severity === 'major') return { status: 'danger', message: `Interaksi MAJOR dengan ${other.medicine.name}: ${inter.description}` };
      if (inter?.severity === 'moderate') result = { status: 'warning', message: `Interaksi moderate dengan ${other.medicine.name}: ${inter.description}` };
    }
    for (const curMed of (customer?.currentMedications || [])) {
      const inter = mimsDrugInteractions.find(
        (i) => (i.drugA === medId && i.drugBName?.toLowerCase().includes(curMed.toLowerCase().split(' ')[0])) ||
               (i.drugB === medId && i.drugAName?.toLowerCase().includes(curMed.toLowerCase().split(' ')[0]))
      );
      if (inter?.severity === 'major') return { status: 'danger', message: `Interaksi MAJOR dengan ${curMed}: ${inter.description}` };
    }
    return result;
  }

  function localDose(mono, ageCategory) {
    const doseData = mono?.dosage;
    const doseForAge = ageCategory === 'Anak' ? doseData?.child : ageCategory === 'Lansia' ? doseData?.elderly : doseData?.adult;
    return {
      dose: doseForAge?.standard || doseData?.adult?.standard || '-',
      category: ageCategory,
      maxDaily: doseForAge?.max || doseData?.adult?.max || '-',
      notes: mono?.warnings?.[0] || '',
    };
  }

  const overallSafetyStatus = getOverallSafetyStatus(advisoryItems);
  const safetyWasReviewed = Boolean(selectedItems.length && safetyReviewedMedicineKey === selectedMedicineKey);
  const decision = getGroupDispensingDecision(advisoryItems);
  const hasEducationRecord = Object.values(educationChecks).some(Boolean);
  const allEducationChecked = educationOptions.every((option) => educationChecks[option.key]);
  const counselingDetails = useMemo(
    () =>
      activeCustomer
        ? advisoryItems.map((entry) => buildCounselingDetails({ ...entry, customer: activeCustomer }))
        : [],
    [activeCustomer, advisoryItems],
  );

  const canOpenStep = (stepKey) => {
    if (stepKey === 'customer') return true;
    if (stepKey === 'medicine') return Boolean(activeCustomer);
    if (stepKey === 'safety') return Boolean(activeCustomer && selectedItems.length && safetyWasReviewed);
    if (stepKey === 'location') return Boolean(activeCustomer && selectedItems.length && safetyWasReviewed);
    return false;
  };

  const resetClosingFlow = () => {
    setClosingStep('picking');
    setPickedAt(null);
    setEducationChecks({ ...defaultEducationChecks });
    setStaffNote('');
    setServedBy('Demo Staff');
    setServiceStatus('dispensed');
    setCompletedRecord(null);
    setPharmacistRequested(false);
  };

  const resetMedicineFlow = () => {
    setSelectedMedicineIds([]);
    setSafetyReviewedMedicineKey('');
    resetClosingFlow();
  };

  const goToStep = (stepKey) => setCurrentStep(stepKey);

  const goBack = () => {
    const stepOrder = ['customer', 'medicine', 'safety', 'location'];
    const index = stepOrder.indexOf(currentStep);
    if (index > 0) setCurrentStep(stepOrder[index - 1]);
  };

  const reset = () => {
    setActiveCustomerId(null);
    setSearchQuery('');
    setActiveCategory('Semua');
    resetMedicineFlow();
    setCurrentStep('customer');
  };

  const changeBranch = (branchId) => {
    setActiveBranchId(branchId);
    setSafetyReviewedMedicineKey('');
    resetClosingFlow();
  };

  const selectCustomer = (customerId) => {
    setActiveCustomerId(customerId);
    resetMedicineFlow();
  };

  const continueFromCustomer = (customer) => {
    if (!customer?.id && !activeCustomer) return;
    if (customer?.id) setActiveCustomerId(customer.id);
    setCurrentStep('medicine');
  };

  const selectMedicine = (medicineId) => {
    setSelectedMedicineIds((current) =>
      current.includes(medicineId)
        ? current.filter((selectedId) => selectedId !== medicineId)
        : [...current, medicineId],
    );
    setSafetyReviewedMedicineKey('');
    resetClosingFlow();
  };

  const checkSafety = async () => {
    if (!activeCustomer || !selectedItems.length) return;
    setAiLoading(true);
    setAiError(null);
    setCurrentStep('safety');

    try {
      const medicineIds = selectedItems.map((item) => item.id);
      console.log('[AI] Calling safety check for:', medicineIds, 'customer:', activeCustomer?.name);
      const result = await aiSafetyCheck(medicineIds, activeCustomer, activeBranchId);
      console.log('[AI] Result:', result);
      if (result.success === false) {
        setAiError(result.error || 'AI gagal merespons');
      }
      setAiResult(result);
    } catch (error) {
      console.error('[AI] Exception:', error);
      setAiError(error.message || 'AI tidak dapat dihubungi');
      setAiResult({ safetyStatus: 'warning', summary: 'AI tidak tersedia.', checks: [] });
    } finally {
      setAiLoading(false);
      setSafetyReviewedMedicineKey(selectedMedicineKey);
      resetClosingFlow();
    }
  };

  const moveToFinalAction = ({ requestPharmacist = false } = {}) => {
    resetClosingFlow();
    if (requestPharmacist) {
      setPharmacistRequested(true);
      setServiceStatus('consultation');
    }
    setCurrentStep('location');
  };

  const toggleEducationCheck = (key) => {
    setEducationChecks((current) => ({
      ...current,
      [key]: !current[key],
    }));
  };

  const confirmPayment = (data) => {
    setPaymentData(data);
    setClosingStep('counseling');
  };

  const submitServiceRecord = (statusOverride) => {
    if (!activeCustomer || !advisoryItems.length || completedRecord) return;

    const { customerPatch, finalServiceStatus, record } = buildServiceRecordUpdate({
      activeCustomer,
      activeBranch,
      activeBranchId,
      advisoryItems,
      pickedAt,
      overallSafetyStatus,
      decision,
      educationChecks,
      counselingDetails,
      staffNote,
      servedBy,
      serviceStatus,
      statusOverride,
      pharmacistRequested,
    });

    updateCustomer(activeCustomer.id, customerPatch);
    setServiceStatus(finalServiceStatus);
    setCompletedRecord(record);
    setClosingStep('complete');
  };

  return {
    currentStep,
    aiLoading,
    aiResult,
    aiError,
    activeBranchId,
    searchQuery,
    activeCategory,
    sortConfig,
    selectedMedicineIds,
    safetyWasReviewed,
    activeCustomerId,
    closingStep,
    pickedAt,
    educationChecks,
    staffNote,
    servedBy,
    serviceStatus,
    completedRecord,
    pharmacistRequested,
    paymentData,
    activeBranch,
    inventoryRows,
    filteredRows,
    selectedItems,
    activeCustomer,
    advisoryItems,
    overallSafetyStatus,
    decision,
    hasEducationRecord,
    allEducationChecked,
    counselingDetails,
    setSearchQuery,
    setActiveCategory,
    setSortConfig,
    setClosingStep,
    setPickedAt,
    setEducationChecks,
    setStaffNote,
    setServedBy,
    setServiceStatus,
    setPharmacistRequested,
    canOpenStep,
    goToStep,
    goBack,
    reset,
    changeBranch,
    selectCustomer,
    continueFromCustomer,
    selectMedicine,
    checkSafety,
    moveToFinalAction,
    confirmPayment,
    toggleEducationCheck,
    submitServiceRecord,
  };
}
