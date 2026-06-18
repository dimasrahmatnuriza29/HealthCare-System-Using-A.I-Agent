/**
 * AI Prompt Builder
 * Membangun prompt terstruktur untuk model AI dengan konteks:
 * - Data ISO (kontraindikasi, dosis, peringatan)
 * - Data MIMS (interaksi obat, cross-reactivity)
 * - History customer (obat sebelumnya, catatan staff)
 * - Primary product logic
 */

import { isoMonographs, isoConditionContraindications } from '../data/isoReference.js';
import { mimsCrossReactivity, mimsDrugInteractions, mimsTherapeuticClass } from '../data/mimsReference.js';
import { medicinesExpanded } from '../data/medicinesExpanded.js';
import { branchStockExpanded } from '../data/branchStockExpanded.js';

// ---------------------------------------------------------------------------
// SYSTEM PROMPT — Identitas dan aturan AI
// ---------------------------------------------------------------------------
export const SYSTEM_PROMPT = `Kamu adalah "Apoteker Digital AI" untuk sistem apotek Bukalapak (RakObat/PharmaLocate).

PERAN:
- Memvalidasi keamanan obat berdasarkan profil customer
- Merekomendasikan obat yang aman dan tepat
- Mereferensi ISO (Informasi Spesialite Obat) dan MIMS sebagai sumber kebenaran

ATURAN WAJIB:
1. KESELAMATAN PASIEN adalah prioritas tertinggi. Jangan pernah merekomendasikan obat yang berbahaya.
2. Selalu sertakan referensi ISO/MIMS untuk setiap keputusan.
3. Jika ada obat dengan flag "isPrimary: true" (Obat Utama ★), PRIORITASKAN dalam rekomendasi — TAPI HANYA jika aman untuk customer.
4. Jika obat primary TIDAK AMAN, jelaskan alasannya dan rekomendasikan alternatif.
5. Berikan rekomendasi dosis sesuai usia/berat badan customer.
6. Jawab SELALU dalam Bahasa Indonesia.
7. Format jawaban dalam JSON yang terstruktur.

PRIORITAS REKOMENDASI:
1. Keamanan (ISO/MIMS) — obat HARUS aman
2. Kesesuaian medis — obat harus sesuai indikasi
3. Status Primary (★) — prioritaskan obat utama Bukalapak jika aman
4. Ketersediaan stok
5. Harga terjangkau

FORMAT JAWABAN JSON:
{
  "safetyStatus": "safe|warning|danger",
  "summary": "ringkasan keputusan dalam 1-2 kalimat",
  "checks": [
    {"type": "allergy|contraindication|interaction|dosage|stock", "status": "safe|warning|danger", "message": "...", "ref": "..."}
  ],
  "doseRecommendation": "dosis yang tepat untuk customer ini",
  "primaryRecommendation": {"name": "...", "isPrimary": true/false, "reason": "..."},
  "alternatives": [{"name": "...", "reason": "...", "isPrimary": true/false}],
  "educationPoints": ["poin edukasi 1", "poin edukasi 2"],
  "staffAdvice": "saran untuk staff apotek"
}`;

// ---------------------------------------------------------------------------
// Bangun konteks ISO untuk obat tertentu
// ---------------------------------------------------------------------------
function buildISOContext(medicineIds) {
  const context = [];
  for (const id of medicineIds) {
    const iso = isoMonographs[id];
    if (!iso) continue;
    context.push(`
[ISO: ${iso.genericName}]
- Kelas: ${iso.class}
- Kontraindikasi: ${iso.contraindications.map((c) => `${c.condition} (${c.severity})`).join('; ')}
- Dosis dewasa: ${iso.dosage.adult.standard} (maks: ${iso.dosage.adult.max})
- Dosis anak: ${iso.dosage.child.standard} (maks: ${iso.dosage.child.max})
- Dosis lansia: ${iso.dosage.elderly.standard} (maks: ${iso.dosage.elderly.max})
- Efek samping: ${iso.sideEffects.join(', ')}
- Peringatan: ${iso.warnings.join('; ')}
- Kehamilan: Kategori ${iso.pregnancyCategory} — ${iso.pregnancyNote}
- Laktasi aman: ${iso.lactationSafe ? 'Ya' : 'Tidak'}
- Ref: ${iso.ref}`);
  }
  return context.join('\n');
}

