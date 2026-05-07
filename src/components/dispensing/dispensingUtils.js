import { getPriceForMedicine, getStockForMedicine } from '../../data/branches.js';
import { getLocationForMedicine } from '../../data/storageLocations.js';
import {
  counselingDatabase,
  educationOptions,
  safetyRank,
  safetyTone,
  serviceStatusLabels,
} from './dispensingConfig.js';

export function formatRupiah(value) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value);
}

export function getStockStatus(stock) {
  if (stock === 0) {
    return {
      key: 'out',
      label: 'Habis',
      badgeClass: 'border-red-200 bg-red-50 text-red-700',
    };
  }
  if (stock < 20) {
    return {
      key: 'low',
      label: 'Stok Menipis',
      badgeClass: 'border-amber-200 bg-amber-50 text-amber-800',
    };
  }
  return {
    key: 'available',
    label: 'Tersedia',
    badgeClass: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  };
}

export function buildInventoryRow(medicine, branchId) {
  const location = getLocationForMedicine(branchId, medicine.id);
  const stock = getStockForMedicine(branchId, medicine.id);
  const price = getPriceForMedicine(branchId, medicine.id);
  const status = getStockStatus(stock);

  return {
    id: medicine.id,
    medicine,
    stock,
    price,
    status,
    location,
    storage: location?.storage ?? '-',
    kolom: location?.kolom ?? '-',
    rak: location?.rak ?? '-',
    zone: location?.zone ?? '-',
    notes: location?.notes ?? '',
  };
}

export function getCheckedLabels(checks, options) {
  return options.filter((option) => checks[option.key]).map((option) => option.label);
}

export function getOverallSafetyStatus(advisoryItems) {
  return advisoryItems.reduce((current, entry) => {
    const nextStatus = entry.advisory?.safetyStatus ?? 'safe';
    return safetyRank[nextStatus] > safetyRank[current] ? nextStatus : current;
  }, 'safe');
}

export function getGroupDispensingDecision(advisoryItems) {
  if (!advisoryItems.length) {
    return {
      tone: 'border-gray-200 bg-white text-gray-900',
      title: 'Keputusan belum tersedia.',
      message: 'Pilih minimal satu obat dan jalankan safety check.',
      canPick: false,
      showLocation: false,
    };
  }

  const outOfStock = advisoryItems.filter(({ item }) => item.stock === 0);
  if (outOfStock.length) {
    return {
      tone: 'border-red-200 bg-red-50 text-red-900',
      title: 'Jangan ambil obat dulu.',
      message: `${outOfStock.map(({ item }) => item.medicine.name).join(', ')} habis di cabang aktif. Pilih alternatif, ubah cabang, atau catat sebagai konsultasi.`,
      canPick: false,
      showLocation: false,
    };
  }

  const dangerItems = advisoryItems.filter(({ advisory }) => advisory?.safetyStatus === 'danger');
  if (dangerItems.length) {
    return {
      tone: 'border-red-200 bg-red-50 text-red-900',
      title: 'Jangan ambil obat dulu.',
      message: `${dangerItems.map(({ item }) => item.medicine.name).join(', ')} memiliki risiko tinggi. Konsultasikan ke apoteker sebelum tindakan lanjutan.`,
      canPick: false,
      showLocation: false,
    };
  }

  const warningItems = advisoryItems.filter(({ advisory }) => advisory?.safetyStatus === 'warning');
  if (warningItems.length) {
    return {
      tone: 'border-amber-200 bg-amber-50 text-amber-900',
      title: 'Konsultasi apoteker sebelum obat diambil.',
      message: `${warningItems.map(({ item }) => item.medicine.name).join(', ')} perlu perhatian. Verifikasi dulu sebelum picking.`,
      canPick: false,
      showLocation: false,
    };
  }

  return {
    tone: 'border-emerald-200 bg-emerald-50 text-emerald-900',
    title: 'Semua obat aman untuk diproses.',
    message: 'Lokasi fisik seluruh obat dibuka setelah safety check selesai.',
    canPick: true,
    showLocation: true,
  };
}

export function buildCounselingDetails({ item, advisory, customer }) {
  const database = counselingDatabase[item.medicine.id] ?? {};
  const allergyMessage = advisory.allergyCheck.status === 'safe'
    ? `Tidak ada konflik alergi langsung pada data customer. Tetap konfirmasi ulang alergi: ${customer.allergies.length ? customer.allergies.join(', ') : 'tidak ada yang tercatat'}.`
    : advisory.allergyCheck.message;

  return {
    medicineId: item.id,
    medicineName: item.medicine.name,
    details: {
      usage: advisory.doseRecommendation.dose,
      sideEffects: database.sideEffects ?? 'Pantau efek samping umum seperti mual, pusing, ruam, atau keluhan yang tidak biasa.',
      storage: database.storage ?? 'Simpan sesuai instruksi pada kemasan, di tempat kering, dan jauhkan dari anak-anak.',
      timing: database.timing ?? 'Ikuti jadwal pakai pada label atau arahan apoteker.',
      allergyWarning: allergyMessage,
      consultWhenNeeded: database.consultWhenNeeded ?? 'Konsultasi dokter/apoteker bila gejala memburuk, muncul alergi, atau ada keluhan berat.',
    },
  };
}

