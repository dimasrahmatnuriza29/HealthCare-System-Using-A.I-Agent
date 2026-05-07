import { getAgeCategoryLabel, getConditionLabel } from '../data/customerRecords.js';

const childDoseRecommendations = {
  MED001: 'Anak 7 tahun: 10-15 mg/kgBB per dosis setiap 4-6 jam, maksimal 4 kali sehari. Dengan catatan berat 22kg, estimasi 220-330mg per dosis.',
  MED002: 'Anak 7 tahun: 5-10 mg/kgBB setiap 6-8 jam, maksimal 30 mg/kgBB/hari. Hindari jika ada alergi Aspirin/NSAID.',
  MED003: '25-50 mg/kgBB/hari dibagi 3 dosis. Tidak direkomendasikan jika ada alergi Penisilin.',
  MED004: '30 mg/kgBB/hari dibagi 2 dosis. Perlu kehati-hatian bila ada alergi Penisilin atau Sefalosporin.',
  MED005: '100-250mg per hari sesudah makan, sesuaikan kebutuhan.',
  MED006: '5-10ml, 3 kali sehari, ikuti aturan pakai pada label.',
  MED007: 'Setengah tablet, 3 kali sehari, gunakan sesuai arahan apoteker.',
  MED008: 'Setengah sampai 1 tablet kunyah sebelum makan atau saat gejala muncul.',
  MED009: 'Penggunaan anak perlu arahan dokter. Jangan jadikan pilihan rutin tanpa konsultasi.',
  MED010: '5mg sekali sehari untuk usia 6 tahun ke atas.',
};

const adultDoseRecommendations = {
  MED001: '500-1000mg setiap 4-6 jam, maksimal 4000mg per hari.',
  MED002: '200-400mg setiap 4-6 jam, maksimal 1200mg per hari untuk penggunaan OTC.',
  MED003: '500mg setiap 8 jam selama 5-7 hari atau sesuai resep dokter.',
  MED004: '500mg setiap 12 jam atau 1g sekali sehari sesuai indikasi.',
  MED005: '500-1000mg per hari sesudah makan.',
  MED006: '15ml, 3 kali sehari.',
  MED007: '1 tablet 8mg, 3 kali sehari.',
  MED008: '1-2 tablet kunyah, 3-4 kali sehari sebelum makan atau saat gejala.',
  MED009: '20mg sekali sehari sebelum sarapan selama 4-8 minggu sesuai indikasi.',
  MED010: '10mg sekali sehari.',
};

const severityRank = {
  safe: 0,
  warning: 1,
  danger: 2,
};

function strongestStatus(current, next) {
  return severityRank[next] > severityRank[current] ? next : current;
}

function hasAllergy(customer, allergyName) {
  return customer.allergies.some((allergy) => allergy.toLowerCase() === allergyName.toLowerCase());
}

function hasCondition(customer, conditionKey) {
  return customer.conditions.includes(conditionKey);
}

function getDoseRecommendation(customer, medicine, safetyStatus) {
  if (safetyStatus === 'danger') {
    return {
      dose: 'Tidak direkomendasikan untuk customer ini.',
      category: getAgeCategoryLabel(customer.ageCategory),
      maxDaily: '-',
      notes: 'Cari alternatif aman atau rujuk ke dokter/apoteker penanggung jawab.',
    };
  }

  const doseMap = customer.ageCategory === 'child' ? childDoseRecommendations : adultDoseRecommendations;
  return {
    dose: doseMap[medicine.id] ?? 'Ikuti aturan pakai pada label dan konsultasikan jika ada kondisi khusus.',
    category: `${getAgeCategoryLabel(customer.ageCategory)} (${customer.age} tahun)`,
    maxDaily: medicine.id === 'MED001' && customer.ageCategory === 'child' ? 'Maksimal 60 mg/kgBB/hari' : 'Ikuti batas aman pada label.',
    notes: 'Rekomendasi dummy untuk prototype, bukan pengganti penilaian klinis.',
  };
}

function summarizePreviousNotes(customer, medicine) {
  const noteText = customer.notes.map((note) => `${note.date}: ${note.text}`).join(' | ');
  if (!noteText) return 'Tidak ada catatan staff sebelumnya.';

  if (customer.ageCategory === 'child' && medicine.id === 'MED001' && /sirup|tablet/i.test(noteText)) {
    return `${noteText}. Pertimbangkan bentuk sirup karena customer sulit minum tablet.`;
  }

  return noteText;
}

