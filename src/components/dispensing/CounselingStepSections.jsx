import { ChecklistToggle } from './DispensingShared.jsx';
import { educationOptions } from './dispensingConfig.js';

export function StepFooter({ decision, onBackToMedicine, onRequestPharmacist, onStartNewCustomer }) {
  return (
    <section className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm">
    <div className="flex flex-wrap justify-end gap-2">
      <button type="button" onClick={onBackToMedicine} className="min-h-10 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-50">
        Pilih Obat Lain
      </button>
      {!decision.canPick ? (
        <button type="button" onClick={onRequestPharmacist} className="min-h-10 rounded-lg bg-amber-600 px-4 py-2 text-sm font-bold text-white hover:bg-amber-700">
          Konsultasi Apoteker
        </button>
      ) : null}
      <button type="button" onClick={onStartNewCustomer} className="min-h-10 rounded-lg bg-gray-900 px-4 py-2 text-sm font-bold text-white hover:bg-black">
        Mulai Customer Baru
      </button>
    </div>
    </section>
  );
}

export function NoLocationServicePanel({
  activeCustomer,
  selectedItems,
  pharmacistRequested,
  completedRecord,
  completedAtLabel,
  servedBy,
  setServedBy,
  serviceStatus,
  setServiceStatus,
  staffNote,
  setStaffNote,
  onSubmitServiceRecord,
}) {
  return (
    <section className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-gray-100 bg-gray-50 p-3">
          <p className="text-[11px] font-black uppercase tracking-wide text-gray-500">Customer</p>
          <p className="mt-1 font-bold text-gray-900">{activeCustomer.name}</p>
          <p className="mt-1 text-xs text-gray-600">
            Alergi: {activeCustomer.allergies.length ? activeCustomer.allergies.join(', ') : 'Tidak ada'}
          </p>
        </div>
        <div className="rounded-lg border border-gray-100 bg-gray-50 p-3">
          <p className="text-[11px] font-black uppercase tracking-wide text-gray-500">Obat</p>
          <p className="mt-1 font-bold text-gray-900">{selectedItems.length} obat dipilih</p>
          <p className="mt-1 text-xs text-gray-600">{selectedItems.map((item) => item.medicine.name).join(', ')}</p>
        </div>
      </div>
      {pharmacistRequested ? (
        <p className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-900">
          Permintaan konsultasi apoteker dicatat untuk transaksi ini.
        </p>
      ) : null}

      {completedRecord ? (
        <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 p-3">
          <p className="text-[11px] font-black uppercase tracking-wide text-emerald-700">Record Tersimpan</p>
          <p className="mt-1 font-bold text-gray-900">{completedRecord.finalStatusLabel}</p>
          <p className="mt-1 text-xs text-gray-600">
            {completedRecord.medicineNames?.join(', ')} untuk {completedRecord.customerName} dicatat pada {completedAtLabel}.
          </p>
        </div>
      ) : (
        <div className="mt-4 border-t border-gray-100 pt-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="text-xs font-bold uppercase tracking-wide text-gray-500">Staff / Apoteker</span>
              <input
                value={servedBy}
                onChange={(event) => setServedBy(event.target.value)}
                className="mt-1 min-h-10 w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm font-semibold text-gray-900 outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500"
              />
            </label>
            <label className="block">
              <span className="text-xs font-bold uppercase tracking-wide text-gray-500">Status akhir</span>
              <select
                value={serviceStatus === 'dispensed' ? 'consultation' : serviceStatus}
                onChange={(event) => setServiceStatus(event.target.value)}
                className="mt-1 min-h-10 w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm font-semibold text-gray-900 outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500"
              >
                <option value="consultation">Perlu konsultasi</option>
                <option value="cancelled">Batal</option>
              </select>
            </label>
          </div>
          <textarea
            value={staffNote}
            onChange={(event) => setStaffNote(event.target.value)}
            className="mt-3 min-h-24 w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2.5 text-sm outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500"
            placeholder="Tambahkan catatan konsultasi, alasan batal, atau instruksi apoteker."
          />
          <div className="mt-3 flex flex-wrap justify-end gap-2">
            <button
              type="button"
              onClick={() => onSubmitServiceRecord(serviceStatus === 'dispensed' ? 'consultation' : serviceStatus)}
              disabled={!servedBy.trim()}
              className="min-h-10 rounded-lg bg-gray-900 px-4 py-2 text-sm font-bold text-white hover:bg-black disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              Simpan ke Customer Record
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

export function EducationPanel({
  educationChecks,
  counselingDetails,
  hasEducationRecord,
  allEducationChecked,
  toggleEducationCheck,
  servedBy,
  setServedBy,
  serviceStatus,
  setServiceStatus,
  staffNote,
  setStaffNote,
  setClosingStep,
  onSubmitServiceRecord,
}) {
  return (
    <section className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-black uppercase tracking-wide text-gray-500">Edukasi & Catatan Staff</p>
          <h3 className="mt-1 text-lg font-black text-gray-900">Siapkan penyerahan dan record pelanggan</h3>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            Materi edukasi diambil dari rule AI safety dan database obat demo. Centang setiap topik setelah disampaikan.
          </p>
        </div>
        <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-black uppercase text-emerald-700">
          Edukasi
        </span>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.55fr)]">
        <div>
          <p className="text-xs font-black uppercase tracking-wide text-gray-500">Materi edukasi dari AI / database</p>
          <div className="mt-2 grid gap-3">
            {educationOptions.map((option) => (
              <article key={option.key} className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                <ChecklistToggle
                  label={option.label}
                  checked={educationChecks[option.key]}
                  onChange={() => toggleEducationCheck(option.key)}
                />
                <div className="mt-3 grid gap-2">
                  {counselingDetails.map((entry) => (
                    <div key={`${option.key}-${entry.medicineId}`} className="rounded-lg border border-gray-100 bg-white px-3 py-2">
                      <p className="text-xs font-black text-gray-900">{entry.medicineName}</p>
                      <p className="mt-1 text-xs leading-5 text-gray-600">{entry.details[option.key]}</p>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
          {!hasEducationRecord ? <p className="mt-2 text-xs font-medium text-amber-700">Belum ada edukasi yang dicentang. Record tetap bisa disimpan jika antrean mendesak.</p> : null}
          {!allEducationChecked ? <p className="mt-2 text-xs font-medium text-gray-500">Semua topik edukasi belum dicentang.</p> : null}
        </div>

        <div className="grid gap-3">
          <label className="block">
            <span className="text-xs font-bold uppercase tracking-wide text-gray-500">Staff / Apoteker</span>
            <input value={servedBy} onChange={(event) => setServedBy(event.target.value)} className="mt-1 min-h-10 w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm font-semibold text-gray-900 outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500" />
          </label>
          <label className="block">
            <span className="text-xs font-bold uppercase tracking-wide text-gray-500">Status akhir</span>
            <select value={serviceStatus} onChange={(event) => setServiceStatus(event.target.value)} className="mt-1 min-h-10 w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm font-semibold text-gray-900 outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500">
              <option value="dispensed">Diserahkan</option>
              <option value="consultation">Perlu konsultasi</option>
              <option value="cancelled">Batal</option>
            </select>
          </label>
          <label className="block">
            <span className="text-xs font-bold uppercase tracking-wide text-gray-500">Catatan staff opsional</span>
            <textarea value={staffNote} onChange={(event) => setStaffNote(event.target.value)} className="mt-1 min-h-28 w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2.5 text-sm outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500" placeholder="Tambahkan catatan untuk customer record, misalnya keluhan pelanggan, edukasi khusus, atau instruksi apoteker." />
          </label>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap justify-end gap-2">
        <button type="button" onClick={() => setClosingStep('picking')} className="min-h-10 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-50">
          Kembali Picking
        </button>
        <button type="button" onClick={() => onSubmitServiceRecord()} disabled={!servedBy.trim() || !allEducationChecked} className="min-h-10 rounded-lg bg-gray-900 px-4 py-2 text-sm font-bold text-white hover:bg-black disabled:cursor-not-allowed disabled:bg-gray-300">
          Simpan & Selesaikan Pelayanan
        </button>
      </div>
    </section>
  );
}

export function CompletionPanel({ completedRecord, completedAtLabel, onViewCustomerRecord, onStartNewCustomer }) {
  return (
    <section className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 shadow-sm">
      <p className="text-[11px] font-black uppercase tracking-wide text-emerald-700">Selesai</p>
      <h3 className="mt-1 text-lg font-black text-gray-900">Record pelayanan tersimpan</h3>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-emerald-100 bg-white/80 p-3">
          <p className="text-xs font-bold uppercase tracking-wide text-gray-500">Customer & Obat</p>
          <p className="mt-1 font-bold text-gray-900">{completedRecord?.customerName}</p>
          <p className="mt-1 text-xs text-gray-600">{completedRecord?.medicineNames?.join(', ')}</p>
        </div>
        <div className="rounded-lg border border-emerald-100 bg-white/80 p-3">
          <p className="text-xs font-bold uppercase tracking-wide text-gray-500">Status</p>
          <p className="mt-1 font-bold text-gray-900">{completedRecord?.finalStatusLabel}</p>
          <p className="mt-1 text-xs text-gray-600">{completedAtLabel}</p>
        </div>
        <div className="rounded-lg border border-emerald-100 bg-white/80 p-3">
          <p className="text-xs font-bold uppercase tracking-wide text-gray-500">Lokasi</p>
          <p className="mt-1 text-xs font-semibold leading-5 text-gray-900">
            {completedRecord?.medicines?.map((medicine) => `${medicine.medicineName}: ${medicine.locationText}`).join(' | ')}
          </p>
          <p className="mt-1 text-xs text-gray-600">{completedRecord?.branchName}</p>
        </div>
        <div className="rounded-lg border border-emerald-100 bg-white/80 p-3">
          <p className="text-xs font-bold uppercase tracking-wide text-gray-500">Safety & Staff</p>
          <p className="mt-1 font-bold text-gray-900">{completedRecord?.safetyLabel}</p>
          <p className="mt-1 text-xs text-gray-600">{completedRecord?.servedBy}</p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap justify-end gap-2">
        <button type="button" onClick={onViewCustomerRecord} className="min-h-10 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-50">
          Lihat Customer Record
        </button>
        <button type="button" onClick={onStartNewCustomer} className="min-h-10 rounded-lg bg-gray-900 px-4 py-2 text-sm font-bold text-white hover:bg-black">
          Mulai Customer Baru
        </button>
      </div>
    </section>
  );
}
