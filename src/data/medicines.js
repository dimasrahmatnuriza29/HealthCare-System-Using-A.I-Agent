import { medicinesExpanded } from './medicinesExpanded.js';

export const medicineCategories = ['Semua', 'Analgesik', 'Antihistamin', 'Antibiotik', 'Lambung', 'Batuk', 'Vitamin'];

/**
 * Medicines list — now sourced from medicinesExpanded with isPrimary & priority.
 * Backward-compatible: same shape as before + new fields.
 */
export const medicines = medicinesExpanded;

/**
 * Finds medicine metadata by medicine ID.
 *
 * @param {string} medicineId - Medicine ID.
 * @returns {object | null} Matching medicine record, or null when not found.
 */
export function getMedicineById(medicineId) {
  return medicines.find((medicine) => medicine.id === medicineId) ?? null;
}