/**
 * Builds the prompt preview used by the rule-based staff safety advisor.
 *
 * @param {{ customer: object, medicine: object, inventoryItem?: object }} input - Safety prompt input.
 * @returns {string} Prompt text for staff safety context.
 */
export function buildStaffSafetyPrompt({ customer, medicine, inventoryItem }) {
  if (!customer || !medicine) {
    return '';
  }

  const allergies = customer.allergies.length ? customer.allergies.join(', ') : 'Tidak ada alergi tercatat';
  const conditions = customer.conditions.length
    ? customer.conditions.map(getConditionLabel).join(', ')
    : 'Tidak ada kondisi khusus tercatat';
  const history = customer.medicineHistory
    .map((item) => `${item.date}: ${item.medicineName}, ${item.dose}, ${item.reason}`)
    .join('\n');
  const notes = customer.notes.map((note) => `${note.date}: ${note.text} - ${note.staffName}`).join('\n');

  return [
    'Anda adalah AI Safety Advisor untuk staff apotek.',
    'Analisis keamanan obat berdasarkan profil customer, alergi, kondisi khusus, riwayat obat, dan catatan staff.',
    '',
    '[A] PROFIL CUSTOMER',
    `Nama: ${customer.name}`,
    `Usia: ${customer.age} tahun (${getAgeCategoryLabel(customer.ageCategory)})`,
    `Gender: ${customer.gender}`,
    `Alergi: ${allergies}`,
    `Kondisi khusus: ${conditions}`,
    '',
    '[B] OBAT YANG DIPILIH',
    `ID: ${medicine.id}`,
    `Nama: ${medicine.name}`,
    `Dosis/Bentuk: ${medicine.dose} / ${medicine.form}`,
    `Kategori: ${medicine.category}`,
    `Indikasi: ${medicine.indications.join(', ')}`,
    `Lokasi: Storage ${inventoryItem?.storage ?? '-'}, Kolom ${inventoryItem?.kolom ?? '-'}, Rak ${inventoryItem?.rak ?? '-'}`,
    `Stok: ${inventoryItem?.stock ?? 0}`,
    '',
    '[C] RIWAYAT OBAT CUSTOMER',
    history || 'Tidak ada riwayat obat tercatat',
    '',
    '[D] CATATAN STAFF',
    notes || 'Tidak ada catatan staff',
    '',
    '[E] FORMAT OUTPUT JSON',
    'Gunakan field: safetyStatus, doseRecommendation, allergyCheck, interactionCheck, contraindicationCheck, previousNotes, suggestion.',
  ].join('\n');
}

/**
 * Evaluates customer and medicine data with the rule-based safety advisor.
 *
 * @param {object} customer - Active customer profile.
 * @param {object} medicine - Selected medicine metadata.
 * @param {object} [inventoryItem={}] - Inventory/location row for the medicine.
 * @returns {object | null} Safety advisory result, or null when input is incomplete.
 */