// ---------------------------------------------------------------------------
// Bangun konteks MIMS (interaksi & cross-reactivity)
// ---------------------------------------------------------------------------
function buildMIMSContext(medicineIds, allergies) {
  const context = [];

  // Interaksi obat-obat yang relevan
  const relevantInteractions = mimsDrugInteractions.filter(
    (i) => medicineIds.includes(i.drugA) || medicineIds.includes(i.drugB)
  );
  if (relevantInteractions.length > 0) {
    context.push('\n[MIMS: Interaksi Obat]');
    for (const interaction of relevantInteractions) {
      context.push(`- ${interaction.drugAName} + ${interaction.drugBName}: ${interaction.severity.toUpperCase()} — ${interaction.description} | Rekomendasi: ${interaction.recommendation} | Ref: ${interaction.ref}`);
    }
  }

  // Cross-reactivity yang relevan
  if (allergies && allergies.length > 0) {
    context.push('\n[MIMS: Alergi Silang]');
    for (const group of mimsCrossReactivity) {
      const hasAllergy = group.allergens.some((a) =>
        allergies.some((allergy) => allergy.toLowerCase().includes(a.toLowerCase()))
      );
      if (hasAllergy) {
        context.push(`- Alergi grup ${group.allergyGroup}:`);
        for (const drug of group.crossReactDrugs) {
          context.push(`  * ${drug.drug}: risiko ${drug.risk} (${drug.percent}) — ${drug.note}`);
        }
        context.push(`  * Obat aman: ${group.safeDrugs.join(', ')}`);
        context.push(`  * Ref: ${group.ref}`);
      }
    }
  }

  return context.join('\n');
}

// ---------------------------------------------------------------------------
// Bangun konteks customer (profil + history)
// ---------------------------------------------------------------------------
function buildCustomerContext(customer) {
  const lines = [
    `\n[PROFIL CUSTOMER]`,
    `- Nama: ${customer.name}`,
    `- Usia: ${customer.age} tahun (${getAgeLabel(customer.age)})`,
    `- Jenis Kelamin: ${customer.gender}`,
    `- Berat Badan: ${customer.weight ? customer.weight + ' kg' : 'Tidak diketahui'}`,
    `- Alergi: ${customer.allergies?.length > 0 ? customer.allergies.join(', ') : 'Tidak ada'}`,
    `- Kondisi Medis: ${customer.conditions?.length > 0 ? customer.conditions.map((c) => c.replace(/_/g, ' ')).join(', ') : 'Tidak ada'}`,
    `- Obat Saat Ini: ${customer.currentMedications?.length > 0 ? customer.currentMedications.join(', ') : 'Tidak ada'}`,
  ];

  if (customer.medicineHistory && customer.medicineHistory.length > 0) {
    lines.push(`\n[RIWAYAT OBAT 6 BULAN TERAKHIR]`);
    for (const h of customer.medicineHistory.slice(0, 10)) {
      lines.push(`- ${h.date}: ${h.name} — Status: ${h.status}${h.reason ? ' (' + h.reason + ')' : ''}`);
    }
  }

  if (customer.notes && customer.notes.length > 0) {
    lines.push(`\n[CATATAN STAFF SEBELUMNYA]`);
    for (const n of customer.notes.slice(0, 5)) {
      lines.push(`- ${n.date} (${n.staff}): ${n.text}`);
    }
  }

  return lines.join('\n');
}

// ---------------------------------------------------------------------------
// Bangun konteks stok & primary
// ---------------------------------------------------------------------------
function buildStockContext(medicineIds, branchId) {
  const branch = branchStockExpanded[branchId];
  if (!branch) return '';

  const lines = [`\n[STOK CABANG: ${branch.branchName}]`];
  for (const id of medicineIds) {
    const stock = branch.stock[id];
    const medicine = medicinesExpanded.find((m) => m.id === id);
    if (medicine && stock) {
      const primaryLabel = stock.isPrimary ? ' ★ OBAT UTAMA' : '';
      const status = stock.qty === 0 ? 'HABIS' : stock.qty <= stock.min ? 'MENIPIS' : 'Tersedia';
      lines.push(`- ${medicine.name} (${medicine.brand})${primaryLabel}: Stok ${stock.qty} pcs, Rp${stock.price.toLocaleString('id-ID')}, Status: ${status}`);
    }
  }
  return lines.join('\n');
}

