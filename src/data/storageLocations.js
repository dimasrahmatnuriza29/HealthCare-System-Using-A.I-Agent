const baseStorageLocations = {
  MED001: { storage: 'A', kolom: 1, rak: 2, zone: 'Analgesik', notes: '' },
  MED002: { storage: 'A', kolom: 1, rak: 3, zone: 'Analgesik', notes: '' },
  MED003: { storage: 'B', kolom: 1, rak: 1, zone: 'Antibiotik', notes: '' },
  MED004: { storage: 'B', kolom: 1, rak: 2, zone: 'Antibiotik', notes: '' },
  MED005: { storage: 'E', kolom: 1, rak: 1, zone: 'Vitamin & Suplemen', notes: '' },
  MED006: { storage: 'D', kolom: 1, rak: 1, zone: 'Batuk & Napas', notes: '' },
  MED007: { storage: 'D', kolom: 1, rak: 2, zone: 'Batuk & Napas', notes: '' },
  MED008: { storage: 'C', kolom: 1, rak: 1, zone: 'Gastrointestinal', notes: '' },
  MED009: { storage: 'C', kolom: 1, rak: 2, zone: 'Gastrointestinal', notes: '' },
  MED010: { storage: 'A', kolom: 2, rak: 1, zone: 'Analgesik/Antihistamin', notes: '' },
};

function buildLocationsForBranch(branchId) {
  return Object.fromEntries(
    Object.entries(baseStorageLocations).map(([medicineId, location]) => [
      medicineId,
      {
        medicineId,
        branchId,
        ...location,
      },
    ]),
  );
}

export const storageLocations = {
  JKT001: buildLocationsForBranch('JKT001'),
  JKT002: buildLocationsForBranch('JKT002'),
  BDG001: buildLocationsForBranch('BDG001'),
};

export function getLocationForMedicine(branchId, medicineId) {
  return storageLocations[branchId]?.[medicineId] ?? null;
}

export function getAllLocationsForBranch(branchId) {
  return Object.values(storageLocations[branchId] ?? {});
}
