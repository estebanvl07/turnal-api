-- CreateTable
CREATE TABLE "Ips" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "nit" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Services" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "icon" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "state" INTEGER NOT NULL DEFAULT 1,
    "ipsId" TEXT NOT NULL,
    CONSTRAINT "Services_ipsId_fkey" FOREIGN KEY ("ipsId") REFERENCES "Ips" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CareCenter" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "ipsId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CareCenter_ipsId_fkey" FOREIGN KEY ("ipsId") REFERENCES "Ips" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CareCenterServices" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "careCenterId" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "prefix" TEXT NOT NULL,
    "state" INTEGER NOT NULL DEFAULT 1,
    CONSTRAINT "CareCenterServices_careCenterId_fkey" FOREIGN KEY ("careCenterId") REFERENCES "CareCenter" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "CareCenterServices_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Services" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PlaceOfCareServices" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "placeOfCareId" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    CONSTRAINT "PlaceOfCareServices_placeOfCareId_fkey" FOREIGN KEY ("placeOfCareId") REFERENCES "PlacesOfCare" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "PlaceOfCareServices_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "CareCenterServices" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PlacesOfCare" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "centerId" TEXT NOT NULL,
    "userId" TEXT,
    CONSTRAINT "PlacesOfCare_centerId_fkey" FOREIGN KEY ("centerId") REFERENCES "CareCenter" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "PlacesOfCare_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "password" TEXT NOT NULL,
    "ipsId" TEXT NOT NULL,
    "centerId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "state" INTEGER NOT NULL DEFAULT 1,
    CONSTRAINT "User_ipsId_fkey" FOREIGN KEY ("ipsId") REFERENCES "Ips" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "User_centerId_fkey" FOREIGN KEY ("centerId") REFERENCES "CareCenter" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "RefreshToken" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "revoked" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" DATETIME NOT NULL,
    CONSTRAINT "RefreshToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Priority" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Turn" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "code" TEXT NOT NULL,
    "statusId" INTEGER NOT NULL,
    "serviceId" TEXT NOT NULL,
    "careCenterId" TEXT,
    "identification" TEXT NOT NULL,
    "userId" TEXT,
    "isPriority" BOOLEAN NOT NULL DEFAULT false,
    "priorityId" INTEGER,
    "placesOfCareId" TEXT NOT NULL,
    "ipsId" TEXT NOT NULL,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Turn_ipsId_fkey" FOREIGN KEY ("ipsId") REFERENCES "Ips" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Turn_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Services" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Turn_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "TurnStatus" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Turn_priorityId_fkey" FOREIGN KEY ("priorityId") REFERENCES "Priority" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Turn_placesOfCareId_fkey" FOREIGN KEY ("placesOfCareId") REFERENCES "PlacesOfCare" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Turn_careCenterId_fkey" FOREIGN KEY ("careCenterId") REFERENCES "CareCenter" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TurnComments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "comment" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "turnId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ñupdatedAt" DATETIME NOT NULL,
    CONSTRAINT "TurnComments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "TurnComments_turnId_fkey" FOREIGN KEY ("turnId") REFERENCES "Turn" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TurnStatusHistory" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "turnId" INTEGER NOT NULL,
    "statusId" INTEGER NOT NULL,
    "enteredAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "exitedAt" DATETIME,
    "durationSeconds" INTEGER,
    "performedById" TEXT,
    "meta" JSONB,
    CONSTRAINT "TurnStatusHistory_turnId_fkey" FOREIGN KEY ("turnId") REFERENCES "Turn" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "TurnStatusHistory_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "TurnStatus" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "TurnStatusHistory_performedById_fkey" FOREIGN KEY ("performedById") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TurnStatus" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "careCenterId" TEXT NOT NULL,
    "ipsId" TEXT NOT NULL,
    CONSTRAINT "TurnStatus_careCenterId_fkey" FOREIGN KEY ("careCenterId") REFERENCES "CareCenter" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Ips_nit_key" ON "Ips"("nit");

-- CreateIndex
CREATE INDEX "Ips_id_nit_idx" ON "Ips"("id", "nit");

-- CreateIndex
CREATE INDEX "Services_id_ipsId_idx" ON "Services"("id", "ipsId");

-- CreateIndex
CREATE INDEX "CareCenter_id_ipsId_idx" ON "CareCenter"("id", "ipsId");

-- CreateIndex
CREATE UNIQUE INDEX "CareCenterServices_careCenterId_prefix_key" ON "CareCenterServices"("careCenterId", "prefix");

-- CreateIndex
CREATE INDEX "PlaceOfCareServices_id_placeOfCareId_idx" ON "PlaceOfCareServices"("id", "placeOfCareId");

-- CreateIndex
CREATE INDEX "PlacesOfCare_id_centerId_idx" ON "PlacesOfCare"("id", "centerId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_id_ipsId_idx" ON "User"("id", "ipsId");

-- CreateIndex
CREATE UNIQUE INDEX "RefreshToken_tokenHash_key" ON "RefreshToken"("tokenHash");

-- CreateIndex
CREATE INDEX "Turn_ipsId_serviceId_idx" ON "Turn"("ipsId", "serviceId");

-- CreateIndex
CREATE INDEX "Turn_ipsId_createdAt_idx" ON "Turn"("ipsId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Turn_code_ipsId_date_key" ON "Turn"("code", "ipsId", "date");

-- CreateIndex
CREATE INDEX "TurnStatusHistory_turnId_enteredAt_idx" ON "TurnStatusHistory"("turnId", "enteredAt");

-- CreateIndex
CREATE INDEX "TurnStatusHistory_statusId_enteredAt_idx" ON "TurnStatusHistory"("statusId", "enteredAt");

-- CreateIndex
CREATE UNIQUE INDEX "TurnStatus_name_key" ON "TurnStatus"("name");