// ---------------------------------------------------------------------------
// PUBLIC: Bangun prompt lengkap untuk Safety Check
// ---------------------------------------------------------------------------
export function buildSafetyCheckPrompt(medicineIds, customer, branchId) {
  const isoContext = buildISOContext(medicineIds);
  const mimsContext = buildMIMSContext(medicineIds, customer.allergies);
  const customerContext = buildCustomerContext(customer);
  const stockContext = buildStockContext(medicineIds, branchId);

  const medicines = medicineIds.map((id) => {
    const m = medicinesExpanded.find((med) => med.id === id);
    return m ? `${m.name} (${m.brand})` : id;
  });

  const userMessage = `EVALUASI KEAMANAN OBAT:

Obat yang diminta/dipilih: ${medicines.join(', ')}

${customerContext}
${isoContext}
${mimsContext}
${stockContext}

TUGAS:
1. Evaluasi keamanan SETIAP obat di atas untuk customer ini.
2. Cek: alergi, kontraindikasi, interaksi obat, kesesuaian dosis berdasarkan usia/BB.
3. Berikan status: SAFE / WARNING / DANGER untuk masing-masing.
4. Jika ada yang tidak aman, jelaskan alasan + referensi ISO/MIMS.
5. Rekomendasikan alternatif yang aman (prioritaskan obat ★ Primary jika aman).
6. Berikan rekomendasi dosis yang tepat.
7. Jawab dalam format JSON sesuai instruksi.`;

  return { systemPrompt: SYSTEM_PROMPT, userMessage };
}

// ---------------------------------------------------------------------------
// PUBLIC: Bangun prompt untuk Rekomendasi Obat (Skenario 3)
// ---------------------------------------------------------------------------
export function buildRecommendationPrompt(complaint, customer, branchId) {
  const customerContext = buildCustomerContext(customer);

  // Cari obat yang relevan berdasarkan keluhan
  const relevantMeds = medicinesExpanded.filter((m) =>
    m.indications.some((i) => i.toLowerCase().includes(complaint.toLowerCase())) ||
    m.tags.some((t) => complaint.toLowerCase().includes(t))
  );
  const relevantIds = relevantMeds.map((m) => m.id);
  const isoContext = buildISOContext(relevantIds);
  const mimsContext = buildMIMSContext(relevantIds, customer.allergies);
  const stockContext = buildStockContext(relevantIds, branchId);

  // Info therapeutic class
  const classInfo = Object.entries(mimsTherapeuticClass)
    .filter(([key]) => complaint.toLowerCase().includes(key.replace(/_/g, ' ')) ||
      key.split('_').some((w) => complaint.toLowerCase().includes(w)))
    .map(([key, val]) => `- ${key}: First-line: ${val.firstLine.join(',')}, Notes: ${val.notes}`)
    .join('\n');

  const userMessage = `REKOMENDASIKAN OBAT:

Keluhan customer: "${complaint}"

${customerContext}

[TERAPI BERDASARKAN MIMS]
${classInfo || 'Tidak ditemukan klasifikasi terapi spesifik.'}

${isoContext}
${mimsContext}
${stockContext}

TUGAS:
1. Berdasarkan keluhan dan profil customer, rekomendasikan obat yang PALING TEPAT dan AMAN.
2. PRIORITASKAN obat dengan flag ★ OBAT UTAMA (isPrimary: true) jika aman.
3. Jika obat utama TIDAK AMAN untuk customer ini, jelaskan alasannya dan rekomendasikan alternatif.
4. Berikan dosis yang tepat sesuai usia/BB customer.
5. Sertakan referensi ISO/MIMS.
6. Jawab dalam format JSON sesuai instruksi.`;

  return { systemPrompt: SYSTEM_PROMPT, userMessage };
}

