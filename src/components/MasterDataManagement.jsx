import { useMemo, useState } from 'react';
import { medicines } from '../data/medicines.js';
import { getLocationForMedicine } from '../data/storageLocations.js';

const branchId = 'JKT001';

const emptyForm = {
  name: '',
  dose: '',
  form: 'Tablet',
  category: 'Analgesik',
  storage: '',
  kolom: '',
  rak: '',
  batch: '',
  expiry: '',
  active: true,
};

function buildInitialRows() {
  return medicines.map((medicine, index) => {
    const location = getLocationForMedicine(branchId, medicine.id);
    return {
      id: medicine.id,
      name: medicine.name,
      dose: medicine.dose,
      form: medicine.form,
      category: medicine.category,
      storage: location?.storage ?? '',
      kolom: String(location?.kolom ?? ''),
      rak: String(location?.rak ?? ''),
      batch: `BATCH-${branchId}-${String(index + 1).padStart(3, '0')}`,
      expiry: index % 2 === 0 ? '2027-08-31' : '2028-01-15',
      active: true,
    };
  });
}

function BackIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
      <path strokeLinecap="round" strokeLinejoin="round" d="m15 19-7-7 7-7" />
    </svg>
  );
}

function StatusBadge({ active }) {
  return (
    <span className={`rounded-full border px-2.5 py-1 text-xs font-black ${active ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-gray-200 bg-gray-50 text-gray-500'}`}>
      {active ? 'Aktif' : 'Tidak Aktif'}
    </span>
  );
}

