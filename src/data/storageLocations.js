const baseStorageLocations = {
  MED001: { storage: 'A', kolom: 1, rak: 2, zone: 'Analgesik', notes: '' },
  MED001B: { storage: 'A', kolom: 1, rak: 2, zone: 'Analgesik', notes: 'Brand alt' },
  MED001C: { storage: 'A', kolom: 1, rak: 4, zone: 'Analgesik', notes: 'Sirup anak' },
  MED002: { storage: 'A', kolom: 1, rak: 3, zone: 'Analgesik', notes: '' },
  MED002B: { storage: 'A', kolom: 1, rak: 3, zone: 'Analgesik', notes: 'Dosis rendah' },
  MED003: { storage: 'B', kolom: 1, rak: 1, zone: 'Antibiotik', notes: '' },
  MED003B: { storage: 'B', kolom: 1, rak: 1, zone: 'Antibiotik', notes: 'Brand alt' },
  MED003C: { storage: 'B', kolom: 1, rak: 3, zone: 'Antibiotik', notes: 'Sirup anak' },
  MED004: { storage: 'B', kolom: 1, rak: 2, zone: 'Antibiotik', notes: '' },
  MED005: { storage: 'E', kolom: 1, rak: 1, zone: 'Vitamin & Suplemen', notes: '' },
  MED005B: { storage: 'E', kolom: 1, rak: 1, zone: 'Vitamin & Suplemen', notes: 'Effervescent' },
  MED006: { storage: 'D', kolom: 1, rak: 1, zone: 'Batuk & Napas', notes: '' },
  MED006B: { storage: 'D', kolom: 1, rak: 1, zone: 'Batuk & Napas', notes: 'Antitussive' },
  MED007: { storage: 'D', kolom: 1, rak: 2, zone: 'Batuk & Napas', notes: '' },
  MED008: { storage: 'C', kolom: 1, rak: 1, zone: 'Gastrointestinal', notes: '' },
  MED008B: { storage: 'C', kolom: 1, rak: 1, zone: 'Gastrointestinal', notes: 'Sirup' },
  MED009: { storage: 'C', kolom: 1, rak: 2, zone: 'Gastrointestinal', notes: '' },
  MED010: { storage: 'A', kolom: 2, rak: 1, zone: 'Antihistamin', notes: '' },
  MED010B: { storage: 'A', kolom: 2, rak: 1, zone: 'Antihistamin', notes: 'Brand alt' },
  MED011: { storage: 'B', kolom: 2, rak: 1, zone: 'Antibiotik', notes: 'Makrolida' },
  MED012: { storage: 'D', kolom: 2, rak: 1, zone: 'Batuk & Napas', notes: 'Ekspektoran' },
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
