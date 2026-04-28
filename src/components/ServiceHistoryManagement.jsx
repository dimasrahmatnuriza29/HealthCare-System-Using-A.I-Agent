import { useMemo, useState } from 'react';

const emptyForm = {
  customer: '',
  medicines: '',
  servedAt: '',
  staff: '',
  pharmacist: '',
  safety: 'Aman',
  pharmacistNote: '',
  status: 'Selesai',
};

const initialRecords = [
  {
    id: 'SRV-20260428-001',
    customer: 'Budi Santoso',
    medicines: 'Paracetamol 500mg, OBH Combi Sirup 100ml',
    servedAt: '2026-04-28T08:12',
    staff: 'Siti',
    pharmacist: 'Apt. Dimas',
    safety: 'Aman',
    pharmacistNote: 'Dosis anak dicek. Edukasi aturan pakai dan penyimpanan sirup sudah diberikan.',
    status: 'Selesai',
  },
  {
    id: 'SRV-20260428-002',
    customer: 'Rina Wijaya',
    medicines: 'Ibuprofen 400mg',
    servedAt: '2026-04-28T08:25',
    staff: 'Ayu',
    pharmacist: 'Apt. Rani',
    safety: 'Warning',
    pharmacistNote: 'Hamil trimester 3. Dispensing dibatalkan dan diarahkan konsultasi dokter.',
    status: 'Batal',
  },
  {
    id: 'SRV-20260428-003',
    customer: 'Customer Baru',
    medicines: 'Omeprazole 20mg, Antasida DOEN',
    servedAt: '2026-04-28T08:37',
    staff: 'Andi',
    pharmacist: 'Apt. Dimas',
    safety: 'Aman',
    pharmacistNote: 'Tidak ada alergi tercatat. Edukasi waktu konsumsi sebelum makan.',
    status: 'Selesai',
  },
];

function BackIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
      <path strokeLinecap="round" strokeLinejoin="round" d="m15 19-7-7 7-7" />
    </svg>
  );
}

function StatusBadge({ status }) {
  const className =
    status === 'Selesai' || status === 'Aman'
      ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
      : status === 'Batal' || status === 'Danger'
        ? 'border-red-200 bg-red-50 text-red-700'
        : 'border-amber-200 bg-amber-50 text-amber-800';
  return <span className={`rounded-full border px-2.5 py-1 text-xs font-black ${className}`}>{status}</span>;
}

function formatDateTime(value) {
  if (!value) return '-';
  return new Date(value).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' });
}

