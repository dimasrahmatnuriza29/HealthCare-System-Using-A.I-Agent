export const workflowSteps = [
  { key: 'customer', label: 'Customer' },
  { key: 'medicine', label: 'Pilih Obat' },
  { key: 'safety', label: 'Safety Check' },
  { key: 'location', label: 'Lokasi & Aksi' },
];

export const safetyTone = {
  safe: {
    label: 'Aman',
    chip: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    panel: 'border-emerald-200 bg-emerald-50 text-emerald-900',
  },
  warning: {
    label: 'Perlu perhatian',
    chip: 'border-amber-200 bg-amber-50 text-amber-800',
    panel: 'border-amber-200 bg-amber-50 text-amber-900',
  },
  danger: {
    label: 'Risiko tinggi',
    chip: 'border-red-200 bg-red-50 text-red-700',
    panel: 'border-red-200 bg-red-50 text-red-900',
  },
};

export const closingWorkflowSteps = [
  { key: 'picking', label: 'Lokasi Picking' },
  { key: 'counseling', label: 'Edukasi & Catatan' },
  { key: 'complete', label: 'Selesai' },
];

export const defaultEducationChecks = {
  usage: false,
  timing: false,
  sideEffects: false,
  allergyWarning: false,
  storage: false,
  consultWhenNeeded: false,
};

export const educationOptions = [
  { key: 'usage', label: 'Aturan pakai' },
  { key: 'sideEffects', label: 'Efek samping umum' },
  { key: 'storage', label: 'Cara penyimpanan' },
  { key: 'timing', label: 'Waktu konsumsi' },
  { key: 'allergyWarning', label: 'Peringatan alergi' },
  { key: 'consultWhenNeeded', label: 'Kapan harus konsultasi dokter/apoteker' },
];

export const counselingDatabase = {
  MED001: {
    timing: 'Dapat diminum sebelum atau sesudah makan. Beri jarak antar dosis sesuai aturan pakai.',
    sideEffects: 'Mual ringan, ruam, atau reaksi alergi jarang terjadi. Hentikan bila muncul bengkak atau sesak.',
    storage: 'Simpan di tempat sejuk dan kering, terlindung dari sinar matahari langsung.',
    consultWhenNeeded: 'Konsultasi bila demam lebih dari 3 hari, nyeri berat, dosis terlewat berulang, atau muncul reaksi alergi.',
  },
  MED002: {
    timing: 'Minum sesudah makan untuk mengurangi iritasi lambung.',
    sideEffects: 'Nyeri lambung, mual, pusing, atau reaksi alergi NSAID dapat terjadi.',
    storage: 'Simpan di tempat kering pada suhu ruang dan jauhkan dari anak-anak.',
    consultWhenNeeded: 'Konsultasi bila ada nyeri lambung berat, muntah darah, sesak, kehamilan trimester akhir, atau riwayat alergi NSAID.',
  },
  MED003: {
    timing: 'Minum pada jam yang konsisten dan habiskan sesuai durasi yang diresepkan.',
    sideEffects: 'Mual, diare, ruam, atau reaksi alergi antibiotik dapat terjadi.',
    storage: 'Simpan kapsul di tempat kering pada suhu ruang.',
    consultWhenNeeded: 'Konsultasi segera bila muncul ruam luas, bengkak, sesak, diare berat, atau gejala infeksi tidak membaik.',
  },
  MED004: {
    timing: 'Minum sesuai jadwal yang diresepkan dan habiskan terapi antibiotik.',
    sideEffects: 'Mual, diare, sakit perut, ruam, atau reaksi alergi sefalosporin dapat terjadi.',
    storage: 'Simpan di tempat kering pada suhu ruang.',
    consultWhenNeeded: 'Konsultasi bila ada reaksi alergi, diare berat, atau keluhan tidak membaik setelah beberapa hari.',
  },
  MED005: {
    timing: 'Minum sesudah makan untuk kenyamanan lambung.',
    sideEffects: 'Mual ringan atau tidak nyaman di lambung dapat terjadi pada sebagian orang.',
    storage: 'Simpan di tempat sejuk dan kering.',
    consultWhenNeeded: 'Konsultasi bila ada keluhan lambung berat, batu ginjal berulang, atau penggunaan dosis tinggi jangka panjang.',
  },
  MED006: {
    timing: 'Gunakan sesuai takaran sirup, umumnya sesudah makan atau sesuai aturan label.',
    sideEffects: 'Mengantuk, mual, atau mulut kering dapat terjadi tergantung komposisi.',
    storage: 'Tutup botol rapat, simpan di suhu ruang, dan jangan gunakan bila warna/bau berubah.',
    consultWhenNeeded: 'Konsultasi bila batuk lebih dari 3 hari, sesak, demam tinggi, atau dahak berdarah.',
  },
  MED007: {
    timing: 'Minum sesudah makan dan perbanyak cairan untuk membantu pengenceran dahak.',
    sideEffects: 'Mual, diare ringan, atau rasa tidak nyaman di lambung dapat terjadi.',
    storage: 'Simpan tablet di tempat kering pada suhu ruang.',
    consultWhenNeeded: 'Konsultasi bila batuk berdahak tidak membaik, sesak, atau demam menetap.',
  },
  MED008: {
    timing: 'Kunyah saat gejala muncul, umumnya sesudah makan atau sebelum tidur sesuai kebutuhan.',
    sideEffects: 'Konstipasi atau diare dapat terjadi tergantung komposisi antasida.',
    storage: 'Simpan di tempat kering dan tutup kemasan rapat.',
    consultWhenNeeded: 'Konsultasi bila nyeri ulu hati berat, muntah darah, BAB hitam, atau gejala sering kambuh.',
  },
  MED009: {
    timing: 'Minum sebelum makan, idealnya sebelum sarapan.',
    sideEffects: 'Sakit kepala, mual, kembung, atau diare ringan dapat terjadi.',
    storage: 'Simpan kapsul di tempat kering dan jauh dari panas berlebih.',
    consultWhenNeeded: 'Konsultasi bila nyeri dada, sulit menelan, muntah darah, BAB hitam, atau keluhan tidak membaik.',
  },
  MED010: {
    timing: 'Minum sekali sehari pada jam yang sama. Dapat diminum sebelum atau sesudah makan.',
    sideEffects: 'Mengantuk ringan, mulut kering, atau sakit kepala dapat terjadi.',
    storage: 'Simpan di tempat kering pada suhu ruang.',
    consultWhenNeeded: 'Konsultasi bila alergi disertai sesak, bengkak wajah, ruam luas, atau gejala tidak membaik.',
  },
};

export const serviceStatusLabels = {
  dispensed: 'Diserahkan',
  consultation: 'Perlu konsultasi',
  cancelled: 'Batal',
};

export const safetyRank = {
  safe: 0,
  warning: 1,
  danger: 2,
};
