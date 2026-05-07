import { useMemo, useState } from 'react';
import { useCustomers } from '../contexts/CustomerContext.jsx';
import {
  ArrowRightIcon,
  CheckCircleIcon,
  ChevronRightIcon,
  ClipboardIcon,
  ClockIcon,
  PlusIcon,
  SearchIcon,
  UserIcon,
} from './ui/Icons.jsx';
import {
  commonAllergies,
  getAgeCategoryLabel,
  getConditionLabel,
  searchCustomers,
  specialConditionOptions,
} from '../data/customerRecords.js';

function Badge({ children, tone = 'gray' }) {
  const toneClass =
    tone === 'danger'
      ? 'border-rose-200 bg-rose-50 text-rose-700'
      : tone === 'success'
        ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
        : tone === 'warning'
          ? 'border-amber-200 bg-amber-50 text-amber-800'
          : tone === 'violet'
            ? 'border-violet-200 bg-violet-50 text-violet-700'
            : 'border-gray-200 bg-gray-50 text-gray-700';

  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${toneClass}`}>
      {children}
    </span>
  );
}


function CustomerAvatar({ name, active }) {
  const initials = (name || '?')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((chunk) => chunk[0]?.toUpperCase())
    .join('');

  return (
    <div className="relative shrink-0">
      <div
        className={`flex h-11 w-11 items-center justify-center rounded-full border text-sm font-black ${
          active ? 'border-rose-200 bg-rose-50 text-rose-700' : 'border-gray-200 bg-gray-50 text-gray-600'
        }`}
      >
        {initials || <UserIcon className="h-5 w-5" />}
      </div>
      {active ? (
        <span className="absolute -bottom-1 -right-1 inline-flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-rose-600 text-white">
          <CheckCircleIcon className="h-4 w-4" />
        </span>
      ) : null}
    </div>
  );
}

function CustomerCard({ customer, active, onClick }) {
  const allergyBadges = customer.allergies.slice(0, 2);
  const extraAllergyCount = Math.max(0, customer.allergies.length - allergyBadges.length);

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group flex w-full items-center justify-between gap-3 rounded-2xl border p-3 text-left transition ${
        active
          ? 'border-rose-300 bg-rose-50/70'
          : 'border-gray-200 bg-white hover:border-rose-200 hover:bg-rose-50/30'
      }`}
    >
      <div className="flex min-w-0 items-center gap-3">
        <CustomerAvatar name={customer.name} active={active} />
        <div className="min-w-0">
          <p className="truncate text-sm font-black text-gray-900">{customer.name}</p>
          <p className="mt-0.5 text-xs text-gray-500">
            {customer.age} tahun · {getAgeCategoryLabel(customer.ageCategory)}
          </p>
          <p className="mt-0.5 text-xs text-gray-500">{customer.phone}</p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <div className="hidden shrink-0 flex-wrap items-center justify-end gap-1 sm:flex">
          <Badge tone="violet">{getAgeCategoryLabel(customer.ageCategory)}</Badge>
          {customer.allergies.length ? (
            <>
              {allergyBadges.map((allergy) => (
                <Badge key={allergy} tone="danger">
                  {allergy}
                </Badge>
              ))}
              {extraAllergyCount ? <Badge tone="danger">+{extraAllergyCount}</Badge> : null}
            </>
          ) : (
            <Badge tone="gray">Tidak ada alergi</Badge>
          )}
        </div>
        {!active ? <ChevronRightIcon className="h-5 w-5 text-gray-300 group-hover:text-gray-400" /> : null}
      </div>
    </button>
  );
}

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

/**
 * Renders customer search, profile summary, and new-customer creation for dispensing workflows.
 *
 * @param {object} props - Component props.
 * @param {string | null} props.activeCustomerId - Currently selected customer ID.
 * @param {(customerId: string) => void} props.onSelectCustomer - Selection callback.
 * @param {(customer: object) => void} [props.onContinue] - Workflow continuation callback.
 * @returns {import('react').ReactElement} Customer panel UI.
 */
