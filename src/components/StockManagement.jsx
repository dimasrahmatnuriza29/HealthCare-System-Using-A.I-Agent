import { useMemo, useState } from 'react';
import { branchStock, getPriceForMedicine } from '../data/branches.js';
import { medicines } from '../data/medicines.js';

const branchId = 'JKT001';

const minimums = {
  MED001: 20,
  MED002: 20,
  MED003: 15,
  MED004: 15,
  MED005: 25,
  MED006: 15,
  MED007: 15,
  MED008: 20,
  MED009: 20,
  MED010: 15,
};

const emptyForm = {
  name: '',
  current: '',
  minimum: '',
  price: '',
  reason: '',
  staff: 'Admin Gudang',
};

function buildInitialRows() {
  return medicines.map((medicine) => ({
    id: medicine.id,
    name: medicine.name,
    current: branchStock[branchId]?.[medicine.id] ?? 0,
    minimum: minimums[medicine.id] ?? 15,
    price: getPriceForMedicine(branchId, medicine.id),
  }));
}

const initialChanges = [
  {
    id: 'STK-001',
    time: '2026-04-28T08:12',
    medicine: 'Paracetamol 500mg',
    change: -2,
    source: 'Picking SRV-20260428-001',
    staff: 'Siti',
  },
  {
    id: 'STK-002',
    time: '2026-04-28T08:37',
    medicine: 'Omeprazole 20mg',
    change: -1,
    source: 'Picking SRV-20260428-003',
    staff: 'Andi',
  },
  {
    id: 'STK-003',
    time: '2026-04-27T16:20',
    medicine: 'Vitamin C 500mg',
    change: 24,
    source: 'Restock pembelian',
    staff: 'Admin Gudang',
  },
];

function BackIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
      <path strokeLinecap="round" strokeLinejoin="round" d="m15 19-7-7 7-7" />
    </svg>
  );
}

function formatRupiah(value) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);
}

function formatDateTime(value) {
  return new Date(value).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' });
}

function getStockStatus(row) {
  if (Number(row.current) === 0) return { label: 'Habis', className: 'border-red-200 bg-red-50 text-red-700' };
  if (Number(row.current) <= Number(row.minimum)) return { label: 'Hampir Habis', className: 'border-amber-200 bg-amber-50 text-amber-800' };
  return { label: 'Aman', className: 'border-emerald-200 bg-emerald-50 text-emerald-700' };
}

