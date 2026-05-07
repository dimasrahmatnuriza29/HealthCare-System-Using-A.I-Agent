import { useMemo, useState } from 'react';
import { useCustomers } from '../contexts/CustomerContext.jsx';
import { branches } from '../data/branches.js';
import { medicines } from '../data/medicines.js';
import { evaluateSafetyAdvisor } from '../services/safetyService.js';
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
      selectedItems.map((item) => ({
        item,
        advisory: evaluateSafetyAdvisor(activeCustomer, item.medicine, item),
      })),
    [activeCustomer, selectedItems],
  );

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

  const checkSafety = () => {
    if (!activeCustomer || !selectedItems.length) return;
    setSafetyReviewedMedicineKey(selectedMedicineKey);
    resetClosingFlow();
    setCurrentStep('safety');
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
    toggleEducationCheck,
    submitServiceRecord,
  };
}
