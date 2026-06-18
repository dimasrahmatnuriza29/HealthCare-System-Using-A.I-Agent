/**
 * DATA DUMMY — Customer Diperluas (dengan history lengkap)
 * Untuk testing skenario AI Safety Check.
 */

export const customersExpanded = [
  {
    id: 'CUST001',
    name: 'Budi Santoso',
    phone: '081234567890',
    age: 7,
    gender: 'Laki-laki',
    weight: 22,
    allergies: ['Penisilin'],
    conditions: [],
    medicineHistory: [
      { date: '2026-04-20', medicineId: 'MED001', name: 'Paracetamol 500mg', status: 'dispensed' },
      { date: '2026-04-05', medicineId: 'MED006', name: 'OBH Combi Sirup', status: 'dispensed' },
      { date: '2026-03-15', medicineId: 'MED005', name: 'Vitamin C 500mg', status: 'dispensed' },
    ],
    notes: [
      { date: '2026-04-20', staff: 'Ani', text: 'Anak susah minum tablet. Preferensi sirup.' },
      { date: '2026-04-05', staff: 'Dewi', text: 'Batuk sudah 4 hari. Diberi OBH Combi.' },
    ],
  },
  {
    id: 'CUST002',
    name: 'Rina Wijaya',
    phone: '081298765432',
    age: 32,
    gender: 'Perempuan',
    weight: 58,
    allergies: ['Aspirin'],
    conditions: ['hamil_trimester_3'],
    medicineHistory: [
      { date: '2026-04-28', medicineId: 'MED001', name: 'Paracetamol 500mg', status: 'dispensed' },
      { date: '2026-04-15', medicineId: 'MED005', name: 'Vitamin C 500mg', status: 'dispensed' },
      { date: '2026-03-20', medicineId: 'MED008', name: 'Antasida DOEN', status: 'dispensed' },
    ],
    notes: [
      { date: '2026-04-28', staff: 'Ani', text: 'Sakit kepala ringan. Diberi Paracetamol. Hamil T3.' },
      { date: '2026-03-20', staff: 'Dewi', text: 'Maag kambuh. Antasida aman untuk bumil.' },
    ],
  },
  {
    id: 'CUST003',
    name: 'Ahmad Fauzi',
    phone: '085711223344',
    age: 55,
    gender: 'Laki-laki',
    weight: 75,
    allergies: [],
    conditions: ['hipertensi', 'diabetes'],
    medicineHistory: [
      { date: '2026-05-01', medicineId: 'MED009', name: 'Omeprazole 20mg', status: 'dispensed' },
      { date: '2026-04-15', medicineId: 'MED001', name: 'Paracetamol 500mg', status: 'dispensed' },
      { date: '2026-04-01', medicineId: 'MED010', name: 'Cetirizine 10mg', status: 'dispensed' },
    ],
    notes: [
      { date: '2026-05-01', staff: 'Budi', text: 'GERD kambuh. Sedang minum Amlodipine & Metformin dari dokter.' },
      { date: '2026-04-01', staff: 'Ani', text: 'Rhinitis alergi. Diberi Cetirizine.' },
    ],
    currentMedications: ['Amlodipine 5mg', 'Metformin 500mg'],
  },
  {
    id: 'CUST004',
    name: 'Sari Dewi',
    phone: '087855667788',
    age: 28,
    gender: 'Perempuan',
    weight: 52,
    allergies: ['NSAID', 'Sulfonamide'],
    conditions: ['asma'],
    medicineHistory: [
      { date: '2026-04-25', medicineId: 'MED001', name: 'Paracetamol 500mg', status: 'dispensed' },
      { date: '2026-04-10', medicineId: 'MED007', name: 'Ambroxol 30mg', status: 'dispensed' },
    ],
    notes: [
      { date: '2026-04-25', staff: 'Dewi', text: 'Nyeri haid. TIDAK BOLEH NSAID (alergi + asma). Paracetamol saja.' },
      { date: '2026-04-10', staff: 'Ani', text: 'Batuk berdahak. Ambroxol aman untuk asma.' },
    ],
    currentMedications: ['Salbutamol inhaler (PRN)'],
  },
  {
    id: 'CUST005',
    name: 'Hendra Kusuma',
    phone: '081399887766',
    age: 45,
    gender: 'Laki-laki',
    weight: 82,
    allergies: ['Penisilin', 'Sefalosporin'],
    conditions: ['gangguan_ginjal'],
    medicineHistory: [
      { date: '2026-04-30', medicineId: 'MED011', name: 'Azithromycin 500mg', status: 'dispensed' },
      { date: '2026-04-20', medicineId: 'MED001', name: 'Paracetamol 500mg', status: 'dispensed' },
    ],
    notes: [
      { date: '2026-04-30', staff: 'Budi', text: 'Infeksi. Alergi Penisilin + Sefalosporin. Diberi Azithromycin (Makrolida). CKD stage 3.' },
    ],
    currentMedications: ['Irbesartan 150mg', 'Calcium Polystyrene'],
  },
  {
    id: 'CUST006',
    name: 'Mega Putri',
    phone: '082177665544',
    age: 25,
    gender: 'Perempuan',
    weight: 50,
    allergies: [],
    conditions: ['menyusui'],
    medicineHistory: [
      { date: '2026-05-02', medicineId: 'MED001', name: 'Paracetamol 500mg', status: 'dispensed' },
    ],
    notes: [
      { date: '2026-05-02', staff: 'Ani', text: 'Demam ringan pasca melahirkan. Paracetamol aman untuk busui.' },
    ],
    currentMedications: [],
  },
  {
    id: 'CUST007',
    name: 'Joko Widodo',
    phone: '081200112233',
    age: 70,
    gender: 'Laki-laki',
    weight: 65,
    allergies: [],
    conditions: ['hipertensi', 'tukak_lambung'],
    medicineHistory: [
      { date: '2026-04-28', medicineId: 'MED009', name: 'Omeprazole 20mg', status: 'dispensed' },
      { date: '2026-04-28', medicineId: 'MED001', name: 'Paracetamol 500mg', status: 'dispensed' },
      { date: '2026-03-10', medicineId: 'MED002', name: 'Ibuprofen 400mg', status: 'rejected', reason: 'Tukak lambung - kontraindikasi' },
    ],
    notes: [
      { date: '2026-04-28', staff: 'Budi', text: 'Nyeri sendi. TIDAK BOLEH NSAID (tukak lambung aktif). Paracetamol saja.' },
      { date: '2026-03-10', staff: 'Dewi', text: 'DITOLAK: Ibuprofen. Riwayat tukak lambung. Dialihkan ke Paracetamol.' },
    ],
    currentMedications: ['Amlodipine 10mg', 'Omeprazole 20mg', 'Sucralfate'],
  },
  {
    id: 'CUST008',
    name: 'Dian Permata',
    phone: '085633445566',
    age: 3,
    gender: 'Perempuan',
    weight: 14,
    allergies: [],
    conditions: [],
    medicineHistory: [
      { date: '2026-05-01', medicineId: 'MED001C', name: 'Paracetamol Sirup 120mg/5ml', status: 'dispensed' },
    ],
    notes: [
      { date: '2026-05-01', staff: 'Ani', text: 'Demam 38.5°C. Paracetamol sirup dosis 7ml (≈168mg). Sesuai BB 14kg.' },
    ],
    currentMedications: [],
  },
];

