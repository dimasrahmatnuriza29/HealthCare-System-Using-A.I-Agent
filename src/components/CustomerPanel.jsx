import { useMemo, useState } from 'react';
import {
  commonAllergies,
  createCustomerRecord,
  getAgeCategoryLabel,
  getConditionLabel,
  searchCustomers,
  specialConditionOptions,
} from '../data/customerRecords.js';

const emptyForm = {
  name: '',
  phone: '',
  age: '',
  gender: 'male',
  allergies: '',
  conditions: [],
  note: '',
};

const femaleOnlyConditionKeys = new Set(['hamil_t1', 'hamil_t2', 'hamil_t3', 'menyusui']);

export default function CustomerPanel({ customers, activeCustomerId, onSelectCustomer, onCreateCustomer, onContinue }) {
  const [query, setQuery] = useState('');
  const [showNewCustomer, setShowNewCustomer] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const activeCustomer = customers.find((customer) => customer.id === activeCustomerId) ?? null;
  const filteredCustomers = useMemo(() => searchCustomers(query, customers), [query, customers]);
  const visibleConditionOptions = useMemo(
    () =>
      form.gender === 'female'
        ? specialConditionOptions
        : specialConditionOptions.filter((condition) => !femaleOnlyConditionKeys.has(condition.key)),
    [form.gender],
  );

  const toggleCondition = (conditionKey) => {
    setForm((current) => {
      const exists = current.conditions.includes(conditionKey);
      return {
        ...current,
        conditions: exists
          ? current.conditions.filter((condition) => condition !== conditionKey)
          : [...current.conditions, conditionKey],
      };
    });
  };

  const handleCreateCustomer = (event) => {
    event.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) return;

    const allergies = form.allergies
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);

    const record = createCustomerRecord({
      ...form,
      allergies,
    });

    onCreateCustomer(record);
    setForm(emptyForm);
    setShowNewCustomer(false);
    onContinue?.(record);
  };

  return (
    <section className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm sm:p-4">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-gray-900">Customer Record</h2>
          <p className="mt-1 text-xs leading-5 text-gray-500">Cari customer lama atau buat customer baru sebelum memilih obat.</p>
        </div>
        <button
          type="button"
          onClick={() => setShowNewCustomer((value) => !value)}
          className="min-h-10 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-bold text-rose-700 hover:bg-rose-100"
        >
          Customer Baru
        </button>
      </div>

      <label className="block text-xs font-bold uppercase tracking-wide text-gray-500" htmlFor="customer-search">
        Cari Customer Lama
      </label>
      <input
        id="customer-search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        className="mt-2 min-h-11 w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2.5 text-sm font-medium text-gray-900 outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500"
        placeholder="Nama atau nomor HP"
      />

      <div className="mt-3 grid max-h-80 gap-2 overflow-y-auto pr-1">
        {filteredCustomers.map((customer) => {
          const active = customer.id === activeCustomer?.id;
          return (
            <button
              type="button"
              key={customer.id}
              onClick={() => onSelectCustomer(customer.id)}
              className={`min-h-24 rounded-lg border p-3 text-left transition ${
                active
                  ? 'border-rose-300 bg-rose-50'
                  : 'border-gray-200 bg-white hover:border-rose-200 hover:bg-rose-50/40'
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-bold text-gray-900">{customer.name}</p>
                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-semibold text-gray-600">
                  {getAgeCategoryLabel(customer.ageCategory)}
                </span>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                {customer.phone} - {customer.age} tahun
              </p>
              <p className="mt-1 text-xs text-rose-700">
                Alergi: {customer.allergies.length ? customer.allergies.join(', ') : 'Tidak ada'}
              </p>
            </button>
          );
        })}
      </div>

      {showNewCustomer ? (
        <form onSubmit={handleCreateCustomer} className="mt-4 border-t border-gray-100 pt-4">
          <h3 className="text-sm font-bold text-gray-900">Registrasi Customer Baru</h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="text-xs font-bold uppercase tracking-wide text-gray-500">Nama lengkap</span>
              <input
                value={form.name}
                onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                className="mt-1 min-h-11 w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2.5 text-sm outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500"
                placeholder="Contoh: Budi Santoso"
                required
              />
            </label>
            <label className="block">
              <span className="text-xs font-bold uppercase tracking-wide text-gray-500">Nomor HP</span>
              <input
                value={form.phone}
                onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))}
                className="mt-1 min-h-11 w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2.5 text-sm outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500"
                placeholder="Contoh: 081234567890"
                required
              />
            </label>
            <label className="block">
              <span className="text-xs font-bold uppercase tracking-wide text-gray-500">Umur</span>
              <input
                value={form.age}
                onChange={(event) => setForm((current) => ({ ...current, age: event.target.value }))}
                className="mt-1 min-h-11 w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2.5 text-sm outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500"
                placeholder="Contoh: 32"
                inputMode="numeric"
                required
              />
            </label>
            <label className="block">
              <span className="text-xs font-bold uppercase tracking-wide text-gray-500">Jenis kelamin</span>
              <select
                value={form.gender}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    gender: event.target.value,
                    conditions:
                      event.target.value === 'male'
                        ? current.conditions.filter((conditionKey) => !femaleOnlyConditionKeys.has(conditionKey))
                        : current.conditions,
                  }))
                }
                className="mt-1 min-h-11 w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2.5 text-sm outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500"
              >
                <option value="male">Laki-laki</option>
                <option value="female">Perempuan</option>
              </select>
            </label>
          </div>
          <label className="mt-3 block">
            <span className="text-xs font-bold uppercase tracking-wide text-gray-500">Alergi obat</span>
            <input
              value={form.allergies}
              onChange={(event) => setForm((current) => ({ ...current, allergies: event.target.value }))}
              className="mt-1 min-h-11 w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2.5 text-sm outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500"
              placeholder={`Pisahkan dengan koma, contoh: ${commonAllergies.slice(0, 3).join(', ')}`}
            />
          </label>
          <div className="mt-3">
            <p className="text-xs font-bold uppercase tracking-wide text-gray-500">Kondisi medis penting</p>
            <div className="mt-2 grid max-h-52 gap-2 overflow-y-auto pr-1 sm:grid-cols-2">
              {visibleConditionOptions.map((condition) => (
                <label key={condition.key} className="flex min-h-10 items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-medium text-gray-700">
                  <input
                    type="checkbox"
                    checked={form.conditions.includes(condition.key)}
                    onChange={() => toggleCondition(condition.key)}
                    className="h-4 w-4 rounded border-gray-300 text-rose-600 focus:ring-rose-500"
                  />
                  {condition.label}
                </label>
              ))}
            </div>
          </div>
          <label className="mt-3 block">
            <span className="text-xs font-bold uppercase tracking-wide text-gray-500">Catatan medis tambahan</span>
            <textarea
              value={form.note}
              onChange={(event) => setForm((current) => ({ ...current, note: event.target.value }))}
              className="mt-1 min-h-20 w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2.5 text-sm outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500"
              placeholder="Contoh: keluhan pelanggan, instruksi apoteker, atau catatan riwayat penting."
            />
          </label>
          <button type="submit" className="mt-3 w-full rounded-lg bg-rose-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-rose-700">
            Simpan & Lanjut Pilih Obat
          </button>
        </form>
      ) : null}

      {activeCustomer ? (
        <div className="mt-4 border-t border-gray-100 pt-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[11px] font-black uppercase tracking-wide text-gray-500">Customer Aktif</p>
              <p className="text-sm font-bold text-gray-900">
                {activeCustomer.name} - {activeCustomer.age} tahun - {getAgeCategoryLabel(activeCustomer.ageCategory)}
              </p>
              <p className="mt-1 text-xs text-gray-500">{activeCustomer.phone}</p>
            </div>
            <span className="rounded-full border border-violet-200 bg-violet-50 px-2.5 py-1 text-[11px] font-bold text-violet-700">
              Aktif
            </span>
          </div>

          <div className="mt-3 grid gap-2 text-xs">
            <p className="rounded-lg bg-rose-50 px-3 py-2 font-medium text-rose-800">
              Alergi: {activeCustomer.allergies.length ? activeCustomer.allergies.join(', ') : 'Tidak ada'}
            </p>
            <p className="rounded-lg bg-amber-50 px-3 py-2 font-medium text-amber-800">
              Kondisi: {activeCustomer.conditions.length ? activeCustomer.conditions.map(getConditionLabel).join(', ') : 'Tidak ada'}
            </p>
          </div>

          <div className="mt-4">
            <p className="text-xs font-bold uppercase tracking-wide text-gray-500">Riwayat Obat</p>
            <div className="mt-2 grid gap-2">
              {activeCustomer.medicineHistory.slice(0, 3).map((history) => (
                <div key={`${history.date}-${history.medicineId}`} className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-xs text-gray-700">
                  <span className="font-bold text-gray-900">{history.date}</span> - {history.medicineName} ({history.reason})
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4">
            <p className="text-xs font-bold uppercase tracking-wide text-gray-500">Catatan Staff</p>
            <div className="mt-2 grid gap-2">
              {activeCustomer.notes.slice(0, 2).map((note) => (
                <div key={`${note.date}-${note.text}`} className="rounded-lg border border-violet-100 bg-violet-50 px-3 py-2 text-xs text-gray-700">
                  <span className="font-bold text-violet-800">{note.date}</span> - {note.text}
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      {onContinue ? (
        <button
          type="button"
          onClick={() => activeCustomer && onContinue(activeCustomer)}
          disabled={!activeCustomer}
          className="mt-4 w-full rounded-lg bg-gray-900 px-4 py-3 text-sm font-bold text-white hover:bg-black disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          Lanjut Pilih Obat
        </button>
      ) : null}
    </section>
  );
}
