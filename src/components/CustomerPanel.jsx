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

export default function CustomerPanel({ customers, activeCustomerId, onSelectCustomer, onCreateCustomer }) {
  const [query, setQuery] = useState('');
  const [showNewCustomer, setShowNewCustomer] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const activeCustomer = customers.find((customer) => customer.id === activeCustomerId) ?? customers[0] ?? null;
  const filteredCustomers = useMemo(() => searchCustomers(query, customers), [query, customers]);

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
  };

  return (
    <section className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm sm:p-4">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-gray-900">Customer Records</h2>
          <p className="mt-1 text-xs leading-5 text-gray-500">Preview customer lama, customer baru, alergi, kondisi, riwayat obat, dan catatan staff.</p>
        </div>
        <button
          type="button"
          onClick={() => setShowNewCustomer((value) => !value)}
          className="min-h-10 rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-2 text-xs font-bold text-indigo-700 hover:bg-indigo-100"
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
        className="mt-2 min-h-11 w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2.5 text-sm font-medium text-gray-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
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
                  ? 'border-indigo-300 bg-indigo-50'
                  : 'border-gray-200 bg-white hover:border-indigo-200 hover:bg-indigo-50/40'
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
            <input
              value={form.name}
              onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
              className="min-h-11 rounded-lg border border-gray-300 bg-gray-50 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
              placeholder="Nama"
              required
            />
            <input
              value={form.phone}
              onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))}
              className="min-h-11 rounded-lg border border-gray-300 bg-gray-50 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
              placeholder="No. HP"
              required
            />
            <input
              value={form.age}
              onChange={(event) => setForm((current) => ({ ...current, age: event.target.value }))}
              className="min-h-11 rounded-lg border border-gray-300 bg-gray-50 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
              placeholder="Usia"
              inputMode="numeric"
              required
            />
            <select
              value={form.gender}
              onChange={(event) => setForm((current) => ({ ...current, gender: event.target.value }))}
              className="min-h-11 rounded-lg border border-gray-300 bg-gray-50 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
            >
              <option value="male">Laki-laki</option>
              <option value="female">Perempuan</option>
            </select>
          </div>
          <input
            value={form.allergies}
            onChange={(event) => setForm((current) => ({ ...current, allergies: event.target.value }))}
            className="mt-3 min-h-11 w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
            placeholder={`Alergi obat, contoh: ${commonAllergies.slice(0, 3).join(', ')}`}
          />
          <div className="mt-3 grid max-h-52 gap-2 overflow-y-auto pr-1 sm:grid-cols-2">
            {specialConditionOptions.map((condition) => (
              <label key={condition.key} className="flex min-h-10 items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-medium text-gray-700">
                <input
                  type="checkbox"
                  checked={form.conditions.includes(condition.key)}
                  onChange={() => toggleCondition(condition.key)}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                {condition.label}
              </label>
            ))}
          </div>
          <textarea
            value={form.note}
            onChange={(event) => setForm((current) => ({ ...current, note: event.target.value }))}
            className="mt-3 min-h-20 w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
            placeholder="Catatan staff"
          />
          <button type="submit" className="mt-3 w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-indigo-700">
            Simpan & Lanjut Cari Obat
          </button>
        </form>
      ) : null}

      {activeCustomer ? (
        <div className="mt-4 border-t border-gray-100 pt-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-bold text-gray-900">
                {activeCustomer.name} ({activeCustomer.age} thn - {getAgeCategoryLabel(activeCustomer.ageCategory)})
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
    </section>
  );
}
