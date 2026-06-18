import { isoMonographs, isoConditionContraindications } from '../../data/isoReference.js';
import { mimsDrugInteractions, mimsCrossReactivity, mimsTherapeuticClass, mimsSpecialPopulations, checkAllergyRisk } from '../../data/mimsReference.js';
import { medicinesExpanded } from '../../data/medicinesExpanded.js';
import { safetyTone } from './dispensingConfig.js';
import { CustomerContextStrip, EmptyState, SafetyCheckItem } from './DispensingShared.jsx';
import { formatRupiah } from './dispensingUtils.js';

export default function SafetyStep({
  activeCustomer,
  advisoryItems,
  overallSafetyStatus,
  decision,
  aiLoading,
  aiResult,
  aiError,
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

      {aiLoading && (
        <section className="rounded-lg border border-blue-200 bg-blue-50 p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
            <div>
              <p className="text-sm font-bold text-blue-900">AI sedang menganalisis...</p>
              <p className="text-xs text-blue-700">Mengecek ISO/MIMS + profil customer + history obat</p>
            </div>
          </div>
        </section>
      )}

      {aiError && (
        <section className="rounded-lg border border-amber-200 bg-amber-50 p-3 shadow-sm">
          <p className="text-xs font-bold text-amber-800">⚠️ AI Error: {aiError}</p>
        </section>
      )}

      <section className={`rounded-lg border p-4 shadow-sm ${tone.panel}`}>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] font-black uppercase tracking-wide opacity-80">AI Safety Check</p>
            <h2 className="mt-1 break-words text-xl font-black leading-tight">{tone.label}</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6">
              {aiResult?.summary || `${advisoryItems.length} obat dicek untuk ${activeCustomer.name}. Status mengikuti risiko tertinggi.`}
            </p>
          </div>
          <span className={`rounded-full border px-3 py-1 text-xs font-black uppercase ${
            advisoryItems[0]?.advisory?.source === 'ai'
              ? 'border-emerald-300 bg-emerald-100 text-emerald-700'
              : 'border-gray-300 bg-white/70 text-gray-600'
          }`}>
            {advisoryItems[0]?.advisory?.source === 'ai' ? '🤖 AI (ISO/MIMS)' : '📋 Lokal ISO/MIMS'}
          </span>
        </div>
        {aiResult?.references?.length > 0 && (
          <div className="mt-3 rounded-lg border border-white/50 bg-white/40 p-2">
            <p className="text-[10px] font-bold uppercase text-gray-600">Referensi ISO/MIMS:</p>
            <p className="mt-1 text-xs text-gray-700">{aiResult.references.join(' • ')}</p>
          </div>
        )}
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
              <p className="text-[11px] font-black uppercase tracking-wide text-violet-700">Saran AI untuk Staff</p>
              <p className="mt-1 text-sm leading-6 text-gray-800">{advisory.suggestion}</p>
              <p className="mt-2 text-xs leading-5 text-gray-500">Catatan sebelumnya: {advisory.previousNotes}</p>
              {advisory.ref && (
                <p className="mt-1 text-[10px] font-semibold text-violet-600">📖 Ref: {advisory.ref}</p>
              )}
            </div>

            {/* ISO KNOWLEDGE PANEL */}
            <ISOPanel medicineId={item.id} customer={activeCustomer} />

            {/* MIMS KNOWLEDGE PANEL */}
            <MIMSPanel medicineId={item.id} customer={activeCustomer} />
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

// ===========================================================================
// ISO Knowledge Panel — menampilkan data monografi ISO untuk tiap obat
// ===========================================================================
function ISOPanel({ medicineId, customer }) {
  const mono = isoMonographs[medicineId];
  if (!mono) return null;

  // Cek kontraindikasi berdasarkan kondisi customer
  const customerConditions = customer?.conditions || [];
  const contraindications = [];
  const cautions = [];
  for (const cond of customerConditions) {
    const condData = isoConditionContraindications[cond];
    if (condData?.forbidden?.includes(medicineId)) {
      contraindications.push(cond.replace(/_/g, ' '));
    }
    if (condData?.caution?.includes(medicineId)) {
      cautions.push(cond.replace(/_/g, ' '));
    }
  }

  return (
    <div className="mt-3 rounded-lg border border-teal-200 bg-teal-50 p-3">
      <p className="text-[11px] font-black uppercase tracking-wide text-teal-700">
        📋 Referensi ISO (Informasi Spesialite Obat)
      </p>
      <div className="mt-2 grid gap-2 text-xs sm:grid-cols-2">
        <div>
          <p className="font-bold text-teal-800">Nama Generik</p>
          <p className="text-gray-700">{mono.genericName}</p>
        </div>
        <div>
          <p className="font-bold text-teal-800">Kelas Terapi</p>
          <p className="text-gray-700">{mono.class || '-'}</p>
        </div>
        <div>
          <p className="font-bold text-teal-800">Brand</p>
          <p className="text-gray-700">{mono.brandNames?.join(', ') || '-'}</p>
        </div>
        <div>
          <p className="font-bold text-teal-800">Kategori Kehamilan</p>
          <p className="text-gray-700">{mono.pregnancyCategory || '-'} {mono.pregnancyNote ? `— ${mono.pregnancyNote}` : ''}</p>
        </div>
        <div className="sm:col-span-2">
          <p className="font-bold text-teal-800">Dosis Dewasa</p>
          <p className="text-gray-700">{mono.dosage?.adult?.standard || '-'} (Maks: {mono.dosage?.adult?.max || '-'})</p>
        </div>
        {mono.dosage?.child && (
          <div className="sm:col-span-2">
            <p className="font-bold text-teal-800">Dosis Anak</p>
            <p className="text-gray-700">{mono.dosage.child.standard || '-'} (Maks: {mono.dosage.child.max || '-'})</p>
          </div>
        )}
        {mono.dosage?.elderly && (
          <div className="sm:col-span-2">
            <p className="font-bold text-teal-800">Dosis Lansia</p>
            <p className="text-gray-700">{mono.dosage.elderly.standard || '-'} (Maks: {mono.dosage.elderly.max || '-'})</p>
          </div>
        )}
        {mono.sideEffects?.length > 0 && (
          <div className="sm:col-span-2">
            <p className="font-bold text-teal-800">Efek Samping</p>
            <p className="text-gray-700">{mono.sideEffects.join(', ')}</p>
          </div>
        )}
        {mono.warnings?.length > 0 && (
          <div className="sm:col-span-2">
            <p className="font-bold text-teal-800">Peringatan</p>
            <p className="text-gray-700">{mono.warnings.join('; ')}</p>
          </div>
        )}
        {mono.contraindications?.length > 0 && (
          <div className="sm:col-span-2">
            <p className="font-bold text-teal-800">Kontraindikasi (ISO)</p>
            <ul className="mt-0.5 space-y-0.5">
              {mono.contraindications.map((c, i) => (
                <li key={i} className="text-gray-700">
                  <span className={`mr-1 rounded px-1 py-0.5 text-[10px] font-bold ${c.severity === 'absolut' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                    {c.severity?.toUpperCase()}
                  </span>
                  {c.condition}
                </li>
              ))}
            </ul>
          </div>
        )}
        {mono.ref && (
          <div className="sm:col-span-2">
            <p className="font-bold text-teal-800">Referensi</p>
            <p className="text-gray-600 italic">{mono.ref}</p>
          </div>
        )}
      </div>

      {(contraindications.length > 0 || cautions.length > 0) && (
        <div className="mt-2 rounded border border-red-200 bg-red-50 p-2">
          {contraindications.length > 0 && (
            <p className="text-xs font-bold text-red-700">
              🚫 KONTRAINDIKASI untuk customer ini: {contraindications.join(', ')}
            </p>
          )}
          {cautions.length > 0 && (
            <p className="mt-1 text-xs font-bold text-amber-700">
              ⚠️ PERHATIAN: {cautions.join(', ')}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// ===========================================================================
// MIMS Knowledge Panel — menampilkan data MIMS lengkap untuk tiap obat
// ===========================================================================
function MIMSPanel({ medicineId, customer }) {
  const med = medicinesExpanded.find((m) => m.id === medicineId);

  // 1. Interaksi obat dari MIMS
  const interactions = mimsDrugInteractions.filter(
    (i) => i.drugA === medicineId || i.drugB === medicineId
  );

  // 2. Risiko alergi silang
  const allergyRisks = [];
  for (const allergy of (customer?.allergies || [])) {
    const risk = checkAllergyRisk(allergy, medicineId);
    if (risk) allergyRisks.push({ allergy, ...risk });
  }

  // 3. Kelas terapi MIMS — cari indikasi obat ini di mimsTherapeuticClass
  const therapeuticEntries = [];
  for (const [indication, data] of Object.entries(mimsTherapeuticClass)) {
    if (data.firstLine?.includes(medicineId) || data.secondLine?.includes(medicineId)) {
      const isFirst = data.firstLine?.includes(medicineId);
      therapeuticEntries.push({
        indication: indication.replace(/_/g, ' '),
        line: isFirst ? 'Lini Pertama' : 'Lini Kedua',
        notes: data.notes,
      });
    }
  }

  // 4. Cross-reactivity groups terkait obat ini
  const crossGroups = mimsCrossReactivity.filter((g) =>
    g.crossReactDrugs.some((d) => d.drugId === medicineId)
  );

  // 5. Populasi khusus — cek usia customer
  const customerAge = customer?.age ?? 0;
  let specialPopNote = null;
  if (customerAge <= 12) {
    const ageGroup = mimsSpecialPopulations.pediatric.ageGroups.find((g) => {
      if (g.label === 'Neonatus') return customerAge < 1;
      if (g.label === 'Bayi') return customerAge < 1;
      if (g.label === 'Balita') return customerAge >= 1 && customerAge <= 5;
      if (g.label === 'Anak') return customerAge >= 6 && customerAge <= 12;
      return false;
    });
    if (ageGroup) {
      specialPopNote = { type: 'Pediatrik', label: ageGroup.label, range: ageGroup.range, notes: ageGroup.notes, ref: mimsSpecialPopulations.pediatric.ref };
    }
  } else if (customerAge >= 60) {
    specialPopNote = { type: 'Geriatrik', label: 'Lansia', range: '≥60 tahun', notes: mimsSpecialPopulations.geriatric.generalRules.join('. '), ref: mimsSpecialPopulations.geriatric.ref };
  }

  // 6. Kehamilan — cek kondisi customer
  const isPregnant = (customer?.conditions || []).some((c) => c.startsWith('hamil'));
  let pregnancyNote = null;
  if (isPregnant) {
    const trimester = (customer?.conditions || []).find((c) => c.startsWith('hamil'));
    const triKey = trimester === 'hamil_t1' ? 'trimester1' : trimester === 'hamil_t2' ? 'trimester2' : 'trimester3';
    const triData = mimsSpecialPopulations.pregnancy[triKey];
    if (triData) {
      const isSafe = triData.safeDrugs?.includes(medicineId);
      const isCaution = triData.cautionDrugs?.includes(medicineId);
      const isForbidden = triData.forbiddenDrugs?.includes(medicineId);
      pregnancyNote = {
        trimester: triKey.replace('trimester', 'Trimester '),
        status: isForbidden ? 'DILARANG' : isCaution ? 'HATI-HATI' : isSafe ? 'AMAN' : 'Tidak ada data',
        statusTone: isForbidden ? 'bg-red-100 text-red-700' : isCaution ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700',
        notes: triData.notes,
        ref: mimsSpecialPopulations.pregnancy.ref,
      };
    }
  }

  return (
    <div className="mt-3 rounded-lg border border-blue-200 bg-blue-50 p-3">
      <p className="text-[11px] font-black uppercase tracking-wide text-blue-700">
        💊 Referensi MIMS (Monthly Index of Medical Specialities)
      </p>

      {/* Kelas Terapi */}
      {therapeuticEntries.length > 0 && (
        <div className="mt-2">
          <p className="text-xs font-bold text-blue-800">Klasifikasi Terapi:</p>
          <div className="mt-1 space-y-1">
            {therapeuticEntries.map((te, i) => (
              <div key={i} className="flex items-start gap-2 text-xs text-gray-700">
                <span className={`mt-0.5 shrink-0 rounded px-1.5 py-0.5 text-[10px] font-bold ${te.line === 'Lini Pertama' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>
                  {te.line}
                </span>
                <span>Untuk <strong className="capitalize">{te.indication}</strong> — {te.notes}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Interaksi Obat */}
      <div className="mt-2">
        <p className="text-xs font-bold text-blue-800">Interaksi Obat (MIMS):</p>
        {interactions.length > 0 ? (
          <ul className="mt-1 space-y-1">
            {interactions.map((inter, i) => (
              <li key={i} className="text-xs text-gray-700">
                <span className={`mr-1 inline-block rounded px-1.5 py-0.5 text-[10px] font-bold ${
                  inter.severity === 'major' || inter.severity === 'contraindicated' ? 'bg-red-100 text-red-700' :
                  inter.severity === 'moderate' ? 'bg-amber-100 text-amber-700' :
                  'bg-gray-100 text-gray-600'
                }`}>
                  {inter.severity?.toUpperCase()}
                </span>
                {inter.drugAName} + {inter.drugBName}: {inter.description}
                <span className="ml-1 text-[10px] italic text-gray-500">({inter.recommendation})</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-1 text-xs text-gray-500">Tidak ada interaksi obat yang tercatat di MIMS untuk obat ini.</p>
        )}
      </div>

      {/* Alergi Silang */}
      <div className="mt-2">
        <p className="text-xs font-bold text-blue-800">Alergi Silang (Cross-Reactivity):</p>
        {allergyRisks.length > 0 ? (
          <ul className="mt-1 space-y-1">
            {allergyRisks.map((ar, i) => (
              <li key={i} className="text-xs text-gray-700">
                <span className={`mr-1 inline-block rounded px-1.5 py-0.5 text-[10px] font-bold ${
                  ar.risk === 'high' ? 'bg-red-100 text-red-700' :
                  ar.risk === 'moderate' ? 'bg-amber-100 text-amber-700' :
                  'bg-gray-100 text-gray-600'
                }`}>
                  {ar.risk?.toUpperCase()}
                </span>
                Alergi "{ar.allergy}" → {ar.note} ({ar.percent})
                <span className="ml-1 text-[10px] italic text-gray-500">Ref: {ar.ref}</span>
              </li>
            ))}
          </ul>
        ) : crossGroups.length > 0 ? (
          <div className="mt-1 space-y-1">
            {crossGroups.map((g, i) => (
              <p key={i} className="text-xs text-gray-700">
                Grup <strong>{g.allergyGroup}</strong> — Customer tidak memiliki alergi terkait.
                Obat aman sebagai alternatif: <span className="text-emerald-700">{g.safeDrugs.join(', ')}</span>
              </p>
            ))}
          </div>
        ) : (
          <p className="mt-1 text-xs text-gray-500">Tidak ada risiko alergi silang terdeteksi untuk customer ini.</p>
        )}
      </div>

      {/* Populasi Khusus */}
      {specialPopNote && (
        <div className="mt-2 rounded border border-blue-300 bg-blue-100/50 p-2">
          <p className="text-xs font-bold text-blue-800">Populasi Khusus — {specialPopNote.type} ({specialPopNote.label}, {specialPopNote.range}):</p>
          <p className="mt-0.5 text-xs text-gray-700">{specialPopNote.notes}</p>
          <p className="mt-0.5 text-[10px] italic text-gray-500">Ref: {specialPopNote.ref}</p>
        </div>
      )}

      {/* Kehamilan */}
      {pregnancyNote && (
        <div className="mt-2 rounded border border-blue-300 bg-blue-100/50 p-2">
          <p className="text-xs font-bold text-blue-800">
            Kehamilan ({pregnancyNote.trimester}):
            <span className={`ml-1.5 rounded px-1.5 py-0.5 text-[10px] font-bold ${pregnancyNote.statusTone}`}>
              {pregnancyNote.status}
            </span>
          </p>
          <p className="mt-0.5 text-xs text-gray-700">{pregnancyNote.notes}</p>
          <p className="mt-0.5 text-[10px] italic text-gray-500">Ref: {pregnancyNote.ref}</p>
        </div>
      )}

      {/* Ref umum */}
      <p className="mt-2 text-[10px] italic text-gray-500">Sumber: MIMS Indonesia — Monthly Index of Medical Specialities</p>
    </div>
  );
}
