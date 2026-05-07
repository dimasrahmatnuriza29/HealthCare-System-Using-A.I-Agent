import { branches } from '../../data/branches.js';
import { BackIcon, BrandIcon } from '../ui/Icons.jsx';

export default function StaffLocatorHeader({ activeBranchId, onBack, onChangeBranch }) {
  return (
    <header className="sticky top-0 z-20 border-b border-gray-200 bg-white/95 shadow-sm backdrop-blur">
      <div className="w-full px-3 py-2.5 sm:mx-auto sm:max-w-6xl sm:px-4">
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 shadow-sm hover:bg-gray-50"
            aria-label="Kembali"
          >
            <BackIcon />
          </button>

          <div className="flex min-w-0 flex-1 items-center gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-600 text-white shadow-sm">
                <BrandIcon className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-black leading-tight text-gray-900">RakObat</p>
                <p className="truncate text-[11px] text-gray-400">PharmaLocate</p>
              </div>
            </div>

            <div className="hidden h-10 w-px bg-gray-200 sm:block" />

            <div className="min-w-0">
              <div className="flex min-w-0 items-center gap-2">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
                  <BrandIcon className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <div className="flex min-w-0 items-center gap-2">
                    <h1 className="min-w-0 truncate text-sm font-black leading-tight text-gray-900 min-[390px]:text-[15px]">
                      Panel Staff
                    </h1>
                    <span className="shrink-0 rounded-full border border-rose-200 bg-rose-50 px-2 py-0.5 text-[9px] font-black uppercase leading-none text-rose-700 md:text-[10px]">
                      Pelayanan
                    </span>
                  </div>
                  <p className="mt-0.5 hidden truncate text-[11px] text-gray-500 sm:block">
                    Customer · Obat · Safety · Picking
                  </p>
                </div>
              </div>
            </div>
          </div>

          <label className="grid w-full shrink-0 gap-1 sm:w-[340px]">
            <span className="text-[10px] font-black uppercase tracking-wide text-gray-500">Cabang</span>
            <select
              value={activeBranchId}
              onChange={(event) => onChangeBranch(event.target.value)}
              className="min-h-11 w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm font-black text-gray-900 outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500"
            >
              {branches.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {branch.name} - {branch.id}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>
    </header>
  );
}
