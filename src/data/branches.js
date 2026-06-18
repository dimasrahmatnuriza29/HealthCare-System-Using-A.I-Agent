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
    MED001: 120, MED001B: 45, MED001C: 5,
    MED002: 80, MED002B: 0,
    MED003: 95, MED003B: 12, MED003C: 3,
    MED004: 18,
    MED005: 200, MED005B: 50,
    MED006: 75, MED006B: 8,
    MED007: 55,
    MED008: 150, MED008B: 40,
    MED009: 70,
    MED010: 90, MED010B: 15,
    MED011: 0,
    MED012: 0,
  },
  JKT002: {
    MED001: 90, MED001B: 30, MED001C: 20,
    MED002: 60, MED002B: 35,
    MED003: 70, MED003B: 25, MED003C: 15,
    MED004: 45,
    MED005: 180, MED005B: 40,
    MED006: 55, MED006B: 20,
    MED007: 40,
    MED008: 120, MED008B: 30,
    MED009: 50,
    MED010: 65, MED010B: 25,
    MED011: 30,
    MED012: 35,
  },
  BDG001: {
    MED001: 100, MED001B: 25, MED001C: 18,
    MED002: 50, MED002B: 30,
    MED003: 80, MED003B: 20, MED003C: 12,
    MED004: 35,
    MED005: 160, MED005B: 30,
    MED006: 60, MED006B: 15,
    MED007: 30,
    MED008: 130, MED008B: 25,
    MED009: 40,
    MED010: 55, MED010B: 20,
    MED011: 0,
    MED012: 25,
  },
};

export const medicinePrices = {
  JKT001: {
    MED001: 8500, MED001B: 12000, MED001C: 35000,
    MED002: 12000, MED002B: 8000,
    MED003: 15000, MED003B: 18000, MED003C: 45000,
    MED004: 22000,
    MED005: 5000, MED005B: 15000,
    MED006: 25000, MED006B: 32000,
    MED007: 12000,
    MED008: 5500, MED008B: 28000,
    MED009: 18000,
    MED010: 15000, MED010B: 25000,
    MED011: 35000,
    MED012: 18000,
  },
  JKT002: {
    MED001: 8500, MED001B: 12000, MED001C: 35000,
    MED002: 12000, MED002B: 8000,
    MED003: 15000, MED003B: 18000, MED003C: 45000,
    MED004: 22000,
    MED005: 5000, MED005B: 15000,
    MED006: 25000, MED006B: 32000,
    MED007: 12000,
    MED008: 5500, MED008B: 28000,
    MED009: 18000,
    MED010: 15000, MED010B: 25000,
    MED011: 35000,
    MED012: 18000,
  },
  BDG001: {
    MED001: 8000, MED001B: 11500, MED001C: 33000,
    MED002: 11500, MED002B: 7500,
    MED003: 14000, MED003B: 17000, MED003C: 42000,
    MED004: 20000,
    MED005: 4500, MED005B: 14000,
    MED006: 23000, MED006B: 30000,
    MED007: 11000,
    MED008: 5000, MED008B: 26000,
    MED009: 17000,
    MED010: 14000, MED010B: 23000,
    MED011: 33000,
    MED012: 16000,
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