export default function MasterDataManagement({ onBack }) {
  const [rows, setRows] = useState(buildInitialRows);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [query, setQuery] = useState('');

  const filteredRows = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return rows;
    return rows.filter((row) =>
      [row.name, row.dose, row.form, row.category, row.storage, row.kolom, row.rak, row.batch, row.expiry]
        .join(' ')
        .toLowerCase()
        .includes(normalized),
    );
  }, [query, rows]);

  const updateForm = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!form.name.trim() || !form.storage.trim() || !form.kolom || !form.rak) return;

    if (editingId) {
      setRows((current) => current.map((row) => (row.id === editingId ? { ...row, ...form } : row)));
      resetForm();
      return;
    }

    setRows((current) => [
      {
        ...form,
        id: `MED${Date.now()}`,
      },
      ...current,
    ]);
    resetForm();
  };

  const handleEdit = (row) => {
    setEditingId(row.id);
    setForm({
      name: row.name,
      dose: row.dose,
      form: row.form,
      category: row.category,
      storage: row.storage,
      kolom: row.kolom,
      rak: row.rak,
      batch: row.batch,
      expiry: row.expiry,
      active: row.active,
    });
  };

  const handleDelete = (rowId) => {
    setRows((current) => current.filter((row) => row.id !== rowId));
    if (editingId === rowId) resetForm();
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-10">
      <header className="sticky top-0 z-10 border-b border-gray-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-3 py-3 sm:px-4">
          <button type="button" onClick={onBack} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50" aria-label="Kembali">
            <BackIcon />
          </button>
          <div>
            <h1 className="text-base font-black text-gray-900 sm:text-lg">Management Master Rak dan Obat</h1>
            <p className="text-xs text-gray-500">CRUD daftar obat, mapping rak, batch, expiry, kategori, dan status aktif.</p>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl gap-4 px-3 py-5 sm:px-4 lg:grid-cols-[380px_minmax(0,1fr)]">
        <form onSubmit={handleSubmit} className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-sm font-black text-gray-900">{editingId ? 'Edit Master' : 'Tambah Master'}</p>
          <div className="mt-4 grid gap-3">
            <input value={form.name} onChange={(event) => updateForm('name', event.target.value)} className="min-h-10 rounded-lg border border-gray-300 bg-gray-50 px-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500" placeholder="Nama obat" required />
            <div className="grid gap-3 sm:grid-cols-2">
              <input value={form.dose} onChange={(event) => updateForm('dose', event.target.value)} className="min-h-10 rounded-lg border border-gray-300 bg-gray-50 px-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500" placeholder="Dosis" />
              <input value={form.form} onChange={(event) => updateForm('form', event.target.value)} className="min-h-10 rounded-lg border border-gray-300 bg-gray-50 px-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500" placeholder="Bentuk" />
            </div>
            <select value={form.category} onChange={(event) => updateForm('category', event.target.value)} className="min-h-10 rounded-lg border border-gray-300 bg-gray-50 px-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500">
              <option>Analgesik</option>
              <option>Antibiotik</option>
              <option>Lambung</option>
              <option>Batuk</option>
              <option>Vitamin</option>
            </select>
            <div className="grid grid-cols-3 gap-3">
              <input value={form.storage} onChange={(event) => updateForm('storage', event.target.value.toUpperCase())} className="min-h-10 rounded-lg border border-gray-300 bg-gray-50 px-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500" placeholder="Storage" required />
              <input value={form.kolom} onChange={(event) => updateForm('kolom', event.target.value)} className="min-h-10 rounded-lg border border-gray-300 bg-gray-50 px-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500" placeholder="Kolom" required />
              <input value={form.rak} onChange={(event) => updateForm('rak', event.target.value)} className="min-h-10 rounded-lg border border-gray-300 bg-gray-50 px-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500" placeholder="Rak" required />
            </div>
            <input value={form.batch} onChange={(event) => updateForm('batch', event.target.value)} className="min-h-10 rounded-lg border border-gray-300 bg-gray-50 px-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500" placeholder="Batch" />
            <input type="date" value={form.expiry} onChange={(event) => updateForm('expiry', event.target.value)} className="min-h-10 rounded-lg border border-gray-300 bg-gray-50 px-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500" />
            <label className="flex min-h-10 items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm font-semibold text-gray-700">
              <input type="checkbox" checked={form.active} onChange={(event) => updateForm('active', event.target.checked)} className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
              Status aktif
            </label>
          </div>
          <div className="mt-4 flex gap-2">
            <button type="submit" className="min-h-10 flex-1 rounded-lg bg-gray-900 px-4 py-2 text-sm font-bold text-white hover:bg-black">
              {editingId ? 'Simpan Perubahan' : 'Tambah Master'}
            </button>
            {editingId ? <button type="button" onClick={resetForm} className="min-h-10 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-50">Batal</button> : null}
          </div>
        </form>

        <section className="rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-100 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-black text-gray-900">Daftar Master</p>
                <p className="text-xs text-gray-500">{filteredRows.length} item ditemukan</p>
              </div>
              <input value={query} onChange={(event) => setQuery(event.target.value)} className="min-h-10 w-full rounded-lg border border-gray-300 bg-gray-50 px-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 sm:w-72" placeholder="Cari master..." />
            </div>
          </div>
          <div className="scroll-fade overflow-x-auto">
            <table className="w-full min-w-[920px] text-sm">
              <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-600">
                <tr>
                  <th className="px-4 py-3 text-left font-black">Obat</th>
                  <th className="px-4 py-3 text-left font-black">Kategori</th>
                  <th className="px-4 py-3 text-left font-black">Lokasi</th>
                  <th className="px-4 py-3 text-left font-black">Batch</th>
                  <th className="px-4 py-3 text-left font-black">Expiry</th>
                  <th className="px-4 py-3 text-left font-black">Status</th>
                  <th className="px-4 py-3 text-right font-black">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredRows.map((row) => (
                  <tr key={row.id}>
                    <td className="px-4 py-3">
                      <p className="font-bold text-gray-900">{row.name}</p>
                      <p className="text-xs text-gray-500">{row.dose} - {row.form}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-700">{row.category}</td>
                    <td className="px-4 py-3 font-bold text-gray-900">Storage {row.storage} / Kolom {row.kolom} / Rak {row.rak}</td>
                    <td className="px-4 py-3 text-gray-700">{row.batch || '-'}</td>
                    <td className="px-4 py-3 text-gray-700">{row.expiry || '-'}</td>
                    <td className="px-4 py-3"><StatusBadge active={row.active} /></td>
                    <td className="px-4 py-3 text-right">
                      <button type="button" onClick={() => handleEdit(row)} className="mr-2 rounded-lg border border-gray-300 px-3 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50">Edit</button>
                      <button type="button" onClick={() => handleDelete(row.id)} className="rounded-lg bg-red-600 px-3 py-2 text-xs font-bold text-white hover:bg-red-700">Hapus</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
