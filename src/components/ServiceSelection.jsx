import { branchStock } from '../data/branches.js';
import { useCustomers } from '../contexts/CustomerContext.jsx';
import { medicines } from '../data/medicines.js';
import {
  ActivityIcon,
  AlertTriangleIcon,
  ArrowRightIcon,
  BanIcon,
  BarChart2Icon,
  BellIcon,
  BrandIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  ClipboardListIcon,
  CogIcon,
  DatabaseIcon,
  HomeIcon,
  MapPinIcon,
  PackageIcon,
  PharmacyIllustration,
  PillIcon,
  ShieldCheckIcon,
  UserCircleIcon,
  UsersIcon,
  ClockIcon,
} from './ui/Icons.jsx';

const activeBranchId = 'JKT001';

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

function MetricCard({ label, value, helper, icon, tone = 'neutral', onClick }) {
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
  const Wrapper = onClick ? 'button' : 'div';

  return (
    <Wrapper
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      className={`w-full rounded-xl border p-4 text-left shadow-sm transition ${t.card} ${
        onClick ? 'hover:border-gray-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-rose-500' : ''
      }`}
    >
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
    </Wrapper>
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

/**
 * Renders the pharmacy operations landing dashboard.
 *
 * @param {object} props - Navigation callbacks.
 * @returns {import('react').ReactElement} Service selection dashboard.
 */
export default function ServiceSelection({ onOpenStaff, onOpenHistory, onOpenMaster, onOpenStock }) {
  const { customers } = useCustomers();
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
              value={customers.length}
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
              onClick={() => lowStock > 0 && onOpenStock?.({ filter: 'low' })}
            />
            <MetricCard
              icon={<BanIcon className="h-5 w-5" />}
              label="Stok Habis"
              value={outOfStock}
              helper="Tidak tersedia"
              tone="red"
              onClick={() => outOfStock > 0 && onOpenStock?.({ filter: 'out' })}
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