export default function CustomerPanel({ activeCustomerId, onSelectCustomer, onContinue }) {
  const { customers, addCustomer } = useCustomers();
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

    const record = addCustomer({
      ...form,
      allergies,
    });

    onSelectCustomer?.(record.id);
    setForm(emptyForm);
    setShowNewCustomer(false);
    onContinue?.(record);
  };

  const activeAllergies = activeCustomer?.allergies ?? [];
  const activeConditions = activeCustomer?.conditions ?? [];

  return (
    <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="grid gap-4 p-3 sm:p-4 lg:grid-cols-[1.55fr_1fr]">
        <div>
          <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-base font-black text-gray-900">Pilih Customer</h2>
              <p className="mt-1 text-xs leading-5 text-gray-500">Cari customer lama atau buat customer baru sebelum memilih obat.</p>
            </div>
            <button
              type="button"
              onClick={() => setShowNewCustomer((value) => !value)}
              className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-black text-rose-700 hover:bg-rose-100"
            >
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-rose-600 text-white">
                <PlusIcon className="h-4 w-4" />
              </span>
              Customer Baru
            </button>
          </div>

          <div className="relative mt-2">
            <input
              id="customer-search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="min-h-11 w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-3 py-2.5 text-sm font-semibold text-gray-900 outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500"
              placeholder="Cari nama atau nomor HP"
            />
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <SearchIcon className="h-5 w-5" />
            </span>
          </div>

          <div className="scroll-fade mt-3 grid max-h-[420px] gap-2 overflow-y-auto pr-1">
            {filteredCustomers.map((customer) => {
              const active = customer.id === activeCustomer?.id;
              return (
                <CustomerCard
                  key={customer.id}
                  customer={customer}
                  active={active}
                  onClick={() => onSelectCustomer(customer.id)}
                />
              );
            })}
          </div>

          {showNewCustomer ? (
            <form onSubmit={handleCreateCustomer} className="mt-4 rounded-2xl border border-gray-100 bg-gray-50 p-3 sm:p-4">
              <h3 className="text-sm font-black text-gray-900">Customer Baru</h3>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <label className="block">
                  <span className="text-[11px] font-black uppercase tracking-wide text-gray-500">Nama lengkap</span>
                  <input
                    value={form.name}
                    onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                    className="mt-1 min-h-11 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm font-semibold outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500"
                    placeholder="Contoh: Budi Santoso"
                    required
                  />
                </label>
                <label className="block">
                  <span className="text-[11px] font-black uppercase tracking-wide text-gray-500">Nomor HP</span>
                  <input
                    value={form.phone}
                    onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))}
                    className="mt-1 min-h-11 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm font-semibold outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500"
                    placeholder="Contoh: 081234567890"
                    required
                  />
                </label>
                <label className="block">
                  <span className="text-[11px] font-black uppercase tracking-wide text-gray-500">Umur</span>
                  <input
                    value={form.age}
                    onChange={(event) => setForm((current) => ({ ...current, age: event.target.value }))}
                    className="mt-1 min-h-11 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm font-semibold outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500"
                    placeholder="Contoh: 32"
                    inputMode="numeric"
                    required
                  />
                </label>
                <label className="block">
                  <span className="text-[11px] font-black uppercase tracking-wide text-gray-500">Jenis kelamin</span>
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
                    className="mt-1 min-h-11 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm font-semibold outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500"
                  >
                    <option value="male">Laki-laki</option>
                    <option value="female">Perempuan</option>
                  </select>
                </label>
              </div>
              <label className="mt-3 block">
                <span className="text-[11px] font-black uppercase tracking-wide text-gray-500">Alergi obat</span>
                <input
                  value={form.allergies}
                  onChange={(event) => setForm((current) => ({ ...current, allergies: event.target.value }))}
                  className="mt-1 min-h-11 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm font-semibold outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500"
                  placeholder={`Pisahkan dengan koma, contoh: ${commonAllergies.slice(0, 3).join(', ')}`}
                />
              </label>
              <div className="mt-3">
                <p className="text-[11px] font-black uppercase tracking-wide text-gray-500">Kondisi medis penting</p>
                <div className="scroll-fade mt-2 grid max-h-52 gap-2 overflow-y-auto pr-1 sm:grid-cols-2">
                  {visibleConditionOptions.map((condition) => (
                    <label
                      key={condition.key}
                      className="flex min-h-10 items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700"
                    >
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
                <span className="text-[11px] font-black uppercase tracking-wide text-gray-500">Catatan medis tambahan</span>
                <textarea
                  value={form.note}
                  onChange={(event) => setForm((current) => ({ ...current, note: event.target.value }))}
                  className="mt-1 min-h-20 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm font-semibold outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500"
                  placeholder="Contoh: keluhan pelanggan, instruksi apoteker, atau catatan riwayat penting."
                />
              </label>
              <button
                type="submit"
                className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-rose-600 px-4 py-3 text-sm font-black text-white hover:bg-rose-700"
              >
                Simpan & Lanjut Pilih Obat
                <ArrowRightIcon className="h-4 w-4" />
              </button>
            </form>
          ) : null}
        </div>

        <aside className="space-y-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-3 shadow-sm sm:p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-black uppercase tracking-wide text-gray-500">Customer Aktif</p>
                {activeCustomer ? (
                  <div className="mt-2 flex items-center gap-3">
                    <CustomerAvatar name={activeCustomer.name} active />
                    <div>
                      <p className="text-sm font-black text-gray-900">{activeCustomer.name}</p>
                      <p className="mt-0.5 text-xs text-gray-500">
                        {activeCustomer.age} tahun · {getAgeCategoryLabel(activeCustomer.ageCategory)}
                      </p>
                      <p className="mt-0.5 text-xs text-gray-500">{activeCustomer.phone}</p>
                    </div>
                  </div>
                ) : (
                  <p className="mt-2 text-xs font-semibold text-gray-500">Belum ada customer dipilih.</p>
                )}
              </div>
              {activeCustomer ? (
                <span className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-black text-emerald-700">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  Aktif
                </span>
              ) : null}
            </div>

            {activeCustomer ? (
              <>
                <div className="mt-4">
                  <p className="text-[11px] font-black uppercase tracking-wide text-gray-500">Alergi</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {activeAllergies.length ? (
                      activeAllergies.map((allergy) => (
                        <Badge key={allergy} tone="danger">
                          {allergy}
                        </Badge>
                      ))
                    ) : (
                      <Badge tone="gray">Tidak ada alergi</Badge>
                    )}
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-[11px] font-black uppercase tracking-wide text-gray-500">Kondisi Medis</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {activeConditions.length ? (
                      activeConditions.map((condition) => (
                        <Badge key={condition} tone="warning">
                          {getConditionLabel(condition)}
                        </Badge>
                      ))
                    ) : (
                      <Badge tone="gray">Tidak ada</Badge>
                    )}
                  </div>
                </div>
              </>
            ) : null}
          </div>

          {activeCustomer ? (
            <div className="rounded-2xl border border-gray-200 bg-white p-3 shadow-sm sm:p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-[11px] font-black uppercase tracking-wide text-gray-500">Riwayat Obat</p>
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-gray-200 bg-gray-50 text-gray-500">
                  <ClockIcon className="h-4 w-4" />
                </span>
              </div>
              <div className="mt-2 grid gap-2">
                {activeCustomer.medicineHistory.slice(0, 3).map((history) => (
                  <div
                    key={`${history.date}-${history.medicineId}`}
                    className="rounded-xl border border-gray-100 bg-gray-50 px-3 py-2 text-xs text-gray-700"
                  >
                    <p className="font-black text-gray-900">{history.medicineName}</p>
                    <p className="mt-0.5 text-[11px] text-gray-500">
                      {history.date} · {history.reason}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {activeCustomer ? (
            <div className="rounded-2xl border border-gray-200 bg-white p-3 shadow-sm sm:p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-[11px] font-black uppercase tracking-wide text-gray-500">Catatan Staff</p>
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-gray-200 bg-gray-50 text-gray-500">
                  <ClipboardIcon className="h-4 w-4" />
                </span>
              </div>
              <div className="mt-2 grid gap-2">
                {activeCustomer.notes.slice(0, 2).map((note) => (
                  <div
                    key={`${note.date}-${note.text}`}
                    className="rounded-xl border border-violet-100 bg-violet-50 px-3 py-2 text-xs text-gray-700"
                  >
                    <p className="font-black text-violet-900">{note.text}</p>
                    <p className="mt-0.5 text-[11px] text-violet-700">{note.date} · Staff</p>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </aside>
      </div>

      {onContinue ? (
        <div className="sticky bottom-0 z-10 border-t border-gray-100 bg-white/90 p-3 backdrop-blur sm:p-4">
          <button
            type="button"
            onClick={() => activeCustomer && onContinue(activeCustomer)}
            disabled={!activeCustomer}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-rose-600 px-4 py-3 text-sm font-black text-white hover:bg-rose-700 disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            Lanjut Pilih Obat
            <ArrowRightIcon className="h-4 w-4" />
          </button>
        </div>
      ) : null}
    </section>
  );
}
