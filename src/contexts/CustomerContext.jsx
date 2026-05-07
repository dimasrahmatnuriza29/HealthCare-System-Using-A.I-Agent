import { createContext, useCallback, useContext, useMemo } from 'react';
import {
  createCustomerRecord,
  customerRecords as initialCustomerRecords,
  getCustomerByPhone as findCustomerByPhone,
} from '../data/customerRecords.js';
import useLocalStorage from '../hooks/useLocalStorage.js';

const CUSTOMER_STORAGE_KEY = 'rakobat.customers.v1';
const CustomerContext = createContext(null);

function cloneCustomerRecords(records) {
  return JSON.parse(JSON.stringify(records));
}

function getTodayDate() {
  return new Date().toISOString().slice(0, 10);
}

function isCustomerRecord(input) {
  return Boolean(input?.id && Array.isArray(input?.medicineHistory) && Array.isArray(input?.notes));
}

/**
 * Provides persisted customer records and customer mutation actions to pharmacy workflow components.
 *
 * @param {{ children: import('react').ReactNode }} props - Provider props.
 * @returns {import('react').ReactElement} Customer context provider.
 */
export function CustomerProvider({ children }) {
  const [customers, setCustomers] = useLocalStorage(CUSTOMER_STORAGE_KEY, () =>
    cloneCustomerRecords(initialCustomerRecords),
  );

  const addCustomer = useCallback(
    (customerInput) => {
      const record = isCustomerRecord(customerInput)
        ? cloneCustomerRecords([customerInput])[0]
        : createCustomerRecord(customerInput);

      setCustomers((current) => [record, ...current]);
      return record;
    },
    [setCustomers],
  );

  const updateCustomer = useCallback(
    (customerId, patch) => {
      const currentCustomer = customers.find((customer) => customer.id === customerId);
      if (!currentCustomer) return null;

      const updatedCustomer = {
        ...currentCustomer,
        ...patch,
        updatedAt: getTodayDate(),
      };

      setCustomers((current) =>
        current.map((customer) =>
          customer.id === customerId
            ? {
                ...customer,
                ...patch,
                updatedAt: getTodayDate(),
              }
            : customer,
        ),
      );

      return updatedCustomer;
    },
    [customers, setCustomers],
  );

  const addMedicineHistory = useCallback(
    (customerId, historyItem) => {
      const currentCustomer = customers.find((customer) => customer.id === customerId);
      if (!currentCustomer) return null;

      const updatedAt = getTodayDate();
      const updatedCustomer = {
        ...currentCustomer,
        updatedAt,
        medicineHistory: [historyItem, ...currentCustomer.medicineHistory],
      };

      setCustomers((current) =>
        current.map((customer) =>
          customer.id === customerId
            ? {
                ...customer,
                updatedAt,
                medicineHistory: [historyItem, ...customer.medicineHistory],
              }
            : customer,
        ),
      );

      return updatedCustomer;
    },
    [customers, setCustomers],
  );

  const addNote = useCallback(
    (customerId, note) => {
      const currentCustomer = customers.find((customer) => customer.id === customerId);
      if (!currentCustomer) return null;

      const updatedAt = getTodayDate();
      const updatedCustomer = {
        ...currentCustomer,
        updatedAt,
        notes: [note, ...currentCustomer.notes],
      };

      setCustomers((current) =>
        current.map((customer) =>
          customer.id === customerId
            ? {
                ...customer,
                updatedAt,
                notes: [note, ...customer.notes],
              }
            : customer,
        ),
      );

      return updatedCustomer;
    },
    [customers, setCustomers],
  );

  const getCustomerByPhone = useCallback((phone) => findCustomerByPhone(phone, customers), [customers]);

  const value = useMemo(
    () => ({
      customers,
      addCustomer,
      updateCustomer,
      addMedicineHistory,
      addNote,
      getCustomerByPhone,
    }),
    [addCustomer, addMedicineHistory, addNote, customers, getCustomerByPhone, updateCustomer],
  );

  return <CustomerContext.Provider value={value}>{children}</CustomerContext.Provider>;
}

/**
 * Reads customer state and mutation actions from CustomerContext.
 *
 * @returns {{
 *   customers: Array<object>,
 *   addCustomer: (customerInput: object) => object,
 *   updateCustomer: (customerId: string, patch: object) => object | null,
 *   addMedicineHistory: (customerId: string, historyItem: object) => object | null,
 *   addNote: (customerId: string, note: object) => object | null,
 *   getCustomerByPhone: (phone: string) => object | null
 * }} Customer context value.
 */
export function useCustomers() {
  const context = useContext(CustomerContext);
  if (!context) {
    throw new Error('useCustomers must be used within a CustomerProvider.');
  }
  return context;
}
