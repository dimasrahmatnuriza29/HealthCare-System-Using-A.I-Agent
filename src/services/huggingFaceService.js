/**
 * Hugging Face Inference API Service
 * Model: Qwen/Qwen3-235B-A22B
 *
 * Service ini menghubungkan frontend ke AI model via HF Router.
 * AI "belajar" dari ISO/MIMS/history melalui konteks yang dikirim di prompt.
 */

import { AI_CONFIG } from './aiConfig.js';
import { buildSafetyCheckPrompt, buildRecommendationPrompt, buildChatAssistantPrompt } from './aiPromptBuilder.js';

// ---------------------------------------------------------------------------
// Core: Panggil Hugging Face API
// ---------------------------------------------------------------------------
async function callHuggingFace(systemPrompt, userMessage) {
  const response = await fetch(AI_CONFIG.url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${AI_CONFIG.token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: AI_CONFIG.model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
      ],
      max_tokens: AI_CONFIG.maxTokens,
      temperature: AI_CONFIG.temperature,
      top_p: AI_CONFIG.topP,
      stream: false,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HF API Error ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content || '';

  // Parse JSON dari response AI
  return parseAIResponse(content);
}

// ---------------------------------------------------------------------------
// Parse response AI (extract JSON dari text)
// ---------------------------------------------------------------------------
function parseAIResponse(content) {
  try {
    // Coba parse langsung
    return JSON.parse(content);
  } catch {
    // Coba extract JSON dari dalam markdown code block
    const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[1].trim());
      } catch {
        // fallback
      }
    }

    // Coba cari JSON object dalam text
    const braceMatch = content.match(/\{[\s\S]*\}/);
    if (braceMatch) {
      try {
        return JSON.parse(braceMatch[0]);
      } catch {
        // fallback
      }
    }

    // Jika gagal parse, return raw text
    return {
      safetyStatus: 'warning',
      summary: 'AI response tidak dapat diparse. Silakan konsultasi apoteker.',
      rawResponse: content,
      checks: [],
      alternatives: [],
    };
  }
}

// ---------------------------------------------------------------------------
// PUBLIC API: Safety Check — evaluasi obat untuk customer
// ---------------------------------------------------------------------------
/**
 * Evaluasi keamanan obat menggunakan AI
 * @param {string[]} medicineIds - Array ID obat yang dipilih
 * @param {object} customer - Profil customer (allergies, conditions, history, dll)
 * @param {string} branchId - ID cabang aktif
 * @returns {Promise<object>} Hasil evaluasi AI dalam format JSON
 *
 * Contoh:
 *   const result = await aiSafetyCheck(['MED002'], customerRina, 'JKT001');
 *   // result.safetyStatus === 'danger'
 *   // result.checks[0].message === 'Kontraindikasi kehamilan T3...'
 */
export async function aiSafetyCheck(medicineIds, customer, branchId) {
  const { systemPrompt, userMessage } = buildSafetyCheckPrompt(
    medicineIds, customer, branchId
  );

  try {
    const result = await callHuggingFace(systemPrompt, userMessage);
    return {
      success: true,
      source: 'ai',
      model: AI_CONFIG.model,
      ...result,
    };
  } catch (error) {
    console.error('[AI Safety Check Error]', error);
    return {
      success: false,
      source: 'fallback',
      error: error.message,
      safetyStatus: 'warning',
      summary: 'AI tidak tersedia. Menggunakan rule-based fallback.',
      checks: [],
      alternatives: [],
    };
  }
}

// ---------------------------------------------------------------------------
// PUBLIC API: Recommend — rekomendasikan obat berdasarkan keluhan
// ---------------------------------------------------------------------------
/**
 * Minta AI merekomendasikan obat berdasarkan keluhan customer
 * @param {string} complaint - Keluhan customer (misal: "batuk berdahak 3 hari")
 * @param {object} customer - Profil customer
 * @param {string} branchId - ID cabang aktif
 * @returns {Promise<object>} Rekomendasi AI
 *
 * Contoh:
 *   const result = await aiRecommend('batuk berdahak', customerAhmad, 'JKT001');
 *   // result.primaryRecommendation.name === 'OBH Combi Sirup'
 *   // result.primaryRecommendation.isPrimary === true
 */
export async function aiRecommend(complaint, customer, branchId) {
  const { systemPrompt, userMessage } = buildRecommendationPrompt(
    complaint, customer, branchId
  );

  try {
    const result = await callHuggingFace(systemPrompt, userMessage);
    return {
      success: true,
      source: 'ai',
      model: AI_CONFIG.model,
      ...result,
    };
  } catch (error) {
    console.error('[AI Recommend Error]', error);
    return {
      success: false,
      source: 'fallback',
      error: error.message,
      summary: 'AI tidak tersedia. Silakan pilih obat secara manual.',
      primaryRecommendation: null,
      alternatives: [],
    };
  }
}

