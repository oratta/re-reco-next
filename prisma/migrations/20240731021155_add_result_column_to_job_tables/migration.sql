-- CreateTable
CREATE TABLE "Cast" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "averageTotalCount" REAL NOT NULL,
    "totalReservationRate" REAL NOT NULL,
    "recent1ReservationRate" REAL NOT NULL,
    "recent5ReservationRate" REAL NOT NULL,
    "recent30daysReservationRate" REAL NOT NULL,
    "reservationUrl" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Cast_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Group" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "totalReservationRate" REAL NOT NULL,
    "recent1ReservationRate" REAL NOT NULL,
    "recent5ReservationRate" REAL NOT NULL,
    "recent30daysReservationRate" REAL NOT NULL,
    "reservationListUrl" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Area" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "JobListing" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "status" TEXT NOT NULL,
    "areaId" TEXT NOT NULL,
    "targetDate" DATETIME NOT NULL,
    "listCount" INTEGER NOT NULL,
    "condition" TEXT NOT NULL,
    "result" TEXT,
    "startedAt" DATETIME,
    "completedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "JobListing_areaId_fkey" FOREIGN KEY ("areaId") REFERENCES "Area" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "JobReservationRate" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "status" TEXT NOT NULL,
    "castId" TEXT NOT NULL,
    "areaCode" TEXT NOT NULL,
    "groupCode" TEXT NOT NULL,
    "reservedRate" REAL NOT NULL,
    "reservedCount" INTEGER NOT NULL,
    "emptyCount" INTEGER NOT NULL,
    "totalCount" INTEGER NOT NULL,
    "result" TEXT,
    "jobListingId" TEXT NOT NULL,
    "isLastList" BOOLEAN NOT NULL,
    "startedAt" DATETIME,
    "completedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "JobReservationRate_jobListingId_fkey" FOREIGN KEY ("jobListingId") REFERENCES "JobListing" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "JobReservationRate_castId_fkey" FOREIGN KEY ("castId") REFERENCES "Cast" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Job" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "status" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "startedAt" DATETIME,
    "completedAt" DATETIME,
    "result" TEXT
);

-- CreateIndex
CREATE UNIQUE INDEX "Cast_code_key" ON "Cast"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Group_code_key" ON "Group"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Area_code_key" ON "Area"("code");
