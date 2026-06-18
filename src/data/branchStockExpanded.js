/**
 * DATA DUMMY — Stok Per Cabang (Diperluas)
 * Termasuk harga, minimum stok, dan status primary flag.
 */

export const branchStockExpanded = {
  JKT001: {
    branchId: 'JKT001',
    branchName: 'Apotek Bukalapak Jakarta Pusat',
    address: 'Jl. Sudirman No. 45, Jakarta Pusat',
    stock: {
      MED001:  { qty: 120, min: 20, price: 8500,  isPrimary: true },
      MED001B: { qty: 45,  min: 10, price: 12000, isPrimary: false },
      MED001C: { qty: 5,   min: 10, price: 35000, isPrimary: true },
      MED002:  { qty: 80,  min: 15, price: 12000, isPrimary: false },
      MED002B: { qty: 0,   min: 10, price: 8000,  isPrimary: false },
      MED003:  { qty: 95,  min: 20, price: 15000, isPrimary: true },
      MED003B: { qty: 12,  min: 10, price: 18000, isPrimary: false },
      MED003C: { qty: 3,   min: 8,  price: 45000, isPrimary: true },
      MED004:  { qty: 18,  min: 15, price: 22000, isPrimary: false },
      MED005:  { qty: 200, min: 30, price: 5000,  isPrimary: true },
      MED005B: { qty: 50,  min: 10, price: 15000, isPrimary: false },
      MED006:  { qty: 75,  min: 15, price: 25000, isPrimary: true },
      MED006B: { qty: 8,   min: 10, price: 32000, isPrimary: false },
      MED007:  { qty: 55,  min: 10, price: 12000, isPrimary: false },
      MED008:  { qty: 150, min: 25, price: 5500,  isPrimary: true },
      MED008B: { qty: 40,  min: 10, price: 28000, isPrimary: false },
      MED009:  { qty: 70,  min: 15, price: 18000, isPrimary: false },
      MED010:  { qty: 90,  min: 15, price: 15000, isPrimary: true },
      MED010B: { qty: 15,  min: 10, price: 25000, isPrimary: false },
      MED011:  { qty: 0,   min: 10, price: 35000, isPrimary: false },
      MED012:  { qty: 0,   min: 10, price: 18000, isPrimary: false },
    },
  },
  JKT002: {
    branchId: 'JKT002',
    branchName: 'Apotek Bukalapak Jakarta Selatan',
    address: 'Jl. Fatmawati No. 12, Jakarta Selatan',
    stock: {
      MED001:  { qty: 90,  min: 20, price: 8500,  isPrimary: true },
      MED001B: { qty: 30,  min: 10, price: 12000, isPrimary: false },
      MED001C: { qty: 20,  min: 10, price: 35000, isPrimary: true },
      MED002:  { qty: 60,  min: 15, price: 12000, isPrimary: false },
      MED002B: { qty: 35,  min: 10, price: 8000,  isPrimary: false },
      MED003:  { qty: 70,  min: 20, price: 15000, isPrimary: true },
      MED003B: { qty: 25,  min: 10, price: 18000, isPrimary: false },
      MED003C: { qty: 15,  min: 8,  price: 45000, isPrimary: true },
      MED004:  { qty: 45,  min: 15, price: 22000, isPrimary: false },
      MED005:  { qty: 180, min: 30, price: 5000,  isPrimary: true },
      MED005B: { qty: 40,  min: 10, price: 15000, isPrimary: false },
      MED006:  { qty: 55,  min: 15, price: 25000, isPrimary: true },
      MED006B: { qty: 20,  min: 10, price: 32000, isPrimary: false },
      MED007:  { qty: 40,  min: 10, price: 12000, isPrimary: false },
      MED008:  { qty: 120, min: 25, price: 5500,  isPrimary: true },
      MED008B: { qty: 30,  min: 10, price: 28000, isPrimary: false },
      MED009:  { qty: 50,  min: 15, price: 18000, isPrimary: false },
      MED010:  { qty: 65,  min: 15, price: 15000, isPrimary: true },
      MED010B: { qty: 25,  min: 10, price: 25000, isPrimary: false },
      MED011:  { qty: 30,  min: 10, price: 35000, isPrimary: false },
      MED012:  { qty: 35,  min: 10, price: 18000, isPrimary: false },
    },
  },
  BDG001: {
    branchId: 'BDG001',
    branchName: 'Apotek Bukalapak Bandung',
    address: 'Jl. Braga No. 88, Bandung',
    stock: {
      MED001:  { qty: 100, min: 20, price: 8000,  isPrimary: true },
      MED001B: { qty: 25,  min: 10, price: 11500, isPrimary: false },
      MED001C: { qty: 18,  min: 8,  price: 33000, isPrimary: true },
      MED002:  { qty: 50,  min: 15, price: 11500, isPrimary: false },
      MED002B: { qty: 30,  min: 10, price: 7500,  isPrimary: false },
      MED003:  { qty: 80,  min: 20, price: 14000, isPrimary: true },
      MED003B: { qty: 20,  min: 10, price: 17000, isPrimary: false },
      MED003C: { qty: 12,  min: 8,  price: 42000, isPrimary: true },
      MED004:  { qty: 35,  min: 15, price: 20000, isPrimary: false },
      MED005:  { qty: 160, min: 30, price: 4500,  isPrimary: true },
      MED005B: { qty: 30,  min: 10, price: 14000, isPrimary: false },
      MED006:  { qty: 60,  min: 15, price: 23000, isPrimary: true },
      MED006B: { qty: 15,  min: 10, price: 30000, isPrimary: false },
      MED007:  { qty: 30,  min: 10, price: 11000, isPrimary: false },
      MED008:  { qty: 130, min: 25, price: 5000,  isPrimary: true },
      MED008B: { qty: 25,  min: 10, price: 26000, isPrimary: false },
      MED009:  { qty: 40,  min: 15, price: 17000, isPrimary: false },
      MED010:  { qty: 55,  min: 15, price: 14000, isPrimary: true },
      MED010B: { qty: 20,  min: 10, price: 23000, isPrimary: false },
      MED011:  { qty: 0,   min: 10, price: 33000, isPrimary: false },
      MED012:  { qty: 25,  min: 10, price: 16000, isPrimary: false },
    },
  },
};

/**
 * Helper: cek stok obat di cabang tertentu
 */
export function getStockInfo(branchId, medicineId) {
  const branch = branchStockExpanded[branchId];
  if (!branch) return null;
  const item = branch.stock[medicineId];
  if (!item) return null;
  return {
    ...item,
    branchName: branch.branchName,
    status: item.qty === 0 ? 'habis' : item.qty <= item.min ? 'menipis' : 'tersedia',
  };
}

/**
 * Helper: cari cabang lain yang punya stok
 */
export function findAlternativeBranch(currentBranchId, medicineId) {
  return Object.entries(branchStockExpanded)
    .filter(([id]) => id !== currentBranchId)
    .map(([id, branch]) => ({
      branchId: id,
      branchName: branch.branchName,
      stock: branch.stock[medicineId],
    }))
    .filter((b) => b.stock && b.stock.qty > 0);
}
