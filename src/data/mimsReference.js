/**
 * DATA DUMMY — MIMS (Monthly Index of Medical Specialities)
 * Database referensi obat internasional (termasuk Indonesia).
 * Fokus: interaksi obat-obat, kategori kehamilan detail, farmakologi.
 */

// ---------------------------------------------------------------------------
// Interaksi Obat-Obat (Drug-Drug Interactions) — MIMS
// ---------------------------------------------------------------------------
export const mimsDrugInteractions = [
  {
    drugA: 'MED001', drugAName: 'Paracetamol',
    drugB: 'MED002', drugBName: 'Ibuprofen',
    severity: 'minor',
    description: 'Dapat digunakan bersamaan. Kombinasi umum untuk nyeri sedang.',
    recommendation: 'Aman dikombinasikan. Jangan melebihi dosis masing-masing.',
    ref: 'MIMS Drug Interactions, Analgesics Section',
  },
  {
    drugA: 'MED002', drugAName: 'Ibuprofen',
    drugB: 'MED009', drugBName: 'Omeprazole',
    severity: 'minor',
    description: 'Omeprazole sering diberikan bersama NSAID untuk melindungi lambung.',
    recommendation: 'Kombinasi baik — PPI melindungi mukosa lambung dari efek NSAID.',
    ref: 'MIMS Drug Interactions, NSAID-PPI Section',
  },
  {
    drugA: 'MED002', drugAName: 'Ibuprofen',
    drugB: 'WARFARIN', drugBName: 'Warfarin',
    severity: 'major',
    description: 'NSAID meningkatkan risiko perdarahan saat digunakan bersama antikoagulan.',
    recommendation: 'HINDARI kombinasi. Jika harus, monitor INR ketat. Pertimbangkan Paracetamol.',
    ref: 'MIMS Drug Interactions, Anticoagulant-NSAID, hal.45',
  },
  {
    drugA: 'MED003', drugAName: 'Amoxicillin',
    drugB: 'METHOTREXATE', drugBName: 'Methotrexate',
    severity: 'major',
    description: 'Amoxicillin dapat mengurangi ekskresi renal Methotrexate, meningkatkan toksisitas.',
    recommendation: 'Monitor kadar Methotrexate. Pertimbangkan antibiotik lain.',
    ref: 'MIMS Drug Interactions, Penicillin-Antimetabolite',
  },
  {
    drugA: 'MED003', drugAName: 'Amoxicillin',
    drugB: 'KONTRASEPSI_ORAL', drugBName: 'Kontrasepsi Oral',
    severity: 'moderate',
    description: 'Antibiotik dapat mengurangi efektivitas kontrasepsi oral.',
    recommendation: 'Gunakan kontrasepsi tambahan (kondom) selama & 7 hari setelah antibiotik.',
    ref: 'MIMS Drug Interactions, Antibiotics-OC',
  },
  {
    drugA: 'MED004', drugAName: 'Cefadroxil',
    drugB: 'PROBENECID', drugBName: 'Probenecid',
    severity: 'moderate',
    description: 'Probenecid meningkatkan kadar Sefalosporin dalam darah dengan menghambat sekresi tubular.',
    recommendation: 'Monitor efek samping. Kurangi dosis Cefadroxil jika perlu.',
    ref: 'MIMS Drug Interactions, Cephalosporin-Probenecid',
  },
  {
    drugA: 'MED006', drugAName: 'OBH Kombinasi',
    drugB: 'SSRI', drugBName: 'SSRI (Fluoxetine, Sertraline)',
    severity: 'major',
    description: 'Komponen DXM dalam OBH + SSRI dapat menyebabkan Sindrom Serotonin.',
    recommendation: 'KONTRAINDIKASI. Jangan kombinasikan. Risiko sindrom serotonin fatal.',
    ref: 'MIMS Drug Interactions, DXM-Serotonergic',
  },
  {
    drugA: 'MED006', drugAName: 'OBH Kombinasi',
    drugB: 'MAO_INHIBITOR', drugBName: 'MAO Inhibitor',
    severity: 'contraindicated',
    description: 'Kombinasi DXM + MAOI menyebabkan krisis hipertensi dan sindrom serotonin.',
    recommendation: 'KONTRAINDIKASI ABSOLUT. Jangan gunakan bersamaan. Jarak minimal 14 hari.',
    ref: 'MIMS Drug Interactions, DXM-MAOI, hal.78',
  },
  {
    drugA: 'MED008', drugAName: 'Antasida',
    drugB: 'MED003', drugBName: 'Amoxicillin',
    severity: 'minor',
    description: 'Antasida dapat sedikit mengurangi absorpsi Amoxicillin.',
    recommendation: 'Beri jarak minum minimal 2 jam.',
    ref: 'MIMS Drug Interactions, Antacid-Antibiotics',
  },
  {
    drugA: 'MED008', drugAName: 'Antasida',
    drugB: 'MED010', drugBName: 'Cetirizine',
    severity: 'minor',
    description: 'Antasida dapat sedikit mengurangi absorpsi Cetirizine.',
    recommendation: 'Beri jarak 2 jam. Efek klinis minimal.',
    ref: 'MIMS Drug Interactions, Antacid-Antihistamine',
  },
  {
    drugA: 'MED009', drugAName: 'Omeprazole',
    drugB: 'CLOPIDOGREL', drugBName: 'Clopidogrel',
    severity: 'major',
    description: 'Omeprazole menghambat CYP2C19, mengurangi aktivasi Clopidogrel hingga 50%.',
    recommendation: 'HINDARI kombinasi. Gunakan Pantoprazole sebagai alternatif PPI.',
    ref: 'MIMS Drug Interactions, PPI-Clopidogrel, hal.92',
  },
  {
    drugA: 'MED009', drugAName: 'Omeprazole',
    drugB: 'MED004', drugBName: 'Cefadroxil',
    severity: 'minor',
    description: 'PPI dapat sedikit mengurangi absorpsi Sefalosporin oral.',
    recommendation: 'Efek klinis minimal. Tidak perlu penyesuaian.',
    ref: 'MIMS Drug Interactions, PPI-Cephalosporin',
  },
  {
    drugA: 'MED010', drugAName: 'Cetirizine',
    drugB: 'ALKOHOL', drugBName: 'Alkohol',
    severity: 'moderate',
    description: 'Alkohol meningkatkan efek sedasi Cetirizine.',
    recommendation: 'Hindari alkohol selama mengonsumsi Cetirizine.',
    ref: 'MIMS Drug Interactions, Antihistamine-Alcohol',
  },
];

