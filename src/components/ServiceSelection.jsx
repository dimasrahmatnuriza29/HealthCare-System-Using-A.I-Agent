import { branchStock } from '../data/branches.js';
import { customerRecords } from '../data/customerRecords.js';
import { medicines } from '../data/medicines.js';

const activeBranchId = 'JKT001';

// ── Icons ──────────────────────────────────────────────────────────────────

function BrandIcon({ className = 'h-5 w-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12h14" />
    </svg>
  );
}

function BellIcon({ className = 'h-5 w-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  );
}

function UsersIcon({ className = 'h-5 w-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function PillIcon({ className = 'h-5 w-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="m8.5 8.5 7 7" />
    </svg>
  );
}

function AlertTriangleIcon({ className = 'h-5 w-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4M12 17h.01" />
    </svg>
  );
}

function BanIcon({ className = 'h-5 w-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <path strokeLinecap="round" strokeLinejoin="round" d="m4.93 4.93 14.14 14.14" />
    </svg>
  );
}

function ActivityIcon({ className = 'h-5 w-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  );
}

function ClipboardListIcon({ className = 'h-5 w-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5h6M9 3h6a2 2 0 0 1 2 2v1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h1V5a2 2 0 0 1 2-2Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h8M8 16h5" />
    </svg>
  );
}

function LayoutGridIcon({ className = 'h-5 w-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect width="7" height="7" x="3" y="3" rx="1" />
      <rect width="7" height="7" x="14" y="3" rx="1" />
      <rect width="7" height="7" x="3" y="14" rx="1" />
      <rect width="7" height="7" x="14" y="14" rx="1" />
    </svg>
  );
}

function PackageIcon({ className = 'h-5 w-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="m3 7 9-4 9 4-9 4-9-4Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10l9 4 9-4V7M12 11v10" />
    </svg>
  );
}

function UserCircleIcon({ className = 'h-4 w-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
    </svg>
  );
}

function ShieldCheckIcon({ className = 'h-4 w-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="m9 12 2 2 4-4" />
    </svg>
  );
}

function CogIcon({ className = 'h-4 w-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="3" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" />
    </svg>
  );
}

function ArrowRightIcon({ className = 'h-4 w-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

// ── Components ─────────────────────────────────────────────────────────────

function MetricCard({ label, value, helper, icon, tone = 'neutral' }) {
  const tones = {
    neutral: {
      card: 'bg-white border-gray-200',
      icon: 'bg-slate-100 text-slate-600',
      value: 'text-gray-900',
      label: 'text-gray-700',
      helper: 'text-gray-500',
    },
    amber: {
      card: 'bg-amber-50 border-amber-200',
      icon: 'bg-amber-100 text-amber-700',
      value: 'text-amber-900',
      label: 'text-amber-800',
      helper: 'text-amber-600',
    },
    red: {
      card: 'bg-red-50 border-red-200',
      icon: 'bg-red-100 text-red-700',
      value: 'text-red-900',
      label: 'text-red-800',
      helper: 'text-red-600',
    },
  };
  const t = tones[tone] ?? tones.neutral;
  return (
    <div className={`rounded-xl border p-4 shadow-sm ${t.card}`}>
      <div className={`mb-3 inline-flex h-9 w-9 items-center justify-center rounded-lg ${t.icon}`}>
        {icon}
      </div>
      <p className={`text-2xl font-black ${t.value}`}>{value}</p>
      <p className={`mt-0.5 text-xs font-bold ${t.label}`}>{label}</p>
      <p className={`mt-0.5 text-[11px] ${t.helper}`}>{helper}</p>
    </div>
  );
}

const cardAccents = {
  rose: {
    icon: 'bg-rose-50 text-rose-600',
    badge: 'border-rose-200 bg-rose-50 text-rose-700',
    hover: 'hover:border-rose-300 hover:shadow-md',
    ring: 'ring-1 ring-rose-100',
    arrow: 'group-hover:text-rose-600',
  },
  emerald: {
    icon: 'bg-emerald-50 text-emerald-600',
    badge: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    hover: 'hover:border-emerald-300 hover:shadow-md',
    ring: '',
    arrow: 'group-hover:text-emerald-600',
  },
  slate: {
    icon: 'bg-slate-100 text-slate-600',
    badge: 'border-slate-200 bg-slate-100 text-slate-700',
    hover: 'hover:border-slate-300 hover:shadow-md',
    ring: '',
    arrow: 'group-hover:text-slate-700',
  },
  amber: {
    icon: 'bg-amber-50 text-amber-600',
    badge: 'border-amber-200 bg-amber-50 text-amber-700',
    hover: 'hover:border-amber-300 hover:shadow-md',
    ring: '',
    arrow: 'group-hover:text-amber-600',
  },
};

function ActionCard({ title, description, icon, badge, onClick, accent = 'slate', primary = false }) {
  const a = cardAccents[accent] ?? cardAccents.slate;
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group flex min-h-40 flex-col rounded-xl border border-gray-200 bg-white p-5 text-left shadow-sm transition focus:outline-none focus:ring-2 focus:ring-rose-400 ${a.hover} ${primary ? a.ring : ''}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${a.icon}`}>
          {icon}
        </div>
        <span className={`rounded-full border px-2.5 py-1 text-[11px] font-bold ${a.badge}`}>{badge}</span>
      </div>
      <h3 className="mt-4 text-[15px] font-black text-gray-900">{title}</h3>
      <p className="mt-1 flex-1 text-xs leading-5 text-gray-500">{description}</p>
      <div className={`mt-3 flex items-center gap-1 text-xs font-bold text-gray-400 transition ${a.arrow}`}>
        Buka <ArrowRightIcon />
      </div>
    </button>
  );
}

// ── Main ───────────────────────────────────────────────────────────────────

export default function ServiceSelection({ onOpenStaff, onOpenHistory, onOpenMaster, onOpenStock }) {
  const stockValues = Object.values(branchStock[activeBranchId] ?? {});
  const lowStock = stockValues.filter((stock) => stock > 0 && stock <= 20).length;
  const outOfStock = stockValues.filter((stock) => stock === 0).length;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-10 border-b border-gray-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-rose-600 text-white shadow-sm">
              <BrandIcon />
            </div>
            <div className="min-w-0">
              <h1 className="text-[15px] font-black leading-tight text-gray-900">RakObat</h1>
              <p className="hidden text-[11px] text-gray-500 sm:block">Operasional Apotek</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700 sm:inline-flex">
              ● Aktif
            </span>
            <span className="rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-[11px] font-semibold text-gray-500">
              Demo MVP
            </span>
            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50"
              aria-label="Notifikasi"
            >
              <BellIcon />
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-14 pt-6 sm:pt-8">
        {/* Hero */}
        <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <span className="inline-flex rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-bold text-rose-700">
              Konsol Apotek
            </span>
            <h2 className="mt-4 text-3xl font-black tracking-tight text-gray-900 md:text-4xl">
              Operasional Apotek
            </h2>
            <p className="mt-2 max-w-lg text-sm leading-6 text-gray-500">
              Pelayanan obat cepat, aman, dan terlacak.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={onOpenStaff}
                className="inline-flex items-center gap-2 rounded-lg bg-rose-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-rose-700"
              >
                <ActivityIcon className="h-4 w-4" />
                Mulai Pelayanan
              </button>
              <button
                type="button"
                onClick={onOpenStock}
                className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-50"
              >
                Lihat Stok
              </button>
            </div>
          </div>

          <aside className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <p className="text-[11px] font-black uppercase tracking-wide text-gray-500">Akses Pengguna</p>
            <div className="mt-3 grid gap-2">
              {[
                {
                  icon: <UserCircleIcon />,
                  label: 'Staff',
                  desc: 'Layani customer, pilih obat, cek keamanan, dan picking lebih cepat.',
                  iconClass: 'bg-rose-50 text-rose-600',
                },
                {
                  icon: <ShieldCheckIcon />,
                  label: 'Apoteker',
                  desc: 'Tinjau peringatan dan validasi pelayanan berisiko.',
                  iconClass: 'bg-violet-50 text-violet-600',
                },
                {
                  icon: <CogIcon />,
                  label: 'Admin',
                  desc: 'Kelola rak, stok, master data, dan pengguna.',
                  iconClass: 'bg-slate-100 text-slate-600',
                },
              ].map(({ icon, label, desc, iconClass }) => (
                <div key={label} className="flex items-start gap-3 rounded-lg border border-gray-100 bg-gray-50 px-3 py-2.5">
                  <div className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${iconClass}`}>
                    {icon}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-gray-900">{label}</p>
                    <p className="mt-0.5 text-[11px] leading-4 text-gray-500">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </aside>
        </section>

        {/* Metrics */}
        <section className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            icon={<UsersIcon />}
            label="Customer"
            value={customerRecords.length}
            helper="Data aktif"
          />
          <MetricCard
            icon={<PillIcon />}
            label="Obat"
            value={medicines.length}
            helper="Dalam katalog"
          />
          <MetricCard
            icon={<AlertTriangleIcon />}
            label="Stok Menipis"
            value={lowStock}
            helper="Perlu restock"
            tone="amber"
          />
          <MetricCard
            icon={<BanIcon />}
            label="Stok Habis"
            value={outOfStock}
            helper="Tidak tersedia"
            tone="red"
          />
        </section>

        {/* Action Cards */}
        <section className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <ActionCard
            title="Panel Staff"
            description="Layani customer, pilih obat, cek keamanan, dan picking lebih cepat."
            icon={<ActivityIcon />}
            badge="Alur Kerja"
            onClick={onOpenStaff}
            accent="rose"
            primary
          />
          <ActionCard
            title="Riwayat Pelayanan"
            description="Lacak seluruh transaksi dispensing yang selesai atau batal."
            icon={<ClipboardListIcon />}
            badge="Riwayat"
            onClick={onOpenHistory}
            accent="emerald"
          />
          <ActionCard
            title="Pemetaan Rak"
            description="Kelola lokasi obat di seluruh rak dan laci."
            icon={<LayoutGridIcon />}
            badge="Admin"
            onClick={onOpenMaster}
            accent="slate"
          />
          <ActionCard
            title="Stok Obat"
            description="Pantau stok, kedaluwarsa, dan kebutuhan restock."
            icon={<PackageIcon />}
            badge="Stok"
            onClick={onOpenStock}
            accent="amber"
          />
        </section>
      </main>
    </div>
  );
}
