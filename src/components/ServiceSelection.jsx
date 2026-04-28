import { branchStock } from '../data/branches.js';
import { customerRecords } from '../data/customerRecords.js';
import { medicines } from '../data/medicines.js';

const activeBranchId = 'JKT001';

// ── Icons ──────────────────────────────────────────────────────────────────

function BrandIcon({ className = 'h-5 w-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="m8.5 8.5 7 7" />
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

function HomeIcon({ className = 'h-4 w-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline strokeLinecap="round" strokeLinejoin="round" points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function ActivityIcon({ className = 'h-4 w-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  );
}

function ClockIcon({ className = 'h-4 w-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <polyline strokeLinecap="round" strokeLinejoin="round" points="12 6 12 12 16 14" />
    </svg>
  );
}

function MapPinIcon({ className = 'h-4 w-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function PackageIcon({ className = 'h-4 w-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="m3 7 9-4 9 4-9 4-9-4Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10l9 4 9-4V7M12 11v10" />
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

function BarChart2Icon({ className = 'h-4 w-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="18" y1="20" x2="18" y2="10" strokeLinecap="round" />
      <line x1="12" y1="20" x2="12" y2="4" strokeLinecap="round" />
      <line x1="6" y1="20" x2="6" y2="14" strokeLinecap="round" />
    </svg>
  );
}

function DatabaseIcon({ className = 'h-4 w-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    </svg>
  );
}

function UsersIcon({ className = 'h-4 w-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
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

function PillIcon({ className = 'h-5 w-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="m8.5 8.5 7 7" />
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

function ClipboardListIcon({ className = 'h-5 w-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5h6M9 3h6a2 2 0 0 1 2 2v1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h1V5a2 2 0 0 1 2-2Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h8M8 16h5" />
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

function ChevronDownIcon({ className = 'h-4 w-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline strokeLinecap="round" strokeLinejoin="round" points="6 9 12 15 18 9" />
    </svg>
  );
}

function ChevronRightIcon({ className = 'h-4 w-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline strokeLinecap="round" strokeLinejoin="round" points="9 18 15 12 9 6" />
    </svg>
  );
}

// ── Pharmacy Illustration ──────────────────────────────────────────────────

function PharmacyIllustration() {
  return (
    <div className="relative flex h-44 w-44 shrink-0 items-center justify-center">
      <div className="absolute inset-0 rounded-full bg-rose-100 opacity-50" />
      <div className="absolute inset-6 rounded-full bg-rose-50 opacity-70" />
      <svg className="relative h-28 w-28" viewBox="0 0 120 120" fill="none">
        {/* Bottle body */}
        <rect x="32" y="44" width="56" height="66" rx="12" fill="#fda4af" />
        <rect x="32" y="44" width="56" height="66" rx="12" stroke="#fb7185" strokeWidth="2" />
        {/* Bottle cap */}
        <rect x="38" y="28" width="44" height="20" rx="6" fill="#fb7185" />
        <rect x="38" y="28" width="44" height="20" rx="6" stroke="#f43f5e" strokeWidth="2" />
        {/* Label */}
        <rect x="42" y="56" width="36" height="28" rx="4" fill="white" fillOpacity="0.6" />
        {/* Cross on label */}
        <line x1="60" y1="62" x2="60" y2="78" stroke="#f43f5e" strokeWidth="4" strokeLinecap="round" />
        <line x1="52" y1="70" x2="68" y2="70" stroke="#f43f5e" strokeWidth="4" strokeLinecap="round" />
        {/* Scattered pills */}
        <ellipse cx="18" cy="72" rx="10" ry="5" fill="#fda4af" stroke="#fb7185" strokeWidth="1.5" transform="rotate(-30 18 72)" />
        <line x1="18" y1="72" x2="18" y2="72" stroke="#fb7185" strokeWidth="1.5" strokeLinecap="round" />
        <ellipse cx="104" cy="58" rx="9" ry="4.5" fill="#fda4af" stroke="#fb7185" strokeWidth="1.5" transform="rotate(20 104 58)" />
        <ellipse cx="24" cy="100" rx="8" ry="4" fill="#fecdd3" stroke="#fb7185" strokeWidth="1.5" transform="rotate(-15 24 100)" />
        <ellipse cx="100" cy="90" rx="7" ry="3.5" fill="#fecdd3" stroke="#fb7185" strokeWidth="1.5" transform="rotate(10 100 90)" />
        {/* Sparkles */}
        <circle cx="22" cy="42" r="3" fill="#fb7185" fillOpacity="0.5" />
        <circle cx="100" cy="38" r="2.5" fill="#fb7185" fillOpacity="0.4" />
        <circle cx="14" cy="55" r="2" fill="#fda4af" fillOpacity="0.6" />
      </svg>
    </div>
  );
}

// ── Sidebar ────────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { label: 'Beranda', Icon: HomeIcon, key: 'home', active: true },
  { label: 'Alur Kerja', Icon: ActivityIcon, key: 'staff' },
  { label: 'Riwayat Pelayanan', Icon: ClockIcon, key: 'history' },
  { label: 'Pemetaan Rak', Icon: MapPinIcon, key: 'master' },
  { label: 'Stok Obat', Icon: PackageIcon, key: 'stock' },
  null,
  { label: 'Peringatan', Icon: BellIcon, key: 'alerts' },
  { label: 'Laporan', Icon: BarChart2Icon, key: 'reports' },
  { label: 'Master Data', Icon: DatabaseIcon, key: 'masterdata' },
  { label: 'Pengguna', Icon: UsersIcon, key: 'users' },
  { label: 'Pengaturan', Icon: CogIcon, key: 'settings' },
];

function Sidebar({ onOpenStaff, onOpenHistory, onOpenMaster, onOpenStock }) {
  const actionMap = {
    staff: onOpenStaff,
    history: onOpenHistory,
    master: onOpenMaster,
    stock: onOpenStock,
  };

  return (
    <aside className="fixed inset-y-0 left-0 z-20 hidden w-[220px] flex-col border-r border-gray-200 bg-white lg:flex">
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-600 text-white shadow-sm">
          <BrandIcon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-[15px] font-black leading-tight text-gray-900">RakObat</p>
          <p className="text-[11px] text-gray-400">PharmaLocate</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto border-t border-gray-100 py-2">
        <ul className="grid gap-0.5 px-3">
          {NAV_ITEMS.map((item, idx) => {
            if (!item) {
              return <li key={`sep-${idx}`} className="my-2 h-px bg-gray-100" />;
            }
            const { label, Icon, key, active } = item;
            const action = actionMap[key];
            const isClickable = active || Boolean(action);
            return (
              <li key={key}>
                <button
                  type="button"
                  onClick={action || undefined}
                  disabled={!isClickable}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${
                    active
                      ? 'bg-rose-50 font-bold text-rose-600'
                      : action
                        ? 'font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        : 'cursor-default font-medium text-gray-400'
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="truncate">{label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom: Branch + User */}
      <div className="border-t border-gray-100">
        <button
          type="button"
          className="flex w-full items-center gap-3 px-4 py-3 hover:bg-gray-50"
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-rose-100 text-rose-600">
            <HomeIcon className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1 text-left">
            <p className="truncate text-xs font-bold text-gray-900">Apotek Sehat Sentosa</p>
            <p className="text-[11px] text-gray-500">Cabang Utama</p>
          </div>
          <ChevronDownIcon className="h-4 w-4 shrink-0 text-gray-400" />
        </button>
        <button
          type="button"
          className="flex w-full items-center gap-3 border-t border-gray-100 px-4 py-3 hover:bg-gray-50"
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-rose-500 text-xs font-black text-white">
            AD
          </div>
          <div className="min-w-0 flex-1 text-left">
            <p className="text-xs font-bold text-gray-900">Admin Demo</p>
            <p className="truncate text-[11px] text-gray-400">admin@rakobat.id</p>
          </div>
          <ChevronRightIcon className="h-4 w-4 shrink-0 text-gray-400" />
        </button>
      </div>
    </aside>
  );
}

// ── Cards ──────────────────────────────────────────────────────────────────

function MetricCard({ label, value, helper, icon, tone = 'neutral' }) {
  const tones = {
    neutral: {
      card: 'bg-white border-gray-200',
      icon: 'bg-slate-100 text-slate-500',
      value: 'text-gray-900',
      label: 'text-gray-700',
      helper: 'text-gray-400',
    },
    amber: {
      card: 'bg-white border-gray-200',
      icon: 'bg-amber-50 text-amber-500',
      value: 'text-amber-600',
      label: 'text-amber-700',
      helper: 'text-amber-500',
    },
    red: {
      card: 'bg-white border-gray-200',
      icon: 'bg-red-50 text-red-500',
      value: 'text-red-600',
      label: 'text-red-700',
      helper: 'text-red-400',
    },
  };
  const t = tones[tone] ?? tones.neutral;
  return (
    <div className={`rounded-xl border p-4 shadow-sm ${t.card}`}>
      <div className="flex items-center gap-4">
        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${t.icon}`}>
          {icon}
        </div>
        <div>
          <p className={`text-2xl font-black leading-none ${t.value}`}>{value}</p>
          <p className={`mt-1 text-sm font-bold ${t.label}`}>{label}</p>
          <p className={`text-[11px] ${t.helper}`}>{helper}</p>
        </div>
      </div>
    </div>
  );
}

const cardAccents = {
  rose: {
    icon: 'bg-rose-50 text-rose-500',
    badge: 'border-rose-200 bg-rose-50 text-rose-600',
    hover: 'hover:border-rose-200 hover:shadow-md',
    ring: 'ring-1 ring-rose-100',
    arrow: 'text-rose-500 group-hover:text-rose-700',
  },
  emerald: {
    icon: 'bg-emerald-50 text-emerald-500',
    badge: 'border-emerald-200 bg-emerald-50 text-emerald-600',
    hover: 'hover:border-emerald-200 hover:shadow-md',
    ring: '',
    arrow: 'text-emerald-500 group-hover:text-emerald-700',
  },
  blue: {
    icon: 'bg-blue-50 text-blue-500',
    badge: 'border-blue-200 bg-blue-50 text-blue-600',
    hover: 'hover:border-blue-200 hover:shadow-md',
    ring: '',
    arrow: 'text-blue-500 group-hover:text-blue-700',
  },
  amber: {
    icon: 'bg-amber-50 text-amber-500',
    badge: 'border-amber-200 bg-amber-50 text-amber-600',
    hover: 'hover:border-amber-200 hover:shadow-md',
    ring: '',
    arrow: 'text-amber-500 group-hover:text-amber-700',
  },
};

function ActionCard({ title, description, icon, badge, onClick, accent = 'slate', primary = false }) {
  const a = cardAccents[accent] ?? cardAccents.rose;
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
      <div className={`mt-3 flex items-center gap-1 text-xs font-bold transition ${a.arrow}`}>
        Buka <ArrowRightIcon />
      </div>
    </button>
  );
}

// ── Main ───────────────────────────────────────────────────────────────────

export default function ServiceSelection({ onOpenStaff, onOpenHistory, onOpenMaster, onOpenStock }) {
  const stockValues = Object.values(branchStock[activeBranchId] ?? {});
  const lowStock = stockValues.filter((s) => s > 0 && s <= 20).length;
  const outOfStock = stockValues.filter((s) => s === 0).length;

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar (desktop only) */}
      <Sidebar
        onOpenStaff={onOpenStaff}
        onOpenHistory={onOpenHistory}
        onOpenMaster={onOpenMaster}
        onOpenStock={onOpenStock}
      />

      {/* Content area */}
      <div className="flex min-h-screen w-full flex-col lg:pl-[220px]">
        {/* Mobile topbar */}
        <header className="sticky top-0 z-10 border-b border-gray-200 bg-white/95 backdrop-blur lg:hidden">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-rose-600 text-white shadow-sm">
                <BrandIcon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[15px] font-black leading-tight text-gray-900">RakObat</p>
                <p className="text-[11px] text-gray-400">PharmaLocate</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700">● Aktif</span>
              <button
                type="button"
                className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500"
                aria-label="Notifikasi"
              >
                <BellIcon className="h-5 w-5" />
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-[10px] font-black text-white">3</span>
              </button>
            </div>
          </div>
        </header>

        {/* Desktop topbar */}
        <header className="sticky top-0 z-10 hidden border-b border-gray-200 bg-white/95 backdrop-blur lg:block">
          <div className="flex items-center justify-between px-6 py-3.5">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-50 text-rose-600">
                <ActivityIcon className="h-4 w-4" />
              </div>
              <h1 className="text-[15px] font-black text-gray-900">Operasional Apotek</h1>
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700">
                ● Aktif
              </span>
              <span className="rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-[11px] font-semibold text-gray-500">
                Demo MVP
              </span>
              <button
                type="button"
                className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50"
                aria-label="Notifikasi"
              >
                <BellIcon className="h-5 w-5" />
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-[10px] font-black text-white">
                  3
                </span>
              </button>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 px-4 pb-12 pt-5 sm:px-6">
          {/* Hero */}
          <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-start">
            {/* Hero card */}
            <div className="flex flex-col gap-0 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm sm:flex-row sm:items-center">
              {/* Text */}
              <div className="flex-1 p-6">
                <span className="inline-flex rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-bold text-rose-700">
                  Konsol Apotek
                </span>
                <h2 className="mt-4 text-2xl font-black tracking-tight text-gray-900 sm:text-3xl">
                  Operasional Apotek
                </h2>
                <p className="mt-2 text-sm leading-6 text-gray-500">
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
                    <PackageIcon className="h-4 w-4" />
                    Lihat Stok
                  </button>
                </div>
              </div>
              {/* Illustration */}
              <div className="flex shrink-0 items-center justify-center px-4 pb-4 sm:px-6 sm:pb-0">
                <PharmacyIllustration />
              </div>
            </div>

            {/* Role panel */}
            <aside className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-black uppercase tracking-wide text-gray-500">Akses Pengguna</p>
              <div className="mt-3 grid gap-1.5">
                {[
                  {
                    icon: <UserCircleIcon className="h-4 w-4" />,
                    label: 'Staff',
                    desc: 'Layani customer, pilih obat, cek keamanan, dan picking lebih cepat.',
                    iconClass: 'bg-rose-50 text-rose-500',
                  },
                  {
                    icon: <ShieldCheckIcon className="h-4 w-4" />,
                    label: 'Apoteker',
                    desc: 'Tinjau peringatan dan validasi pelayanan berisiko.',
                    iconClass: 'bg-violet-50 text-violet-500',
                  },
                  {
                    icon: <CogIcon className="h-4 w-4" />,
                    label: 'Admin',
                    desc: 'Kelola rak, stok, master data, dan pengguna.',
                    iconClass: 'bg-slate-100 text-slate-500',
                  },
                ].map(({ icon, label, desc, iconClass }) => (
                  <div key={label} className="flex items-center gap-3 rounded-lg border border-gray-100 px-3 py-2.5 hover:bg-gray-50">
                    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${iconClass}`}>
                      {icon}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-gray-900">{label}</p>
                      <p className="mt-0.5 text-[11px] leading-4 text-gray-500">{desc}</p>
                    </div>
                    <ChevronRightIcon className="h-4 w-4 shrink-0 text-gray-300" />
                  </div>
                ))}
              </div>
            </aside>
          </section>

          {/* Metrics */}
          <section className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              icon={<UsersIcon className="h-5 w-5" />}
              label="Customer"
              value={customerRecords.length}
              helper="Data aktif"
            />
            <MetricCard
              icon={<PillIcon className="h-5 w-5" />}
              label="Obat"
              value={medicines.length}
              helper="Dalam katalog"
            />
            <MetricCard
              icon={<AlertTriangleIcon className="h-5 w-5" />}
              label="Stok Menipis"
              value={lowStock}
              helper="Perlu restock"
              tone="amber"
            />
            <MetricCard
              icon={<BanIcon className="h-5 w-5" />}
              label="Stok Habis"
              value={outOfStock}
              helper="Tidak tersedia"
              tone="red"
            />
          </section>

          {/* Action Cards */}
          <section className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <ActionCard
              title="Panel Staff"
              description="Layani customer, pilih obat, cek keamanan, dan picking lebih cepat."
              icon={<ActivityIcon className="h-5 w-5" />}
              badge="Alur Kerja"
              onClick={onOpenStaff}
              accent="rose"
              primary
            />
            <ActionCard
              title="Riwayat Pelayanan"
              description="Lacak seluruh transaksi dispensing yang selesai atau batal."
              icon={<ClipboardListIcon className="h-5 w-5" />}
              badge="Riwayat"
              onClick={onOpenHistory}
              accent="emerald"
            />
            <ActionCard
              title="Pemetaan Rak"
              description="Kelola lokasi obat di seluruh rak dan laci."
              icon={<MapPinIcon className="h-5 w-5" />}
              badge="Admin"
              onClick={onOpenMaster}
              accent="blue"
            />
            <ActionCard
              title="Stok Obat"
              description="Pantau stok, kedaluwarsa, dan kebutuhan restock."
              icon={<PackageIcon className="h-5 w-5" />}
              badge="Stok"
              onClick={onOpenStock}
              accent="amber"
            />
          </section>
        </main>
      </div>
    </div>
  );
}
