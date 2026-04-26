import { useEffect, useMemo, useRef, useState } from 'react';
import { branches, getPriceForMedicine, getStockForMedicine } from '../data/branches.js';
import { customerRecords } from '../data/customerRecords.js';
import { medicines, medicineCategories } from '../data/medicines.js';
import { getLocationForMedicine } from '../data/storageLocations.js';
import { evaluateSafetyAdvisor } from '../utils/aiService.js';
import CustomerPanel from './CustomerPanel.jsx';

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

function LocationCard({ item, onClose }) {
  if (!item) return null;

  return (
    <section className="location-card-pulse min-w-0 overflow-hidden rounded-lg border-2 border-indigo-300 bg-indigo-50 p-4 shadow-sm md:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-indigo-700">
            <LocationPinIcon />
            AMBIL DI:
          </p>
          <h2 className="mt-1 text-xl font-black leading-tight text-gray-900 md:text-2xl">{item.medicine.name}</h2>
          <p className="mt-1 text-sm font-semibold text-indigo-700">Zona {item.zone}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-indigo-700 hover:bg-indigo-100"
          aria-label="Tutup kartu lokasi"
        >
          <CloseIcon />
        </button>
      </div>

      <div className="mt-4 grid min-w-0 grid-cols-3 gap-2 md:gap-3">
        {[
          ['Storage', item.storage],
          ['Kolom', item.kolom],
          ['Rak', item.rak],
        ].map(([label, value]) => (
          <div key={label} className="min-w-0 rounded-lg border border-indigo-200 bg-white p-3 text-center md:p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 md:text-xs">{label}</p>
            <p className="mt-1 text-4xl font-black leading-none text-indigo-700 md:text-5xl">{value}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 grid min-w-0 gap-2 text-sm sm:grid-cols-3">
        <div className="min-w-0 rounded-lg border border-indigo-100 bg-white/80 p-3">
          <p className="text-xs font-semibold text-gray-500">Stok</p>
          <p className="mt-1 font-bold text-gray-900">{item.stock === 0 ? 'Habis' : `${item.stock} pcs`}</p>
        </div>
        <div className="min-w-0 rounded-lg border border-indigo-100 bg-white/80 p-3">
          <p className="text-xs font-semibold text-gray-500">Harga</p>
          <p className="mt-1 font-bold text-gray-900">{formatRupiah(item.price)}</p>
        </div>
        <div className="min-w-0 rounded-lg border border-indigo-100 bg-white/80 p-3">
          <p className="text-xs font-semibold text-gray-500">Status</p>
          <p className="mt-1 font-bold text-gray-900">{item.status.label}</p>
        </div>
      </div>
    </section>
  );
}

function SummaryCard({ label, value, tone = 'slate' }) {
  const toneClass = {
    slate: 'border-slate-200 bg-white text-slate-900',
    emerald: 'border-emerald-200 bg-emerald-50 text-emerald-900',
    amber: 'border-amber-200 bg-amber-50 text-amber-900',
    red: 'border-red-200 bg-red-50 text-red-900',
  };

  return (
    <div className={`min-h-20 min-w-0 overflow-hidden rounded-lg border px-3 py-3 ${toneClass[tone]}`}>
      <p className="text-[11px] font-bold uppercase tracking-wide opacity-70">{label}</p>
      <p className="mt-1 text-2xl font-black leading-none">{value}</p>
    </div>
  );
}

function MobileMedicineCards({ rows, selectedMedicineId, onSelect }) {
  if (!rows.length) return null;

  return (
    <div className="grid min-w-0 gap-3 md:hidden">
      {rows.map((item) => (
        <article
          key={item.id}
          className={`min-w-0 overflow-hidden rounded-lg border bg-white p-3 shadow-sm ${
            selectedMedicineId === item.id ? 'border-indigo-300 ring-2 ring-indigo-100' : 'border-gray-200'
          } ${item.status.key === 'out' ? 'opacity-65' : ''}`}
        >
          <div className="flex min-w-0 items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="break-words text-base font-black leading-tight text-gray-900">{item.medicine.name}</h3>
              <p className="mt-1 text-xs font-medium text-gray-500">
                {item.medicine.form} - {item.medicine.category}
              </p>
            </div>
            <span className={`shrink-0 rounded-full border px-2 py-1 text-[10px] font-black ${item.status.badgeClass}`}>
              {item.status.label}
            </span>
          </div>

          <div className="mt-3 grid min-w-0 grid-cols-3 gap-2">
            <div className="min-w-0 rounded-lg bg-indigo-50 p-2 text-center">
              <p className="text-[10px] font-black uppercase text-indigo-600">Storage</p>
              <p className="mt-1 text-2xl font-black leading-none text-indigo-700">{item.storage}</p>
            </div>
            <div className="min-w-0 rounded-lg bg-indigo-50 p-2 text-center">
              <p className="text-[10px] font-black uppercase text-indigo-600">Kolom</p>
              <p className="mt-1 text-2xl font-black leading-none text-indigo-700">{item.kolom}</p>
            </div>
            <div className="min-w-0 rounded-lg bg-indigo-50 p-2 text-center">
              <p className="text-[10px] font-black uppercase text-indigo-600">Rak</p>
              <p className="mt-1 text-2xl font-black leading-none text-indigo-700">{item.rak}</p>
            </div>
          </div>

          <div className="mt-3 flex min-w-0 flex-wrap items-center justify-between gap-2 text-sm">
            <div className="min-w-0">
              <p className="text-xs font-semibold text-gray-500">Stok / Harga</p>
              <p className="font-black text-gray-900">
                {item.stock} pcs - {formatRupiah(item.price)}
              </p>
            </div>
            <button
              type="button"
              onClick={() => onSelect(item.id)}
              className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-bold text-white hover:bg-indigo-700"
            >
              <LocationPinIcon />
              Ambil
            </button>
          </div>

          <p className="mt-2 line-clamp-2 text-xs leading-5 text-gray-500">{item.medicine.indications.join(', ')}</p>
        </article>
      ))}
    </div>
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
    <div className="rounded-lg border border-gray-100 bg-gray-50 p-3">
      <div className="mb-1 flex items-center justify-between gap-2">
        <p className="text-[11px] font-black uppercase tracking-wide text-gray-500">{label}</p>
        <span className={`rounded-full border px-2 py-0.5 text-[10px] font-black uppercase ${toneClass}`}>{check.status}</span>
      </div>
      <p className="text-sm leading-6 text-gray-700">{check.message}</p>
    </div>
  );
}

function SafetyAdvisorPreview({ customer, selectedItem }) {
  const advisory = useMemo(
    () => evaluateSafetyAdvisor(customer, selectedItem?.medicine, selectedItem),
    [customer, selectedItem],
  );

  const statusClass = {
    safe: 'border-emerald-200 bg-emerald-50 text-emerald-800',
    warning: 'border-amber-200 bg-amber-50 text-amber-800',
    danger: 'border-red-200 bg-red-50 text-red-800',
  };

  return (
    <section className="rounded-lg border border-violet-200 bg-violet-50 p-4 shadow-sm">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-gray-900">AI Safety Check</h2>
          <p className="mt-1 text-xs leading-5 text-gray-600">Preview dummy. Tidak memanggil API eksternal pada MVP.</p>
        </div>
        <span className="rounded-full border border-violet-200 bg-white px-2.5 py-1 text-[11px] font-bold text-violet-700">Preview</span>
      </div>

      {!selectedItem ? (
        <div className="rounded-lg border border-violet-100 bg-white p-4 text-sm text-gray-600">
          Pilih obat dari tabel untuk melihat rekomendasi dosis, cek alergi, cek interaksi, cek kontraindikasi, dan saran staff.
        </div>
      ) : (
        <div className="grid gap-3">
          <div className={`rounded-lg border p-4 ${statusClass[advisory.safetyStatus]}`}>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-white/70 px-2.5 py-1 text-xs font-black uppercase">Status {advisory.statusLabel}</span>
              <span className="text-sm font-bold">{selectedItem.medicine.name}</span>
            </div>
            <p className="mt-2 text-sm leading-6">{advisory.summary}</p>
          </div>

          <div className="rounded-lg border border-violet-100 bg-white p-3">
            <p className="text-[11px] font-black uppercase tracking-wide text-violet-700">Customer Aktif</p>
            <p className="mt-1 text-sm font-bold text-gray-900">
              {customer.name} - {customer.age} tahun ({advisory.customerContext.ageCategory})
            </p>
            <p className="mt-1 text-xs text-gray-600">
              Alergi: {advisory.customerContext.allergies.length ? advisory.customerContext.allergies.join(', ') : 'Tidak ada'}.
              Kondisi: {advisory.customerContext.conditions.length ? advisory.customerContext.conditions.join(', ') : 'Tidak ada'}.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-gray-100 bg-white p-3">
              <p className="text-[11px] font-black uppercase tracking-wide text-gray-500">Rekomendasi Dosis</p>
              <p className="mt-1 text-sm font-semibold leading-6 text-gray-800">{advisory.doseRecommendation.dose}</p>
              <p className="mt-1 text-xs text-gray-500">
                Kategori: {advisory.doseRecommendation.category}. Maks: {advisory.doseRecommendation.maxDaily}
              </p>
            </div>
            <SafetyCheckItem label="Cek Alergi" check={advisory.allergyCheck} />
            <SafetyCheckItem label="Cek Interaksi Obat" check={advisory.interactionCheck} />
            <SafetyCheckItem label="Cek Kontraindikasi" check={advisory.contraindicationCheck} />
          </div>

          <div className="rounded-lg border border-violet-100 bg-white p-3">
            <p className="text-[11px] font-black uppercase tracking-wide text-violet-700">Catatan / Saran Staff</p>
            <p className="mt-1 text-sm leading-6 text-gray-800">{advisory.suggestion}</p>
            <p className="mt-2 text-xs leading-5 text-gray-500">Catatan sebelumnya: {advisory.previousNotes}</p>
          </div>
        </div>
      )}
    </section>
  );
}

export default function StaffLocator({ onBack }) {
  const [activeBranchId, setActiveBranchId] = useState('JKT001');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [selectedMedicineId, setSelectedMedicineId] = useState(null);
  const [customers, setCustomers] = useState(() => [...customerRecords]);
  const [activeCustomerId, setActiveCustomerId] = useState(customerRecords[0]?.id ?? null);
  const locationCardRef = useRef(null);

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
        item.zone,
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
      if (sortConfig.key === 'storage') {
        return `${first.storage}${first.kolom}${first.rak}`.localeCompare(`${second.storage}${second.kolom}${second.rak}`) * direction;
      }
      return first.medicine.name.localeCompare(second.medicine.name) * direction;
    });
  }, [activeCategory, inventoryRows, searchQuery, sortConfig]);

  const selectedItem = useMemo(
    () => inventoryRows.find((item) => item.id === selectedMedicineId) ?? null,
    [inventoryRows, selectedMedicineId],
  );

  const activeCustomer = useMemo(
    () => customers.find((customer) => customer.id === activeCustomerId) ?? customers[0] ?? null,
    [activeCustomerId, customers],
  );

  useEffect(() => {
    if (selectedItem && locationCardRef.current) {
      locationCardRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [selectedItem]);

  const handleCreateCustomer = (record) => {
    setCustomers((current) => [record, ...current]);
    setActiveCustomerId(record.id);
  };

  const toggleSort = (key) => {
    setSortConfig((current) => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const sortIndicator = (key) => {
    if (sortConfig.key !== key) return '';
    return sortConfig.direction === 'asc' ? ' ↑' : ' ↓';
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-50 pb-10">
      <header className="sticky top-0 z-20 border-b border-gray-200 bg-white/95 shadow-sm backdrop-blur">
        <div className="w-full px-4 py-2.5 sm:mx-auto sm:max-w-6xl">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBack}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 shadow-sm hover:bg-gray-50"
              aria-label="Kembali"
            >
              <BackIcon />
            </button>

            <div className="min-w-0 flex-1">
              <div className="flex min-w-0 items-center gap-2">
                <h1 className="min-w-0 truncate text-[15px] font-black leading-tight text-gray-900 min-[390px]:text-base sm:text-lg">
                  Lokasi Obat - Staff Panel
                </h1>
                <span className="shrink-0 rounded-full border border-indigo-200 bg-indigo-50 px-2 py-1 text-[9px] font-black uppercase leading-none text-indigo-700 min-[390px]:px-2.5 min-[390px]:text-[10px] md:text-xs">
                  Mode Staff
                </span>
              </div>
              <p className="mt-1 hidden truncate text-xs text-gray-500 sm:block">Cari stok dan lokasi fisik obat berdasarkan Storage, Kolom, dan Rak.</p>
            </div>

            <label className="hidden w-80 shrink-0 sm:block">
              <span className="sr-only">Pilih Cabang</span>
              <select
                value={activeBranchId}
                onChange={(event) => setActiveBranchId(event.target.value)}
                className="min-h-11 w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2.5 text-sm font-bold text-gray-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
              >
                {branches.map((branch) => (
                  <option key={branch.id} value={branch.id}>
                    {branch.name} - {branch.id}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="mt-2 block sm:hidden">
            <span className="sr-only">Pilih Cabang</span>
            <select
              value={activeBranchId}
              onChange={(event) => setActiveBranchId(event.target.value)}
              className="min-h-11 w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2.5 text-sm font-bold text-gray-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
            >
              {branches.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {branch.name} - {branch.id}
                </option>
              ))}
            </select>
          </label>
        </div>
      </header>

      <main className="grid min-w-0 max-w-full gap-4 overflow-hidden py-3 sm:mx-auto sm:w-full sm:max-w-6xl sm:overflow-visible sm:px-4 sm:py-5">
        <section className="relative z-10 min-w-0 max-w-full overflow-hidden rounded-none border-y border-gray-200 bg-white p-4 shadow-sm sm:sticky sm:top-[68px] sm:overflow-visible sm:rounded-lg sm:border sm:bg-white/95 sm:p-4 sm:backdrop-blur">
          <div className="grid min-w-0 gap-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
            <div className="relative min-w-0">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <SearchIcon />
              </span>
              <input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="min-h-12 w-full min-w-0 max-w-full rounded-full border border-gray-300 bg-gray-50 py-3 pl-12 pr-12 text-base font-semibold text-gray-900 outline-none placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                placeholder="Cari obat, kategori, atau indikasi..."
              />
              {searchQuery ? (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300"
                  aria-label="Bersihkan pencarian"
                >
                  <CloseIcon />
                </button>
              ) : null}
            </div>
            <div className="flex min-h-11 min-w-0 items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 text-sm font-bold text-amber-900">
              <AlertIcon />
              <span className="min-w-0 truncate">{lowStockRows.length} obat stok menipis</span>
            </div>
          </div>

          <div className="scroll-fade mt-4 flex min-w-0 max-w-full gap-2 overflow-x-auto pb-1">
            {medicineCategories.map((category) => {
              const active = category === activeCategory;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  aria-pressed={active}
                  className={`min-h-10 whitespace-nowrap rounded-full border px-4 py-2 text-sm font-bold transition ${
                    active
                      ? 'border-indigo-600 bg-indigo-600 text-white'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-indigo-300 hover:text-indigo-700'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>

          {lowStockRows.length ? (
            <p className="mt-3 overflow-hidden text-ellipsis whitespace-nowrap text-xs font-medium text-amber-800">
              Stok menipis: {lowStockRows.map((item) => `${item.medicine.name} (${item.stock})`).join(' - ')}
            </p>
          ) : (
            <p className="mt-3 text-xs font-medium text-emerald-700">Tidak ada stok menipis di cabang aktif.</p>
          )}
        </section>

        <section className="grid w-full min-w-0 max-w-full grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-3 px-4 sm:grid-cols-4 sm:px-0">
          <SummaryCard label="Total Obat" value={inventoryRows.length} />
          <SummaryCard label="Tersedia" value={availableRows.length} tone="emerald" />
          <SummaryCard label="Menipis" value={lowStockRows.length} tone="amber" />
          <SummaryCard label="Habis" value={outOfStockRows.length} tone="red" />
        </section>

        <div ref={locationCardRef} className="px-3 sm:px-0">
          <LocationCard item={selectedItem} onClose={() => setSelectedMedicineId(null)} />
        </div>

        <section className="min-w-0 overflow-hidden rounded-none border-y border-gray-200 bg-white shadow-sm sm:rounded-lg sm:border">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 p-4">
            <div>
              <h2 className="text-base font-bold text-gray-900">Tabel Hasil Pencarian</h2>
              <p className="mt-1 text-xs text-gray-500">
                {filteredRows.length} hasil ditemukan dari {inventoryRows.length} obat
              </p>
            </div>
            <label className="flex w-full items-center gap-2 text-xs font-bold text-gray-600 sm:w-auto md:hidden">
              Urutkan
              <select
                value={`${sortConfig.key}:${sortConfig.direction}`}
                onChange={(event) => {
                  const [key, direction] = event.target.value.split(':');
                  setSortConfig({ key, direction });
                }}
                className="min-h-10 flex-1 rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-xs font-bold text-gray-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
              >
                <option value="name:asc">Nama A-Z</option>
                <option value="name:desc">Nama Z-A</option>
                <option value="stock:desc">Stok terbanyak</option>
                <option value="stock:asc">Stok tersedikit</option>
                <option value="storage:asc">Storage A-E</option>
                <option value="storage:desc">Storage E-A</option>
              </select>
            </label>
            <span className="hidden text-xs font-medium text-gray-400 md:inline">Klik header tabel untuk sortir</span>
          </div>

          <div className="min-w-0 p-3 md:hidden">
            <MobileMedicineCards rows={filteredRows} selectedMedicineId={selectedMedicineId} onSelect={setSelectedMedicineId} />
          </div>

          <div className="scroll-fade hidden w-full overflow-x-auto md:block">
            <table className="w-full min-w-[940px] text-sm">
              <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-600">
                <tr>
                  <th className="px-4 py-3 text-left font-black">
                    <button type="button" onClick={() => toggleSort('name')} className="font-black hover:text-indigo-700">
                      Nama Obat{sortIndicator('name')}
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left font-black">Dosis</th>
                  <th className="px-4 py-3 text-left font-black">
                    <button type="button" onClick={() => toggleSort('stock')} className="font-black hover:text-indigo-700">
                      Stok{sortIndicator('stock')}
                    </button>
                  </th>
                  <th className="px-3 py-3 text-center font-black">
                    <button type="button" onClick={() => toggleSort('storage')} className="font-black hover:text-indigo-700">
                      Storage{sortIndicator('storage')}
                    </button>
                  </th>
                  <th className="px-3 py-3 text-center font-black">Kolom</th>
                  <th className="px-3 py-3 text-center font-black">Rak</th>
                  <th className="px-4 py-3 text-left font-black">Status</th>
                  <th className="px-4 py-3 text-left font-black">Harga</th>
                  <th className="px-4 py-3 text-right font-black">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredRows.map((item) => (
                  <tr
                    key={item.id}
                    className={`transition hover:bg-indigo-50/40 ${
                      item.status.key === 'out' ? 'bg-red-50/40 opacity-60' : ''
                    } ${selectedMedicineId === item.id ? 'bg-indigo-50' : ''}`}
                  >
                    <td className="px-4 py-3">
                      <p className="font-bold text-gray-900">{item.medicine.name}</p>
                      <p className="mt-0.5 text-xs text-gray-500">
                        {item.medicine.category} - {item.medicine.indications.join(', ')}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-gray-700">{item.medicine.dose}</td>
                    <td className="px-4 py-3 font-black text-gray-900">{item.stock}</td>
                    <td className="px-3 py-3 text-center">
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 font-black text-indigo-700">
                        {item.storage}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-center font-bold text-gray-700">{item.kolom}</td>
                    <td className="px-3 py-3 text-center font-bold text-gray-700">{item.rak}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full border px-2.5 py-1 text-xs font-black ${item.status.badgeClass}`}>{item.status.label}</span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 font-bold text-gray-900">{formatRupiah(item.price)}</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedMedicineId(item.id)}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-2 text-xs font-bold text-white hover:bg-indigo-700"
                      >
                        <LocationPinIcon />
                        Lihat Lokasi
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <details className="border-t border-gray-100 md:hidden">
            <summary className="cursor-pointer px-4 py-3 text-sm font-bold text-indigo-700">Lihat tabel lengkap</summary>
            <div className="scroll-fade overflow-x-auto">
              <table className="w-full min-w-[860px] text-sm">
                <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-600">
                  <tr>
                    <th className="px-4 py-3 text-left font-black">Nama Obat</th>
                    <th className="px-4 py-3 text-left font-black">Dosis</th>
                    <th className="px-4 py-3 text-left font-black">Stok</th>
                    <th className="px-3 py-3 text-center font-black">Storage</th>
                    <th className="px-3 py-3 text-center font-black">Kolom</th>
                    <th className="px-3 py-3 text-center font-black">Rak</th>
                    <th className="px-4 py-3 text-left font-black">Status</th>
                    <th className="px-4 py-3 text-left font-black">Harga</th>
                    <th className="px-4 py-3 text-right font-black">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredRows.map((item) => (
                    <tr key={`mobile-table-${item.id}`} className={item.status.key === 'out' ? 'bg-red-50/40 opacity-60' : ''}>
                      <td className="px-4 py-3">
                        <p className="font-bold text-gray-900">{item.medicine.name}</p>
                        <p className="mt-0.5 text-xs text-gray-500">{item.medicine.category}</p>
                      </td>
                      <td className="px-4 py-3 text-gray-700">{item.medicine.dose}</td>
                      <td className="px-4 py-3 font-black text-gray-900">{item.stock}</td>
                      <td className="px-3 py-3 text-center font-black text-indigo-700">{item.storage}</td>
                      <td className="px-3 py-3 text-center font-bold text-gray-700">{item.kolom}</td>
                      <td className="px-3 py-3 text-center font-bold text-gray-700">{item.rak}</td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full border px-2.5 py-1 text-xs font-black ${item.status.badgeClass}`}>{item.status.label}</span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 font-bold text-gray-900">{formatRupiah(item.price)}</td>
                      <td className="px-4 py-3 text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedMedicineId(item.id)}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-2 text-xs font-bold text-white hover:bg-indigo-700"
                        >
                          <LocationPinIcon />
                          Lihat
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </details>

          {!filteredRows.length ? (
            <div className="p-10 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                <SearchIcon />
              </div>
              <p className="mt-3 font-bold text-gray-700">Obat tidak ditemukan</p>
              <p className="mt-1 text-sm text-gray-500">Coba kata kunci lain atau ubah filter kategori.</p>
            </div>
          ) : null}
        </section>

        <section className="grid gap-4 px-3 sm:px-0 lg:grid-cols-[0.95fr_1.05fr]">
          <CustomerPanel
            customers={customers}
            activeCustomerId={activeCustomer?.id}
            onSelectCustomer={setActiveCustomerId}
            onCreateCustomer={handleCreateCustomer}
          />
          <SafetyAdvisorPreview customer={activeCustomer} selectedItem={selectedItem} />
        </section>
      </main>
    </div>
  );
}
