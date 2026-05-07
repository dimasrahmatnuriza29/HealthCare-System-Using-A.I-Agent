import { LocationPinIcon } from '../ui/Icons.jsx';
import { ClosingWorkflowProgress, EmptyState } from './DispensingShared.jsx';
import { safetyTone } from './dispensingConfig.js';
import { formatRupiah } from './dispensingUtils.js';

function LocationFooter({ decision, onBackToMedicine, onRequestPharmacist, onStartNewCustomer }) {
  return (
    <section className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm">
    <div className="flex flex-wrap justify-end gap-2">
      <button
        type="button"
        onClick={onBackToMedicine}
        className="min-h-10 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-50"
      >
        Pilih Obat Lain
      </button>
      {!decision.canPick ? (
        <button
          type="button"
          onClick={onRequestPharmacist}
          className="min-h-10 rounded-lg bg-amber-600 px-4 py-2 text-sm font-bold text-white hover:bg-amber-700"
        >
          Konsultasi Apoteker
        </button>
      ) : null}
      <button
        type="button"
        onClick={onStartNewCustomer}
        className="min-h-10 rounded-lg bg-gray-900 px-4 py-2 text-sm font-bold text-white hover:bg-black"
      >
        Mulai Customer Baru
      </button>
    </div>
    </section>
  );
}

export default function LocationStep({
  activeCustomer,
  advisoryItems,
  selectedItems,
  decision,
  overallSafetyStatus,
  closingStep,
  pickedAt,
  completedRecord,
  setPickedAt,
  setClosingStep,
  onBackToMedicine,
  onRequestPharmacist,
  onStartNewCustomer,
}) {
  if (!activeCustomer || !advisoryItems.length) {
    return (
      <div className="px-3 sm:px-0">
        <EmptyState title="Aksi belum tersedia" message="Selesaikan safety check terlebih dahulu." />
      </div>
    );
  }

  const tone = safetyTone[overallSafetyStatus];
  const pickedAtLabel = pickedAt
    ? new Date(pickedAt).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })
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

      {decision.showLocation && closingStep === 'picking' ? (
        <section className="location-card-pulse overflow-hidden rounded-lg border border-rose-300 bg-rose-50 p-4 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wide text-rose-700">
                <LocationPinIcon />
                Lokasi Picking
              </p>
              <h3 className="mt-1 break-words text-xl font-black leading-tight text-gray-900">{selectedItems.length} obat siap diambil</h3>
              <p className="mt-1 text-xs font-semibold text-rose-700">Ambil semua obat sesuai lokasi masing-masing</p>
            </div>
            <span className="rounded-full border border-emerald-200 bg-white px-2.5 py-1 text-xs font-black text-emerald-700">Siap Picking</span>
          </div>

          <div className="mt-4 grid gap-3 lg:grid-cols-2">
            {selectedItems.map((item) => (
              <article key={`pick-${item.id}`} className="rounded-lg border border-rose-200 bg-white p-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <h4 className="text-sm font-black text-gray-900">{item.medicine.name}</h4>
                    <p className="mt-1 text-xs font-semibold text-rose-700">Zona {item.zone}</p>
                  </div>
                  <span className={`rounded-full border px-2 py-0.5 text-[10px] font-black ${item.status.badgeClass}`}>{item.status.label}</span>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {[
                    ['Storage', item.storage],
                    ['Kolom', item.kolom],
                    ['Rak', item.rak],
                  ].map(([label, value]) => (
                    <div key={`${item.id}-${label}`} className="rounded-lg border border-rose-100 bg-rose-50 p-2 text-center">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-rose-600">{label}</p>
                      <p className="mt-1 text-2xl font-black leading-none text-rose-700">{value}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-3 grid gap-2 text-xs sm:grid-cols-2">
                  <p className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 font-semibold text-gray-700">Stok: {item.stock} pcs</p>
                  <p className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 font-semibold text-gray-700">Harga: {formatRupiah(item.price)}</p>
                </div>
              </article>
            ))}
          </div>

          {pickedAt ? (
            <p className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-900">
              Semua obat ditandai diambil pada {pickedAtLabel}. Lanjutkan ke edukasi dan catatan sebelum penyerahan.
            </p>
          ) : null}

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm font-semibold text-gray-700">
              {pickedAt ? 'Picking selesai, belum diserahkan ke customer.' : 'Lokasi sudah dibuka. Ambil obat sesuai rak sebelum proses lanjut.'}
            </p>
            <div className="flex flex-wrap gap-2">
              {pickedAt ? (
                <>
                  <button
                    type="button"
                    onClick={() => setPickedAt(null)}
                    className="min-h-11 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-50"
                  >
                    Tandai Salah Ambil
                  </button>
                  <button
                    type="button"
                    onClick={() => setClosingStep('counseling')}
                    className="min-h-11 rounded-lg bg-gray-900 px-4 py-2 text-sm font-bold text-white hover:bg-black"
                  >
                    Lanjut Edukasi & Catatan
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setPickedAt(new Date().toISOString())}
                  className="min-h-11 rounded-lg bg-gray-900 px-4 py-2 text-sm font-bold text-white hover:bg-black"
                >
                  Ambil Semua Obat dari Rak
                </button>
              )}
            </div>
          </div>
        </section>
      ) : null}

      {closingStep !== 'complete' && !completedRecord ? (
        <LocationFooter
          decision={decision}
          onBackToMedicine={onBackToMedicine}
          onRequestPharmacist={onRequestPharmacist}
          onStartNewCustomer={onStartNewCustomer}
        />
      ) : null}
    </section>
  );
}
