import { branchStock } from '../data/branches.js';
import { customerRecords } from '../data/customerRecords.js';
import { medicines } from '../data/medicines.js';

const activeBranchId = 'JKT001';

function MenuIcon() {
  return (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

function ClipboardIcon() {
  return (
    <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5h6M9 3h6a2 2 0 0 1 2 2v1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h1V5a2 2 0 0 1 2-2Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h8M8 16h5" />
    </svg>
  );
}

function DatabaseIcon() {
  return (
    <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <ellipse cx="12" cy="5" rx="7" ry="3" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 5v6c0 1.7 3.1 3 7 3s7-1.3 7-3V5M5 11v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6" />
    </svg>
  );
}

function BoxIcon() {
  return (
    <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="m3 7 9-4 9 4-9 4-9-4Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10l9 4 9-4V7M12 11v10" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM12 14a7 7 0 0 0-7 7h14a7 7 0 0 0-7-7Z" />
    </svg>
  );
}

function DashboardCard({ title, description, icon, badge, onClick, tone = 'indigo' }) {
  const toneClass = {
    indigo: 'bg-indigo-50 text-indigo-700',
    emerald: 'bg-emerald-50 text-emerald-700',
    amber: 'bg-amber-50 text-amber-700',
    slate: 'bg-slate-100 text-slate-700',
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className="min-h-40 rounded-lg border border-gray-200 bg-white p-5 text-left shadow-sm transition hover:border-indigo-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
    >
      <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-lg ${toneClass[tone]}`}>
        {icon}
      </div>
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-lg font-black text-gray-900">{title}</h3>
        <span className="shrink-0 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-bold text-gray-600">{badge}</span>
      </div>
      <p className="mt-2 text-sm leading-6 text-gray-600">{description}</p>
    </button>
  );
}

function MetricCard({ label, value, helper }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <p className="text-[11px] font-black uppercase tracking-wide text-gray-500">{label}</p>
      <p className="mt-1 text-2xl font-black text-gray-900">{value}</p>
      <p className="mt-1 text-xs font-medium text-gray-500">{helper}</p>
    </div>
  );
}

export default function ServiceSelection({ onOpenStaff, onOpenHistory, onOpenMaster, onOpenStock }) {
  const stockValues = Object.values(branchStock[activeBranchId] ?? {});
  const lowStock = stockValues.filter((stock) => stock > 0 && stock <= 20).length;
  const outOfStock = stockValues.filter((stock) => stock === 0).length;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-10 border-b border-gray-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-3 py-3 sm:px-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-sm">
              <MenuIcon />
            </div>
            <div className="min-w-0">
              <h1 className="truncate text-base font-bold leading-tight text-gray-900 sm:text-lg">RakObat / PharmaLocate</h1>
              <p className="text-xs text-gray-500">Dashboard Operasional Apotek</p>
            </div>
          </div>
          <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">MVP Dummy</span>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-3 pb-14 pt-6 sm:px-4 sm:pt-8">
        <section className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-stretch">
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <span className="inline-flex rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700">Apotek Console</span>
            <h2 className="mt-4 max-w-3xl text-3xl font-black tracking-tight text-gray-900 md:text-4xl">
              Kelola pelayanan obat, master rak, dan stok dalam satu alur.
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-600 md:text-base">
              Dashboard ini dibuat ringkas untuk navigasi. Detail CRUD dipisah ke halaman manajemen masing-masing agar workflow staff, apoteker, dan admin tidak bercampur.
            </p>
            <button
              type="button"
              onClick={onOpenStaff}
              className="mt-5 min-h-11 rounded-lg bg-gray-900 px-4 py-2 text-sm font-bold text-white hover:bg-black"
            >
              Mulai Pelayanan Obat
            </button>
          </div>

          <aside className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <p className="text-[11px] font-black uppercase tracking-wide text-gray-500">Role Akses</p>
            <div className="mt-3 grid gap-2">
              {[
                ['Staff', 'Customer, obat, lokasi picking'],
                ['Apoteker', 'Validasi warning dan approve dispensing'],
                ['Admin', 'Master data, stok, dan user'],
              ].map(([role, description]) => (
                <div key={role} className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2">
                  <p className="text-sm font-black text-gray-900">{role}</p>
                  <p className="mt-0.5 text-xs text-gray-500">{description}</p>
                </div>
              ))}
            </div>
          </aside>
        </section>

        <section className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard label="Customer Demo" value={customerRecords.length} helper="Customer record aktif" />
          <MetricCard label="Master Obat" value={medicines.length} helper="Obat dummy tersedia" />
          <MetricCard label="Stok Menipis" value={lowStock} helper="Perlu restock terencana" />
          <MetricCard label="Stok Habis" value={outOfStock} helper="Tidak bisa dipicking" />
        </section>

        <section className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <DashboardCard
            title="Staff Panel"
            description="Cari customer, pilih beberapa obat, cek safety, lihat lokasi picking, dan catat edukasi."
            icon={<UserIcon />}
            badge="Workflow"
            onClick={onOpenStaff}
            tone="indigo"
          />
          <DashboardCard
            title="Riwayat Pelayanan"
            description="CRUD riwayat dispensing: customer, obat, waktu, staff, safety, catatan apoteker, status."
            icon={<ClipboardIcon />}
            badge="CRUD"
            onClick={onOpenHistory}
            tone="emerald"
          />
          <DashboardCard
            title="Master Rak & Obat"
            description="CRUD obat, kategori, batch, expiry, status aktif, dan mapping lokasi rak."
            icon={<DatabaseIcon />}
            badge="CRUD"
            onClick={onOpenMaster}
            tone="slate"
          />
          <DashboardCard
            title="Manajemen Stok"
            description="CRUD stok dasar, stok minimum, indikator hampir habis, dan riwayat perubahan stok."
            icon={<BoxIcon />}
            badge="CRUD"
            onClick={onOpenStock}
            tone="amber"
          />
        </section>
      </main>
    </div>
  );
}
