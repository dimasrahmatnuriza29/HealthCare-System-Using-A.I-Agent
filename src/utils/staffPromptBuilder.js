import { getAgeCategoryLabel, getConditionLabel } from '../data/customerRecords.js';

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