// ---------------------------------------------------------------------------
// PUBLIC API: Chat — tanya jawab bebas tentang obat
// ---------------------------------------------------------------------------
/**
 * Tanya jawab bebas dengan AI tentang obat/farmasi
 * @param {string} question - Pertanyaan staff
 * @param {object} customer - Profil customer (opsional)
 * @returns {Promise<object>} Jawaban AI
 */
export async function aiChat(question, customer = null) {
  const systemPrompt = `Kamu adalah Apoteker Digital AI Bukalapak. Jawab pertanyaan tentang obat-obatan dengan akurat berdasarkan ISO/MIMS Indonesia. Jawab dalam Bahasa Indonesia, singkat dan jelas.`;

  let userMessage = question;
  if (customer) {
    userMessage += `\n\nKonteks customer: ${customer.name}, ${customer.age} tahun, Alergi: ${customer.allergies?.join(', ') || 'tidak ada'}, Kondisi: ${customer.conditions?.join(', ') || 'tidak ada'}`;
  }

  try {
    const response = await fetch(AI_CONFIG.url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${AI_CONFIG.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: AI_CONFIG.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage },
        ],
        max_tokens: 1024,
        temperature: 0.4,
      }),
    });

    if (!response.ok) throw new Error(`HF API Error ${response.status}`);

    const data = await response.json();
    return {
      success: true,
      answer: data.choices?.[0]?.message?.content || 'Tidak ada jawaban.',
    };
  } catch (error) {
    return {
      success: false,
      answer: 'AI tidak tersedia saat ini. Silakan konsultasi langsung dengan apoteker.',
      error: error.message,
    };
  }
}

// ---------------------------------------------------------------------------
// PUBLIC API: Chat Assistant — konsultasi keluhan customer (multi-turn)
// ---------------------------------------------------------------------------
/**
 * Chat assistant multi-turn untuk konsultasi keluhan customer.
 * AI mempelajari: history customer, ISO, MIMS, stok obat.
 * @param {Array<{role: string, content: string}>} chatHistory - Riwayat percakapan [{role:'user'|'assistant', content:'...'}]
 * @param {string} newMessage - Pesan baru dari staff
 * @param {object} customer - Profil customer aktif
 * @param {string} branchId - ID cabang aktif
 * @returns {Promise<object>} { success, answer, model }
 */
export async function aiChatAssistant(chatHistory, newMessage, customer, branchId) {
  const { systemPrompt, contextBlock } = buildChatAssistantPrompt(customer, branchId);

  // Bangun messages array dengan konteks penuh
  const messages = [
    { role: 'system', content: systemPrompt },
    // Inject konteks customer + ISO + MIMS sebagai pesan sistem tambahan
    { role: 'system', content: `KONTEKS DATA CUSTOMER & APOTEK:\n${contextBlock}` },
  ];

  // Tambahkan history percakapan sebelumnya (max 20 pesan terakhir)
  const recentHistory = chatHistory.slice(-20);
  for (const msg of recentHistory) {
    messages.push({ role: msg.role, content: msg.content });
  }

  // Tambahkan pesan baru dari staff
  messages.push({ role: 'user', content: newMessage });

  try {
    const response = await fetch(AI_CONFIG.url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${AI_CONFIG.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: AI_CONFIG.model,
        messages,
        max_tokens: AI_CONFIG.maxTokens,
        temperature: 0.4,
        top_p: AI_CONFIG.topP,
        stream: false,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HF API Error ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    const answer = data.choices?.[0]?.message?.content || 'Tidak ada jawaban.';

    return {
      success: true,
      answer,
      model: AI_CONFIG.model,
    };
  } catch (error) {
    console.error('[AI Chat Assistant Error]', error);
    return {
      success: false,
      answer: 'AI tidak tersedia saat ini. Silakan konsultasi langsung dengan apoteker.',
      error: error.message,
    };
  }
}

// ---------------------------------------------------------------------------
// PUBLIC API: Cek koneksi ke HF
// ---------------------------------------------------------------------------
export async function testConnection() {
  try {
    const response = await fetch(AI_CONFIG.url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${AI_CONFIG.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: AI_CONFIG.model,
        messages: [{ role: 'user', content: 'Halo, test koneksi. Jawab: OK' }],
        max_tokens: 10,
      }),
    });
    return { connected: response.ok, status: response.status };
  } catch (error) {
    return { connected: false, error: error.message };
  }
}