// ---------------------------------------------------------------------------
// PUBLIC: Bangun prompt untuk Chat Assistant (Konsultasi Keluhan Customer)
// ---------------------------------------------------------------------------
export const CHAT_ASSISTANT_SYSTEM_PROMPT = `Kamu adalah "Asisten Apoteker AI" untuk apotek Bukalapak (RakObat/PharmaLocate).

PERAN:
- Kamu membantu STAFF apotek dalam melayani customer.
- Staff akan menginput keluh kesah / gejala yang dialami customer.
- Kamu menganalisis keluhan tersebut dan memberikan rekomendasi obat yang AMAN dan TEPAT.
- Kamu BUKAN menggantikan dokter, tapi membantu staff memberikan rekomendasi OTC (obat bebas).

SUMBER PENGETAHUAN:
- ISO (Informasi Spesialite Obat Indonesia)
- MIMS (Monthly Index of Medical Specialities)
- Riwayat pembelian obat customer sebelumnya
- Catatan staff sebelumnya tentang customer ini

ATURAN WAJIB:
1. KESELAMATAN PASIEN adalah prioritas TERTINGGI — jangan pernah rekomendasikan obat berbahaya.
2. Selalu pertimbangkan alergi, kondisi medis, dan riwayat obat customer.
3. Berikan dosis yang sesuai usia/berat badan customer.
4. Jawab SELALU dalam Bahasa Indonesia.
5. Jawab dengan gaya percakapan yang ramah tapi profesional.
6. Jika keluhan serius / butuh resep dokter, SARANKAN ke dokter.
7. Jangan pernah merekomendasikan obat keras tanpa resep dokter.

STRATEGI REKOMENDASI OBAT — PRIORITAS OBAT UTAMA (★):
Kamu WAJIB mengikuti logika berikut secara berurutan:

LANGKAH 1: Cari obat dengan status ★ OBAT UTAMA yang sesuai indikasi keluhan customer.
- Jika ADA obat utama yang AMAN dan stoknya TERSEDIA → REKOMENDASIKAN obat utama tersebut sebagai pilihan PERTAMA dan UTAMA.
- Jelaskan bahwa obat ini adalah ★ Obat Utama apotek dan merupakan pilihan terbaik.

LANGKAH 2: Jika obat utama STOKNYA HABIS atau MENIPIS:
- TETAP sebutkan bahwa obat utama idealnya adalah pilihan pertama, tapi stoknya sedang habis/menipis.
- Lalu rekomendasikan obat ALTERNATIF (non-primary) sebagai pengganti sementara.
- Tandai dengan jelas: "★ [Nama Obat Utama] (Stok Habis) → Alternatif: [Nama Obat Pengganti]"

LANGKAH 3: Jika TIDAK ADA obat utama yang sesuai indikasi:
- Rekomendasikan obat terbaik yang tersedia berdasarkan ISO/MIMS.
- Jelaskan bahwa tidak ada obat utama untuk keluhan ini, sehingga diberikan obat alternatif.

LANGKAH 4: Di blok REKOMENDASI_OBAT:
- SELALU tempatkan obat ★ UTAMA di urutan PERTAMA (jika ada dan stok tersedia).
- Obat alternatif/non-primary di urutan SETELAHNYA.
- Jika obat utama habis, tetap cantumkan di blok tapi tambahkan keterangan "(STOK HABIS)".

TUJUAN: Meningkatkan penjualan Obat Utama (★) apotek, TANPA mengorbankan keselamatan pasien.

WAJIB TAMPILKAN REFERENSI ISO & MIMS:
Kamu HARUS SELALU menyertakan referensi ISO dan MIMS secara EKSPLISIT di setiap jawaban. Gunakan format berikut:

📋 Referensi ISO:
- Sebutkan data ISO yang relevan: kelas obat, kontraindikasi, kategori kehamilan, dosis, efek samping, peringatan.
- Contoh: "(ISO: Paracetamol — Kategori B untuk kehamilan, dosis dewasa 500mg 3-4x/hari, maks 4g/hari)"

💊 Referensi MIMS:
- Sebutkan data MIMS yang relevan: interaksi obat, alergi silang (cross-reactivity), kelas terapi.
- Contoh: "(MIMS: Tidak ada interaksi major. Cross-reactivity Aspirin-NSAID: risiko tinggi pada pasien alergi Aspirin)"

Jika ada kontraindikasi atau peringatan khusus untuk customer ini, WAJIB sebutkan dengan jelas beserta sumbernya (ISO/MIMS).
Jika TIDAK ada kontraindikasi, tetap tulis: "Berdasarkan ISO/MIMS: Tidak ditemukan kontraindikasi untuk customer ini."

FORMAT JAWABAN:
- Jawab informatif (5-12 kalimat) dalam format teks biasa.
- WAJIB sertakan bagian "📋 Referensi ISO:" dan "💊 Referensi MIMS:" di setiap jawaban.
- Jika merekomendasikan obat, sebutkan nama, dosis, dan alasannya berdasarkan ISO/MIMS.
- Tandai obat Primary dengan ★ jika ada.
- PENTING: Di akhir jawaban, WAJIB tambahkan blok rekomendasi obat dengan format PERSIS seperti ini:

---REKOMENDASI_OBAT---
[ID_OBAT] | [Nama Obat (Brand)] | [Dosis yang disarankan] | [Alasan singkat]
---END_REKOMENDASI---

Contoh (obat utama tersedia):
---REKOMENDASI_OBAT---
MED001 | Paracetamol 500mg (Sanmol) | 500mg, 3x sehari | ★ Obat Utama — pilihan pertama untuk demam
MED001B | Paracetamol 500mg (Panadol) | 500mg, 3x sehari | Alternatif jika Sanmol tidak cocok
---END_REKOMENDASI---

Contoh (obat utama habis):
---REKOMENDASI_OBAT---
MED001 | Paracetamol 500mg (Sanmol) | 500mg, 3x sehari | ★ Obat Utama (STOK HABIS)
MED001B | Paracetamol 500mg (Panadol) | 500mg, 3x sehari | Pengganti karena ★ Obat Utama habis
---END_REKOMENDASI---

ATURAN BLOK REKOMENDASI:
- Gunakan ID obat yang PERSIS sesuai data apotek yang diberikan.
- Obat ★ UTAMA SELALU di urutan pertama, meskipun stoknya habis.
- Jika TIDAK ada obat yang direkomendasikan, TETAP tulis blok kosong:

---REKOMENDASI_OBAT---
---END_REKOMENDASI---`;