export default function ServiceHistoryManagement({ onBack }) {
  const [records, setRecords] = useState(initialRecords);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [query, setQuery] = useState('');

  const filteredRecords = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return records;
    return records.filter((record) =>
      [record.id, record.customer, record.medicines, record.staff, record.pharmacist, record.safety, record.status]
        .join(' ')
        .toLowerCase()
        .includes(normalized),
    );
  }, [query, records]);

  const updateForm = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!form.customer.trim() || !form.medicines.trim() || !form.servedAt) return;

    if (editingId) {
      setRecords((current) =>
        current.map((record) => (record.id === editingId ? { ...record, ...form } : record)),
      );
      resetForm();
      return;
    }

    setRecords((current) => [
      {
        ...form,
        id: `SRV-${Date.now()}`,
      },
      ...current,
    ]);
    resetForm();
  };

  const handleEdit = (record) => {
    setEditingId(record.id);
    setForm({
      customer: record.customer,
      medicines: record.medicines,
      servedAt: record.servedAt,
      staff: record.staff,
      pharmacist: record.pharmacist,
      safety: record.safety,
      pharmacistNote: record.pharmacistNote,
      status: record.status,
    });
  };

  const handleDelete = (recordId) => {
    setRecords((current) => current.filter((record) => record.id !== recordId));
    if (editingId === recordId) resetForm();
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-10">
      <header className="sticky top-0 z-10 border-b border-gray-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
          <button
            type="button"
            onClick={onBack}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
            aria-label="Kembali"
          >
            <BackIcon />
          </button>
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-emerald-600 text-white">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5h6M9 3h6a2 2 0 0 1 2 2v1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h1V5a2 2 0 0 1 2-2Z" />
              </svg>
            </div>
            <div>
              <h1 className="text-[15px] font-black text-gray-900">Riwayat Pelayanan</h1>
              <p className="text-[11px] text-gray-500">Lacak seluruh transaksi dispensing yang selesai atau batal.</p>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl gap-4 px-3 py-5 sm:px-4 lg:grid-cols-[380px_minmax(0,1fr)]">
        <form onSubmit={handleSubmit} className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-sm font-black text-gray-900">{editingId ? 'Edit Riwayat' : 'Tambah Riwayat'}</p>
          <div className="mt-4 grid gap-3">
            <input value={form.customer} onChange={(event) => updateForm('customer', event.target.value)} className="min-h-10 rounded-lg border border-gray-300 bg-gray-50 px-3 text-sm outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500" placeholder="Customer" required />
            <textarea value={form.medicines} onChange={(event) => updateForm('medicines', event.target.value)} className="min-h-20 rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500" placeholder="Obat yang diberikan, pisahkan dengan koma" required />
            <input type="datetime-local" value={form.servedAt} onChange={(event) => updateForm('servedAt', event.target.value)} className="min-h-10 rounded-lg border border-gray-300 bg-gray-50 px-3 text-sm outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500" required />
            <input value={form.staff} onChange={(event) => updateForm('staff', event.target.value)} className="min-h-10 rounded-lg border border-gray-300 bg-gray-50 px-3 text-sm outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500" placeholder="Staff yang melayani" />
            <input value={form.pharmacist} onChange={(event) => updateForm('pharmacist', event.target.value)} className="min-h-10 rounded-lg border border-gray-300 bg-gray-50 px-3 text-sm outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500" placeholder="Apoteker" />
            <div className="grid gap-3 sm:grid-cols-2">
              <select value={form.safety} onChange={(event) => updateForm('safety', event.target.value)} className="min-h-10 rounded-lg border border-gray-300 bg-gray-50 px-3 text-sm outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500">
                <option>Aman</option>
                <option>Warning</option>
                <option>Danger</option>
              </select>
              <select value={form.status} onChange={(event) => updateForm('status', event.target.value)} className="min-h-10 rounded-lg border border-gray-300 bg-gray-50 px-3 text-sm outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500">
                <option>Selesai</option>
                <option>Batal</option>
                <option>Perlu Konsultasi</option>
              </select>
            </div>
            <textarea value={form.pharmacistNote} onChange={(event) => updateForm('pharmacistNote', event.target.value)} className="min-h-24 rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500" placeholder="Catatan apoteker" />
          </div>
          <div className="mt-4 flex gap-2">
            <button type="submit" className="min-h-10 flex-1 rounded-lg bg-gray-900 px-4 py-2 text-sm font-bold text-white hover:bg-black">
              {editingId ? 'Simpan Perubahan' : 'Tambah Riwayat'}
            </button>
            {editingId ? (
              <button type="button" onClick={resetForm} className="min-h-10 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-50">
                Batal
              </button>
            ) : null}
          </div>
        </form>

        <section className="rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-100 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-black text-gray-900">Daftar Riwayat</p>
                <p className="text-xs text-gray-500">{filteredRecords.length} record ditemukan</p>
              </div>
              <input value={query} onChange={(event) => setQuery(event.target.value)} className="min-h-10 w-full rounded-lg border border-gray-300 bg-gray-50 px-3 text-sm outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500 sm:w-72" placeholder="Cari riwayat..." />
            </div>
          </div>
          <div className="scroll-fade overflow-x-auto">
            <table className="w-full min-w-[980px] text-sm">
              <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-600">
                <tr>
                  <th className="px-4 py-3 text-left font-black">ID</th>
                  <th className="px-4 py-3 text-left font-black">Customer</th>
                  <th className="px-4 py-3 text-left font-black">Obat</th>
                  <th className="px-4 py-3 text-left font-black">Waktu</th>
                  <th className="px-4 py-3 text-left font-black">Staff / Apoteker</th>
                  <th className="px-4 py-3 text-left font-black">Safety</th>
                  <th className="px-4 py-3 text-left font-black">Status</th>
                  <th className="px-4 py-3 text-right font-black">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredRecords.map((record) => (
                  <tr key={record.id}>
                    <td className="px-4 py-3 font-bold text-gray-900">{record.id}</td>
                    <td className="px-4 py-3 text-gray-700">{record.customer}</td>
                    <td className="px-4 py-3 text-gray-700">
                      <p>{record.medicines}</p>
                      <p className="mt-1 text-xs text-gray-500">{record.pharmacistNote}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-700">{formatDateTime(record.servedAt)}</td>
                    <td className="px-4 py-3 text-gray-700">
                      <p>{record.staff || '-'}</p>
                      <p className="text-xs text-gray-500">{record.pharmacist || '-'}</p>
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={record.safety} /></td>
                    <td className="px-4 py-3"><StatusBadge status={record.status} /></td>
                    <td className="px-4 py-3 text-right">
                      <button type="button" onClick={() => handleEdit(record)} className="mr-2 rounded-lg border border-gray-300 px-3 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50">Edit</button>
                      <button type="button" onClick={() => handleDelete(record.id)} className="rounded-lg bg-red-600 px-3 py-2 text-xs font-bold text-white hover:bg-red-700">Hapus</button>
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