export function buildServiceRecordUpdate({
  activeCustomer,
  activeBranch,
  activeBranchId,
  advisoryItems,
  pickedAt,
  overallSafetyStatus,
  decision,
  educationChecks,
  counselingDetails,
  staffNote,
  servedBy,
  serviceStatus,
  statusOverride,
  pharmacistRequested,
}) {
  const submittedAt = new Date();
  const serviceDate = submittedAt.toISOString().slice(0, 10);
  const safetyLabel = safetyTone[overallSafetyStatus]?.label ?? 'Aman';
  const educationLabels = getCheckedLabels(educationChecks, educationOptions);
  const finalServiceStatus = statusOverride ?? serviceStatus;
  const medicineSummaries = advisoryItems.map(({ item, advisory }) => {
    const locationText = decision.showLocation
      ? `Storage ${item.storage}, Kolom ${item.kolom}, Rak ${item.rak}`
      : 'Lokasi belum dibuka';
    return {
      medicineId: item.medicine.id,
      medicineName: item.medicine.name,
      dose: advisory.doseRecommendation.dose,
      price: item.price,
      stock: item.stock,
      safetyStatus: advisory.safetyStatus,
      safetyLabel: safetyTone[advisory.safetyStatus]?.label ?? advisory.statusLabel,
      safetySummary: advisory.summary,
      locationText,
      location: {
        storage: item.storage,
        kolom: item.kolom,
        rak: item.rak,
        zone: item.zone,
      },
    };
  });

  const record = {
    id: `SERV${Date.now()}`,
    customerId: activeCustomer.id,
    customerName: activeCustomer.name,
    medicineIds: medicineSummaries.map((medicine) => medicine.medicineId),
    medicineNames: medicineSummaries.map((medicine) => medicine.medicineName),
    branchId: activeBranchId,
    branchName: activeBranch?.name ?? activeBranchId,
    medicines: medicineSummaries,
    pickedAt,
    submittedAt: submittedAt.toISOString(),
    servedBy: servedBy.trim() || 'Demo Staff',
    safetyStatus: overallSafetyStatus,
    safetyLabel,
    safetySummary: medicineSummaries.map((medicine) => `${medicine.medicineName}: ${medicine.safetySummary}`).join(' | '),
    finalStatus: finalServiceStatus,
    finalStatusLabel: serviceStatusLabels[finalServiceStatus],
    pharmacistRequested,
    educationChecks,
    counselingDetails,
    staffNote: staffNote.trim(),
  };

  const noteText = [
    `Pelayanan ${medicineSummaries.map((medicine) => medicine.medicineName).join(', ')}: ${serviceStatusLabels[finalServiceStatus]}.`,
    `Safety: ${safetyLabel}.`,
    `Cabang: ${activeBranch?.name ?? activeBranchId}.`,
    decision.showLocation
      ? `Lokasi: ${medicineSummaries.map((medicine) => `${medicine.medicineName} (${medicine.locationText})`).join('; ')}.`
      : 'Lokasi tidak dibuka karena perlu konsultasi atau stok tidak tersedia.',
    educationLabels.length ? `Edukasi: ${educationLabels.join(', ')}.` : 'Edukasi belum dicatat.',
    staffNote.trim() ? `Catatan: ${staffNote.trim()}` : '',
  ]
    .filter(Boolean)
    .join(' ');

  return {
    finalServiceStatus,
    record,
    customerPatch: {
      medicineHistory: [
        ...medicineSummaries.map((medicine) => ({
          date: serviceDate,
          medicineId: medicine.medicineId,
          medicineName: medicine.medicineName,
          dose: medicine.dose,
          reason: serviceStatusLabels[finalServiceStatus],
          staffName: record.servedBy,
          branchId: activeBranchId,
          branchName: activeBranch?.name ?? activeBranchId,
          location: medicine.locationText,
          safetyStatus: medicine.safetyLabel,
        })),
        ...activeCustomer.medicineHistory,
      ],
      notes: [
        {
          date: serviceDate,
          text: noteText,
          staffName: record.servedBy,
        },
        ...activeCustomer.notes,
      ],
    },
  };
}
