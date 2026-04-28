import { useMemo, useState } from 'react';
import { branches, getPriceForMedicine, getStockForMedicine } from '../data/branches.js';
import { customerRecords, getAgeCategoryLabel, getConditionLabel } from '../data/customerRecords.js';
import { medicines, medicineCategories } from '../data/medicines.js';
import { getLocationForMedicine } from '../data/storageLocations.js';
import { evaluateSafetyAdvisor } from '../utils/aiService.js';
import CustomerPanel from './CustomerPanel.jsx';

const workflowSteps = [
  { key: 'customer', label: 'Customer' },
  { key: 'medicine', label: 'Pilih Obat' },
  { key: 'safety', label: 'Safety Check' },
  { key: 'location', label: 'Lokasi & Aksi' },
];

const safetyTone = {
  safe: {
    label: 'Aman',
    chip: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    panel: 'border-emerald-200 bg-emerald-50 text-emerald-900',
  },
  warning: {
    label: 'Perlu perhatian',
    chip: 'border-amber-200 bg-amber-50 text-amber-800',
    panel: 'border-amber-200 bg-amber-50 text-amber-900',
  },
  danger: {
    label: 'Risiko tinggi',
    chip: 'border-red-200 bg-red-50 text-red-700',
    panel: 'border-red-200 bg-red-50 text-red-900',
  },
};

const closingWorkflowSteps = [
  { key: 'picking', label: 'Lokasi Picking' },
  { key: 'counseling', label: 'Edukasi & Catatan' },
  { key: 'complete', label: 'Selesai' },
];

const defaultEducationChecks = {
  usage: false,
  timing: false,
  sideEffects: false,
  allergyWarning: false,
  storage: false,
  consultWhenNeeded: false,
};

const educationOptions = [
  { key: 'usage', label: 'Aturan pakai' },
  { key: 'sideEffects', label: 'Efek samping umum' },
  { key: 'storage', label: 'Cara penyimpanan' },
  { key: 'timing', label: 'Waktu konsumsi' },
  { key: 'allergyWarning', label: 'Peringatan alergi' },
  { key: 'consultWhenNeeded', label: 'Kapan harus konsultasi dokter/apoteker' },
];

const counselingDatabase = {
  MED001: {
    timing: 'Dapat diminum sebelum atau sesudah makan. Beri jarak antar dosis sesuai aturan pakai.',
    sideEffects: 'Mual ringan, ruam, atau reaksi alergi jarang terjadi. Hentikan bila muncul bengkak atau sesak.',
    storage: 'Simpan di tempat sejuk dan kering, terlindung dari sinar matahari langsung.',
    consultWhenNeeded: 'Konsultasi bila demam lebih dari 3 hari, nyeri berat, dosis terlewat berulang, atau muncul reaksi alergi.',
  },
  MED002: {
    timing: 'Minum sesudah makan untuk mengurangi iritasi lambung.',
    sideEffects: 'Nyeri lambung, mual, pusing, atau reaksi alergi NSAID dapat terjadi.',
    storage: 'Simpan di tempat kering pada suhu ruang dan jauhkan dari anak-anak.',
    consultWhenNeeded: 'Konsultasi bila ada nyeri lambung berat, muntah darah, sesak, kehamilan trimester akhir, atau riwayat alergi NSAID.',
  },
  MED003: {
    timing: 'Minum pada jam yang konsisten dan habiskan sesuai durasi yang diresepkan.',
    sideEffects: 'Mual, diare, ruam, atau reaksi alergi antibiotik dapat terjadi.',
    storage: 'Simpan kapsul di tempat kering pada suhu ruang.',
    consultWhenNeeded: 'Konsultasi segera bila muncul ruam luas, bengkak, sesak, diare berat, atau gejala infeksi tidak membaik.',
  },
  MED004: {
    timing: 'Minum sesuai jadwal yang diresepkan dan habiskan terapi antibiotik.',
    sideEffects: 'Mual, diare, sakit perut, ruam, atau reaksi alergi sefalosporin dapat terjadi.',
    storage: 'Simpan di tempat kering pada suhu ruang.',
    consultWhenNeeded: 'Konsultasi bila ada reaksi alergi, diare berat, atau keluhan tidak membaik setelah beberapa hari.',
  },
  MED005: {
    timing: 'Minum sesudah makan untuk kenyamanan lambung.',
    sideEffects: 'Mual ringan atau tidak nyaman di lambung dapat terjadi pada sebagian orang.',
    storage: 'Simpan di tempat sejuk dan kering.',
    consultWhenNeeded: 'Konsultasi bila ada keluhan lambung berat, batu ginjal berulang, atau penggunaan dosis tinggi jangka panjang.',
  },
  MED006: {
    timing: 'Gunakan sesuai takaran sirup, umumnya sesudah makan atau sesuai aturan label.',
    sideEffects: 'Mengantuk, mual, atau mulut kering dapat terjadi tergantung komposisi.',
    storage: 'Tutup botol rapat, simpan di suhu ruang, dan jangan gunakan bila warna/bau berubah.',
    consultWhenNeeded: 'Konsultasi bila batuk lebih dari 3 hari, sesak, demam tinggi, atau dahak berdarah.',
  },
  MED007: {
    timing: 'Minum sesudah makan dan perbanyak cairan untuk membantu pengenceran dahak.',
    sideEffects: 'Mual, diare ringan, atau rasa tidak nyaman di lambung dapat terjadi.',
    storage: 'Simpan tablet di tempat kering pada suhu ruang.',
    consultWhenNeeded: 'Konsultasi bila batuk berdahak tidak membaik, sesak, atau demam menetap.',
  },
  MED008: {
    timing: 'Kunyah saat gejala muncul, umumnya sesudah makan atau sebelum tidur sesuai kebutuhan.',
    sideEffects: 'Konstipasi atau diare dapat terjadi tergantung komposisi antasida.',
    storage: 'Simpan di tempat kering dan tutup kemasan rapat.',
    consultWhenNeeded: 'Konsultasi bila nyeri ulu hati berat, muntah darah, BAB hitam, atau gejala sering kambuh.',
  },
  MED009: {
    timing: 'Minum sebelum makan, idealnya sebelum sarapan.',
    sideEffects: 'Sakit kepala, mual, kembung, atau diare ringan dapat terjadi.',
    storage: 'Simpan kapsul di tempat kering dan jauh dari panas berlebih.',
    consultWhenNeeded: 'Konsultasi bila nyeri dada, sulit menelan, muntah darah, BAB hitam, atau keluhan tidak membaik.',
  },
  MED010: {
    timing: 'Minum sekali sehari pada jam yang sama. Dapat diminum sebelum atau sesudah makan.',
    sideEffects: 'Mengantuk ringan, mulut kering, atau sakit kepala dapat terjadi.',
    storage: 'Simpan di tempat kering pada suhu ruang.',
    consultWhenNeeded: 'Konsultasi bila alergi disertai sesak, bengkak wajah, ruam luas, atau gejala tidak membaik.',
  },
};