export function buildChatAssistantPrompt(customer, branchId) {
  const customerContext = buildCustomerContext(customer);

  // Gunakan SEMUA medicine IDs — agar AI punya konteks ISO/MIMS lengkap
  const allMedIds = medicinesExpanded.map((m) => m.id);

  const isoContext = buildISOContext(allMedIds);
  const mimsContext = buildMIMSContext(allMedIds, customer.allergies);
  const stockContext = buildStockContext(allMedIds, branchId);

  // Pisahkan obat Primary dan Non-Primary agar AI jelas prioritasnya
  const primaryMeds = medicinesExpanded.filter((m) => m.isPrimary);
  const nonPrimaryMeds = medicinesExpanded.filter((m) => !m.isPrimary);

  const formatMed = (m) => `- [${m.id}] ${m.name} (${m.brand}) — ${m.dose}, ${m.form} — Indikasi: ${m.indications.join(', ')}`;

  const primaryList = primaryMeds.map((m) => formatMed(m)).join('\n');
  const nonPrimaryList = nonPrimaryMeds.map((m) => formatMed(m)).join('\n');

  const contextBlock = `${customerContext}

[★ OBAT UTAMA APOTEK — PRIORITAS REKOMENDASI]
Obat-obat berikut adalah Obat Utama (Primary) apotek. WAJIB rekomendasikan terlebih dahulu jika sesuai indikasi dan aman.
${primaryList}

[OBAT ALTERNATIF — GUNAKAN JIKA OBAT UTAMA TIDAK TERSEDIA/TIDAK AMAN]
${nonPrimaryList}

${isoContext}
${mimsContext}
${stockContext}`;

  return { systemPrompt: CHAT_ASSISTANT_SYSTEM_PROMPT, contextBlock };
}

// ---------------------------------------------------------------------------
// Helper
// ---------------------------------------------------------------------------
function getAgeLabel(age) {
  if (age <= 1) return 'bayi';
  if (age <= 5) return 'balita';
  if (age <= 12) return 'anak';
  if (age <= 17) return 'remaja';
  if (age <= 59) return 'dewasa';
  return 'lansia';
}
