-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_PlacesOfCare" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "centerId" TEXT NOT NULL,
    "userId" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "PlacesOfCare_centerId_fkey" FOREIGN KEY ("centerId") REFERENCES "CareCenter" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "PlacesOfCare_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_PlacesOfCare" ("centerId", "createdAt", "id", "name", "updatedAt", "userId") SELECT "centerId", "createdAt", "id", "name", "updatedAt", "userId" FROM "PlacesOfCare";
DROP TABLE "PlacesOfCare";
ALTER TABLE "new_PlacesOfCare" RENAME TO "PlacesOfCare";
CREATE INDEX "PlacesOfCare_id_centerId_idx" ON "PlacesOfCare"("id", "centerId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
