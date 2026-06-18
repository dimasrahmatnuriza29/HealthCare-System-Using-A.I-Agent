import { useState, useRef, useEffect, useMemo } from 'react';
import { aiChatAssistant } from '../../services/huggingFaceService.js';
import { ChatBubbleIcon, CheckIcon, CloseIcon, MicrophoneIcon, PlusIcon, SendIcon, SparklesIcon, TrashIcon } from '../ui/Icons.jsx';
import { useSpeechToText } from '../../hooks/useSpeechToText.js';
import { formatRupiah } from './dispensingUtils.js';

const QUICK_PROMPTS = [
  'Customer mengeluh sakit kepala sudah 2 hari',
  'Batuk berdahak dan pilek',
  'Nyeri sendi dan otot',
  'Demam tinggi pada anak',
  'Maag kambuh, perut perih',
  'Alergi kulit, gatal-gatal',
];

function formatTimestamp() {
  return new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
}

// ---------------------------------------------------------------------------
// Parse AI response: extract REKOMENDASI_OBAT block + clean display text
// ---------------------------------------------------------------------------
function parseAiResponse(rawAnswer) {
  const rekomRegex = /---REKOMENDASI_OBAT---([\s\S]*?)---END_REKOMENDASI---/;
  const match = rawAnswer.match(rekomRegex);

  // Clean display text (remove the structured block)
  let displayText = rawAnswer.replace(rekomRegex, '').trim();
  // Also remove any trailing dashes or whitespace
  displayText = displayText.replace(/\n{3,}/g, '\n\n').trim();

  const recommendations = [];
  if (match && match[1]) {
    const lines = match[1].trim().split('\n').filter((l) => l.trim());
    for (const line of lines) {
      const parts = line.split('|').map((p) => p.trim());
      if (parts.length >= 2) {
        recommendations.push({
          id: parts[0] || '',
          name: parts[1] || '',
          dose: parts[2] || '',
          reason: parts[3] || '',
        });
      }
    }
  }

  return { displayText, recommendations };
}

// ---------------------------------------------------------------------------
// Match AI-recommended IDs to actual inventory rows
// ---------------------------------------------------------------------------
function matchRecommendationsToInventory(recommendations, inventoryRows) {
  const matched = [];
  for (const rec of recommendations) {
    // Try exact ID match first
    let invItem = inventoryRows.find((row) => row.id === rec.id);

    // Fallback: fuzzy match by medicine name
    if (!invItem && rec.name) {
      const nameLower = rec.name.toLowerCase();
      invItem = inventoryRows.find((row) => {
        const fullName = `${row.medicine.name} ${row.medicine.brand}`.toLowerCase();
        return fullName.includes(nameLower) || nameLower.includes(row.medicine.name.toLowerCase());
      });
    }

    // Fallback: try partial ID match (e.g. MED001 from "MED001B")
    if (!invItem && rec.id) {
      invItem = inventoryRows.find((row) => row.id === rec.id.replace(/[^A-Z0-9]/gi, ''));
    }

    if (invItem) {
      matched.push({
        ...rec,
        inventoryItem: invItem,
        matchedId: invItem.id,
      });
    } else {
      // Still show the recommendation even without inventory match
      matched.push({ ...rec, inventoryItem: null, matchedId: null });
    }
  }
  return matched;
}

