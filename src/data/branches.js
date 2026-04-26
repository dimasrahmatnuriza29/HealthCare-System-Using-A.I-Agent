export const branches = [
  {
    id: 'JKT001',
    name: 'Apotek Sehat Jaya',
    city: 'Jakarta',
    address: 'Jakarta Pusat',
  },
  {
    id: 'JKT002',
    name: 'Apotek Farma Sentosa',
    city: 'Jakarta',
    address: 'Jakarta Selatan',
  },
  {
    id: 'BDG001',
    name: 'Apotek Bandung Care',
    city: 'Bandung',
    address: 'Bandung Tengah',
  },
];

export const branchStock = {
  JKT001: {
    MED001: 50,
    MED002: 15,
    MED003: 0,
    MED004: 25,
    MED005: 70,
    MED006: 12,
    MED007: 30,
    MED008: 45,
    MED009: 18,
    MED010: 40,
  },
  JKT002: {
    MED001: 28,
    MED002: 0,
    MED003: 35,
    MED004: 8,
    MED005: 22,
    MED006: 40,
    MED007: 5,
    MED008: 60,
    MED009: 24,
    MED010: 16,
  },
  BDG001: {
    MED001: 11,
    MED002: 22,
    MED003: 14,
    MED004: 0,
    MED005: 100,
    MED006: 19,
    MED007: 27,
    MED008: 9,
    MED009: 33,
    MED010: 6,
  },
};

export const medicinePrices = {
  JKT001: {
    MED001: 8500,
    MED002: 12000,
    MED003: 18000,
    MED004: 20000,
    MED005: 10000,
    MED006: 17500,
    MED007: 15000,
    MED008: 7500,
    MED009: 22000,
    MED010: 11000,
  },
  JKT002: {
    MED001: 8800,
    MED002: 12500,
    MED003: 18500,
    MED004: 20500,
    MED005: 10500,
    MED006: 18000,
    MED007: 15500,
    MED008: 7800,
    MED009: 22500,
    MED010: 11500,
  },
  BDG001: {
    MED001: 8200,
    MED002: 11500,
    MED003: 17500,
    MED004: 19500,
    MED005: 9500,
    MED006: 17000,
    MED007: 14500,
    MED008: 7200,
    MED009: 21500,
    MED010: 10500,
  },
};

export function getBranchById(branchId) {
  return branches.find((branch) => branch.id === branchId) ?? null;
}

export function getStockForMedicine(branchId, medicineId) {
  return branchStock[branchId]?.[medicineId] ?? 0;
}

export function getPriceForMedicine(branchId, medicineId) {
  return medicinePrices[branchId]?.[medicineId] ?? 0;
}
