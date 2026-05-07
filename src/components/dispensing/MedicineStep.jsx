import { medicineCategories } from '../../data/medicines.js';
import { CloseIcon, SearchIcon } from '../ui/Icons.jsx';
import { CustomerContextStrip, EmptyState } from './DispensingShared.jsx';
import { formatRupiah } from './dispensingUtils.js';
import { AdvancedStockTable, MedicineCard, SelectedMedicineTray } from './MedicineStepParts.jsx';

export default function MedicineStep({
  activeCustomer,
  searchQuery,
  setSearchQuery,
  sortConfig,
  setSortConfig,
  activeCategory,
  setActiveCategory,
  selectedItems,
  filteredRows,
  inventoryRows,
  selectedMedicineIds,
  safetyWasReviewed,
  onChangeCustomer,
  onSelectMedicine,
  onCheckSafety,
}) {
  return (
    <section className="grid min-w-0 max-w-full gap-3 px-3 pb-36 sm:px-0 sm:pb-0">
      <CustomerContextStrip customer={activeCustomer} onChangeCustomer={onChangeCustomer} />

      <section className="min-w-0 rounded-lg border border-gray-200 bg-white p-3 shadow-sm">
        <div className="grid min-w-0 grid-cols-1 gap-2 sm:gap-2.5 sm:grid-cols-[minmax(0,1fr)_minmax(170px,0.42fr)] lg:grid-cols-[minmax(0,1fr)_auto_auto] lg:items-end">
          <div className="min-w-0">
            <label className="mb-1 block text-[11px] font-black uppercase tracking-wide text-gray-500" htmlFor="medicine-search">
              Cari Obat
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <SearchIcon />
              </span>
              <input
                id="medicine-search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                inputMode="search"
                className="min-h-10 w-full min-w-0 max-w-full rounded-lg border border-gray-300 bg-gray-50 py-2 pl-9 pr-9 text-sm font-semibold text-gray-900 outline-none placeholder:text-gray-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-500"
                placeholder="Cari nama obat..."
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
          </div>
          <label className="block min-w-0 text-xs font-bold text-gray-600">
            <span className="mb-1 block text-[11px] font-black uppercase tracking-wide text-gray-500">Urutkan</span>
            <select
              value={`${sortConfig.key}:${sortConfig.direction}`}
              onChange={(event) => {
                const [key, direction] = event.target.value.split(':');
                setSortConfig({ key, direction });
              }}
              className="min-h-10 w-full min-w-0 rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-xs font-bold text-gray-900 outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500"
            >
              <option value="name:asc">Nama A-Z</option>
              <option value="name:desc">Nama Z-A</option>
              <option value="stock:desc">Stok terbanyak</option>
              <option value="stock:asc">Stok tersedikit</option>
              <option value="price:asc">Harga terendah</option>
              <option value="price:desc">Harga tertinggi</option>
            </select>
          </label>
        </div>

        <div className="scroll-fade mt-3 flex min-w-0 max-w-full snap-x flex-nowrap gap-2 overflow-x-auto pb-1">
          {medicineCategories.map((category) => {
            const active = category === activeCategory;
            return (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                aria-pressed={active}
                className={`min-h-9 shrink-0 snap-start whitespace-nowrap rounded-full border px-3 py-2 text-xs font-bold transition sm:px-3 ${
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

      <SelectedMedicineTray selectedItems={selectedItems} onRemove={onSelectMedicine} />

      <section className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm">
        <div className="grid gap-2 border-b border-gray-100 pb-3 sm:flex sm:flex-wrap sm:items-start sm:justify-between">
          <div>
            <h2 className="text-sm font-black text-gray-900">Pilih Obat</h2>
            <p className="mt-1 text-xs text-gray-500">
              {filteredRows.length} hasil dari {inventoryRows.length} obat di cabang aktif
            </p>
          </div>
          {selectedItems.length ? (
            <span className="w-fit rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-bold text-rose-700">
              {selectedItems.length} obat dipilih
            </span>
          ) : null}
        </div>

        {filteredRows.length ? (
          <div className="mt-3 grid min-w-0 gap-2.5 sm:grid-cols-2 sm:gap-3 xl:grid-cols-3">
            {filteredRows.map((item) => (
              <MedicineCard
                key={item.id}
                item={item}
                customer={activeCustomer}
                selected={selectedMedicineIds.includes(item.id)}
                onSelect={onSelectMedicine}
              />
            ))}
          </div>
        ) : (
          <div className="pt-3">
            <EmptyState title="Obat tidak ditemukan" message="Coba kata kunci lain atau ubah filter kategori." />
          </div>
        )}
      </section>

      <AdvancedStockTable rows={filteredRows} selectedMedicineIds={selectedMedicineIds} onSelect={onSelectMedicine} />

      <section className="sticky bottom-0 z-10 -mx-3 min-w-0 border-t border-gray-200 bg-white/95 p-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] shadow-[0_-8px_24px_rgba(15,23,42,0.08)] backdrop-blur sm:mx-0 sm:rounded-lg sm:border sm:pb-3 sm:shadow-sm">
        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
          <div className="grid gap-2 sm:grid-cols-3">
            <div className="rounded-lg border border-gray-200 bg-white px-3 py-2">
              <p className="text-[11px] font-black uppercase tracking-wide text-gray-500">Obat dipilih</p>
              <p className="mt-0.5 text-sm font-black text-gray-900">{selectedItems.length}</p>
              <p className="mt-0.5 text-[11px] text-gray-500">Lihat daftar</p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white px-3 py-2">
              <p className="text-[11px] font-black uppercase tracking-wide text-gray-500">Total estimasi</p>
              <p className="mt-0.5 text-sm font-black text-gray-900">
                {formatRupiah(selectedItems.reduce((sum, item) => sum + (item?.price ?? 0), 0))}
              </p>
              <p className="mt-0.5 text-[11px] text-gray-500">Rp 0 jika belum pilih</p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white px-3 py-2">
              <p className="text-[11px] font-black uppercase tracking-wide text-gray-500">Status keamanan</p>
              <p className="mt-0.5 text-sm font-black text-gray-900">
                {safetyWasReviewed ? 'Sudah dicek' : 'Belum dicek'}
              </p>
              <p className="mt-0.5 text-[11px] text-gray-500">
                {selectedItems.length ? 'Pilih minimal satu obat untuk melanjutkan.' : 'Pilih obat untuk memulai.'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onCheckSafety}
            disabled={!selectedItems.length}
            className="min-h-11 w-full shrink-0 whitespace-nowrap rounded-lg bg-gray-900 px-5 py-3 text-sm font-black text-white hover:bg-black disabled:cursor-not-allowed disabled:bg-gray-300 lg:w-auto"
          >
            Cek Keamanan Obat
          </button>
        </div>
      </section>
    </section>
  );
}