/**
 * Test Scenarios — ringkasan kasus untuk validasi AI
 */
export const testScenarios = [
  {
    id: 'SCENARIO_1',
    title: 'Customer baru, tahu mau beli apa — obat AMAN',
    customer: 'Customer baru (profil kosong)',
    request: 'Beli Paracetamol 500mg',
    expectedResult: 'SAFE ✅ — Tidak ada kontraindikasi',
  },
  {
    id: 'SCENARIO_2',
    title: 'Customer baru, tahu mau beli apa — obat BERBAHAYA',
    customer: 'CUST002 (Rina, hamil T3, alergi Aspirin)',
    request: 'Beli Ibuprofen 400mg',
    expectedResult: 'DANGER ⛔ — Kontraindikasi kehamilan T3 + cross-react alergi Aspirin',
  },
  {
    id: 'SCENARIO_3',
    title: 'Customer lama + history — obat bertentangan dgn alergi',
    customer: 'CUST001 (Budi, alergi Penisilin)',
    request: 'Beli Amoxicillin 500mg',
    expectedResult: 'DANGER ⛔ — Amoxicillin golongan Penisilin',
  },
  {
    id: 'SCENARIO_4',
    title: 'Customer lama + history — staff rekomendasikan',
    customer: 'CUST004 (Sari, alergi NSAID, asma)',
    request: 'Staff rekomendasikan obat nyeri',
    expectedResult: 'AI rekomendasikan ★ Paracetamol (primary, SAFE). Ibuprofen DILARANG.',
  },
  {
    id: 'SCENARIO_5',
    title: 'Customer multi-alergi butuh antibiotik',
    customer: 'CUST005 (Hendra, alergi Penisilin + Sefalosporin, gangguan ginjal)',
    request: 'Butuh antibiotik untuk infeksi',
    expectedResult: 'Amoxicillin DILARANG, Cefadroxil DILARANG. AI rekomendasikan Azithromycin.',
  },
  {
    id: 'SCENARIO_6',
    title: 'Customer lansia + tukak lambung minta obat nyeri',
    customer: 'CUST007 (Joko, 70thn, hipertensi, tukak lambung)',
    request: 'Nyeri sendi, minta obat',
    expectedResult: 'Ibuprofen DILARANG (tukak lambung). AI rekomendasikan ★ Paracetamol.',
  },
  {
    id: 'SCENARIO_7',
    title: 'Primary product recommendation',
    customer: 'CUST003 (Ahmad, sehat selain hipertensi+diabetes)',
    request: 'Batuk berdahak',
    expectedResult: 'AI rekomendasikan ★ OBH Combi (primary, priority 10) terlebih dahulu.',
  },
];
