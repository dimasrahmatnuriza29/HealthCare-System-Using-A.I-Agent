import { useState } from 'react';
import { evaluateSafetyAdvisor } from '../../services/safetyService.js';
import { CloseIcon } from '../ui/Icons.jsx';
import { RiskChipIcon, RiskDetailModal } from './DispensingShared.jsx';
import { formatRupiah } from './dispensingUtils.js';

export function MedicineCard({ item, customer, selected, onSelect }) {
  const preview = customer ? evaluateSafetyAdvisor(customer, item.medicine, item) : null;
  const isInactive = item.stock === 0;
  const [showRiskDetail, setShowRiskDetail] = useState(false);
  const riskCheck =
    preview?.allergyCheck.status !== 'safe'
      ? preview.allergyCheck
      : preview?.contraindicationCheck.status !== 'safe'
        ? preview.contraindicationCheck
        : preview?.interactionCheck.status !== 'safe'
          ? preview.interactionCheck
          : null;
  const riskStatus = riskCheck?.status ?? 'safe';
  const hasRisk = Boolean(riskCheck && riskStatus !== 'safe');

  return (
    <>
      <article
        className={`relative flex min-w-0 flex-col overflow-hidden rounded-lg border bg-white p-3 shadow-sm transition ${
          isInactive
            ? 'border-gray-200 bg-gray-50/70 opacity-70'
            : selected
              ? 'border-rose-400 ring-2 ring-rose-100'
              : 'border-gray-200 hover:border-gray-300'
        }`}
      >
        {hasRisk ? (
          <button
            type="button"
            className="absolute right-2 top-2 z-10"
            onClick={() => setShowRiskDetail(true)}
            aria-label="Lihat detail risiko"
          >
            <RiskChipIcon status={riskStatus} />
          </button>
        ) : null}

        <div className="grid min-w-0 grid-cols-1 items-start gap-2">
          <div className="min-w-0">
            <h3 className="break-words text-sm font-black leading-tight text-gray-900">{item.medicine.name}</h3>
            <p className="mt-1 min-w-0 break-words text-[11px] font-semibold leading-4 text-gray-500">
              {item.medicine.dose} · {item.medicine.form} · {item.medicine.category}
            </p>
          </div>
        </div>

        <p className="mt-2 line-clamp-2 min-w-0 text-xs leading-5 text-gray-600">{item.medicine.indications.join(', ')}</p>

        <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
          <div className="rounded-lg border border-gray-100 bg-gray-50 p-2">
            <p className="font-semibold text-gray-500">Stok</p>
            <p className="mt-0.5 font-black text-gray-900">{item.stock === 0 ? 'Habis' : `${item.stock} pcs`}</p>
          </div>
          <div className="rounded-lg border border-gray-100 bg-gray-50 p-2">
            <p className="font-semibold text-gray-500">Harga</p>
            <p className="mt-0.5 min-w-0 break-all font-black text-gray-900">{formatRupiah(item.price)}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => !isInactive && onSelect(item.id)}
          disabled={isInactive}
          className={`mt-3 min-h-11 w-full rounded-lg px-3 py-2 text-sm font-bold ${
            isInactive
              ? 'cursor-not-allowed bg-gray-200 text-gray-500'
              : selected
                ? 'bg-gray-900 text-white hover:bg-black'
                : 'bg-rose-600 text-white hover:bg-rose-700'
          }`}
        >
          {isInactive ? 'Stok Habis' : selected ? 'Hapus dari Pilihan' : 'Tambah Obat'}
        </button>
      </article>

      <RiskDetailModal
        open={showRiskDetail}
        title={item.medicine.name}
        status={riskStatus}
        message={riskCheck?.message ?? ''}
        onClose={() => setShowRiskDetail(false)}
      />
    </>
  );
}

