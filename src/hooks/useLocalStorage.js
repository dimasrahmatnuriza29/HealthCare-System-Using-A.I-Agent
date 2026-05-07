import { useEffect, useState } from 'react';

function resolveInitialValue(initialValue) {
  return typeof initialValue === 'function' ? initialValue() : initialValue;
}

/**
 * Stores React state in localStorage while keeping the useState setter API.
 *
 * @template T
 * @param {string} key - localStorage key.
 * @param {T | (() => T)} initialValue - Initial value or lazy initializer used when storage is empty.
 * @returns {[T, import('react').Dispatch<import('react').SetStateAction<T>>]} Stored value and state setter.
 */
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    if (typeof window === 'undefined') {
      return resolveInitialValue(initialValue);
    }

    try {
      const storedValue = window.localStorage.getItem(key);
      return storedValue === null ? resolveInitialValue(initialValue) : JSON.parse(storedValue);
    } catch (error) {
      console.warn(`Failed to read localStorage key "${key}".`, error);
      return resolveInitialValue(initialValue);
    }
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn(`Failed to write localStorage key "${key}".`, error);
    }
  }, [key, value]);

  return [value, setValue];
}

export default useLocalStorage;