const serviceStatusLabels = {
  dispensed: 'Diserahkan',
  consultation: 'Perlu konsultasi',
  cancelled: 'Batal',
};

const safetyRank = {
  safe: 0,
  warning: 1,
  danger: 2,
};

function BackIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
      <path strokeLinecap="round" strokeLinejoin="round" d="m15 19-7-7 7-7" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-4.35-4.35M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
    </svg>
  );
}

function LocationPinIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7Zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Z" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
      <path strokeLinecap="round" strokeLinejoin="round" d="m5 13 4 4L19 7" />
    </svg>
  );
}

function formatRupiah(value) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value);
}

function getStockStatus(stock) {
  if (stock === 0) {
    return {
      key: 'out',
      label: 'Habis',
      badgeClass: 'border-red-200 bg-red-50 text-red-700',
    };
  }
  if (stock < 20) {
    return {
      key: 'low',
      label: 'Stok Menipis',
      badgeClass: 'border-amber-200 bg-amber-50 text-amber-800',
    };
  }
  return {
    key: 'available',
    label: 'Tersedia',
    badgeClass: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  };
}

function buildInventoryRow(medicine, branchId) {
  const location = getLocationForMedicine(branchId, medicine.id);
  const stock = getStockForMedicine(branchId, medicine.id);
  const price = getPriceForMedicine(branchId, medicine.id);
  const status = getStockStatus(stock);

  return {
    id: medicine.id,
    medicine,
    stock,
    price,
    status,
    location,
    storage: location?.storage ?? '-',
    kolom: location?.kolom ?? '-',
    rak: location?.rak ?? '-',
    zone: location?.zone ?? '-',
    notes: location?.notes ?? '',
  };
}

function SummaryCard({ label, value, tone = 'slate' }) {
  const toneClass = {
    slate: 'border-slate-200 bg-white text-slate-900',
    emerald: 'border-emerald-200 bg-emerald-50 text-emerald-900',
    amber: 'border-amber-200 bg-amber-50 text-amber-900',
    red: 'border-red-200 bg-red-50 text-red-900',
  };

  return (
    <div className={`min-h-16 min-w-0 overflow-hidden rounded-lg border px-3 py-2.5 ${toneClass[tone]}`}>
      <p className="text-[10px] font-bold uppercase tracking-wide opacity-70">{label}</p>
      <p className="mt-1 text-xl font-black leading-none">{value}</p>
    </div>
  );
}