export function AdvancedStockTable({ rows, selectedMedicineIds, onSelect }) {
  return (
    <details className="hidden min-w-0 rounded-lg border border-gray-200 bg-white shadow-sm md:block">
      <summary className="cursor-pointer px-4 py-3 text-sm font-bold text-gray-800">Lihat semua stok</summary>
      <div className="scroll-fade min-w-0 overflow-x-auto border-t border-gray-100">
        <table className="w-full min-w-[760px] text-sm">
          <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-600">
            <tr>
              <th className="px-4 py-3 text-left font-black">Nama Obat</th>
              <th className="px-4 py-3 text-left font-black">Dosis</th>
              <th className="px-4 py-3 text-left font-black">Kategori</th>
              <th className="px-4 py-3 text-left font-black">Stok</th>
              <th className="px-4 py-3 text-left font-black">Harga</th>
              <th className="px-4 py-3 text-right font-black">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.map((item) => {
              const selected = selectedMedicineIds.includes(item.id);
              const isInactive = item.stock === 0;
              return (
              <tr
                key={`advanced-${item.id}`}
                className={`${selected ? 'bg-rose-50' : ''} ${isInactive ? 'opacity-60' : ''}`}
              >
                <td className="px-4 py-3">
                  <p className="font-bold text-gray-900">{item.medicine.name}</p>
                  <p className="mt-0.5 text-xs text-gray-500 [overflow-wrap:anywhere]">
                    {item.medicine.indications.join(', ')}
                  </p>
                </td>
                <td className="px-4 py-3 text-gray-700">{item.medicine.dose}</td>
                <td className="px-4 py-3 text-gray-700">{item.medicine.category}</td>
                <td className="px-4 py-3 font-black text-gray-900">{item.stock}</td>
                <td className="whitespace-nowrap px-4 py-3 font-bold text-gray-900">{formatRupiah(item.price)}</td>
                <td className="px-4 py-3 text-right">
                  <button
                    type="button"
                    onClick={() => !isInactive && onSelect(item.id)}
                    disabled={isInactive}
                    className={`inline-flex items-center rounded-lg px-3 py-2 text-xs font-bold ${
                      isInactive
                        ? 'cursor-not-allowed bg-gray-200 text-gray-500'
                        : 'bg-rose-600 text-white hover:bg-rose-700'
                    }`}
                  >
                    {selected ? 'Hapus' : 'Tambah'}
                  </button>
                </td>
              </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </details>
  );
}

export function SelectedMedicineTray({ selectedItems, onRemove }) {
  if (!selectedItems.length) return null;

  return (
    <section className="rounded-lg border border-rose-200 bg-rose-50 p-3 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-black uppercase tracking-wide text-rose-700">Pilihan Saat Ini</p>
          <p className="mt-1 text-xs font-semibold text-rose-900">{selectedItems.length} obat siap dicek keamanannya</p>
        </div>
        <span className="shrink-0 rounded-full bg-white px-2.5 py-1 text-xs font-black text-rose-700">{selectedItems.length}</span>
      </div>
      <div className="scroll-fade mt-3 flex min-w-0 gap-2 overflow-x-auto pb-2">
        {selectedItems.map((item) => (
          <div
            key={`selected-tray-${item.id}`}
            className="flex w-[min(220px,calc(100vw-2.5rem))] shrink-0 items-center justify-between gap-2 rounded-lg border border-rose-100 bg-white px-3 py-2"
          >
            <div className="min-w-0">
              <p className="truncate text-xs font-black text-gray-900">{item.medicine.name}</p>
              <p className="mt-0.5 truncate text-[11px] font-semibold text-gray-500">
                {item.stock === 0 ? 'Habis' : `${item.stock} pcs`} · {formatRupiah(item.price)}
              </p>
            </div>
            <button
              type="button"
              onClick={() => onRemove(item.id)}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200"
              aria-label={`Hapus ${item.medicine.name} dari pilihan`}
            >
              <CloseIcon />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
