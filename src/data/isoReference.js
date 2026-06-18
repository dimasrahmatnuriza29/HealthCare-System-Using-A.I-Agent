/**
 * DATA DUMMY — ISO (Informasi Spesialite Obat)
 * Panduan referensi obat resmi Indonesia oleh ISFI.
 */

export const isoMonographs = {
  MED001: {
    id: 'MED001', genericName: 'Paracetamol',
    brandNames: ['Panadol', 'Sanmol', 'Tempra', 'Biogesic'],
    class: 'Analgesik-Antipiretik',
    contraindications: [
      { condition: 'Hipersensitivitas terhadap paracetamol', severity: 'absolut' },
      { condition: 'Gangguan hati berat (Child-Pugh C)', severity: 'absolut' },
      { condition: 'Defisiensi G6PD berat', severity: 'relatif' },
    ],
    dosage: {
      adult: { standard: '500-1000mg tiap 4-6 jam', max: '4000mg/hari' },
      child: { standard: '10-15 mg/kgBB tiap 4-6 jam', max: '60mg/kgBB/hari' },
      elderly: { standard: '500mg tiap 4-6 jam', max: '3000mg/hari' },
    },
    sideEffects: ['Mual ringan', 'Ruam kulit', 'Hepatotoksisitas (overdosis)'],
    warnings: ['Hepatotoksik >4g/hari', 'Hati-hati peminum alkohol kronis', 'Cek paracetamol di obat lain'],
    pregnancyCategory: 'B', pregnancyNote: 'Aman semua trimester',
    lactationSafe: true,
    ref: 'ISO Ed.54, Analgesik, hal.112-115',
  },
  MED002: {
    id: 'MED002', genericName: 'Ibuprofen',
    brandNames: ['Brufen', 'Proris', 'Advil'],
    class: 'NSAID',
    contraindications: [
      { condition: 'Alergi NSAID/Aspirin', severity: 'absolut' },
      { condition: 'Tukak lambung aktif', severity: 'absolut' },
      { condition: 'Kehamilan trimester 3', severity: 'absolut' },
      { condition: 'Gangguan ginjal berat', severity: 'absolut' },
      { condition: 'Gagal jantung berat', severity: 'absolut' },
    ],
    dosage: {
      adult: { standard: '200-400mg tiap 4-6 jam sesudah makan', max: '1200mg/hari' },
      child: { standard: '5-10 mg/kgBB tiap 6-8 jam', max: '40mg/kgBB/hari' },
      elderly: { standard: '200mg tiap 6-8 jam', max: '1200mg/hari' },
    },
    sideEffects: ['Nyeri lambung', 'Mual', 'Pusing', 'Perdarahan GI', 'Gagal ginjal akut'],
    warnings: ['Risiko kardiovaskular jangka panjang', 'Risiko GI usia >60', 'Perburuk asma', 'T3: penutupan duktus arteriosus'],
    pregnancyCategory: 'D', pregnancyNote: 'T1-2 hati-hati. T3 KONTRAINDIKASI.',
    lactationSafe: true,
    ref: 'ISO Ed.54, NSAID, hal.98-103',
  },
  MED003: {
    id: 'MED003', genericName: 'Amoxicillin',
    brandNames: ['Amoxsan', 'Kimoxil', 'Ospamox'],
    class: 'Antibiotik Penisilin',
    contraindications: [
      { condition: 'Alergi Penisilin / beta-laktam', severity: 'absolut' },
      { condition: 'Riwayat anafilaksis Penisilin', severity: 'absolut' },
      { condition: 'Mononukleosis (risiko ruam)', severity: 'relatif' },
    ],
    dosage: {
      adult: { standard: '500mg tiap 8 jam', max: '3000mg/hari' },
      child: { standard: '25-50 mg/kgBB/hari dibagi 3', max: '100mg/kgBB/hari' },
      elderly: { standard: '500mg tiap 8 jam', max: '2000mg/hari' },
    },
    sideEffects: ['Diare', 'Mual', 'Ruam', 'Anafilaksis', 'Kolitis pseudomembran'],
    warnings: ['Tanya alergi Penisilin SEBELUM pemberian', 'Cross-react Sefalosporin 1-10%', 'Habiskan sesuai durasi resep'],
    pregnancyCategory: 'B', pregnancyNote: 'Aman pada kehamilan.',
    lactationSafe: true,
    ref: 'ISO Ed.54, Antibiotik Penisilin, hal.45-49',
  },
  MED004: {
    id: 'MED004', genericName: 'Cefadroxil',
    brandNames: ['Duricef', 'Cefat', 'Lapicef'],
    class: 'Antibiotik Sefalosporin Gen.1',
    contraindications: [
      { condition: 'Alergi Sefalosporin', severity: 'absolut' },
      { condition: 'Riwayat anafilaksis Penisilin', severity: 'absolut' },
      { condition: 'Alergi Penisilin (cross-react 1-10%)', severity: 'relatif' },
    ],
    dosage: {
      adult: { standard: '500mg-1g tiap 12 jam', max: '2000mg/hari' },
      child: { standard: '25-50 mg/kgBB/hari dibagi 2', max: '50mg/kgBB/hari' },
      elderly: { standard: '500mg tiap 12 jam', max: '1000mg/hari' },
    },
    sideEffects: ['Diare', 'Mual', 'Ruam', 'Anafilaksis', 'Nefrotoksisitas'],
    warnings: ['Cross-react alergi Penisilin 1-10%', 'Sesuaikan dosis gangguan ginjal'],
    pregnancyCategory: 'B', pregnancyNote: 'Aman pada kehamilan.',
    lactationSafe: true,
    ref: 'ISO Ed.54, Sefalosporin, hal.52-55',
  },
  MED005: {
    id: 'MED005', genericName: 'Vitamin C',
    brandNames: ['Vitacimin', 'Enervon-C', 'Holisticare'],
    class: 'Vitamin',
    contraindications: [
      { condition: 'Riwayat batu ginjal oksalat (dosis tinggi)', severity: 'relatif' },
      { condition: 'Hemokromatosis', severity: 'relatif' },
    ],
    dosage: {
      adult: { standard: '500-1000mg/hari', max: '2000mg/hari' },
      child: { standard: '25-75mg/hari (1-8thn), 250mg (9-13thn)', max: '650mg/hari' },
      elderly: { standard: '500mg/hari', max: '2000mg/hari' },
    },
    sideEffects: ['Mual (dosis tinggi)', 'Batu ginjal (>2g/hari kronis)'],
    warnings: ['Dosis >2g/hari risiko batu ginjal', 'Hati-hati diabetes (ganggu tes glukosa)'],
    pregnancyCategory: 'A', pregnancyNote: 'Aman dosis biasa.',
    lactationSafe: true,
    ref: 'ISO Ed.54, Vitamin, hal.320-322',
  },
  MED006: {
    id: 'MED006', genericName: 'OBH Kombinasi',
    brandNames: ['OBH Combi', 'OBH Nellco', 'Woods'],
    class: 'Antitusif-Ekspektoran',
    contraindications: [
      { condition: 'Bayi <2 tahun', severity: 'absolut' },
      { condition: 'Penggunaan bersamaan MAO inhibitor', severity: 'absolut' },
    ],
    dosage: {
      adult: { standard: '15ml tiap 8 jam', max: '45ml/hari' },
      child: { standard: '5ml tiap 8 jam (6-12thn)', max: '15ml/hari' },
      elderly: { standard: '10ml tiap 8 jam', max: '30ml/hari' },
    },
    sideEffects: ['Mengantuk', 'Mual', 'Mulut kering', 'Depresi napas (overdosis)'],
    warnings: ['Menyebabkan kantuk', 'Tidak untuk bayi <2thn', 'Hati-hati asma'],
    pregnancyCategory: 'C', pregnancyNote: 'Hanya jika manfaat > risiko.',
    lactationSafe: false,
    ref: 'ISO Ed.54, Antitusif, hal.78-80',
  },
  MED007: {
    id: 'MED007', genericName: 'Ambroxol',
    brandNames: ['Mucosolvan', 'Mucera'],
    class: 'Mukolitik',
    contraindications: [
      { condition: 'Hipersensitivitas ambroxol', severity: 'absolut' },
      { condition: 'Tukak lambung aktif', severity: 'relatif' },
    ],
    dosage: {
      adult: { standard: '30mg tiap 8-12 jam', max: '120mg/hari' },
      child: { standard: '7.5-15mg tiap 8-12 jam', max: '45mg/hari' },
      elderly: { standard: '30mg tiap 12 jam', max: '60mg/hari' },
    },
    sideEffects: ['Mual', 'Diare ringan', 'Gangguan rasa'],
    warnings: ['Minum sesudah makan', 'Perbanyak cairan'],
    pregnancyCategory: 'C', pregnancyNote: 'Hindari T1. Hati-hati T2-3.',
    lactationSafe: true,
    ref: 'ISO Ed.54, Mukolitik, hal.82-83',
  },
  MED008: {
    id: 'MED008', genericName: 'Antasida (Al+Mg)',
    brandNames: ['Mylanta', 'Promag', 'Polysilane'],
    class: 'Antasida',
    contraindications: [
      { condition: 'Gagal ginjal berat (akumulasi Mg/Al)', severity: 'relatif' },
    ],
    dosage: {
      adult: { standard: '1-2 tab kunyah 3-4x/hari', max: '8 tab/hari' },
      child: { standard: '0.5-1 tab 3x/hari (>6thn)', max: '3 tab/hari' },
      elderly: { standard: '1 tab 3x/hari', max: '6 tab/hari' },
    },
    sideEffects: ['Konstipasi (Al)', 'Diare (Mg)', 'Hipermagnesemia (gagal ginjal)'],
    warnings: ['Kurangi absorpsi obat lain — jarak 2 jam', 'Jangan jangka panjang'],
    pregnancyCategory: 'B', pregnancyNote: 'Aman dosis biasa.',
    lactationSafe: true,
    ref: 'ISO Ed.54, Antasida, hal.155-157',
  },
  MED009: {
    id: 'MED009', genericName: 'Omeprazole',
    brandNames: ['Losec', 'OMZ', 'Norsec'],
    class: 'Proton Pump Inhibitor (PPI)',
    contraindications: [
      { condition: 'Hipersensitivitas PPI', severity: 'absolut' },
      { condition: 'Penggunaan bersamaan Nelfinavir', severity: 'absolut' },
    ],
    dosage: {
      adult: { standard: '20mg 1x/hari sebelum makan', max: '40mg/hari' },
      child: { standard: '0.5-1mg/kgBB/hari (>1thn)', max: '20mg/hari' },
      elderly: { standard: '20mg 1x/hari', max: '20mg/hari' },
    },
    sideEffects: ['Sakit kepala', 'Mual', 'Diare', 'Defisiensi Mg (jangka panjang)', 'Fraktur'],
    warnings: ['Jangka panjang >1thn: risiko def Mg & B12', 'Ganggu absorpsi Clopidogrel'],
    pregnancyCategory: 'C', pregnancyNote: 'Hanya jika diperlukan.',
    lactationSafe: false,
    ref: 'ISO Ed.54, PPI, hal.160-163',
  },
  MED010: {
    id: 'MED010', genericName: 'Cetirizine',
    brandNames: ['Zyrtec', 'Incidal', 'Ozen'],
    class: 'Antihistamin Generasi 2',
    contraindications: [
      { condition: 'Hipersensitivitas cetirizine/hydroxyzine', severity: 'absolut' },
      { condition: 'Gangguan ginjal berat tanpa penyesuaian', severity: 'relatif' },
    ],
    dosage: {
      adult: { standard: '10mg 1x/hari', max: '10mg/hari' },
      child: { standard: '2.5mg 1-2x/hari (2-5thn), 5-10mg (6-12thn)', max: '10mg/hari' },
      elderly: { standard: '5mg 1x/hari', max: '5mg/hari' },
    },
    sideEffects: ['Mengantuk ringan', 'Mulut kering', 'Sakit kepala', 'Fatigue'],
    warnings: ['Dapat menyebabkan kantuk ringan', 'Sesuaikan dosis gangguan ginjal'],
    pregnancyCategory: 'B', pregnancyNote: 'Relatif aman. Antihistamin pilihan pada kehamilan.',
    lactationSafe: false,
    ref: 'ISO Ed.54, Antihistamin, hal.88-90',
  },
};

