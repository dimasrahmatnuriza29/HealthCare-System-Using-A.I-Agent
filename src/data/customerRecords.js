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
    weight: 22,
    ageCategory: 'child',
    allergies: ['Penisilin'],
    conditions: [],
    createdAt: '2026-02-28',
    updatedAt: '2026-04-20',
    medicineHistory: [
      { date: '2026-04-20', medicineId: 'MED001', medicineName: 'Paracetamol 500mg', dose: '250mg, 3x sehari', reason: 'Demam', staffName: 'Ani' },
      { date: '2026-04-05', medicineId: 'MED006', medicineName: 'OBH Combi Sirup', dose: '5ml, 3x sehari', reason: 'Batuk', staffName: 'Dewi' },
      { date: '2026-03-15', medicineId: 'MED005', medicineName: 'Vitamin C 500mg', dose: '250mg, 1x sehari', reason: 'Suplemen', staffName: 'Ani' },
    ],
    notes: [
      { date: '2026-04-20', text: 'Anak susah minum tablet. Preferensi sirup.', staffName: 'Ani' },
      { date: '2026-04-05', text: 'Batuk sudah 4 hari. Diberi OBH Combi.', staffName: 'Dewi' },
    ],
  },
  {
    id: 'CUST002',
    name: 'Rina Wijaya',
    phone: '081298765432',
    age: 32,
    gender: 'female',
    weight: 58,
    ageCategory: 'adult',
    allergies: ['Aspirin'],
    conditions: ['hamil_t3'],
    createdAt: '2026-04-01',
    updatedAt: '2026-04-28',
    medicineHistory: [
      { date: '2026-04-28', medicineId: 'MED001', medicineName: 'Paracetamol 500mg', dose: '500mg, 3x sehari', reason: 'Sakit kepala', staffName: 'Ani' },
      { date: '2026-04-15', medicineId: 'MED005', medicineName: 'Vitamin C 500mg', dose: '500mg, 1x sehari', reason: 'Suplemen', staffName: 'Dewi' },
      { date: '2026-03-20', medicineId: 'MED008', medicineName: 'Antasida DOEN', dose: '1 tab, 3x sehari', reason: 'Maag', staffName: 'Dewi' },
    ],
    notes: [
      { date: '2026-04-28', text: 'Sakit kepala ringan. Diberi Paracetamol. Hamil T3.', staffName: 'Ani' },
      { date: '2026-03-20', text: 'Maag kambuh. Antasida aman untuk bumil.', staffName: 'Dewi' },
    ],
  },
  {
    id: 'CUST003',
    name: 'Ahmad Fauzi',
    phone: '085711223344',
    age: 55,
    gender: 'male',
    weight: 75,
    ageCategory: 'adult',
    allergies: [],
    conditions: ['hipertensi', 'diabetes'],
    createdAt: '2026-03-01',
    updatedAt: '2026-05-01',
    currentMedications: ['Amlodipine 5mg', 'Metformin 500mg'],
    medicineHistory: [
      { date: '2026-05-01', medicineId: 'MED009', medicineName: 'Omeprazole 20mg', dose: '20mg, 1x sehari', reason: 'GERD', staffName: 'Budi' },
      { date: '2026-04-15', medicineId: 'MED001', medicineName: 'Paracetamol 500mg', dose: '500mg, 3x sehari', reason: 'Nyeri', staffName: 'Ani' },
      { date: '2026-04-01', medicineId: 'MED010', medicineName: 'Cetirizine 10mg', dose: '10mg, 1x sehari', reason: 'Rhinitis', staffName: 'Ani' },
    ],
    notes: [
      { date: '2026-05-01', text: 'GERD kambuh. Sedang minum Amlodipine & Metformin dari dokter.', staffName: 'Budi' },
      { date: '2026-04-01', text: 'Rhinitis alergi. Diberi Cetirizine.', staffName: 'Ani' },
    ],
  },
  {
    id: 'CUST004',
    name: 'Sari Dewi',
    phone: '087855667788',
    age: 28,
    gender: 'female',
    weight: 52,
    ageCategory: 'adult',
    allergies: ['NSAID', 'Sulfonamida'],
    conditions: ['asma'],
    createdAt: '2026-03-15',
    updatedAt: '2026-04-25',
    currentMedications: ['Salbutamol inhaler (PRN)'],
    medicineHistory: [
      { date: '2026-04-25', medicineId: 'MED001', medicineName: 'Paracetamol 500mg', dose: '500mg, 3x sehari', reason: 'Nyeri haid', staffName: 'Dewi' },
      { date: '2026-04-10', medicineId: 'MED007', medicineName: 'Ambroxol 30mg', dose: '30mg, 3x sehari', reason: 'Batuk berdahak', staffName: 'Ani' },
    ],
    notes: [
      { date: '2026-04-25', text: 'Nyeri haid. TIDAK BOLEH NSAID (alergi + asma). Paracetamol saja.', staffName: 'Dewi' },
      { date: '2026-04-10', text: 'Batuk berdahak. Ambroxol aman untuk asma.', staffName: 'Ani' },
    ],
  },
  {
    id: 'CUST005',
    name: 'Hendra Kusuma',
    phone: '081399887766',
    age: 45,
    gender: 'male',
    weight: 82,
    ageCategory: 'adult',
    allergies: ['Penisilin', 'Sefalosporin'],
    conditions: ['ginjal'],
    createdAt: '2026-04-01',
    updatedAt: '2026-04-30',
    currentMedications: ['Irbesartan 150mg', 'Calcium Polystyrene'],
    medicineHistory: [
      { date: '2026-04-30', medicineId: 'MED011', medicineName: 'Azithromycin 500mg', dose: '500mg, 1x sehari (3 hari)', reason: 'Infeksi', staffName: 'Budi' },
      { date: '2026-04-20', medicineId: 'MED001', medicineName: 'Paracetamol 500mg', dose: '500mg, 3x sehari', reason: 'Nyeri', staffName: 'Ani' },
    ],
    notes: [
      { date: '2026-04-30', text: 'Infeksi. Alergi Penisilin + Sefalosporin. Diberi Azithromycin. CKD stage 3.', staffName: 'Budi' },
    ],
  },
  {
    id: 'CUST006',
    name: 'Mega Putri',
    phone: '082177665544',
    age: 25,
    gender: 'female',
    weight: 50,
    ageCategory: 'adult',
    allergies: [],
    conditions: ['menyusui'],
    createdAt: '2026-04-20',
    updatedAt: '2026-05-02',
    medicineHistory: [
      { date: '2026-05-02', medicineId: 'MED001', medicineName: 'Paracetamol 500mg', dose: '500mg, 3x sehari', reason: 'Demam', staffName: 'Ani' },
    ],
    notes: [
      { date: '2026-05-02', text: 'Demam ringan pasca melahirkan. Paracetamol aman untuk busui.', staffName: 'Ani' },
    ],
  },
  {
    id: 'CUST007',
    name: 'Joko Widodo',
    phone: '081200112233',
    age: 70,
    gender: 'male',
    weight: 65,
    ageCategory: 'adult',
    allergies: [],
    conditions: ['hipertensi', 'maag_kronis'],
    createdAt: '2026-02-01',
    updatedAt: '2026-04-28',
    currentMedications: ['Amlodipine 10mg', 'Omeprazole 20mg', 'Sucralfate'],
    medicineHistory: [
      { date: '2026-04-28', medicineId: 'MED009', medicineName: 'Omeprazole 20mg', dose: '20mg, 1x sehari', reason: 'Tukak lambung', staffName: 'Budi' },
      { date: '2026-04-28', medicineId: 'MED001', medicineName: 'Paracetamol 500mg', dose: '500mg, 3x sehari', reason: 'Nyeri sendi', staffName: 'Budi' },
    ],
    notes: [
      { date: '2026-04-28', text: 'Nyeri sendi. TIDAK BOLEH NSAID (tukak lambung aktif). Paracetamol saja.', staffName: 'Budi' },
    ],
  },
  {
    id: 'CUST008',
    name: 'Dian Permata',
    phone: '085633445566',
    age: 3,
    gender: 'female',
    weight: 14,
    ageCategory: 'child',
    allergies: [],
    conditions: [],
    createdAt: '2026-04-28',
    updatedAt: '2026-05-01',
    medicineHistory: [
      { date: '2026-05-01', medicineId: 'MED001C', medicineName: 'Paracetamol Sirup 120mg/5ml', dose: '7ml (168mg), 3x sehari', reason: 'Demam', staffName: 'Ani' },
    ],
    notes: [
      { date: '2026-05-01', text: 'Demam 38.5°C. Paracetamol sirup dosis 7ml. Sesuai BB 14kg.', staffName: 'Ani' },
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
