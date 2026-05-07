export const specialConditionOptions = [
  { key: 'hamil_t1', label: 'Hamil Trimester 1' },
  { key: 'hamil_t2', label: 'Hamil Trimester 2' },
  { key: 'hamil_t3', label: 'Hamil Trimester 3' },
  { key: 'menyusui', label: 'Sedang Menyusui' },
  { key: 'diabetes', label: 'Diabetes Mellitus' },
  { key: 'hipertensi', label: 'Hipertensi / Tekanan Darah Tinggi' },
  { key: 'ginjal', label: 'Gangguan Fungsi Ginjal' },
  { key: 'hati', label: 'Gangguan Fungsi Hati' },
  { key: 'asma', label: 'Asma' },
  { key: 'maag_kronis', label: 'Maag Kronis / GERD' },
  { key: 'jantung', label: 'Penyakit Jantung' },
];

export const commonAllergies = [
  'Penisilin',
  'Aspirin',
  'Sulfonamida',
  'Sefalosporin',
  'NSAID',
  'Paracetamol',
  'Codein',
  'Latex',
];

export const customerRecords = [
  {
    id: 'CUST001',
    name: 'Budi Santoso',
    phone: '081234567890',
    age: 7,
    gender: 'male',
    ageCategory: 'child',
    allergies: ['Aspirin', 'Penisilin'],
    conditions: [],
    createdAt: '2026-02-28',
    updatedAt: '2026-03-15',
    medicineHistory: [
      {
        date: '2026-03-15',
        medicineId: 'MED003',
        medicineName: 'Amoxicillin 500mg',
        dose: '125-250mg, 3x sehari',
        reason: 'Infeksi tenggorokan',
        staffName: 'Siti',
        duration: '5 hari',
      },
      {
        date: '2026-03-12',
        medicineId: 'MED001',
        medicineName: 'Paracetamol Sirup',
        dose: '125mg, 3-4x sehari',
        reason: 'Demam',
        staffName: 'Siti',
      },
      {
        date: '2026-02-28',
        medicineId: 'MED005',
        medicineName: 'Vitamin C 250mg',
        dose: '250mg, 1x sehari',
        reason: 'Suplemen',
        staffName: 'Andi',
      },
    ],
    notes: [
      {
        date: '2026-03-12',
        text: 'Ibu bilang Budi susah minum tablet, preferensi sirup',
        staffName: 'Siti',
      },
      {
        date: '2026-02-28',
        text: 'Berat badan 22kg',
        staffName: 'Andi',
      },
    ],
  },
  {
    id: 'CUST002',
    name: 'Rina Wijaya',
    phone: '081298765432',
    age: 32,
    gender: 'female',
    ageCategory: 'adult',
    allergies: [],
    conditions: ['hamil_t3'],
    createdAt: '2026-04-01',
    updatedAt: '2026-04-10',
    medicineHistory: [
      {
        date: '2026-04-10',
        medicineId: 'MED005',
        medicineName: 'Vitamin C 500mg',
        dose: '500mg, 1x sehari',
        reason: 'Suplemen kehamilan',
        staffName: 'Ayu',
      },
    ],
    notes: [
      {
        date: '2026-04-10',
        text: 'Hamil trimester 3, hindari NSAID kecuali atas instruksi dokter',
        staffName: 'Ayu',
      },
    ],
  },
];

/**
 * Maps a numeric age to the app's dispensing age category.
 *
 * @param {number} age - Customer age in years.
 * @returns {'infant' | 'child' | 'teen' | 'adult'} Age category key.
 */
export function getAgeCategory(age) {
  if (age < 2) return 'infant';
  if (age <= 11) return 'child';
  if (age <= 17) return 'teen';
  return 'adult';
}

/**
 * Gets the display label for an age category key.
 *
 * @param {string} ageCategory - Age category key.
 * @returns {string} Uppercase display label.
 */
export function getAgeCategoryLabel(ageCategory) {
  const labels = {
    infant: 'BAYI',
    child: 'ANAK',
    teen: 'REMAJA',
    adult: 'DEWASA',
  };
  return labels[ageCategory] ?? 'DEWASA';
}

/**
 * Gets the display label for a special medical condition key.
 *
 * @param {string} conditionKey - Condition key stored on the customer record.
 * @returns {string} Human-readable condition label.
 */
export function getConditionLabel(conditionKey) {
  return specialConditionOptions.find((condition) => condition.key === conditionKey)?.label ?? conditionKey;
}

/**
 * Finds a customer by normalized phone number.
 *
 * @param {string} phone - Phone number to find.
 * @param {Array<object>} [records=customerRecords] - Customer records to search.
 * @returns {object | null} Matching customer record, or null when not found.
 */
export function getCustomerByPhone(phone, records = customerRecords) {
  const normalizedPhone = phone.replace(/\D/g, '');
  return records.find((customer) => customer.phone.replace(/\D/g, '') === normalizedPhone) ?? null;
}

/**
 * Searches customers by name, phone, age category, allergy, or condition label.
 *
 * @param {string} query - Free-text search query.
 * @param {Array<object>} [records=customerRecords] - Customer records to search.
 * @returns {Array<object>} Matching customer records.
 */
export function searchCustomers(query, records = customerRecords) {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return records;
  return records.filter((customer) => {
    const haystack = [
      customer.name,
      customer.phone,
      getAgeCategoryLabel(customer.ageCategory),
      ...customer.allergies,
      ...customer.conditions.map(getConditionLabel),
    ]
      .join(' ')
      .toLowerCase();
    return haystack.includes(normalizedQuery);
  });
}

/**
 * Builds a new customer record from form input without mutating existing data.
 *
 * @param {object} input - New customer form data.
 * @returns {object} Customer record ready to store in React state.
 */
export function createCustomerRecord(input) {
  const now = new Date().toISOString().slice(0, 10);
  const age = Number(input.age) || 0;
  return {
    id: input.id ?? `CUST${Date.now()}`,
    name: input.name.trim(),
    phone: input.phone.trim(),
    age,
    gender: input.gender || 'male',
    ageCategory: getAgeCategory(age),
    allergies: input.allergies ?? [],
    conditions: input.conditions ?? [],
    createdAt: now,
    updatedAt: now,
    medicineHistory: [],
    notes: input.note
      ? [
          {
            date: now,
            text: input.note,
            staffName: 'Demo Staff',
          },
        ]
      : [],
  };
}