// ---------------------------------------------------------------------------
// Medicine Card inside chat
// ---------------------------------------------------------------------------
function RecommendedMedicineCard({ rec, isSelected, onAdd }) {
  const inv = rec.inventoryItem;
  const isPrimary = inv?.medicine?.isPrimary || rec.reason?.includes('★');
  const isOutOfStock = inv && inv.stock === 0;

  return (
    <div className="flex items-center gap-2 rounded-lg border border-violet-200 bg-white p-2">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          {isPrimary && <span className="text-amber-500 text-xs">★</span>}
          <p className="truncate text-xs font-black text-gray-900">
            {inv ? inv.medicine.name : rec.name}
          </p>
        </div>
        {inv && (
          <p className="mt-0.5 truncate text-[10px] text-gray-500">
            {inv.medicine.brand} · {inv.medicine.dose} · {inv.medicine.form}
          </p>
        )}
        <p className="mt-0.5 text-[10px] text-violet-600">{rec.dose}</p>
        {rec.reason && <p className="mt-0.5 text-[10px] text-gray-500">{rec.reason}</p>}
        {inv && (
          <div className="mt-1 flex items-center gap-2">
            <span className={`text-[10px] font-bold ${inv.stock === 0 ? 'text-red-500' : inv.stock <= 20 ? 'text-amber-600' : 'text-emerald-600'}`}>
              Stok: {inv.stock === 0 ? 'Habis' : `${inv.stock} pcs`}
            </span>
            <span className="text-[10px] font-bold text-gray-500">{formatRupiah(inv.price)}</span>
          </div>
        )}
      </div>

      {inv ? (
        <button
          type="button"
          onClick={() => onAdd(inv.id)}
          disabled={isOutOfStock}
          className={`flex h-8 shrink-0 items-center gap-1 rounded-lg px-2.5 text-[11px] font-bold transition ${
            isSelected
              ? 'bg-emerald-600 text-white'
              : isOutOfStock
                ? 'cursor-not-allowed bg-gray-200 text-gray-400'
                : 'bg-rose-600 text-white hover:bg-rose-700'
          }`}
        >
          {isSelected ? (
            <><CheckIcon className="h-3 w-3" /> Dipilih</>
          ) : isOutOfStock ? (
            'Habis'
          ) : (
            <><PlusIcon className="h-3 w-3" /> Tambah</>
          )}
        </button>
      ) : (
        <span className="shrink-0 rounded bg-gray-100 px-2 py-1 text-[10px] font-semibold text-gray-400">
          Tidak tersedia
        </span>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Chat Message with embedded medicine cards
// ---------------------------------------------------------------------------
function ChatMessage({ message, inventoryRows, selectedMedicineIds, onSelectMedicine }) {
  const isUser = message.role === 'user';
  const isSystem = message.role === 'system';

  if (isSystem) {
    return (
      <div className="flex justify-center px-4 py-2">
        <span className="rounded-full bg-gray-100 px-3 py-1 text-[11px] font-semibold text-gray-500">
          {message.content}
        </span>
      </div>
    );
  }

  // Parse recommendations from AI messages
  const { displayText, matchedRecs } = useMemo(() => {
    if (isUser || !message.content) return { displayText: message.content, matchedRecs: [] };
    const { displayText: dt, recommendations } = parseAiResponse(message.content);
    const matched = matchRecommendationsToInventory(recommendations, inventoryRows || []);
    return { displayText: dt, matchedRecs: matched };
  }, [isUser, message.content, inventoryRows]);

  return (
    <div className={`flex gap-2.5 px-3 py-1.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar */}
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-black ${
          isUser ? 'bg-rose-600 text-white' : 'bg-violet-600 text-white'
        }`}
      >
        {isUser ? 'ST' : 'AI'}
      </div>

      {/* Bubble + Medicine Cards */}
      <div className={`max-w-[85%] min-w-0 ${isUser ? 'items-end' : 'items-start'}`}>
        <div
          className={`rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
            isUser
              ? 'rounded-tr-md bg-rose-600 text-white'
              : 'rounded-tl-md border border-gray-200 bg-white text-gray-800'
          }`}
        >
          <div className="whitespace-pre-wrap break-words">{displayText}</div>
        </div>

        {/* Recommended Medicine Cards */}
        {!isUser && matchedRecs.length > 0 && (
          <div className="mt-2 grid gap-1.5">
            <p className="text-[10px] font-black uppercase tracking-wide text-violet-600">
              Obat yang disarankan — klik untuk menambahkan:
            </p>
            {matchedRecs.map((rec, i) => (
              <RecommendedMedicineCard
                key={rec.matchedId || `rec-${i}`}
                rec={rec}
                isSelected={rec.matchedId ? selectedMedicineIds.includes(rec.matchedId) : false}
                onAdd={onSelectMedicine}
              />
            ))}
          </div>
        )}

        <p className={`mt-1 text-[10px] text-gray-400 ${isUser ? 'text-right' : 'text-left'}`}>
          {message.timestamp}
          {!isUser && message.model && (
            <span className="ml-1.5 rounded bg-violet-100 px-1.5 py-0.5 text-[9px] font-bold text-violet-700">
              AI
            </span>
          )}
        </p>
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex gap-2.5 px-3 py-1.5">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-600 text-xs font-black text-white">
        AI
      </div>
      <div className="rounded-2xl rounded-tl-md border border-gray-200 bg-white px-4 py-3">
        <div className="flex items-center gap-1.5">
          <div className="h-2 w-2 animate-bounce rounded-full bg-violet-400" style={{ animationDelay: '0ms' }} />
          <div className="h-2 w-2 animate-bounce rounded-full bg-violet-400" style={{ animationDelay: '150ms' }} />
          <div className="h-2 w-2 animate-bounce rounded-full bg-violet-400" style={{ animationDelay: '300ms' }} />
          <span className="ml-2 text-xs text-gray-400">Menganalisis keluhan berdasarkan ISO, MIMS & riwayat...</span>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Chat Panel
// ---------------------------------------------------------------------------
export default function AiChatPanel({ customer, activeBranchId, inventoryRows, selectedMedicineIds, onSelectMedicine }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showQuickPrompts, setShowQuickPrompts] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const {
    isSupported: speechSupported,
    isListening,
    transcript,
    startListening,
    stopListening,
    resetTranscript,
  } = useSpeechToText({ lang: 'id-ID', continuous: false, interimResults: true });

  // Real-time update textarea saat staff bicara
  useEffect(() => {
    if (isListening) {
      setInputValue(transcript);
    }
  }, [transcript, isListening]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Focus input when panel opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [isOpen]);

  // Reset chat when customer changes
  useEffect(() => {
    if (customer) {
      setMessages([]);
      setShowQuickPrompts(true);
    }
  }, [customer?.id]);

  const handleSend = async (text) => {
    if (isListening) stopListening();
    const trimmed = (text || inputValue).trim();
    if (!trimmed || isLoading || !customer) return;

    resetTranscript();
    setInputValue('');
    setShowQuickPrompts(false);

    const userMsg = {
      role: 'user',
      content: trimmed,
      timestamp: formatTimestamp(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      // Build chat history for API (only role + content, strip recommendation blocks)
      const chatHistory = messages.map((m) => ({
        role: m.role,
        content: m.role === 'assistant'
          ? m.content.replace(/---REKOMENDASI_OBAT---[\s\S]*?---END_REKOMENDASI---/g, '').trim()
          : m.content,
      }));
      const result = await aiChatAssistant(chatHistory, trimmed, customer, activeBranchId || 'JKT001');

      const aiMsg = {
        role: 'assistant',
        content: result.answer,
        timestamp: formatTimestamp(),
        model: result.model,
        success: result.success,
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Maaf, terjadi kesalahan saat menghubungi AI. Silakan coba lagi.',
          timestamp: formatTimestamp(),
          success: false,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([]);
    setShowQuickPrompts(true);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!customer) return null;

  // Floating button when closed
  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-violet-600 text-white shadow-lg shadow-violet-200 transition hover:bg-violet-700 hover:shadow-xl sm:bottom-6 sm:right-6"
        aria-label="Buka Chat AI Assistant"
      >
        <ChatBubbleIcon className="h-6 w-6" />
        <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-black text-white">
          AI
        </span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-0 right-0 z-50 flex h-[min(85vh,640px)] w-full flex-col overflow-hidden border-l border-t border-gray-200 bg-slate-50 shadow-2xl sm:bottom-4 sm:right-4 sm:h-[min(80vh,620px)] sm:w-[420px] sm:rounded-2xl sm:border">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 bg-violet-600 px-4 py-3 text-white">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20">
            <SparklesIcon className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-black">Asisten Apoteker AI</h3>
            <p className="text-[11px] font-medium text-violet-200">
              Customer: {customer.name}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handleClearChat}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-violet-200 transition hover:bg-white/20 hover:text-white"
            aria-label="Bersihkan chat"
            title="Bersihkan chat"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-violet-200 transition hover:bg-white/20 hover:text-white"
            aria-label="Tutup chat"
          >
            <CloseIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Customer context strip */}
      <div className="flex items-center gap-2 border-b border-gray-100 bg-white px-3 py-2">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-rose-100 text-[10px] font-black text-rose-700">
          {(customer.name || '?').split(' ').slice(0, 2).map(c => c[0]?.toUpperCase()).join('')}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-bold text-gray-900">{customer.name}</p>
          <p className="truncate text-[10px] text-gray-500">
            {customer.age}th
            {customer.allergies?.length > 0 && ` · Alergi: ${customer.allergies.join(', ')}`}
            {customer.conditions?.length > 0 && ` · ${customer.conditions.map(c => c.replace(/_/g, ' ')).join(', ')}`}
          </p>
        </div>
        {customer.medicineHistory?.length > 0 && (
          <span className="shrink-0 rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700">
            {customer.medicineHistory.length} riwayat
          </span>
        )}
        <span className="shrink-0 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
          ISO+MIMS
        </span>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto py-3">
        {messages.length === 0 && (
          <div className="px-4 py-6">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100">
                <SparklesIcon className="h-7 w-7 text-violet-600" />
              </div>
              <h4 className="mt-3 text-sm font-black text-gray-900">Asisten Apoteker AI</h4>
              <p className="mt-1 text-xs leading-5 text-gray-500">
                Deskripsikan keluh kesah customer, dan AI akan merekomendasikan obat yang aman berdasarkan profil, riwayat, ISO & MIMS.
              </p>
              <div className="mt-2 flex flex-wrap justify-center gap-1">
                <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-600">Riwayat Customer</span>
                <span className="rounded-full bg-teal-50 px-2 py-0.5 text-[10px] font-bold text-teal-600">ISO Reference</span>
                <span className="rounded-full bg-orange-50 px-2 py-0.5 text-[10px] font-bold text-orange-600">MIMS Reference</span>
                <span className="rounded-full bg-violet-50 px-2 py-0.5 text-[10px] font-bold text-violet-600">Stok Apotek</span>
              </div>
            </div>

            {showQuickPrompts && (
              <div className="mt-4">
                <p className="mb-2 text-[11px] font-black uppercase tracking-wide text-gray-400">Contoh keluhan:</p>
                <div className="grid gap-1.5">
                  {QUICK_PROMPTS.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      onClick={() => handleSend(prompt)}
                      className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-left text-xs font-semibold text-gray-700 transition hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {messages.map((msg, idx) => (
          <ChatMessage
            key={idx}
            message={msg}
            inventoryRows={inventoryRows}
            selectedMedicineIds={selectedMedicineIds}
            onSelectMedicine={onSelectMedicine}
          />
        ))}

        {isLoading && <TypingIndicator />}

        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="border-t border-gray-200 bg-white p-3">
        <div className="flex items-end gap-2">
          <textarea
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isListening ? 'Mendengarkan…' : 'Ketik keluhan customer di sini...'}
            rows={1}
            className={`max-h-24 min-h-[42px] w-full resize-none rounded-xl border bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:ring-2 ${isListening ? 'border-rose-400 ring-rose-200' : 'border-gray-300 focus:border-violet-500 focus:ring-violet-200'}`}
            style={{ height: 'auto', minHeight: '42px' }}
            onInput={(e) => {
              e.target.style.height = 'auto';
              e.target.style.height = Math.min(e.target.scrollHeight, 96) + 'px';
            }}
          />
          {speechSupported && (
            <button
              type="button"
              onClick={() => {
                if (isListening) {
                  stopListening();
                } else {
                  setInputValue('');
                  resetTranscript();
                  startListening();
                }
              }}
              disabled={isLoading}
              className={`flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-xl transition ${isListening ? 'bg-rose-500 text-white animate-pulse' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'} disabled:bg-gray-300 disabled:text-gray-500`}
              aria-label={isListening ? 'Hentikan rekaman' : 'Rekam suara'}
              title={isListening ? 'Hentikan rekaman' : 'Rekam suara'}
            >
              <MicrophoneIcon className="h-4 w-4" />
            </button>
          )}
          <button
            type="button"
            onClick={() => handleSend()}
            disabled={isLoading || !inputValue.trim()}
            className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-xl bg-violet-600 text-white transition hover:bg-violet-700 disabled:bg-gray-300 disabled:text-gray-500"
            aria-label="Kirim pesan"
          >
            <SendIcon className="h-4 w-4" />
          </button>
        </div>
        <p className="mt-1.5 text-center text-[10px] text-gray-400">
          AI menganalisis berdasarkan ISO, MIMS & riwayat customer. Bukan pengganti dokter.
        </p>
      </div>
    </div>
  );
}
