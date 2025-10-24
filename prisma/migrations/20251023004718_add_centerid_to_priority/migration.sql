/*
  Warnings:

  - Added the required column `centerId` to the `Priority` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Priority" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "centerId" TEXT NOT NULL,
    CONSTRAINT "Priority_centerId_fkey" FOREIGN KEY ("centerId") REFERENCES "CareCenter" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Priority" ("createdAt", "id", "name", "updatedAt") SELECT "createdAt", "id", "name", "updatedAt" FROM "Priority";
DROP TABLE "Priority";
ALTER TABLE "new_Priority" RENAME TO "Priority";
CREATE INDEX "Priority_id_centerId_idx" ON "Priority"("id", "centerId");
CREATE UNIQUE INDEX "Priority_id_centerId_key" ON "Priority"("id", "centerId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
