import { useState } from 'react';
import { ClosingWorkflowProgress, CustomerContextStrip } from './DispensingShared.jsx';
import { formatRupiah } from './dispensingUtils.js';

const paymentMethods = [
  { key: 'cash', label: 'Tunai', icon: '💵' },
  { key: 'debit', label: 'Kartu Debit', icon: '💳' },
  { key: 'credit', label: 'Kartu Kredit', icon: '💳' },
  { key: 'qris', label: 'QRIS', icon: '📱' },
  { key: 'transfer', label: 'Transfer Bank', icon: '🏦' },
];

export default function PaymentStep({
  activeCustomer,
  selectedItems,
  closingStep,
  onConfirmPayment,
  onBackToPicking,
}) {
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [amountPaid, setAmountPaid] = useState('');
  const [discount, setDiscount] = useState(0);

  const subtotal = selectedItems.reduce((sum, item) => sum + (item.price || 0), 0);
  const discountAmount = Math.round(subtotal * discount / 100);
  const total = subtotal - discountAmount;
  const change = paymentMethod === 'cash' ? Math.max(0, Number(amountPaid) - total) : 0;
  const canPay = paymentMethod !== 'cash' || Number(amountPaid) >= total;

  return (
    <section className="grid gap-4 px-3 sm:px-0">
      <CustomerContextStrip customer={activeCustomer} />
      <ClosingWorkflowProgress currentStep={closingStep} />

      <section className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <h2 className="text-lg font-black text-gray-900">Pembayaran</h2>
        <p className="mt-1 text-xs text-gray-500">Rincian obat yang dibeli customer</p>

        {/* RINCIAN OBAT */}
        <div className="mt-4 rounded-lg border border-gray-100 bg-gray-50 p-3">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-xs uppercase text-gray-500">
                <th className="pb-2 text-left font-bold">Obat</th>
                <th className="pb-2 text-right font-bold">Harga</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {selectedItems.map((item) => (
                <tr key={item.id}>
                  <td className="py-2">
                    <p className="font-bold text-gray-900">
                      {item.medicine.isPrimary && <span className="mr-1 text-amber-500">★</span>}
                      {item.medicine.name}
                    </p>
                    <p className="text-[11px] text-gray-500">{item.medicine.dose} · {item.medicine.form}</p>
                  </td>
                  <td className="py-2 text-right font-bold text-gray-900">{formatRupiah(item.price)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-3 space-y-1 border-t border-gray-200 pt-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-bold text-gray-900">{formatRupiah(subtotal)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-emerald-700">
                <span>Diskon ({discount}%)</span>
                <span className="font-bold">-{formatRupiah(discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between border-t border-gray-200 pt-2 text-base">
              <span className="font-black text-gray-900">TOTAL</span>
              <span className="font-black text-gray-900">{formatRupiah(total)}</span>
            </div>
          </div>
        </div>

        {/* DISKON */}
        <div className="mt-4">
          <label className="text-[11px] font-bold uppercase tracking-wide text-gray-500">Diskon (%)</label>
          <div className="mt-1 flex gap-2">
            {[0, 5, 10, 15, 20].map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDiscount(d)}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold ${
                  discount === d
                    ? 'bg-emerald-600 text-white'
                    : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                {d}%
              </button>
            ))}
          </div>
        </div>

        {/* METODE PEMBAYARAN */}
        <div className="mt-4">
          <label className="text-[11px] font-bold uppercase tracking-wide text-gray-500">Metode Pembayaran</label>
          <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
            {paymentMethods.map((method) => (
              <button
                key={method.key}
                type="button"
                onClick={() => setPaymentMethod(method.key)}
                className={`flex flex-col items-center gap-1 rounded-lg border p-3 text-xs font-bold transition ${
                  paymentMethod === method.key
                    ? 'border-rose-400 bg-rose-50 text-rose-700 ring-2 ring-rose-100'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="text-lg">{method.icon}</span>
                {method.label}
              </button>
            ))}
          </div>
        </div>

        {/* INPUT JUMLAH BAYAR (TUNAI) */}
        {paymentMethod === 'cash' && (
          <div className="mt-4">
            <label className="text-[11px] font-bold uppercase tracking-wide text-gray-500">Jumlah Dibayar</label>
            <input
              type="number"
              value={amountPaid}
              onChange={(e) => setAmountPaid(e.target.value)}
              placeholder={`Min ${formatRupiah(total)}`}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm font-bold text-gray-900 outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
            />
            {Number(amountPaid) >= total && (
              <div className="mt-2 rounded-lg border border-emerald-200 bg-emerald-50 p-2">
                <p className="text-sm font-bold text-emerald-800">Kembalian: {formatRupiah(change)}</p>
              </div>
            )}
          </div>
        )}

        {paymentMethod !== 'cash' && (
          <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-3">
            <p className="text-xs font-bold text-blue-800">
              {paymentMethod === 'qris' && '📱 Scan QRIS untuk pembayaran'}
              {paymentMethod === 'debit' && '💳 Gesek/tap kartu debit di mesin EDC'}
              {paymentMethod === 'credit' && '💳 Gesek/tap kartu kredit di mesin EDC'}
              {paymentMethod === 'transfer' && '🏦 Transfer ke rekening apotek'}
            </p>
          </div>
        )}
      </section>

      {/* ACTIONS */}
      <section className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm">
        <div className="flex flex-wrap justify-between gap-2">
          <button
            type="button"
            onClick={onBackToPicking}
            className="min-h-10 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-50"
          >
            Kembali
          </button>
          <button
            type="button"
            onClick={() => onConfirmPayment({ paymentMethod, amountPaid: Number(amountPaid), total, change, discount })}
            disabled={!canPay}
            className="min-h-10 rounded-lg bg-emerald-600 px-6 py-2 text-sm font-bold text-white hover:bg-emerald-700 disabled:bg-gray-300 disabled:text-gray-500"
          >
            Konfirmasi Pembayaran
          </button>
        </div>
      </section>
    </section>
  );
}
