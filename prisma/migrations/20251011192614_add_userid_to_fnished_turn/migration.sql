-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_FinishedTurn" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "turnId" INTEGER NOT NULL,
    "userId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "FinishedTurn_turnId_fkey" FOREIGN KEY ("turnId") REFERENCES "Turn" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "FinishedTurn_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_FinishedTurn" ("createdAt", "id", "turnId", "updatedAt") SELECT "createdAt", "id", "turnId", "updatedAt" FROM "FinishedTurn";
DROP TABLE "FinishedTurn";
ALTER TABLE "new_FinishedTurn" RENAME TO "FinishedTurn";
CREATE UNIQUE INDEX "FinishedTurn_turnId_key" ON "FinishedTurn"("turnId");
CREATE TABLE "new_UnfinishedTurn" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "turnId" INTEGER NOT NULL,
    "userId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "UnfinishedTurn_turnId_fkey" FOREIGN KEY ("turnId") REFERENCES "Turn" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "UnfinishedTurn_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_UnfinishedTurn" ("createdAt", "id", "turnId", "updatedAt") SELECT "createdAt", "id", "turnId", "updatedAt" FROM "UnfinishedTurn";
DROP TABLE "UnfinishedTurn";
ALTER TABLE "new_UnfinishedTurn" RENAME TO "UnfinishedTurn";
CREATE UNIQUE INDEX "UnfinishedTurn_turnId_key" ON "UnfinishedTurn"("turnId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
