-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_TurnStatus" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "initial" BOOLEAN NOT NULL DEFAULT false,
    "final" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "careCenterId" TEXT NOT NULL,
    "ipsId" TEXT NOT NULL,
    CONSTRAINT "TurnStatus_careCenterId_fkey" FOREIGN KEY ("careCenterId") REFERENCES "CareCenter" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_TurnStatus" ("careCenterId", "createdAt", "id", "ipsId", "isActive", "name", "updatedAt") SELECT "careCenterId", "createdAt", "id", "ipsId", "isActive", "name", "updatedAt" FROM "TurnStatus";
DROP TABLE "TurnStatus";
ALTER TABLE "new_TurnStatus" RENAME TO "TurnStatus";
CREATE UNIQUE INDEX "TurnStatus_name_key" ON "TurnStatus"("name");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
