import { useState, useEffect } from 'react';
import { getAgeCategoryLabel, getConditionLabel } from '../../data/customerRecords.js';
import { isoMonographs, isoConditionContraindications } from '../../data/isoReference.js';
import { mimsDrugInteractions, checkAllergyRisk, mimsCrossReactivity } from '../../data/mimsReference.js';
import { aiChat } from '../../services/huggingFaceService.js';
import { AlertIcon, CheckIcon, CloseIcon, InfoIcon, SearchIcon } from '../ui/Icons.jsx';
import { closingWorkflowSteps, workflowSteps } from './dispensingConfig.js';

export function WorkflowStepper({ currentStep, canOpenStep, onOpenStep }) {
  const currentIndex = workflowSteps.findIndex((step) => step.key === currentStep);

  return (
    <section className="rounded-none border-y border-gray-200 bg-white p-2.5 shadow-sm sm:rounded-lg sm:border sm:p-3">
      <ol className="grid grid-cols-4 gap-1.5 sm:gap-2">
        {workflowSteps.map((step, index) => {
          const active = step.key === currentStep;
          const done = index < currentIndex;
          const enabled = canOpenStep(step.key);
          return (
            <li key={step.key} className="min-w-0">
              <button
                type="button"
                onClick={() => enabled && onOpenStep(step.key)}
                disabled={!enabled}
                className={`flex min-h-14 w-full min-w-0 items-center gap-2 rounded-lg border px-2 py-2 text-left transition sm:min-h-12 sm:px-3 ${
                  active
                    ? 'border-gray-900 bg-gray-900 text-white shadow-sm'
                    : done
                      ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
                      : enabled
                        ? 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                        : 'border-gray-100 bg-gray-50 text-gray-300'
                }`}
              >
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-black ${
                    active
                      ? 'bg-white text-gray-900'
                      : done
                        ? 'bg-emerald-600 text-white'
                        : enabled
                          ? 'bg-gray-100 text-gray-700'
                          : 'bg-gray-100 text-gray-300'
                  }`}
                >
                  {done ? <CheckIcon /> : index + 1}
                </span>
                <span className="min-w-0 truncate text-[11px] font-black uppercase tracking-wide sm:text-xs">{step.label}</span>
              </button>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

export function CustomerContextStrip({ customer, onChangeCustomer }) {
  if (!customer) return null;

  const initials = (customer.name || '?')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((chunk) => chunk[0]?.toUpperCase())
    .join('');

  return (
    <section className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="p-3 sm:p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-rose-600 text-sm font-black text-white">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-black uppercase tracking-wide text-gray-500">Customer Aktif</p>
              <h2 className="mt-1 truncate text-base font-black text-gray-900">{customer.name}</h2>
              <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
                <span className="font-semibold">{customer.phone}</span>
                <span>{customer.age} tahun</span>
                <span className="inline-flex items-center rounded-full border border-violet-200 bg-violet-50 px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-violet-700">
                  {getAgeCategoryLabel(customer.ageCategory)}
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onChangeCustomer}
            className="min-h-10 rounded-lg border border-gray-300 bg-white px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50"
          >
            Ganti Customer
          </button>
        </div>

        <div className="mt-3 grid gap-2 text-xs md:grid-cols-2">
          <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2">
            <p className="text-[11px] font-black uppercase tracking-wide text-rose-700">Alergi Aktif</p>
            <div className="mt-1 flex flex-wrap gap-1.5">
              {customer.allergies.length ? (
                customer.allergies.slice(0, 3).map((allergy) => (
                  <span key={allergy} className="inline-flex items-center rounded-full border border-rose-200 bg-white/70 px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-rose-700">
                    Alergi: {allergy}
                  </span>
                ))
              ) : (
                <span className="inline-flex items-center rounded-full border border-gray-200 bg-white/70 px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-gray-600">
                  Tidak ada
                </span>
              )}
            </div>
          </div>
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2">
            <p className="text-[11px] font-black uppercase tracking-wide text-emerald-700">Kondisi Medis</p>
            <div className="mt-1 flex flex-wrap gap-1.5">
              {customer.conditions.length ? (
                customer.conditions.slice(0, 3).map((condition) => (
                  <span key={condition} className="inline-flex items-center rounded-full border border-emerald-200 bg-white/70 px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-emerald-700">
                    Kondisi: {getConditionLabel(condition)}
                  </span>
                ))
              ) : (
                <span className="inline-flex items-center rounded-full border border-emerald-200 bg-white/70 px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-emerald-700">
                  Kondisi: Tidak ada
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-100 bg-gray-50 px-3 py-2 text-xs text-gray-600 sm:px-4">
        <p>
          {customer.ageCategory === 'child'
            ? 'Pasien anak. Sistem akan menandai obat berisiko sebelum ditambahkan.'
            : 'Pastikan konfirmasi alergi dan kondisi medis sebelum memilih obat.'}
        </p>
      </div>
    </section>
  );
}

export function SafetyCheckItem({ label, check }) {
  const toneClass =
    check.status === 'danger'
      ? 'border-red-200 bg-red-50 text-red-800'
      : check.status === 'warning'
        ? 'border-amber-200 bg-amber-50 text-amber-800'
        : 'border-emerald-200 bg-emerald-50 text-emerald-800';

  return (
    <div className="rounded-lg border border-gray-100 bg-white p-3">
      <div className="mb-1 flex items-center justify-between gap-2">
        <p className="text-[11px] font-black uppercase tracking-wide text-gray-500">{label}</p>
        <span className={`rounded-full border px-2 py-0.5 text-[10px] font-black uppercase ${toneClass}`}>{check.status}</span>
      </div>
      <p className="text-sm leading-6 text-gray-700">{check.message}</p>
    </div>
  );
}

export function RiskChipIcon({ status = 'warning' }) {
  const toneClass =
    status === 'danger'
      ? 'bg-red-600 text-white'
      : status === 'warning'
        ? 'bg-amber-500 text-white'
        : 'bg-emerald-600 text-white';

  return (
    <span className={`inline-flex h-7 w-7 items-center justify-center rounded-full shadow-sm ${toneClass}`}>
      {status === 'danger' ? <AlertIcon /> : status === 'warning' ? <InfoIcon /> : <CheckIcon />}
    </span>
  );
}

export function RiskDetailModal({ open, title, status, message, onClose, medicineId, customer }) {
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);

  // Panggil AI saat modal dibuka
  useEffect(() => {
    if (!open || !medicineId || !customer) return;
    setAiLoading(true);
    setAiAnalysis(null);

    const mono = isoMonographs[medicineId];
    const medName = mono?.genericName || title;

    // Bangun konteks lokal untuk dikirim ke AI
    let localCtx = `Obat: ${medName}. `;
    localCtx += `Customer: ${customer.name}, ${customer.age} tahun, `;
    localCtx += `Alergi: ${(customer.allergies || []).join(', ') || 'tidak ada'}, `;
    localCtx += `Kondisi: ${(customer.conditions || []).map(c => c.replace(/_/g, ' ')).join(', ') || 'tidak ada'}. `;
    if (mono) {
      localCtx += `ISO: Kelas ${mono.class}, Kehamilan kat. ${mono.pregnancyCategory} (${mono.pregnancyNote}), `;
      localCtx += `Kontraindikasi: ${mono.contraindications.map(c => c.condition).join('; ')}. `;
      localCtx += `Peringatan: ${mono.warnings.join('; ')}. `;
    }

    const question = `Analisa risiko pemberian obat ${medName} untuk customer ini. Deteksi risiko lokal: "${message}". Jelaskan kenapa berbahaya/perlu perhatian berdasarkan ISO/MIMS, dan berikan saran alternatif jika ada. Jawab singkat dalam 3-5 kalimat bahasa Indonesia.\n\nKonteks:\n${localCtx}`;

    aiChat(question, customer).then((result) => {
      setAiAnalysis(result);
      setAiLoading(false);
    });
  }, [open, medicineId, customer, title, message]);

  if (!open) return null;

  // Kumpulkan data ISO/MIMS lokal untuk ditampilkan
  const mono = isoMonographs[medicineId];
  const allergyRisks = [];
  for (const allergy of (customer?.allergies || [])) {
    const risk = checkAllergyRisk(allergy, medicineId);
    if (risk) allergyRisks.push({ allergy, ...risk });
  }
  const contraList = [];
  for (const cond of (customer?.conditions || [])) {
    const condData = isoConditionContraindications[cond];
    if (condData?.forbidden?.includes(medicineId)) contraList.push({ cond: cond.replace(/_/g, ' '), severity: 'DILARANG' });
    if (condData?.caution?.includes(medicineId)) contraList.push({ cond: cond.replace(/_/g, ' '), severity: 'PERHATIAN' });
  }

  const panelTone =
    status === 'danger'
      ? 'border-red-200 bg-red-50'
      : status === 'warning'
        ? 'border-amber-200 bg-amber-50'
        : 'border-emerald-200 bg-emerald-50';
  const titleTone =
    status === 'danger' ? 'text-red-900' : status === 'warning' ? 'text-amber-900' : 'text-emerald-900';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button type="button" className="absolute inset-0 bg-black/40" onClick={onClose} aria-label="Tutup detail risiko" />
      <div className={`relative max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-xl border p-4 shadow-xl ${panelTone}`}>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] font-black uppercase tracking-wide text-gray-600">Detail Risiko</p>
            <h3 className={`mt-1 break-words text-base font-black ${titleTone}`}>{title}</h3>
          </div>
          <button type="button" onClick={onClose} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/70 text-gray-700 hover:bg-white" aria-label="Tutup">
            <CloseIcon />
          </button>
        </div>

        {/* REFERENSI ISO */}
        {mono && (
          <div className="mt-3 rounded-lg border border-teal-200 bg-teal-50 p-3">
            <p className="text-[10px] font-black uppercase tracking-wide text-teal-700">📋 Referensi ISO</p>
            <div className="mt-1.5 grid gap-1 text-xs text-gray-700">
              <p><span className="font-bold text-teal-800">Kelas:</span> {mono.class}</p>
              <p><span className="font-bold text-teal-800">Kehamilan:</span> Kategori {mono.pregnancyCategory} — {mono.pregnancyNote}</p>
              {mono.contraindications?.length > 0 && (
                <div>
                  <span className="font-bold text-teal-800">Kontraindikasi ISO:</span>
                  <ul className="mt-0.5 space-y-0.5 pl-3">
                    {mono.contraindications.map((c, i) => (
                      <li key={i}>
                        <span className={`mr-1 rounded px-1 py-0.5 text-[10px] font-bold ${c.severity === 'absolut' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                          {c.severity?.toUpperCase()}
                        </span>
                        {c.condition}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <p><span className="font-bold text-teal-800">Ref:</span> <span className="italic">{mono.ref}</span></p>
            </div>
          </div>
        )}

        {/* REFERENSI MIMS — Alergi Silang */}
        {allergyRisks.length > 0 && (
          <div className="mt-2 rounded-lg border border-blue-200 bg-blue-50 p-3">
            <p className="text-[10px] font-black uppercase tracking-wide text-blue-700">💊 MIMS: Alergi Silang</p>
            <ul className="mt-1.5 space-y-1">
              {allergyRisks.map((ar, i) => (
                <li key={i} className="text-xs text-gray-700">
                  <span className={`mr-1 rounded px-1 py-0.5 text-[10px] font-bold ${ar.risk === 'high' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                    {ar.risk?.toUpperCase()}
                  </span>
                  Alergi "{ar.allergy}" → {ar.note} ({ar.percent}) <span className="italic text-gray-500">Ref: {ar.ref}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* KONTRAINDIKASI CUSTOMER */}
        {contraList.length > 0 && (
          <div className="mt-2 rounded-lg border border-red-200 bg-red-50/50 p-3">
            <p className="text-[10px] font-black uppercase tracking-wide text-red-700">🚫 Kontraindikasi untuk Customer Ini</p>
            <ul className="mt-1.5 space-y-1">
              {contraList.map((c, i) => (
                <li key={i} className="text-xs font-bold text-red-700">{c.severity}: {c.cond}</li>
              ))}
            </ul>
          </div>
        )}

        {/* ANALISA AI */}
        <div className="mt-3 rounded-lg border border-violet-200 bg-violet-50 p-3">
          <p className="text-[10px] font-black uppercase tracking-wide text-violet-700">🤖 Analisa AI</p>
          {aiLoading ? (
            <div className="mt-2 flex items-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-violet-600 border-t-transparent"></div>
              <p className="text-xs text-violet-700">AI sedang menganalisa berdasarkan ISO/MIMS...</p>
            </div>
          ) : aiAnalysis?.success ? (
            <p className="mt-1.5 text-xs leading-5 text-gray-800">{aiAnalysis.answer}</p>
          ) : (
            <p className="mt-1.5 text-xs text-gray-500">{aiAnalysis?.answer || 'AI tidak tersedia. Gunakan referensi ISO/MIMS di atas.'}</p>
          )}
        </div>

        <div className="mt-4 flex justify-end">
          <button type="button" onClick={onClose} className="min-h-10 rounded-lg bg-gray-900 px-4 py-2 text-sm font-bold text-white hover:bg-black">
            Mengerti
          </button>
        </div>
      </div>
    </div>
  );
}

export function EmptyState({ title, message }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-8 text-center shadow-sm">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-400">
        <SearchIcon />
      </div>
      <p className="mt-3 font-bold text-gray-800">{title}</p>
      <p className="mt-1 text-sm text-gray-500">{message}</p>
    </div>
  );
}

export function ClosingWorkflowProgress({ currentStep }) {
  const currentIndex = closingWorkflowSteps.findIndex((step) => step.key === currentStep);

  return (
    <section className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm">
      <ol className="grid gap-2 sm:grid-cols-3">
        {closingWorkflowSteps.map((step, index) => {
          const active = step.key === currentStep;
          const done = index < currentIndex;
          return (
            <li key={step.key} className={`rounded-lg border px-3 py-2 text-xs font-black uppercase tracking-wide ${active ? 'border-gray-900 bg-gray-900 text-white' : done ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-gray-200 bg-gray-50 text-gray-500'}`}>
              <span className="mr-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/80 text-[10px] text-gray-900">
                {index + 1}
              </span>
              {step.label}
            </li>
          );
        })}
      </ol>
    </section>
  );
}

export function ChecklistToggle({ label, checked, onChange, disabled = false }) {
  return (
    <label className={`flex min-h-12 items-center gap-3 rounded-lg border px-3 py-2 text-sm font-semibold ${checked ? 'border-emerald-200 bg-emerald-50 text-emerald-900' : disabled ? 'border-gray-100 bg-gray-50 text-gray-300' : 'border-gray-200 bg-white text-gray-700'}`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 disabled:cursor-not-allowed"
      />
      <span>{label}</span>
    </label>
  );
}
