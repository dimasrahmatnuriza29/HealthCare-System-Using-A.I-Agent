/**
 * CONTOH PENGGUNAAN AI SERVICE
 * File ini mendemonstrasikan cara memanggil AI untuk 3 skenario.
 * Bisa dijalankan sebagai test atau referensi integrasi ke komponen React.
 */

import { aiSafetyCheck, aiRecommend, aiChat } from './huggingFaceService.js';
import { customersExpanded } from '../data/customersExpanded.js';

// ===========================================================================
// SKENARIO 1: Customer baru, tahu mau beli apa
// ===========================================================================
export async function scenario1_NewCustomerKnowsWhat() {
  // Customer baru tanpa history, mau beli Ibuprofen
  const newCustomer = {
    name: 'Customer Baru',
    age: 28,
    gender: 'Perempuan',
    weight: 55,
    allergies: ['Aspirin'],
    conditions: ['hamil_trimester_3'],
    medicineHistory: [],
    notes: [],
  };

  console.log('=== SKENARIO 1: Customer baru + Hamil T3 + Alergi Aspirin mau beli Ibuprofen ===');
  const result = await aiSafetyCheck(['MED002'], newCustomer, 'JKT001');
  console.log('Hasil:', JSON.stringify(result, null, 2));
  // Expected: DANGER — Ibuprofen kontraindikasi hamil T3 + cross-react Aspirin
  return result;
}

// ===========================================================================
// SKENARIO 2: Customer lama + history, mau beli obat
// ===========================================================================
export async function scenario2_ExistingCustomerBuys() {
  // Budi (7 tahun, alergi Penisilin) mau beli Amoxicillin
  const budi = customersExpanded.find((c) => c.id === 'CUST001');

  console.log('=== SKENARIO 2: Budi (alergi Penisilin) mau beli Amoxicillin ===');
  const result = await aiSafetyCheck(['MED003'], budi, 'JKT001');
  console.log('Hasil:', JSON.stringify(result, null, 2));
  // Expected: DANGER — Amoxicillin golongan Penisilin
  return result;
}

// ===========================================================================
// SKENARIO 3: Customer lama, staff merekomendasikan
// ===========================================================================
export async function scenario3_StaffRecommends() {
  // Ahmad (55 tahun, hipertensi, diabetes) batuk berdahak
  const ahmad = customersExpanded.find((c) => c.id === 'CUST003');

  console.log('=== SKENARIO 3: Ahmad batuk berdahak — staff minta rekomendasi AI ===');
  const result = await aiRecommend('batuk berdahak', ahmad, 'JKT001');
  console.log('Hasil:', JSON.stringify(result, null, 2));
  // Expected: ★ OBH Combi (primary, safe for Ahmad) sebagai rekomendasi utama
  return result;
}

// ===========================================================================
// SKENARIO 4: Multi-obat check
// ===========================================================================
export async function scenario4_MultiDrugCheck() {
  // Sari (alergi NSAID, asma) mau beli Ibuprofen + OBH Combi
  const sari = customersExpanded.find((c) => c.id === 'CUST004');

  console.log('=== SKENARIO 4: Sari (alergi NSAID + asma) mau beli Ibuprofen + OBH ===');
  const result = await aiSafetyCheck(['MED002', 'MED006'], sari, 'JKT001');
  console.log('Hasil:', JSON.stringify(result, null, 2));
  // Expected: DANGER untuk Ibuprofen (alergi NSAID), WARNING untuk OBH (hati-hati asma)
  return result;
}

// ===========================================================================
// SKENARIO 5: Tanya AI (chat bebas)
// ===========================================================================
export async function scenario5_AskAI() {
  const hendra = customersExpanded.find((c) => c.id === 'CUST005');

  console.log('=== SKENARIO 5: Tanya AI — antibiotik apa yang aman untuk alergi Penisilin + Sefalosporin? ===');
  const result = await aiChat(
    'Antibiotik apa yang aman untuk pasien dengan alergi Penisilin DAN Sefalosporin sekaligus?',
    hendra
  );
  console.log('Jawaban AI:', result.answer);
  // Expected: Azithromycin (Makrolida), Ciprofloxacin (Fluoroquinolone), atau Doxycycline (Tetrasiklin)
  return result;
}

// ===========================================================================
// SKENARIO 6: Primary product — obat utama tidak aman
// ===========================================================================
export async function scenario6_PrimaryUnsafe() {
  // Hendra (alergi Penisilin + Sefalosporin) — obat primary Amoxicillin TIDAK AMAN
  const hendra = customersExpanded.find((c) => c.id === 'CUST005');

  console.log('=== SKENARIO 6: Hendra butuh antibiotik — ★ Amoxicillin (primary) TIDAK AMAN ===');
  const result = await aiRecommend('infeksi bakteri', hendra, 'JKT001');
  console.log('Hasil:', JSON.stringify(result, null, 2));
  // Expected: Amoxicillin DITOLAK, Cefadroxil DITOLAK, AI rekomendasikan Azithromycin
  return result;
}

// ===========================================================================
// Jalankan semua skenario (untuk testing)
// ===========================================================================
export async function runAllScenarios() {
  const results = {};
  results.scenario1 = await scenario1_NewCustomerKnowsWhat();
  results.scenario2 = await scenario2_ExistingCustomerBuys();
  results.scenario3 = await scenario3_StaffRecommends();
  results.scenario4 = await scenario4_MultiDrugCheck();
  results.scenario5 = await scenario5_AskAI();
  results.scenario6 = await scenario6_PrimaryUnsafe();
  return results;
}
