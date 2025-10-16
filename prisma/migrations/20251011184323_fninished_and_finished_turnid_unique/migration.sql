/*
  Warnings:

  - You are about to drop the `finishedTurn` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[turnId]` on the table `UnfinishedTurn` will be added. If there are existing duplicate values, this will fail.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "finishedTurn";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "FinishedTurn" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "turnId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "FinishedTurn_turnId_fkey" FOREIGN KEY ("turnId") REFERENCES "Turn" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "FinishedTurn_turnId_key" ON "FinishedTurn"("turnId");

-- CreateIndex
CREATE UNIQUE INDEX "UnfinishedTurn_turnId_key" ON "UnfinishedTurn"("turnId");
