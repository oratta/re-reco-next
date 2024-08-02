/*
  Warnings:

  - You are about to drop the column `groupId` on the `Cast` table. All the data in the column will be lost.
  - You are about to drop the column `areaId` on the `JobListing` table. All the data in the column will be lost.
  - You are about to drop the column `castId` on the `JobReservationRate` table. All the data in the column will be lost.
  - Added the required column `areaCode` to the `Cast` table without a default value. This is not possible if the table is not empty.
  - Added the required column `groupCode` to the `Cast` table without a default value. This is not possible if the table is not empty.
  - Added the required column `areaCode` to the `Group` table without a default value. This is not possible if the table is not empty.
  - Added the required column `areaCode` to the `JobListing` table without a default value. This is not possible if the table is not empty.
  - Added the required column `castCode` to the `JobReservationRate` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Cast" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "areaCode" TEXT NOT NULL,
    "groupCode" TEXT NOT NULL,
    "averageTotalCount" REAL NOT NULL,
    "totalReservationRate" REAL NOT NULL,
    "recent1ReservationRate" REAL NOT NULL,
    "recent5ReservationRate" REAL NOT NULL,
    "recent30daysReservationRate" REAL NOT NULL,
    "reservationUrl" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Cast_groupCode_fkey" FOREIGN KEY ("groupCode") REFERENCES "Group" ("code") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Cast_areaCode_fkey" FOREIGN KEY ("areaCode") REFERENCES "Area" ("code") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Cast" ("averageTotalCount", "code", "createdAt", "id", "name", "recent1ReservationRate", "recent30daysReservationRate", "recent5ReservationRate", "reservationUrl", "totalReservationRate", "updatedAt") SELECT "averageTotalCount", "code", "createdAt", "id", "name", "recent1ReservationRate", "recent30daysReservationRate", "recent5ReservationRate", "reservationUrl", "totalReservationRate", "updatedAt" FROM "Cast";
DROP TABLE "Cast";
ALTER TABLE "new_Cast" RENAME TO "Cast";
CREATE UNIQUE INDEX "Cast_code_key" ON "Cast"("code");
CREATE TABLE "new_Group" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "areaCode" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "totalReservationRate" REAL NOT NULL,
    "recent1ReservationRate" REAL NOT NULL,
    "recent5ReservationRate" REAL NOT NULL,
    "recent30daysReservationRate" REAL NOT NULL,
    "reservationListUrl" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Group_areaCode_fkey" FOREIGN KEY ("areaCode") REFERENCES "Area" ("code") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Group" ("code", "createdAt", "id", "name", "recent1ReservationRate", "recent30daysReservationRate", "recent5ReservationRate", "reservationListUrl", "totalReservationRate", "updatedAt") SELECT "code", "createdAt", "id", "name", "recent1ReservationRate", "recent30daysReservationRate", "recent5ReservationRate", "reservationListUrl", "totalReservationRate", "updatedAt" FROM "Group";
DROP TABLE "Group";
ALTER TABLE "new_Group" RENAME TO "Group";
CREATE UNIQUE INDEX "Group_code_key" ON "Group"("code");
CREATE TABLE "new_JobListing" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "status" TEXT NOT NULL,
    "areaCode" TEXT NOT NULL,
    "targetDate" DATETIME NOT NULL,
    "listCount" INTEGER NOT NULL,
    "condition" TEXT NOT NULL,
    "result" TEXT,
    "startedAt" DATETIME,
    "completedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "JobListing_areaCode_fkey" FOREIGN KEY ("areaCode") REFERENCES "Area" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_JobListing" ("completedAt", "condition", "createdAt", "id", "listCount", "result", "startedAt", "status", "targetDate", "updatedAt") SELECT "completedAt", "condition", "createdAt", "id", "listCount", "result", "startedAt", "status", "targetDate", "updatedAt" FROM "JobListing";
DROP TABLE "JobListing";
ALTER TABLE "new_JobListing" RENAME TO "JobListing";
CREATE TABLE "new_JobReservationRate" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "status" TEXT NOT NULL,
    "castCode" TEXT NOT NULL,
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
    CONSTRAINT "JobReservationRate_castCode_fkey" FOREIGN KEY ("castCode") REFERENCES "Cast" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_JobReservationRate" ("areaCode", "completedAt", "createdAt", "emptyCount", "groupCode", "id", "isLastList", "jobListingId", "reservedCount", "reservedRate", "result", "startedAt", "status", "totalCount", "updatedAt") SELECT "areaCode", "completedAt", "createdAt", "emptyCount", "groupCode", "id", "isLastList", "jobListingId", "reservedCount", "reservedRate", "result", "startedAt", "status", "totalCount", "updatedAt" FROM "JobReservationRate";
DROP TABLE "JobReservationRate";
ALTER TABLE "new_JobReservationRate" RENAME TO "JobReservationRate";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
