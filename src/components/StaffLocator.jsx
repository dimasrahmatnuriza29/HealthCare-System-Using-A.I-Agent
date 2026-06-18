import useDispensingWorkflow from '../hooks/useDispensingWorkflow.js';
import CounselingStep from './dispensing/CounselingStep.jsx';
import CustomerStep from './dispensing/CustomerStep.jsx';
import { WorkflowStepper } from './dispensing/DispensingShared.jsx';
import LocationStep from './dispensing/LocationStep.jsx';
import MedicineStep from './dispensing/MedicineStep.jsx';
import PaymentStep from './dispensing/PaymentStep.jsx';
import SafetyStep from './dispensing/SafetyStep.jsx';
import StaffLocatorHeader from './dispensing/StaffLocatorHeader.jsx';

export default function StaffLocator({ onBack }) {
  const workflow = useDispensingWorkflow();

  const renderStep = () => {
    if (workflow.currentStep === 'customer') {
      return (
        <CustomerStep
          activeCustomerId={workflow.activeCustomerId}
          onSelectCustomer={workflow.selectCustomer}
          onContinue={workflow.continueFromCustomer}
        />
      );
    }

    if (workflow.currentStep === 'medicine') {
      return (
        <MedicineStep
          activeCustomer={workflow.activeCustomer}
          searchQuery={workflow.searchQuery}
          setSearchQuery={workflow.setSearchQuery}
          sortConfig={workflow.sortConfig}
          setSortConfig={workflow.setSortConfig}
          activeCategory={workflow.activeCategory}
          setActiveCategory={workflow.setActiveCategory}
          selectedItems={workflow.selectedItems}
          filteredRows={workflow.filteredRows}
          inventoryRows={workflow.inventoryRows}
          selectedMedicineIds={workflow.selectedMedicineIds}
          safetyWasReviewed={workflow.safetyWasReviewed}
          activeBranchId={workflow.activeBranchId}
          onChangeCustomer={() => workflow.goToStep('customer')}
          onSelectMedicine={workflow.selectMedicine}
          onCheckSafety={workflow.checkSafety}
        />
      );
    }

    if (workflow.currentStep === 'safety') {
      return (
        <SafetyStep
          activeCustomer={workflow.activeCustomer}
          advisoryItems={workflow.advisoryItems}
          overallSafetyStatus={workflow.overallSafetyStatus}
          decision={workflow.decision}
          aiLoading={workflow.aiLoading}
          aiResult={workflow.aiResult}
          aiError={workflow.aiError}
          onChangeCustomer={() => workflow.goToStep('customer')}
          onBackToMedicine={() => workflow.goToStep('medicine')}
          onMoveToFinalAction={workflow.moveToFinalAction}
        />
      );
    }

    if (workflow.currentStep === 'location' && workflow.decision.showLocation && workflow.closingStep === 'picking') {
      return (
        <LocationStep
          activeCustomer={workflow.activeCustomer}
          advisoryItems={workflow.advisoryItems}
          selectedItems={workflow.selectedItems}
          decision={workflow.decision}
          overallSafetyStatus={workflow.overallSafetyStatus}
          closingStep={workflow.closingStep}
          pickedAt={workflow.pickedAt}
          completedRecord={workflow.completedRecord}
          setPickedAt={workflow.setPickedAt}
          setClosingStep={workflow.setClosingStep}
          onBackToMedicine={() => workflow.goToStep('medicine')}
          onRequestPharmacist={() => workflow.setPharmacistRequested(true)}
          onStartNewCustomer={workflow.reset}
        />
      );
    }

    if (workflow.currentStep === 'location' && workflow.closingStep === 'payment') {
      return (
        <PaymentStep
          activeCustomer={workflow.activeCustomer}
          selectedItems={workflow.selectedItems}
          closingStep={workflow.closingStep}
          onConfirmPayment={workflow.confirmPayment}
          onBackToPicking={() => workflow.setClosingStep('picking')}
        />
      );
    }

    if (workflow.currentStep === 'location') {
      return (
        <CounselingStep
          activeCustomer={workflow.activeCustomer}
          advisoryItems={workflow.advisoryItems}
          selectedItems={workflow.selectedItems}
          decision={workflow.decision}
          overallSafetyStatus={workflow.overallSafetyStatus}
          closingStep={workflow.closingStep}
          completedRecord={workflow.completedRecord}
          pharmacistRequested={workflow.pharmacistRequested}
          serviceStatus={workflow.serviceStatus}
          setServiceStatus={workflow.setServiceStatus}
          staffNote={workflow.staffNote}
          setStaffNote={workflow.setStaffNote}
          servedBy={workflow.servedBy}
          setServedBy={workflow.setServedBy}
          educationChecks={workflow.educationChecks}
          counselingDetails={workflow.counselingDetails}
          hasEducationRecord={workflow.hasEducationRecord}
          allEducationChecked={workflow.allEducationChecked}
          toggleEducationCheck={workflow.toggleEducationCheck}
          setClosingStep={workflow.setClosingStep}
          onSubmitServiceRecord={workflow.submitServiceRecord}
          onBackToMedicine={() => workflow.goToStep('medicine')}
          onRequestPharmacist={() => workflow.setPharmacistRequested(true)}
          onStartNewCustomer={workflow.reset}
          onViewCustomerRecord={() => workflow.goToStep('customer')}
        />
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-50 pb-8">
      <StaffLocatorHeader
        activeBranchId={workflow.activeBranchId}
        onBack={onBack}
        onChangeBranch={workflow.changeBranch}
      />

      <main className="grid min-w-0 max-w-full gap-3 overflow-x-hidden py-2.5 sm:mx-auto sm:w-full sm:max-w-6xl sm:overflow-visible sm:px-4 sm:py-4">
        <WorkflowStepper currentStep={workflow.currentStep} canOpenStep={workflow.canOpenStep} onOpenStep={workflow.goToStep} />
        {renderStep()}
      </main>
    </div>
  );
}
