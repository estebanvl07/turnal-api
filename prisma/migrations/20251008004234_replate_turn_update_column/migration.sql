/*
  Warnings:

  - You are about to drop the column `ñupdatedAt` on the `TurnComments` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `TurnComments` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_TurnComments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "comment" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "turnId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "TurnComments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "TurnComments_turnId_fkey" FOREIGN KEY ("turnId") REFERENCES "Turn" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_TurnComments" ("comment", "createdAt", "id", "turnId", "userId") SELECT "comment", "createdAt", "id", "turnId", "userId" FROM "TurnComments";
DROP TABLE "TurnComments";
ALTER TABLE "new_TurnComments" RENAME TO "TurnComments";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