// ---------------------------------------------------------------------------
// Kontraindikasi berdasarkan kondisi medis (cross-reference)
// ---------------------------------------------------------------------------
export const isoConditionContraindications = {
  'hamil_trimester_1': {
    forbidden: [],
    caution: ['MED006', 'MED007', 'MED009'],
    safe: ['MED001', 'MED003', 'MED004', 'MED005', 'MED008', 'MED010'],
  },
  'hamil_trimester_2': {
    forbidden: [],
    caution: ['MED002', 'MED006', 'MED007', 'MED009'],
    safe: ['MED001', 'MED003', 'MED004', 'MED005', 'MED008', 'MED010'],
  },
  'hamil_trimester_3': {
    forbidden: ['MED002'],
    caution: ['MED006', 'MED007', 'MED009'],
    safe: ['MED001', 'MED003', 'MED004', 'MED005', 'MED008', 'MED010'],
  },
  'menyusui': {
    forbidden: [],
    caution: ['MED006', 'MED009', 'MED010'],
    safe: ['MED001', 'MED002', 'MED003', 'MED004', 'MED005', 'MED007', 'MED008'],
  },
  'gangguan_ginjal': {
    forbidden: ['MED002'],
    caution: ['MED004', 'MED008', 'MED009', 'MED010'],
    safe: ['MED001', 'MED003', 'MED005', 'MED006', 'MED007'],
  },
  'gangguan_hati': {
    forbidden: ['MED001'],
    caution: ['MED002', 'MED009'],
    safe: ['MED003', 'MED004', 'MED005', 'MED006', 'MED007', 'MED008', 'MED010'],
  },
  'tukak_lambung': {
    forbidden: ['MED002'],
    caution: ['MED007'],
    safe: ['MED001', 'MED003', 'MED004', 'MED005', 'MED008', 'MED009', 'MED010'],
  },
  'asma': {
    forbidden: [],
    caution: ['MED002', 'MED006'],
    safe: ['MED001', 'MED003', 'MED004', 'MED005', 'MED007', 'MED008', 'MED009', 'MED010'],
  },
  'diabetes': {
    forbidden: [],
    caution: ['MED005'],
    safe: ['MED001', 'MED002', 'MED003', 'MED004', 'MED006', 'MED007', 'MED008', 'MED009', 'MED010'],
  },
  'hipertensi': {
    forbidden: [],
    caution: ['MED002', 'MED008'],
    safe: ['MED001', 'MED003', 'MED004', 'MED005', 'MED006', 'MED007', 'MED009', 'MED010'],
  },
};