// ---------------------------------------------------------------------------
// Alergi Silang (Cross-Reactivity) — MIMS
// ---------------------------------------------------------------------------
export const mimsCrossReactivity = [
  {
    allergyGroup: 'Penisilin',
    allergens: ['Penisilin', 'Penicillin', 'Amoxicillin', 'Ampicillin'],
    crossReactDrugs: [
      { drugId: 'MED003', drug: 'Amoxicillin', risk: 'high', percent: '100%', note: 'Golongan sama — DILARANG' },
      { drugId: 'MED004', drug: 'Cefadroxil', risk: 'moderate', percent: '1-10%', note: 'Sefalosporin gen.1 — cross-react mungkin' },
    ],
    safeDrugs: ['Azithromycin', 'Ciprofloxacin', 'Doxycycline'],
    ref: 'MIMS Allergy Cross-Reactivity, Beta-Lactam Section',
  },
  {
    allergyGroup: 'Aspirin',
    allergens: ['Aspirin', 'Asam Asetilsalisilat', 'ASA'],
    crossReactDrugs: [
      { drugId: 'MED002', drug: 'Ibuprofen', risk: 'high', percent: '~100%', note: 'Sesama NSAID — cross-react tinggi' },
    ],
    safeDrugs: ['Paracetamol', 'Tramadol'],
    ref: 'MIMS Allergy Cross-Reactivity, NSAID Section',
  },
  {
    allergyGroup: 'NSAID',
    allergens: ['NSAID', 'Ibuprofen', 'Diklofenak', 'Naproxen', 'Meloxicam'],
    crossReactDrugs: [
      { drugId: 'MED002', drug: 'Ibuprofen', risk: 'high', percent: '~100%', note: 'Sesama golongan NSAID' },
    ],
    safeDrugs: ['Paracetamol', 'Tramadol', 'Kodein'],
    ref: 'MIMS Allergy Cross-Reactivity, NSAID Section',
  },
  {
    allergyGroup: 'Sulfonamide',
    allergens: ['Sulfa', 'Sulfametoksazol', 'Kotrimoksazol'],
    crossReactDrugs: [],
    safeDrugs: ['Amoxicillin', 'Cefadroxil', 'Azithromycin', 'Paracetamol'],
    ref: 'MIMS Allergy Cross-Reactivity, Sulfonamide Section',
  },
  {
    allergyGroup: 'Sefalosporin',
    allergens: ['Sefalosporin', 'Cephalosporin', 'Cefadroxil', 'Cefixime'],
    crossReactDrugs: [
      { drugId: 'MED004', drug: 'Cefadroxil', risk: 'high', percent: '100%', note: 'Golongan sama' },
      { drugId: 'MED003', drug: 'Amoxicillin', risk: 'low', percent: '1-2%', note: 'Cross-react rendah ke Penisilin' },
    ],
    safeDrugs: ['Azithromycin', 'Ciprofloxacin', 'Doxycycline'],
    ref: 'MIMS Allergy Cross-Reactivity, Beta-Lactam Section',
  },
];

