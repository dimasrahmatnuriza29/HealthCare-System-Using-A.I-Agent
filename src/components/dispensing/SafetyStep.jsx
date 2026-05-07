import { safetyTone } from './dispensingConfig.js';
import { CustomerContextStrip, EmptyState, SafetyCheckItem } from './DispensingShared.jsx';
import { formatRupiah } from './dispensingUtils.js';

export default function SafetyStep({
  activeCustomer,
  advisoryItems,
  overallSafetyStatus,
  decision,
  onChangeCustomer,
  onBackToMedicine,
  onMoveToFinalAction,
}) {
  if (!activeCustomer || !advisoryItems.length) {
    return (
      <div className="px-3 sm:px-0">
        <EmptyState title="Safety check belum siap" message="Pilih customer dan obat terlebih dahulu." />
      </div>
    );
  }

  const tone = safetyTone[overallSafetyStatus];

  return (
    <section className="grid gap-4 px-3 sm:px-0">
      <CustomerContextStrip customer={activeCustomer} onChangeCustomer={onChangeCustomer} />

      <section className={`rounded-lg border p-4 shadow-sm ${tone.panel}`}>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] font-black uppercase tracking-wide opacity-80">AI Safety Check</p>
            <h2 className="mt-1 break-words text-xl font-black leading-tight">{tone.label}</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6">
              {advisoryItems.length} obat dicek untuk {activeCustomer.name}. Status transaksi mengikuti risiko tertinggi dari seluruh obat.
            </p>
          </div>
          <span className="rounded-full border border-white/70 bg-white/70 px-3 py-1 text-xs font-black uppercase">
            Rule-based MVP
          </span>
        </div>
      </section>

      <section className="grid gap-4">
        {advisoryItems.map(({ item, advisory }) => (
          <article key={`safety-${item.id}`} className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[11px] font-black uppercase tracking-wide text-gray-500">Obat Dipilih</p>
                <h3 className="mt-1 text-lg font-black text-gray-900">{item.medicine.name}</h3>
                <p className="mt-1 text-xs text-gray-500">
                  {item.medicine.category} - Stok {item.stock === 0 ? 'Habis' : `${item.stock} pcs`} - {formatRupiah(item.price)}
                </p>
              </div>
              <span className={`rounded-full border px-3 py-1 text-xs font-black uppercase ${safetyTone[advisory.safetyStatus].chip}`}>
                {safetyTone[advisory.safetyStatus].label}
              </span>
            </div>

            <div className="mt-3 grid gap-3 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
              <div className="rounded-lg border border-gray-100 bg-gray-50 p-3">
                <p className="text-[11px] font-black uppercase tracking-wide text-gray-500">Rekomendasi Dosis</p>
                <p className="mt-1 text-sm font-semibold leading-6 text-gray-800">{advisory.doseRecommendation.dose}</p>
                <p className="mt-1 text-xs leading-5 text-gray-500">
                  Kategori: {advisory.doseRecommendation.category}. Maks: {advisory.doseRecommendation.maxDaily}
                </p>
              </div>

              <div className="grid gap-2 sm:grid-cols-2">
                <SafetyCheckItem label="Cek Alergi" check={advisory.allergyCheck} />
                <SafetyCheckItem label="Cek Usia / Dosis" check={{ status: advisory.safetyStatus === 'danger' ? 'danger' : 'safe', message: advisory.doseRecommendation.notes }} />
                <SafetyCheckItem label="Cek Riwayat Obat" check={advisory.interactionCheck} />
                <SafetyCheckItem label="Cek Kontraindikasi" check={advisory.contraindicationCheck} />
              </div>
            </div>

            <div className="mt-3 rounded-lg border border-violet-100 bg-violet-50 p-3">
              <p className="text-[11px] font-black uppercase tracking-wide text-violet-700">Saran Staff</p>
              <p className="mt-1 text-sm leading-6 text-gray-800">{advisory.suggestion}</p>
              <p className="mt-2 text-xs leading-5 text-gray-500">Catatan sebelumnya: {advisory.previousNotes}</p>
            </div>
          </article>
        ))}
      </section>

      <section className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm">
        <div className="flex flex-wrap justify-end gap-2">
          <button
            type="button"
            onClick={onBackToMedicine}
            className="min-h-10 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-50"
          >
            Pilih Obat Lain
          </button>
          {decision.canPick ? (
            <button
              type="button"
              onClick={() => onMoveToFinalAction()}
              className="min-h-10 rounded-lg bg-gray-900 px-4 py-2 text-sm font-bold text-white hover:bg-black"
            >
              Lanjut ke Lokasi Obat
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onMoveToFinalAction({ requestPharmacist: true })}
              className="min-h-10 rounded-lg bg-amber-600 px-4 py-2 text-sm font-bold text-white hover:bg-amber-700"
            >
              Konsultasi Apoteker
            </button>
          )}
        </div>
      </section>
    </section>
  );
}
