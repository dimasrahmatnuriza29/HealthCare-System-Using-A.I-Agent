/**
 * DATA DUMMY — Katalog Obat Diperluas dengan flag isPrimary (★)
 * Termasuk beberapa brand berbeda untuk obat yang sama.
 */

export const medicinesExpanded = [
  // --- PARACETAMOL ---
  {
    id: 'MED001',
    name: 'Paracetamol 500mg',
    genericId: 'GEN_PARACETAMOL',
    brand: 'Sanmol',
    dose: '500mg',
    form: 'Tablet',
    category: 'Analgesik',
    isPrimary: true,
    priority: 10,
    indications: ['Demam', 'Sakit kepala', 'Nyeri ringan-sedang'],
    tags: ['demam', 'nyeri', 'sakit kepala'],
  },
  {
    id: 'MED001B',
    name: 'Paracetamol 500mg',
    genericId: 'GEN_PARACETAMOL',
    brand: 'Panadol',
    dose: '500mg',
    form: 'Tablet',
    category: 'Analgesik',
    isPrimary: false,
    priority: 0,
    indications: ['Demam', 'Sakit kepala', 'Nyeri ringan-sedang'],
    tags: ['demam', 'nyeri', 'sakit kepala'],
  },
  {
    id: 'MED001C',
    name: 'Paracetamol Sirup 120mg/5ml',
    genericId: 'GEN_PARACETAMOL',
    brand: 'Tempra',
    dose: '120mg/5ml',
    form: 'Sirup',
    category: 'Analgesik',
    isPrimary: true,
    priority: 9,
    indications: ['Demam anak', 'Nyeri anak'],
    tags: ['demam', 'nyeri', 'anak', 'sirup'],
  },

  // --- IBUPROFEN ---
  {
    id: 'MED002',
    name: 'Ibuprofen 400mg',
    genericId: 'GEN_IBUPROFEN',
    brand: 'Proris',
    dose: '400mg',
    form: 'Tablet',
    category: 'Analgesik',
    isPrimary: false,
    priority: 0,
    indications: ['Nyeri sedang', 'Nyeri haid', 'Radang sendi', 'Demam'],
    tags: ['nyeri', 'radang', 'haid', 'demam'],
  },
  {
    id: 'MED002B',
    name: 'Ibuprofen 200mg',
    genericId: 'GEN_IBUPROFEN',
    brand: 'Brufen',
    dose: '200mg',
    form: 'Tablet',
    category: 'Analgesik',
    isPrimary: false,
    priority: 0,
    indications: ['Nyeri ringan', 'Demam', 'Nyeri haid'],
    tags: ['nyeri', 'demam', 'haid'],
  },

  // --- AMOXICILLIN ---
  {
    id: 'MED003',
    name: 'Amoxicillin 500mg',
    genericId: 'GEN_AMOXICILLIN',
    brand: 'Amoxsan',
    dose: '500mg',
    form: 'Kapsul',
    category: 'Antibiotik',
    isPrimary: true,
    priority: 10,
    indications: ['Infeksi saluran napas', 'Infeksi THT', 'Infeksi saluran kemih', 'Infeksi kulit'],
    tags: ['antibiotik', 'infeksi', 'bakteri'],
  },
  {
    id: 'MED003B',
    name: 'Amoxicillin 500mg',
    genericId: 'GEN_AMOXICILLIN',
    brand: 'Kimoxil',
    dose: '500mg',
    form: 'Kapsul',
    category: 'Antibiotik',
    isPrimary: false,
    priority: 0,
    indications: ['Infeksi saluran napas', 'Infeksi THT', 'Infeksi saluran kemih'],
    tags: ['antibiotik', 'infeksi', 'bakteri'],
  },
  {
    id: 'MED003C',
    name: 'Amoxicillin Sirup 125mg/5ml',
    genericId: 'GEN_AMOXICILLIN',
    brand: 'Amoxsan',
    dose: '125mg/5ml',
    form: 'Sirup',
    category: 'Antibiotik',
    isPrimary: true,
    priority: 8,
    indications: ['Infeksi anak', 'Infeksi THT anak'],
    tags: ['antibiotik', 'infeksi', 'anak', 'sirup'],
  },

  // --- CEFADROXIL ---
  {
    id: 'MED004',
    name: 'Cefadroxil 500mg',
    genericId: 'GEN_CEFADROXIL',
    brand: 'Duricef',
    dose: '500mg',
    form: 'Kapsul',
    category: 'Antibiotik',
    isPrimary: false,
    priority: 0,
    indications: ['Infeksi saluran napas', 'Infeksi kulit', 'Infeksi saluran kemih'],
    tags: ['antibiotik', 'infeksi', 'bakteri'],
  },

  // --- VITAMIN C ---
  {
    id: 'MED005',
    name: 'Vitamin C 500mg',
    genericId: 'GEN_VITAMINC',
    brand: 'Vitacimin',
    dose: '500mg',
    form: 'Tablet hisap',
    category: 'Vitamin',
    isPrimary: true,
    priority: 9,
    indications: ['Suplemen daya tahan tubuh', 'Antioksidan'],
    tags: ['vitamin', 'imun', 'suplemen'],
  },
  {
    id: 'MED005B',
    name: 'Vitamin C 1000mg',
    genericId: 'GEN_VITAMINC',
    brand: 'Enervon-C',
    dose: '1000mg',
    form: 'Tablet effervescent',
    category: 'Vitamin',
    isPrimary: false,
    priority: 0,
    indications: ['Suplemen daya tahan tubuh', 'Recovery sakit'],
    tags: ['vitamin', 'imun', 'suplemen'],
  },

  // --- OBH ---
  {
    id: 'MED006',
    name: 'OBH Combi Sirup',
    genericId: 'GEN_OBH',
    brand: 'OBH Combi',
    dose: '100ml',
    form: 'Sirup',
    category: 'Batuk',
    isPrimary: true,
    priority: 10,
    indications: ['Batuk berdahak', 'Batuk kering', 'Tenggorokan gatal'],
    tags: ['batuk', 'dahak', 'pilek'],
  },
  {
    id: 'MED006B',
    name: 'Woods Antitussive',
    genericId: 'GEN_OBH',
    brand: 'Woods',
    dose: '100ml',
    form: 'Sirup',
    category: 'Batuk',
    isPrimary: false,
    priority: 0,
    indications: ['Batuk kering', 'Batuk malam hari'],
    tags: ['batuk', 'antitusif'],
  },

  // --- AMBROXOL ---
  {
    id: 'MED007',
    name: 'Ambroxol 30mg',
    genericId: 'GEN_AMBROXOL',
    brand: 'Mucosolvan',
    dose: '30mg',
    form: 'Tablet',
    category: 'Batuk',
    isPrimary: false,
    priority: 0,
    indications: ['Batuk berdahak', 'Mengencerkan dahak'],
    tags: ['batuk', 'dahak', 'mukolitik'],
  },

  // --- ANTASIDA ---
  {
    id: 'MED008',
    name: 'Antasida DOEN',
    genericId: 'GEN_ANTASIDA',
    brand: 'Promag',
    dose: '400mg',
    form: 'Tablet kunyah',
    category: 'Lambung',
    isPrimary: true,
    priority: 8,
    indications: ['Maag', 'Kembung', 'Nyeri ulu hati'],
    tags: ['lambung', 'maag', 'asam'],
  },
  {
    id: 'MED008B',
    name: 'Mylanta Sirup',
    genericId: 'GEN_ANTASIDA',
    brand: 'Mylanta',
    dose: '150ml',
    form: 'Sirup',
    category: 'Lambung',
    isPrimary: false,
    priority: 0,
    indications: ['Maag', 'Nyeri ulu hati', 'Kembung'],
    tags: ['lambung', 'maag', 'asam', 'sirup'],
  },

  // --- OMEPRAZOLE ---
  {
    id: 'MED009',
    name: 'Omeprazole 20mg',
    genericId: 'GEN_OMEPRAZOLE',
    brand: 'OMZ',
    dose: '20mg',
    form: 'Kapsul',
    category: 'Lambung',
    isPrimary: false,
    priority: 0,
    indications: ['GERD', 'Tukak lambung', 'Dispepsia kronis'],
    tags: ['lambung', 'GERD', 'tukak', 'PPI'],
  },

  // --- CETIRIZINE ---
  {
    id: 'MED010',
    name: 'Cetirizine 10mg',
    genericId: 'GEN_CETIRIZINE',
    brand: 'Incidal',
    dose: '10mg',
    form: 'Tablet',
    category: 'Antihistamin',
    isPrimary: true,
    priority: 8,
    indications: ['Alergi', 'Rhinitis alergi', 'Urtikaria', 'Gatal-gatal'],
    tags: ['alergi', 'gatal', 'bersin', 'rhinitis'],
  },
  {
    id: 'MED010B',
    name: 'Cetirizine 10mg',
    genericId: 'GEN_CETIRIZINE',
    brand: 'Zyrtec',
    dose: '10mg',
    form: 'Tablet',
    category: 'Antihistamin',
    isPrimary: false,
    priority: 0,
    indications: ['Alergi', 'Rhinitis alergi', 'Urtikaria'],
    tags: ['alergi', 'gatal', 'bersin'],
  },

  // --- AZITHROMYCIN (alternatif utk alergi Penisilin) ---
  {
    id: 'MED011',
    name: 'Azithromycin 500mg',
    genericId: 'GEN_AZITHROMYCIN',
    brand: 'Zithromax',
    dose: '500mg',
    form: 'Tablet',
    category: 'Antibiotik',
    isPrimary: false,
    priority: 0,
    indications: ['Infeksi saluran napas', 'Infeksi THT', 'Infeksi kulit'],
    tags: ['antibiotik', 'infeksi', 'makrolida'],
  },

  // --- GUAIFENESIN ---
  {
    id: 'MED012',
    name: 'Guaifenesin 100mg/5ml',
    genericId: 'GEN_GUAIFENESIN',
    brand: 'Glyceryl Guaiacolate',
    dose: '100mg/5ml',
    form: 'Sirup',
    category: 'Batuk',
    isPrimary: false,
    priority: 0,
    indications: ['Batuk berdahak', 'Mengencerkan dahak'],
    tags: ['batuk', 'dahak', 'ekspektoran'],
  },
];

/**
 * Fungsi helper: dapatkan obat primary berdasarkan indikasi/keluhan
 */
export function getPrimaryByIndication(keyword) {
  return medicinesExpanded.filter(
    (m) => m.isPrimary && (
      m.indications.some((i) => i.toLowerCase().includes(keyword.toLowerCase())) ||
      m.tags.some((t) => t.toLowerCase().includes(keyword.toLowerCase()))
    )
  ).sort((a, b) => b.priority - a.priority);
}

/**
 * Fungsi helper: dapatkan alternatif untuk obat tertentu (generic yang sama)
 */
export function getAlternatives(medicineId) {
  const medicine = medicinesExpanded.find((m) => m.id === medicineId);
  if (!medicine) return [];
  return medicinesExpanded.filter(
    (m) => m.genericId === medicine.genericId && m.id !== medicineId
  );
}