function WorkflowStepper({ currentStep, canOpenStep, onOpenStep }) {
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

function CustomerContextStrip({ customer, onChangeCustomer }) {
  if (!customer) return null;

  return (
    <section className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-black uppercase tracking-wide text-gray-500">Customer Aktif</p>
          <h2 className="mt-1 truncate text-base font-black text-gray-900">{customer.name}</h2>
          <p className="mt-1 text-xs text-gray-500">
            {customer.phone} - {customer.age} tahun - {getAgeCategoryLabel(customer.ageCategory)}
          </p>
        </div>
        <button
          type="button"
          onClick={onChangeCustomer}
          className="min-h-9 rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50"
        >
          Ganti Customer
        </button>
      </div>
      <div className="mt-3 grid gap-2 text-xs sm:grid-cols-2">
        <p className="rounded-lg bg-rose-50 px-3 py-2 font-semibold text-rose-800">
          Alergi: {customer.allergies.length ? customer.allergies.join(', ') : 'Tidak ada'}
        </p>
        <p className="rounded-lg bg-amber-50 px-3 py-2 font-semibold text-amber-800">
          Kondisi: {customer.conditions.length ? customer.conditions.map(getConditionLabel).join(', ') : 'Tidak ada'}
        </p>
      </div>
    </section>
  );
}

function SafetyCheckItem({ label, check }) {
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

function MedicineCard({ item, customer, selected, onSelect }) {
  const preview = customer ? evaluateSafetyAdvisor(customer, item.medicine, item) : null;
  const riskCheck =
    preview?.allergyCheck.status !== 'safe'
      ? preview.allergyCheck
      : preview?.contraindicationCheck.status !== 'safe'
        ? preview.contraindicationCheck
        : preview?.interactionCheck.status !== 'safe'
          ? preview.interactionCheck
          : null;
  const riskClass =
    riskCheck?.status === 'danger'
      ? 'border-red-200 bg-red-50 text-red-800'
      : riskCheck?.status === 'warning'
        ? 'border-amber-200 bg-amber-50 text-amber-800'
        : 'border-gray-100 bg-gray-50 text-gray-600';

  return (
    <article
      className={`min-w-0 overflow-hidden rounded-lg border bg-white p-3 shadow-sm transition ${
        selected ? 'border-rose-400 ring-2 ring-rose-100' : 'border-gray-200 hover:border-gray-300'
      }`}
    >
      <div className="flex min-w-0 items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="break-words text-sm font-black leading-tight text-gray-900">{item.medicine.name}</h3>
          <p className="mt-1 text-xs font-medium text-gray-500">
            {item.medicine.dose} - {item.medicine.form} - {item.medicine.category}
          </p>
        </div>
        <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-black ${item.status.badgeClass}`}>
          {item.status.label}
        </span>
      </div>

      <p className="mt-2 line-clamp-2 min-h-10 text-xs leading-5 text-gray-600">{item.medicine.indications.join(', ')}</p>

      <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
        <div className="rounded-lg border border-gray-100 bg-gray-50 p-2.5">
          <p className="font-semibold text-gray-500">Stok</p>
          <p className="mt-1 font-black text-gray-900">{item.stock === 0 ? 'Habis' : `${item.stock} pcs`}</p>
        </div>
        <div className="rounded-lg border border-gray-100 bg-gray-50 p-2.5">
          <p className="font-semibold text-gray-500">Harga</p>
          <p className="mt-1 font-black text-gray-900">{formatRupiah(item.price)}</p>
        </div>
      </div>

      {riskCheck ? (
        <div className={`mt-3 rounded-lg border px-3 py-2 text-xs font-semibold leading-5 ${riskClass}`}>
          Perlu perhatian: {riskCheck.message}
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => onSelect(item.id)}
        className={`mt-3 min-h-10 w-full rounded-lg px-3 py-2 text-sm font-bold ${
          selected ? 'bg-gray-900 text-white hover:bg-black' : 'bg-rose-600 text-white hover:bg-rose-700'
        }`}
      >
        {selected ? 'Hapus dari Pilihan' : 'Tambah Obat'}
      </button>
    </article>
  );
}

function AdvancedStockTable({ rows, selectedMedicineIds, onSelect }) {
  return (
    <details className="rounded-lg border border-gray-200 bg-white shadow-sm">
      <summary className="cursor-pointer px-4 py-3 text-sm font-bold text-gray-800">Lihat semua stok</summary>
      <div className="scroll-fade overflow-x-auto border-t border-gray-100">
        <table className="w-full min-w-[760px] text-sm">
          <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-600">
            <tr>
              <th className="px-4 py-3 text-left font-black">Nama Obat</th>
              <th className="px-4 py-3 text-left font-black">Dosis</th>
              <th className="px-4 py-3 text-left font-black">Kategori</th>
              <th className="px-4 py-3 text-left font-black">Stok</th>
              <th className="px-4 py-3 text-left font-black">Status</th>
              <th className="px-4 py-3 text-left font-black">Harga</th>
              <th className="px-4 py-3 text-right font-black">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.map((item) => {
              const selected = selectedMedicineIds.includes(item.id);
              return (
              <tr key={`advanced-${item.id}`} className={selected ? 'bg-rose-50' : ''}>
                <td className="px-4 py-3">
                  <p className="font-bold text-gray-900">{item.medicine.name}</p>
                  <p className="mt-0.5 text-xs text-gray-500">{item.medicine.indications.join(', ')}</p>
                </td>
                <td className="px-4 py-3 text-gray-700">{item.medicine.dose}</td>
                <td className="px-4 py-3 text-gray-700">{item.medicine.category}</td>
                <td className="px-4 py-3 font-black text-gray-900">{item.stock}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full border px-2.5 py-1 text-xs font-black ${item.status.badgeClass}`}>{item.status.label}</span>
                </td>
                <td className="whitespace-nowrap px-4 py-3 font-bold text-gray-900">{formatRupiah(item.price)}</td>
                <td className="px-4 py-3 text-right">
                  <button
                    type="button"
                    onClick={() => onSelect(item.id)}
                    className="inline-flex items-center rounded-lg bg-rose-600 px-3 py-2 text-xs font-bold text-white hover:bg-rose-700"
                  >
                    {selected ? 'Hapus' : 'Tambah'}
                  </button>
                </td>
              </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </details>
  );
}

function EmptyState({ title, message }) {
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

function ClosingWorkflowProgress({ currentStep }) {
  const currentIndex = closingWorkflowSteps.findIndex((step) => step.key === currentStep);

  return (
    <section className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm">
      <ol className="grid gap-2 sm:grid-cols-3">
        {closingWorkflowSteps.map((step, index) => {
          const active = step.key === currentStep;
          const done = index < currentIndex;
          return (
            <li
              key={step.key}
              className={`rounded-lg border px-3 py-2 text-xs font-black uppercase tracking-wide ${
                active
                  ? 'border-gray-900 bg-gray-900 text-white'
                  : done
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                    : 'border-gray-200 bg-gray-50 text-gray-500'
              }`}
            >
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

function ChecklistToggle({ label, checked, onChange, disabled = false }) {
  return (
    <label
      className={`flex min-h-12 items-center gap-3 rounded-lg border px-3 py-2 text-sm font-semibold ${
        checked
          ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
          : disabled
            ? 'border-gray-100 bg-gray-50 text-gray-300'
            : 'border-gray-200 bg-white text-gray-700'
      }`}
    >
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

function getCheckedLabels(checks, options) {
  return options.filter((option) => checks[option.key]).map((option) => option.label);
}

function getDispensingDecision(advisory, item) {
  if (!advisory || !item) {
    return {
      tone: 'border-gray-200 bg-white text-gray-900',
      title: 'Keputusan belum tersedia.',
      message: 'Customer, obat, dan safety check harus lengkap sebelum tindakan dipilih.',
      canPick: false,
      showLocation: false,
    };
  }

  if (item.stock === 0) {
    return {
      tone: 'border-red-200 bg-red-50 text-red-900',
      title: 'Jangan ambil obat dulu.',
      message: 'Stok obat di cabang aktif habis. Cari cabang lain atau pilih alternatif sesuai arahan apoteker.',
      canPick: false,
      showLocation: false,
    };
  }

  if (advisory.safetyStatus === 'danger') {
    return {
      tone: 'border-red-200 bg-red-50 text-red-900',
      title: 'Jangan ambil obat dulu.',
      message: advisory.suggestion,
      canPick: false,
      showLocation: false,
    };
  }

  if (advisory.safetyStatus === 'warning') {
    return {
      tone: 'border-amber-200 bg-amber-50 text-amber-900',
      title: 'Konsultasi apoteker sebelum obat diambil.',
      message: advisory.suggestion,
      canPick: false,
      showLocation: false,
    };
  }

  return {
    tone: 'border-emerald-200 bg-emerald-50 text-emerald-900',
    title: 'Obat aman untuk diproses.',
    message: 'Lokasi fisik obat dibuka setelah safety check selesai.',
    canPick: true,
    showLocation: true,
  };
}

function getOverallSafetyStatus(advisoryItems) {
  return advisoryItems.reduce((current, entry) => {
    const nextStatus = entry.advisory?.safetyStatus ?? 'safe';
    return safetyRank[nextStatus] > safetyRank[current] ? nextStatus : current;
  }, 'safe');
}

function getGroupDispensingDecision(advisoryItems) {
  if (!advisoryItems.length) {
    return {
      tone: 'border-gray-200 bg-white text-gray-900',
      title: 'Keputusan belum tersedia.',
      message: 'Pilih minimal satu obat dan jalankan safety check.',
      canPick: false,
      showLocation: false,
    };
  }

  const outOfStock = advisoryItems.filter(({ item }) => item.stock === 0);
  if (outOfStock.length) {
    return {
      tone: 'border-red-200 bg-red-50 text-red-900',
      title: 'Jangan ambil obat dulu.',
      message: `${outOfStock.map(({ item }) => item.medicine.name).join(', ')} habis di cabang aktif. Pilih alternatif, ubah cabang, atau catat sebagai konsultasi.`,
      canPick: false,
      showLocation: false,
    };
  }

  const dangerItems = advisoryItems.filter(({ advisory }) => advisory?.safetyStatus === 'danger');
  if (dangerItems.length) {
    return {
      tone: 'border-red-200 bg-red-50 text-red-900',
      title: 'Jangan ambil obat dulu.',
      message: `${dangerItems.map(({ item }) => item.medicine.name).join(', ')} memiliki risiko tinggi. Konsultasikan ke apoteker sebelum tindakan lanjutan.`,
      canPick: false,
      showLocation: false,
    };
  }

  const warningItems = advisoryItems.filter(({ advisory }) => advisory?.safetyStatus === 'warning');
  if (warningItems.length) {
    return {
      tone: 'border-amber-200 bg-amber-50 text-amber-900',
      title: 'Konsultasi apoteker sebelum obat diambil.',
      message: `${warningItems.map(({ item }) => item.medicine.name).join(', ')} perlu perhatian. Verifikasi dulu sebelum picking.`,
      canPick: false,
      showLocation: false,
    };
  }

  return {
    tone: 'border-emerald-200 bg-emerald-50 text-emerald-900',
    title: 'Semua obat aman untuk diproses.',
    message: 'Lokasi fisik seluruh obat dibuka setelah safety check selesai.',
    canPick: true,
    showLocation: true,
  };
}

function buildCounselingDetails({ item, advisory, customer }) {
  const database = counselingDatabase[item.medicine.id] ?? {};
  const allergyMessage = advisory.allergyCheck.status === 'safe'
    ? `Tidak ada konflik alergi langsung pada data customer. Tetap konfirmasi ulang alergi: ${customer.allergies.length ? customer.allergies.join(', ') : 'tidak ada yang tercatat'}.`
    : advisory.allergyCheck.message;

  return {
    medicineId: item.id,
    medicineName: item.medicine.name,
    details: {
      usage: advisory.doseRecommendation.dose,
      sideEffects: database.sideEffects ?? 'Pantau efek samping umum seperti mual, pusing, ruam, atau keluhan yang tidak biasa.',
      storage: database.storage ?? 'Simpan sesuai instruksi pada kemasan, di tempat kering, dan jauhkan dari anak-anak.',
      timing: database.timing ?? 'Ikuti jadwal pakai pada label atau arahan apoteker.',
      allergyWarning: allergyMessage,
      consultWhenNeeded: database.consultWhenNeeded ?? 'Konsultasi dokter/apoteker bila gejala memburuk, muncul alergi, atau ada keluhan berat.',
    },
  };
}

export default function StaffLocator({ onBack }) {
  const [currentStep, setCurrentStep] = useState('customer');
  const [activeBranchId, setActiveBranchId] = useState('JKT001');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [selectedMedicineIds, setSelectedMedicineIds] = useState([]);
  const [safetyReviewedMedicineKey, setSafetyReviewedMedicineKey] = useState('');
  const [customers, setCustomers] = useState(() => [...customerRecords]);
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

  const lowStockRows = useMemo(
    () => inventoryRows.filter((item) => item.stock > 0 && item.stock < 20),
    [inventoryRows],
  );

  const availableRows = useMemo(
    () => inventoryRows.filter((item) => item.stock >= 20),
    [inventoryRows],
  );

  const outOfStockRows = useMemo(
    () => inventoryRows.filter((item) => item.stock === 0),
    [inventoryRows],
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

  const handleCreateCustomer = (record) => {
    setCustomers((current) => [record, ...current]);
    setActiveCustomerId(record.id);
    resetMedicineFlow();
  };

  const handleCustomerContinue = (customer) => {
    if (!customer?.id && !activeCustomer) return;
    if (customer?.id) setActiveCustomerId(customer.id);
    setCurrentStep('medicine');
  };

  const handleSelectMedicine = (medicineId) => {
    setSelectedMedicineIds((current) =>
      current.includes(medicineId)
        ? current.filter((selectedId) => selectedId !== medicineId)
        : [...current, medicineId],
    );
    setSafetyReviewedMedicineKey('');
    resetClosingFlow();
  };

  const handleCheckSafety = () => {
    if (!activeCustomer || !selectedItems.length) return;
    setSafetyReviewedMedicineKey(selectedMedicineKey);
    resetClosingFlow();
    setCurrentStep('safety');
  };

  const handleMoveToFinalAction = ({ requestPharmacist = false } = {}) => {
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

  const handleSubmitServiceRecord = (statusOverride) => {
    if (!activeCustomer || !advisoryItems.length || completedRecord) return;

    const submittedAt = new Date();
    const serviceDate = submittedAt.toISOString().slice(0, 10);
    const safetyLabel = safetyTone[overallSafetyStatus]?.label ?? 'Aman';
    const educationLabels = getCheckedLabels(educationChecks, educationOptions);
    const finalServiceStatus = statusOverride ?? serviceStatus;
    const medicineSummaries = advisoryItems.map(({ item, advisory }) => {
      const locationText = decision.showLocation
        ? `Storage ${item.storage}, Kolom ${item.kolom}, Rak ${item.rak}`
        : 'Lokasi belum dibuka';
      return {
        medicineId: item.medicine.id,
        medicineName: item.medicine.name,
        dose: advisory.doseRecommendation.dose,
        price: item.price,
        stock: item.stock,
        safetyStatus: advisory.safetyStatus,
        safetyLabel: safetyTone[advisory.safetyStatus]?.label ?? advisory.statusLabel,
        safetySummary: advisory.summary,
        locationText,
        location: {
          storage: item.storage,
          kolom: item.kolom,
          rak: item.rak,
          zone: item.zone,
        },
      };
    });

    const record = {
      id: `SERV${Date.now()}`,
      customerId: activeCustomer.id,
      customerName: activeCustomer.name,
      medicineIds: medicineSummaries.map((medicine) => medicine.medicineId),
      medicineNames: medicineSummaries.map((medicine) => medicine.medicineName),
      branchId: activeBranchId,
      branchName: activeBranch?.name ?? activeBranchId,
      medicines: medicineSummaries,
      pickedAt,
      submittedAt: submittedAt.toISOString(),
      servedBy: servedBy.trim() || 'Demo Staff',
      safetyStatus: overallSafetyStatus,
      safetyLabel,
      safetySummary: medicineSummaries.map((medicine) => `${medicine.medicineName}: ${medicine.safetySummary}`).join(' | '),
      finalStatus: finalServiceStatus,
      finalStatusLabel: serviceStatusLabels[finalServiceStatus],
      pharmacistRequested,
      educationChecks,
      counselingDetails,
      staffNote: staffNote.trim(),
    };

    const noteText = [
      `Pelayanan ${medicineSummaries.map((medicine) => medicine.medicineName).join(', ')}: ${serviceStatusLabels[finalServiceStatus]}.`,
      `Safety: ${safetyLabel}.`,
      `Cabang: ${activeBranch?.name ?? activeBranchId}.`,
      decision.showLocation
        ? `Lokasi: ${medicineSummaries.map((medicine) => `${medicine.medicineName} (${medicine.locationText})`).join('; ')}.`
        : 'Lokasi tidak dibuka karena perlu konsultasi atau stok tidak tersedia.',
      educationLabels.length ? `Edukasi: ${educationLabels.join(', ')}.` : 'Edukasi belum dicatat.',
      staffNote.trim() ? `Catatan: ${staffNote.trim()}` : '',
    ]
      .filter(Boolean)
      .join(' ');

    setCustomers((current) =>
      current.map((customer) => {
        if (customer.id !== activeCustomer.id) return customer;

        return {
          ...customer,
          updatedAt: serviceDate,
          medicineHistory: [
            ...medicineSummaries.map((medicine) => ({
              date: serviceDate,
              medicineId: medicine.medicineId,
              medicineName: medicine.medicineName,
              dose: medicine.dose,
              reason: serviceStatusLabels[finalServiceStatus],
              staffName: record.servedBy,
              branchId: activeBranchId,
              branchName: activeBranch?.name ?? activeBranchId,
              location: medicine.locationText,
              safetyStatus: medicine.safetyLabel,
            })),
            ...customer.medicineHistory,
          ],
          notes: [
            {
              date: serviceDate,
              text: noteText,
              staffName: record.servedBy,
            },
            ...customer.notes,
          ],
        };
      }),
    );
    setServiceStatus(finalServiceStatus);
    setCompletedRecord(record);
    setClosingStep('complete');
  };

  const handleStartNewCustomer = () => {
    setActiveCustomerId(null);
    resetMedicineFlow();
    setSearchQuery('');
    setActiveCategory('Semua');
    setCurrentStep('customer');
  };

  const renderCustomerStep = () => (
    <section className="grid gap-4 px-3 sm:px-0 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.45fr)]">
      <CustomerPanel
        customers={customers}
        activeCustomerId={activeCustomerId}
        onSelectCustomer={(customerId) => {
          setActiveCustomerId(customerId);
          resetMedicineFlow();
        }}
        onCreateCustomer={handleCreateCustomer}
        onContinue={handleCustomerContinue}
      />

      <aside className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <p className="text-[11px] font-black uppercase tracking-wide text-gray-500">Ringkasan Cabang</p>
        <div className="mt-3 rounded-lg border border-gray-100 bg-gray-50 p-3">
          <p className="text-sm font-black text-gray-900">{activeBranch?.name ?? activeBranchId}</p>
          <p className="mt-1 text-xs font-semibold text-gray-600">{activeBranch?.id ?? activeBranchId}</p>
          <p className="mt-1 text-xs text-gray-500">
            {[activeBranch?.address, activeBranch?.city].filter(Boolean).join(', ')}
          </p>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <SummaryCard label="Total Obat" value={inventoryRows.length} />
          <SummaryCard label="Menipis" value={lowStockRows.length} tone="amber" />
        </div>
        {activeCustomer ? (
          <div className="mt-4 rounded-lg border border-emerald-100 bg-emerald-50 p-3">
            <p className="text-xs font-black uppercase tracking-wide text-emerald-700">Customer Dipilih</p>
            <p className="mt-1 font-bold text-gray-900">{activeCustomer.name}</p>
            <p className="mt-1 text-xs text-gray-600">
              {activeCustomer.age} tahun - {getAgeCategoryLabel(activeCustomer.ageCategory)}
            </p>
          </div>
        ) : null}
      </aside>
    </section>
  );

  const renderMedicineStep = () => (
    <section className="grid gap-3 px-3 sm:px-0">
      <CustomerContextStrip customer={activeCustomer} onChangeCustomer={() => setCurrentStep('customer')} />

      <section className="grid w-full min-w-0 max-w-full grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-2.5 sm:grid-cols-4">
        <SummaryCard label="Total Obat" value={inventoryRows.length} />
        <SummaryCard label="Tersedia" value={availableRows.length} tone="emerald" />
        <SummaryCard label="Menipis" value={lowStockRows.length} tone="amber" />
        <SummaryCard label="Habis" value={outOfStockRows.length} tone="red" />
      </section>

      <section className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm">
        <div className="grid min-w-0 gap-2.5 md:grid-cols-[minmax(0,1fr)_auto_auto] md:items-center">
          <div className="relative min-w-0">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <SearchIcon />
            </span>
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="min-h-10 w-full min-w-0 max-w-full rounded-lg border border-gray-300 bg-gray-50 py-2 pl-10 pr-10 text-sm font-semibold text-gray-900 outline-none placeholder:text-gray-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-500"
              placeholder="Cari obat, kategori, atau indikasi..."
            />
            {searchQuery ? (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300"
                aria-label="Bersihkan pencarian"
              >
                <CloseIcon />
              </button>
            ) : null}
          </div>
          <label className="flex min-h-10 items-center gap-2 text-xs font-bold text-gray-600">
            Urutkan
            <select
              value={`${sortConfig.key}:${sortConfig.direction}`}
              onChange={(event) => {
                const [key, direction] = event.target.value.split(':');
                setSortConfig({ key, direction });
              }}
              className="min-h-10 rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-xs font-bold text-gray-900 outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500"
            >
              <option value="name:asc">Nama A-Z</option>
              <option value="name:desc">Nama Z-A</option>
              <option value="stock:desc">Stok terbanyak</option>
              <option value="stock:asc">Stok tersedikit</option>
              <option value="price:asc">Harga terendah</option>
              <option value="price:desc">Harga tertinggi</option>
            </select>
          </label>
          <div className="flex min-h-10 min-w-0 items-center gap-1.5 rounded-lg border border-amber-200 bg-amber-50 px-2.5 py-2 text-xs font-bold text-amber-900">
            <AlertIcon />
            <span className="min-w-0 truncate">{lowStockRows.length} stok menipis</span>
          </div>
        </div>

        <div className="scroll-fade mt-3 flex min-w-0 max-w-full gap-2 overflow-x-auto pb-1">
          {medicineCategories.map((category) => {
            const active = category === activeCategory;
            return (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                aria-pressed={active}
                className={`min-h-8 whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-bold transition ${
                  active
                    ? 'border-gray-900 bg-gray-900 text-white'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-rose-300 hover:text-rose-700'
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>
      </section>

      <section className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-gray-100 pb-3">
          <div>
            <h2 className="text-sm font-black text-gray-900">Pilih Obat</h2>
            <p className="mt-1 text-xs text-gray-500">
              {filteredRows.length} hasil dari {inventoryRows.length} obat di cabang aktif
            </p>
          </div>
          {selectedItems.length ? (
            <span className="rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-bold text-rose-700">
              {selectedItems.length} obat dipilih
            </span>
          ) : null}
        </div>

        {filteredRows.length ? (
          <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {filteredRows.map((item) => (
              <MedicineCard
                key={item.id}
                item={item}
                customer={activeCustomer}
                selected={selectedMedicineIds.includes(item.id)}
                onSelect={handleSelectMedicine}
              />
            ))}
          </div>
        ) : (
          <div className="pt-3">
            <EmptyState title="Obat tidak ditemukan" message="Coba kata kunci lain atau ubah filter kategori." />
          </div>
        )}
      </section>

      <AdvancedStockTable rows={filteredRows} selectedMedicineIds={selectedMedicineIds} onSelect={handleSelectMedicine} />

      <section className="sticky bottom-0 z-10 -mx-3 border-t border-gray-200 bg-white/95 p-3 shadow-[0_-8px_24px_rgba(15,23,42,0.08)] backdrop-blur sm:mx-0 sm:rounded-lg sm:border sm:shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-black uppercase tracking-wide text-gray-500">Tahap berikutnya</p>
            <p className="mt-1 truncate text-sm font-bold text-gray-900">
              {selectedItems.length ? `Cek keamanan untuk ${selectedItems.length} obat` : 'Pilih minimal satu obat sebelum safety check'}
            </p>
          </div>
          <button
            type="button"
            onClick={handleCheckSafety}
            disabled={!selectedItems.length}
            className="min-h-11 rounded-lg bg-gray-900 px-4 py-2 text-sm font-bold text-white hover:bg-black disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            Cek Keamanan Obat
          </button>
        </div>
      </section>
    </section>
  );

  const renderSafetyStep = () => {
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
        <CustomerContextStrip customer={activeCustomer} onChangeCustomer={() => setCurrentStep('customer')} />

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
              onClick={() => setCurrentStep('medicine')}
              className="min-h-10 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-50"
            >
              Pilih Obat Lain
            </button>
            {decision.canPick ? (
              <button
                type="button"
                onClick={() => handleMoveToFinalAction()}
                className="min-h-10 rounded-lg bg-gray-900 px-4 py-2 text-sm font-bold text-white hover:bg-black"
              >
                Lanjut ke Lokasi Obat
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleMoveToFinalAction({ requestPharmacist: true })}
                className="min-h-10 rounded-lg bg-amber-600 px-4 py-2 text-sm font-bold text-white hover:bg-amber-700"
              >
                Konsultasi Apoteker
              </button>
            )}
          </div>
        </section>
      </section>
    );
  };

  const renderLocationStep = () => {
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

        {!decision.showLocation ? (
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
                    onClick={() => handleSubmitServiceRecord(serviceStatus === 'dispensed' ? 'consultation' : serviceStatus)}
                    disabled={!servedBy.trim()}
                    className="min-h-10 rounded-lg bg-gray-900 px-4 py-2 text-sm font-bold text-white hover:bg-black disabled:cursor-not-allowed disabled:bg-gray-300"
                  >
                    Simpan ke Customer Record
                  </button>
                </div>
              </div>
            )}
          </section>
        ) : null}

        {decision.showLocation && closingStep === 'counseling' ? (
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
                {!hasEducationRecord ? (
                  <p className="mt-2 text-xs font-medium text-amber-700">Belum ada edukasi yang dicentang. Record tetap bisa disimpan jika antrean mendesak.</p>
                ) : null}
                {!allEducationChecked ? (
                  <p className="mt-2 text-xs font-medium text-gray-500">Semua topik edukasi belum dicentang.</p>
                ) : null}
              </div>

              <div className="grid gap-3">
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
                    value={serviceStatus}
                    onChange={(event) => setServiceStatus(event.target.value)}
                    className="mt-1 min-h-10 w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm font-semibold text-gray-900 outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500"
                  >
                    <option value="dispensed">Diserahkan</option>
                    <option value="consultation">Perlu konsultasi</option>
                    <option value="cancelled">Batal</option>
                  </select>
                </label>
                <label className="block">
                  <span className="text-xs font-bold uppercase tracking-wide text-gray-500">Catatan staff opsional</span>
                  <textarea
                    value={staffNote}
                    onChange={(event) => setStaffNote(event.target.value)}
                    className="mt-1 min-h-28 w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2.5 text-sm outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500"
                    placeholder="Tambahkan catatan untuk customer record, misalnya keluhan pelanggan, edukasi khusus, atau instruksi apoteker."
                  />
                </label>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap justify-end gap-2">
              <button
                type="button"
                onClick={() => setClosingStep('picking')}
                className="min-h-10 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-50"
              >
                Kembali Picking
              </button>
              <button
                type="button"
                onClick={() => handleSubmitServiceRecord()}
                disabled={!servedBy.trim() || !allEducationChecked}
                className="min-h-10 rounded-lg bg-gray-900 px-4 py-2 text-sm font-bold text-white hover:bg-black disabled:cursor-not-allowed disabled:bg-gray-300"
              >
                Simpan & Selesaikan Pelayanan
              </button>
            </div>
          </section>
        ) : null}

        {decision.showLocation && closingStep === 'complete' ? (
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
              <button
                type="button"
                onClick={() => setCurrentStep('customer')}
                className="min-h-10 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-50"
              >
                Lihat Customer Record
              </button>
              <button
                type="button"
                onClick={handleStartNewCustomer}
                className="min-h-10 rounded-lg bg-gray-900 px-4 py-2 text-sm font-bold text-white hover:bg-black"
              >
                Mulai Customer Baru
              </button>
            </div>
          </section>
        ) : null}

        {closingStep !== 'complete' && !completedRecord ? (
          <section className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm">
          <div className="flex flex-wrap justify-end gap-2">
            <button
              type="button"
              onClick={() => setCurrentStep('medicine')}
              className="min-h-10 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-50"
            >
              Pilih Obat Lain
            </button>
            {!decision.canPick ? (
              <button
                type="button"
                onClick={() => setPharmacistRequested(true)}
                className="min-h-10 rounded-lg bg-amber-600 px-4 py-2 text-sm font-bold text-white hover:bg-amber-700"
              >
                Konsultasi Apoteker
              </button>
            ) : null}
            <button
              type="button"
              onClick={handleStartNewCustomer}
              className="min-h-10 rounded-lg bg-gray-900 px-4 py-2 text-sm font-bold text-white hover:bg-black"
            >
              Mulai Customer Baru
            </button>
          </div>
          </section>
        ) : null}
      </section>
    );
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-50 pb-8">
      <header className="sticky top-0 z-20 border-b border-gray-200 bg-white/95 shadow-sm backdrop-blur">
        <div className="w-full px-3 py-2.5 sm:mx-auto sm:max-w-6xl sm:px-4">
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={onBack}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 shadow-sm hover:bg-gray-50"
              aria-label="Kembali"
            >
              <BackIcon />
            </button>

            <div className="flex min-w-0 flex-1 items-center gap-2">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-rose-600 text-white">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12h14" />
                </svg>
              </div>
              <div className="min-w-0">
                <div className="flex min-w-0 items-center gap-2">
                  <h1 className="min-w-0 truncate text-sm font-black leading-tight text-gray-900 min-[390px]:text-[15px]">
                    Panel Staff
                  </h1>
                  <span className="shrink-0 rounded-full border border-rose-200 bg-rose-50 px-2 py-0.5 text-[9px] font-black uppercase leading-none text-rose-700 md:text-[10px]">
                    Pelayanan
                  </span>
                </div>
                <p className="mt-0.5 hidden truncate text-[11px] text-gray-500 sm:block">
                  Customer · Obat · Safety · Picking
                </p>
              </div>
            </div>

            <label className="grid w-full shrink-0 gap-1 sm:w-72">
              <span className="text-[10px] font-black uppercase tracking-wide text-gray-500">Cabang</span>
              <select
                value={activeBranchId}
                onChange={(event) => {
                  setActiveBranchId(event.target.value);
                  setSafetyReviewedMedicineKey('');
                  resetClosingFlow();
                }}
                className="min-h-9 w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-xs font-bold text-gray-900 outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500"
              >
                {branches.map((branch) => (
                  <option key={branch.id} value={branch.id}>
                    {branch.name} - {branch.id}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
      </header>

      <main className="grid min-w-0 max-w-full gap-3 overflow-hidden py-2.5 sm:mx-auto sm:w-full sm:max-w-6xl sm:overflow-visible sm:px-4 sm:py-4">
        <WorkflowStepper currentStep={currentStep} canOpenStep={canOpenStep} onOpenStep={setCurrentStep} />

        {currentStep === 'customer' ? renderCustomerStep() : null}
        {currentStep === 'medicine' ? renderMedicineStep() : null}
        {currentStep === 'safety' ? renderSafetyStep() : null}
        {currentStep === 'location' ? renderLocationStep() : null}
      </main>
    </div>
  );
}