// ---------------------------------------------------------------------------
// Kategori Khusus Pasien — Rekomendasi MIMS
// ---------------------------------------------------------------------------
export const mimsSpecialPopulations = {
  pediatric: {
    ageGroups: [
      { label: 'Neonatus', range: '0-28 hari', notes: 'Dosis sangat rendah. Hanya obat esensial.' },
      { label: 'Bayi', range: '1-12 bulan', notes: 'Gunakan sediaan drops/sirup. Hitung dosis per kgBB.' },
      { label: 'Balita', range: '1-5 tahun', notes: 'Sediaan sirup. Perhatikan rasa untuk compliance.' },
      { label: 'Anak', range: '6-12 tahun', notes: 'Sirup atau tablet kunyah. Mulai transisi tablet.' },
      { label: 'Remaja', range: '13-17 tahun', notes: 'Dosis mendekati dewasa. Pertimbangkan berat badan.' },
    ],
    generalRules: [
      'SELALU hitung dosis berdasarkan berat badan (mg/kgBB)',
      'Jangan gunakan sediaan dewasa yang dibelah — dosis tidak akurat',
      'Perhatikan kandungan alkohol/gula dalam sirup',
      'Antibiotik: habiskan sesuai durasi meskipun sudah membaik',
    ],
    ref: 'MIMS Pediatric Dosing Guidelines',
  },
  geriatric: {
    generalRules: [
      'Start low, go slow — mulai dosis rendah, naikkan perlahan',
      'Fungsi ginjal & hati menurun — sesuaikan dosis',
      'Risiko interaksi obat tinggi (polifarmasi)',
      'Perhatikan risiko jatuh pada obat yang menyebabkan pusing/kantuk',
      'Monitor efek samping lebih ketat',
    ],
    highRiskDrugs: ['NSAID', 'Benzodiazepine', 'Antikolinergik', 'Opioid'],
    ref: 'MIMS Geriatric Prescribing Guidelines',
  },
  pregnancy: {
    trimester1: {
      notes: 'Periode organogenesis — paling rentan. Hindari obat kecuali esensial.',
      safeDrugs: ['MED001', 'MED003', 'MED005', 'MED008'],
      cautionDrugs: ['MED006', 'MED007', 'MED009', 'MED010'],
      forbiddenDrugs: [],
    },
    trimester2: {
      notes: 'Relatif lebih aman. Tetap gunakan dosis terendah efektif.',
      safeDrugs: ['MED001', 'MED003', 'MED004', 'MED005', 'MED008', 'MED010'],
      cautionDrugs: ['MED002', 'MED006', 'MED007', 'MED009'],
      forbiddenDrugs: [],
    },
    trimester3: {
      notes: 'Perhatikan efek pada persalinan dan neonatus.',
      safeDrugs: ['MED001', 'MED003', 'MED004', 'MED005', 'MED008', 'MED010'],
      cautionDrugs: ['MED006', 'MED007', 'MED009'],
      forbiddenDrugs: ['MED002'],
    },
    ref: 'MIMS Prescribing in Pregnancy, FDA Categories',
  },
};