// Alias mapping — menyesuaikan key customerRecords dengan key ISO
// Berguna agar lookup tetap berhasil meskipun key di customer berbeda
isoConditionContraindications['hamil_t1'] = isoConditionContraindications['hamil_trimester_1'];
isoConditionContraindications['hamil_t2'] = isoConditionContraindications['hamil_trimester_2'];
isoConditionContraindications['hamil_t3'] = isoConditionContraindications['hamil_trimester_3'];
isoConditionContraindications['ginjal'] = isoConditionContraindications['gangguan_ginjal'];
isoConditionContraindications['hati'] = isoConditionContraindications['gangguan_hati'];
isoConditionContraindications['maag_kronis'] = isoConditionContraindications['tukak_lambung'];
isoConditionContraindications['jantung'] = { forbidden: ['MED002'], caution: ['MED006'], safe: ['MED001', 'MED003', 'MED004', 'MED005', 'MED007', 'MED008', 'MED009', 'MED010'] };

// ---------------------------------------------------------------------------
// Kategori kehamilan FDA (referensi ISO)
// ---------------------------------------------------------------------------
export const pregnancyCategoryExplanation = {
  A: 'Studi terkontrol tidak menunjukkan risiko pada janin.',
  B: 'Studi hewan tidak menunjukkan risiko, belum ada studi terkontrol pada manusia; atau studi hewan menunjukkan efek samping tapi tidak dikonfirmasi pada manusia.',
  C: 'Studi hewan menunjukkan efek samping pada janin. Gunakan hanya jika manfaat > risiko.',
  D: 'Ada bukti risiko pada janin manusia. Gunakan hanya pada kondisi mengancam jiwa.',
  X: 'Studi menunjukkan abnormalitas janin. KONTRAINDIKASI pada kehamilan.',
};