export function evaluateSafetyAdvisor(customer, medicine, inventoryItem = {}) {
  if (!customer || !medicine) {
    return null;
  }

  let safetyStatus = 'safe';
  let allergyCheck = {
    status: 'safe',
    message: 'Tidak ada konflik langsung dengan alergi yang tercatat.',
  };
  let interactionCheck = {
    status: 'safe',
    message: 'Tidak ada interaksi mayor terdeteksi dari riwayat obat demo.',
  };
  let contraindicationCheck = {
    status: 'safe',
    message: 'Tidak ada kontraindikasi dari profil customer demo.',
  };
  let suggestion = 'Berikan edukasi aturan pakai dan konfirmasi ulang alergi sebelum obat diserahkan.';

  if (medicine.id === 'MED003' && hasAllergy(customer, 'Penisilin')) {
    allergyCheck = {
      status: 'danger',
      message: 'Amoxicillin termasuk golongan Penisilin, sedangkan customer tercatat alergi Penisilin.',
    };
    suggestion = 'Jangan diberikan. Sarankan konsultasi dokter untuk alternatif non-penisilin.';
    safetyStatus = strongestStatus(safetyStatus, 'danger');
  }

  if (medicine.id === 'MED004' && hasAllergy(customer, 'Penisilin')) {
    allergyCheck = {
      status: 'warning',
      message: 'Cefadroxil adalah Sefalosporin. Ada risiko reaksi silang pada sebagian pasien alergi Penisilin.',
    };
    suggestion = 'Konfirmasi tingkat reaksi alergi dan konsultasikan sebelum diberikan.';
    safetyStatus = strongestStatus(safetyStatus, 'warning');
  }

  if (medicine.id === 'MED004' && hasAllergy(customer, 'Sefalosporin')) {
    allergyCheck = {
      status: 'danger',
      message: 'Customer tercatat alergi Sefalosporin, sedangkan Cefadroxil termasuk Sefalosporin.',
    };
    suggestion = 'Jangan diberikan. Pilih alternatif sesuai arahan dokter.';
    safetyStatus = strongestStatus(safetyStatus, 'danger');
  }

  if (medicine.id === 'MED002' && (hasAllergy(customer, 'Aspirin') || hasAllergy(customer, 'NSAID'))) {
    allergyCheck = {
      status: hasAllergy(customer, 'NSAID') ? 'danger' : 'warning',
      message: 'Ibuprofen termasuk NSAID. Perlu kehati-hatian pada customer dengan alergi Aspirin/NSAID.',
    };
    suggestion = 'Pertimbangkan Paracetamol sebagai alternatif jika tidak ada kontraindikasi.';
    safetyStatus = strongestStatus(safetyStatus, allergyCheck.status);
  }

  if (medicine.id === 'MED001' && hasAllergy(customer, 'Paracetamol')) {
    allergyCheck = {
      status: 'danger',
      message: 'Customer tercatat alergi Paracetamol.',
    };
    suggestion = 'Jangan diberikan. Gunakan alternatif sesuai arahan dokter.';
    safetyStatus = strongestStatus(safetyStatus, 'danger');
  }

  if (medicine.id === 'MED002' && hasCondition(customer, 'hamil_t3')) {
    contraindicationCheck = {
      status: 'danger',
      message: 'Ibuprofen tidak direkomendasikan untuk kehamilan trimester 3 karena risiko pada janin dan persalinan.',
    };
    suggestion = 'Jangan diberikan. Alternatif demo: Paracetamol 500mg di Storage A, Kolom 1, Rak 2.';
    safetyStatus = strongestStatus(safetyStatus, 'danger');
  }

  const activeHistoryNames = customer.medicineHistory.map((item) => item.medicineName).join(', ');
  if (medicine.id === 'MED001' && /Amoxicillin/i.test(activeHistoryNames)) {
    interactionCheck = {
      status: 'safe',
      message: 'Riwayat Amoxicillin tidak menunjukkan interaksi negatif mayor dengan Paracetamol dalam data demo.',
    };
  }

  if (inventoryItem.stock === 0) {
    suggestion = 'Obat habis di cabang aktif. Cari cabang lain atau tawarkan alternatif sesuai arahan apoteker.';
  }

  const previousNotes = summarizePreviousNotes(customer, medicine);
  if (safetyStatus === 'safe' && medicine.id === 'MED001' && /sirup/i.test(previousNotes)) {
    suggestion = 'Paracetamol aman untuk profil demo Budi. Pertimbangkan sediaan sirup karena catatan preferensi pasien.';
  }

  return {
    safetyStatus,
    statusLabel: safetyStatus === 'safe' ? 'Safe' : safetyStatus === 'warning' ? 'Warning' : 'Danger',
    summary:
      safetyStatus === 'safe'
        ? `${medicine.name} aman diberikan untuk ${customer.name} berdasarkan data demo.`
        : safetyStatus === 'warning'
          ? `${medicine.name} perlu kehati-hatian untuk ${customer.name}.`
          : `${medicine.name} tidak aman untuk ${customer.name} berdasarkan data demo.`,
    doseRecommendation: getDoseRecommendation(customer, medicine, safetyStatus),
    allergyCheck,
    interactionCheck,
    contraindicationCheck,
    previousNotes,
    suggestion,
    promptPreview: buildStaffSafetyPrompt({ customer, medicine, inventoryItem }),
    customerContext: {
      name: customer.name,
      age: customer.age,
      ageCategory: getAgeCategoryLabel(customer.ageCategory),
      allergies: customer.allergies,
      conditions: customer.conditions.map(getConditionLabel),
    },
  };
}
