import { ClosingWorkflowProgress, EmptyState } from './DispensingShared.jsx';
import { safetyTone } from './dispensingConfig.js';
import {
  CompletionPanel,
  EducationPanel,
  NoLocationServicePanel,
  StepFooter,
} from './CounselingStepSections.jsx';

export default function CounselingStep({
  activeCustomer,
  advisoryItems,
  selectedItems,
  decision,
  overallSafetyStatus,
  closingStep,
  completedRecord,
  pharmacistRequested,
  serviceStatus,
  setServiceStatus,
  staffNote,
  setStaffNote,
  servedBy,
  setServedBy,
  educationChecks,
  counselingDetails,
  hasEducationRecord,
  allEducationChecked,
  toggleEducationCheck,
  setClosingStep,
  onSubmitServiceRecord,
  onBackToMedicine,
  onRequestPharmacist,
  onStartNewCustomer,
  onViewCustomerRecord,
}) {
  if (!activeCustomer || !advisoryItems.length) {
    return (
      <div className="px-3 sm:px-0">
        <EmptyState title="Aksi belum tersedia" message="Selesaikan safety check terlebih dahulu." />
      </div>
    );
  }

  const tone = safetyTone[overallSafetyStatus];
  const completedAtLabel = completedRecord?.submittedAt
    ? new Date(completedRecord.submittedAt).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })
    : null;

  return (
    <section className="grid gap-4 px-3 sm:px-0">
      <section className={`rounded-lg border p-4 shadow-sm ${decision.tone}`}>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] font-black uppercase tracking-wide opacity-80">Keputusan Tindakan</p>
            <h2 className="mt-1 break-words text-xl font-black leading-tight">{decision.title}</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6">{decision.message}</p>
          </div>
          <span className={`rounded-full border px-3 py-1 text-xs font-black uppercase ${tone.chip}`}>{tone.label}</span>
        </div>
      </section>

      {decision.showLocation ? <ClosingWorkflowProgress currentStep={closingStep} /> : null}

      {!decision.showLocation ? (
        <NoLocationServicePanel
          activeCustomer={activeCustomer}
          selectedItems={selectedItems}
          pharmacistRequested={pharmacistRequested}
          completedRecord={completedRecord}
          completedAtLabel={completedAtLabel}
          servedBy={servedBy}
          setServedBy={setServedBy}
          serviceStatus={serviceStatus}
          setServiceStatus={setServiceStatus}
          staffNote={staffNote}
          setStaffNote={setStaffNote}
          onSubmitServiceRecord={onSubmitServiceRecord}
        />
      ) : null}

      {decision.showLocation && closingStep === 'counseling' ? (
        <EducationPanel
          educationChecks={educationChecks}
          counselingDetails={counselingDetails}
          hasEducationRecord={hasEducationRecord}
          allEducationChecked={allEducationChecked}
          toggleEducationCheck={toggleEducationCheck}
          servedBy={servedBy}
          setServedBy={setServedBy}
          serviceStatus={serviceStatus}
          setServiceStatus={setServiceStatus}
          staffNote={staffNote}
          setStaffNote={setStaffNote}
          setClosingStep={setClosingStep}
          onSubmitServiceRecord={onSubmitServiceRecord}
        />
      ) : null}

      {decision.showLocation && closingStep === 'complete' ? (
        <CompletionPanel
          completedRecord={completedRecord}
          completedAtLabel={completedAtLabel}
          onViewCustomerRecord={onViewCustomerRecord}
          onStartNewCustomer={onStartNewCustomer}
        />
      ) : null}

      {closingStep !== 'complete' && !completedRecord ? (
        <StepFooter
          decision={decision}
          onBackToMedicine={onBackToMedicine}
          onRequestPharmacist={onRequestPharmacist}
          onStartNewCustomer={onStartNewCustomer}
        />
      ) : null}
    </section>
  );
}
