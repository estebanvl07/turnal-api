-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_PlaceOfCareServices" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "placeOfCareId" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "careCenterId" TEXT,
    CONSTRAINT "PlaceOfCareServices_careCenterId_fkey" FOREIGN KEY ("careCenterId") REFERENCES "CareCenter" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "PlaceOfCareServices_placeOfCareId_fkey" FOREIGN KEY ("placeOfCareId") REFERENCES "PlacesOfCare" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "PlaceOfCareServices_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "CareCenterServices" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_PlaceOfCareServices" ("id", "placeOfCareId", "serviceId") SELECT "id", "placeOfCareId", "serviceId" FROM "PlaceOfCareServices";
DROP TABLE "PlaceOfCareServices";
ALTER TABLE "new_PlaceOfCareServices" RENAME TO "PlaceOfCareServices";
CREATE INDEX "PlaceOfCareServices_id_placeOfCareId_idx" ON "PlaceOfCareServices"("id", "placeOfCareId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