// ---------------------------------------------------------------------------
// Klasifikasi Terapi (untuk rekomendasi AI)
// ---------------------------------------------------------------------------
export const mimsTherapeuticClass = {
  'nyeri_ringan': {
    firstLine: ['MED001'],
    secondLine: ['MED002'],
    notes: 'Paracetamol pilihan pertama. NSAID jika Paracetamol tidak cukup.',
  },
  'nyeri_sedang': {
    firstLine: ['MED001', 'MED002'],
    secondLine: [],
    notes: 'Kombinasi Paracetamol + Ibuprofen. Jika tidak cukup, rujuk dokter.',
  },
  'demam': {
    firstLine: ['MED001'],
    secondLine: ['MED002'],
    notes: 'Paracetamol pilihan utama. Ibuprofen jika Paracetamol gagal.',
  },
  'infeksi_bakteri': {
    firstLine: ['MED003'],
    secondLine: ['MED004'],
    notes: 'Amoxicillin lini pertama. Cefadroxil jika resisten/intoleran.',
  },
  'batuk_berdahak': {
    firstLine: ['MED007'],
    secondLine: ['MED006'],
    notes: 'Ambroxol mukolitik. OBH jika butuh antitusif juga.',
  },
  'batuk_kering': {
    firstLine: ['MED006'],
    secondLine: [],
    notes: 'OBH mengandung antitusif untuk menekan refleks batuk.',
  },
  'maag_asam_lambung': {
    firstLine: ['MED008'],
    secondLine: ['MED009'],
    notes: 'Antasida untuk relief cepat. PPI jika kronis/berulang.',
  },
  'alergi_rhinitis': {
    firstLine: ['MED010'],
    secondLine: [],
    notes: 'Cetirizine antihistamin gen.2 non-sedatif.',
  },
  'daya_tahan_tubuh': {
    firstLine: ['MED005'],
    secondLine: [],
    notes: 'Vitamin C sebagai suplemen imunitas.',
  },
};

// ---------------------------------------------------------------------------
// Fungsi helper: cari interaksi antara 2 obat
// ---------------------------------------------------------------------------
export function checkDrugInteraction(drugIdA, drugIdB) {
  return mimsDrugInteractions.filter(
    (i) =>
      (i.drugA === drugIdA && i.drugB === drugIdB) ||
      (i.drugA === drugIdB && i.drugB === drugIdA)
  );
}

// ---------------------------------------------------------------------------
// Fungsi helper: cari cross-reactivity berdasarkan alergi
// ---------------------------------------------------------------------------
export function checkAllergyRisk(allergyName, drugId) {
  for (const group of mimsCrossReactivity) {
    const allergyMatch = group.allergens.some(
      (a) => a.toLowerCase() === allergyName.toLowerCase()
    );
    if (allergyMatch) {
      const crossDrug = group.crossReactDrugs.find((d) => d.drugId === drugId);
      if (crossDrug) return { ...crossDrug, allergyGroup: group.allergyGroup, ref: group.ref };
    }
  }
  return null;
}