export default function StockManagement({ onBack }) {
  const [rows, setRows] = useState(buildInitialRows);
  const [changes, setChanges] = useState(initialChanges);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [query, setQuery] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    const filter = params.get('filter');
    // supported: low | out
    return filter === 'low' ? 'hampir habis' : filter === 'out' ? 'habis' : '';
  });

  const filteredRows = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const stockFilter = normalized === 'habis' ? 'out' : normalized === 'hampir habis' ? 'low' : null;

    if (stockFilter === 'out') {
      return rows.filter((row) => Number(row.current) === 0);
    }
    if (stockFilter === 'low') {
      return rows.filter((row) => Number(row.current) > 0 && Number(row.current) <= Number(row.minimum));
    }
    if (!normalized) return rows;
    return rows.filter((row) => row.name.toLowerCase().includes(normalized));
  }, [query, rows]);

  const updateForm = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const appendChange = ({ medicine, before, after, reason, staff }) => {
    const delta = Number(after) - Number(before);
    if (delta === 0) return;
    setChanges((current) => [
      {
        id: `STK-${Date.now()}`,
        time: new Date().toISOString().slice(0, 16),
        medicine,
        change: delta,
        source: reason || 'Update manual',
        staff: staff || 'Admin Gudang',
      },
      ...current,
    ]);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!form.name.trim()) return;

    const payload = {
      name: form.name.trim(),
      current: Number(form.current) || 0,
      minimum: Number(form.minimum) || 0,
      price: Number(form.price) || 0,
    };

    if (editingId) {
      const before = rows.find((row) => row.id === editingId);
      setRows((current) => current.map((row) => (row.id === editingId ? { ...row, ...payload } : row)));
      appendChange({
        medicine: payload.name,
        before: before?.current ?? 0,
        after: payload.current,
        reason: form.reason,
        staff: form.staff,
      });
      resetForm();
      return;
    }

    setRows((current) => [{ ...payload, id: `STOCK${Date.now()}` }, ...current]);
    appendChange({ medicine: payload.name, before: 0, after: payload.current, reason: form.reason || 'Tambah stok baru', staff: form.staff });
    resetForm();
  };

  const handleEdit = (row) => {
    setEditingId(row.id);
    setForm({
      name: row.name,
      current: String(row.current),
      minimum: String(row.minimum),
      price: String(row.price),
      reason: '',
      staff: 'Admin Gudang',
    });
  };

  const handleDelete = (rowId) => {
    const row = rows.find((item) => item.id === rowId);
    setRows((current) => current.filter((item) => item.id !== rowId));
    if (row) {
      appendChange({ medicine: row.name, before: row.current, after: 0, reason: 'Item stok dihapus', staff: 'Admin Gudang' });
    }
    if (editingId === rowId) resetForm();
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-10">
      <header className="sticky top-0 z-10 border-b border-gray-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
          <button type="button" onClick={onBack} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50" aria-label="Kembali">
            <BackIcon />
          </button>
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-amber-600 text-white">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="m3 7 9-4 9 4-9 4-9-4Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10l9 4 9-4V7M12 11v10" />
              </svg>
            </div>
            <div>
              <h1 className="text-[15px] font-black text-gray-900">Stok Obat</h1>
              <p className="text-[11px] text-gray-500">Pantau stok, kedaluwarsa, dan kebutuhan restock.</p>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl gap-4 px-3 py-5 sm:px-4 lg:grid-cols-[360px_minmax(0,1fr)]">
        <div className="grid gap-4">
          <form onSubmit={handleSubmit} className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <p className="text-sm font-black text-gray-900">{editingId ? 'Edit Stok' : 'Tambah Stok'}</p>
            <div className="mt-4 grid gap-3">
              <input value={form.name} onChange={(event) => updateForm('name', event.target.value)} className="min-h-10 rounded-lg border border-gray-300 bg-gray-50 px-3 text-sm outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500" placeholder="Nama obat" required />
              <div className="grid gap-3 sm:grid-cols-2">
                <input type="number" value={form.current} onChange={(event) => updateForm('current', event.target.value)} className="min-h-10 rounded-lg border border-gray-300 bg-gray-50 px-3 text-sm outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500" placeholder="Stok saat ini" />
                <input type="number" value={form.minimum} onChange={(event) => updateForm('minimum', event.target.value)} className="min-h-10 rounded-lg border border-gray-300 bg-gray-50 px-3 text-sm outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500" placeholder="Stok minimum" />
              </div>
              <input type="number" value={form.price} onChange={(event) => updateForm('price', event.target.value)} className="min-h-10 rounded-lg border border-gray-300 bg-gray-50 px-3 text-sm outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500" placeholder="Harga" />
              <input value={form.reason} onChange={(event) => updateForm('reason', event.target.value)} className="min-h-10 rounded-lg border border-gray-300 bg-gray-50 px-3 text-sm outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500" placeholder="Alasan perubahan" />
              <input value={form.staff} onChange={(event) => updateForm('staff', event.target.value)} className="min-h-10 rounded-lg border border-gray-300 bg-gray-50 px-3 text-sm outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500" placeholder="Staff" />
            </div>
            <div className="mt-4 flex gap-2">
              <button type="submit" className="min-h-10 flex-1 rounded-lg bg-gray-900 px-4 py-2 text-sm font-bold text-white hover:bg-black">
                {editingId ? 'Simpan Perubahan' : 'Tambah Stok'}
              </button>
              {editingId ? <button type="button" onClick={resetForm} className="min-h-10 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-50">Batal</button> : null}
            </div>
          </form>

          <section className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <p className="text-sm font-black text-gray-900">Riwayat Perubahan</p>
            <div className="mt-3 grid max-h-[460px] gap-2 overflow-y-auto pr-1">
              {changes.map((change) => (
                <article key={change.id} className="rounded-lg border border-gray-100 bg-gray-50 p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-bold text-gray-900">{change.medicine}</p>
                      <p className="mt-1 text-xs text-gray-500">{formatDateTime(change.time)}</p>
                    </div>
                    <span className={`rounded-full border px-2 py-0.5 text-xs font-black ${change.change < 0 ? 'border-amber-200 bg-amber-50 text-amber-800' : 'border-emerald-200 bg-emerald-50 text-emerald-700'}`}>
                      {change.change > 0 ? `+${change.change}` : change.change}
                    </span>
                  </div>
                  <p className="mt-2 text-xs leading-5 text-gray-600">{change.source} - {change.staff}</p>
                </article>
              ))}
            </div>
          </section>
        </div>

        <section className="rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-100 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-black text-gray-900">Daftar Stok</p>
                <p className="text-xs text-gray-500">{filteredRows.length} item ditemukan</p>
              </div>
              <input value={query} onChange={(event) => setQuery(event.target.value)} className="min-h-10 w-full rounded-lg border border-gray-300 bg-gray-50 px-3 text-sm outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500 sm:w-72" placeholder="Cari stok..." />
            </div>
          </div>
          <div className="scroll-fade overflow-x-auto">
            <table className="w-full min-w-[760px] text-sm">
              <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-600">
                <tr>
                  <th className="px-4 py-3 text-left font-black">Obat</th>
                  <th className="px-4 py-3 text-left font-black">Stok Saat Ini</th>
                  <th className="px-4 py-3 text-left font-black">Minimum</th>
                  <th className="px-4 py-3 text-left font-black">Indikator</th>
                  <th className="px-4 py-3 text-left font-black">Harga</th>
                  <th className="px-4 py-3 text-right font-black">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredRows.map((row) => {
                  const status = getStockStatus(row);
                  return (
                    <tr key={row.id}>
                      <td className="px-4 py-3 font-bold text-gray-900">{row.name}</td>
                      <td className="px-4 py-3 font-black text-gray-900">{row.current} pcs</td>
                      <td className="px-4 py-3 text-gray-700">{row.minimum} pcs</td>
                      <td className="px-4 py-3"><span className={`rounded-full border px-2.5 py-1 text-xs font-black ${status.className}`}>{status.label}</span></td>
                      <td className="px-4 py-3 font-semibold text-gray-900">{formatRupiah(row.price)}</td>
                      <td className="px-4 py-3 text-right">
                        <button type="button" onClick={() => handleEdit(row)} className="mr-2 rounded-lg border border-gray-300 px-3 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50">Edit</button>
                        <button type="button" onClick={() => handleDelete(row.id)} className="rounded-lg bg-red-600 px-3 py-2 text-xs font-bold text-white hover:bg-red-700">Hapus</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
