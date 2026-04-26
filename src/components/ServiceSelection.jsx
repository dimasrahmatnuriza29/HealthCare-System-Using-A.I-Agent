function MenuIcon() {
  return (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657 13.414 20.9a2 2 0 0 1-2.828 0l-4.243-4.243a8 8 0 1 1 11.314 0Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-4.35-4.35M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z" />
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

function ServiceCard({ title, description, icon, active, badge, onClick }) {
  const baseClass = 'min-h-40 text-left rounded-lg border p-5 transition focus:outline-none focus:ring-2 focus:ring-indigo-500';
  const activeClass = active
    ? 'border-indigo-700 bg-indigo-600 text-white shadow-md hover:bg-indigo-700'
    : 'border-gray-200 bg-white text-gray-900 hover:border-indigo-300 hover:shadow-sm';

  return (
    <button type="button" onClick={onClick} className={`${baseClass} ${activeClass}`}>
      <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-lg ${active ? 'bg-white/15 text-white' : 'bg-indigo-50 text-indigo-600'}`}>
        {icon}
      </div>
      <h3 className={`text-lg font-bold ${active ? 'text-white' : 'text-gray-900'}`}>{title}</h3>
      <p className={`mt-1 text-sm leading-6 ${active ? 'text-indigo-50' : 'text-gray-600'}`}>{description}</p>
      <span className={`mt-4 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${active ? 'bg-white text-indigo-700' : 'bg-gray-100 text-gray-500'}`}>
        {badge}
      </span>
    </button>
  );
}

export default function ServiceSelection({ onOpenStaff }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-10 border-b border-gray-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-3 py-3 sm:px-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-sm">
              <MenuIcon />
            </div>
            <div className="min-w-0">
              <h1 className="truncate text-base font-bold leading-tight text-gray-900 sm:text-lg">RakObat / PharmaLocate</h1>
              <p className="text-xs text-gray-500">Sistem Pencarian Lokasi Obat</p>
            </div>
          </div>
          <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">v1.0 Prototype</span>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-3 pb-14 pt-6 sm:px-4 sm:pt-8">
        <section className="mb-6">
          <span className="inline-flex rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">Service Selection</span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-gray-900 md:text-4xl">Pilih Layanan</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600 md:text-base">
            Prototype internal apotek untuk mempercepat pelayanan staff counter saat mencari stok dan lokasi fisik obat.
          </p>
        </section>

        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <ServiceCard
            title="Customer Mode"
            description="Preview arah pengembangan customer record dan safety check."
            icon={<UserIcon />}
            badge="Preview"
            onClick={() => onOpenStaff()}
          />
          <ServiceCard
            title="Cari Obat"
            description="Akses cepat pencarian obat yang diarahkan ke panel staff."
            icon={<SearchIcon />}
            badge="Cari Lokasi Obat"
            onClick={onOpenStaff}
          />
          <ServiceCard
            title="Mode Staff"
            description="Cari lokasi obat berdasarkan Storage, Kolom, Rak, stok, harga, dan status ketersediaan."
            icon={<LocationIcon />}
            active
            badge="Buka Panel"
            onClick={onOpenStaff}
          />
        </section>

        <section className="mt-8 rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-sm font-semibold text-gray-900">Fokus MVP</p>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            Layer utama aplikasi adalah pencarian lokasi penyimpanan obat untuk staff. Customer record dan AI Safety Advisor tetap tampil sebagai preview pendukung, bukan fitur utama.
          </p>
        </section>
      </main>
    </div>
  );
}
