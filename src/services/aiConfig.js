/**
 * Konfigurasi AI Model — Hugging Face Inference API
 * Model: Qwen/Qwen3-235B-A22B
 *
 * ⚠️ CATATAN KEAMANAN:
 * Token ini TIDAK BOLEH di-hardcode di production.
 * Gunakan environment variable atau backend proxy.
 * Ini hanya untuk prototype/POC.
 */

const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

export const AI_CONFIG = {
  token: import.meta.env.VITE_HF_TOKEN || '',
  model: 'Qwen/Qwen2.5-72B-Instruct',
  // Dev: gunakan proxy Vite. Production: langsung ke HuggingFace (CORS supported)
  url: isDev
    ? '/api/ai/v1/chat/completions'
    : 'https://router.huggingface.co/v1/chat/completions',
  maxTokens: 2048,
  temperature: 0.3, // rendah untuk konsistensi medis
  topP: 0.9,
};
