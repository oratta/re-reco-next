/*
  Warnings:

  - Made the column `castCode` on table `JobReservationRate` required. This step will fail if there are existing NULL values in that column.
  - Made the column `groupCode` on table `JobReservationRate` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
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
    CONSTRAINT "JobReservationRate_castCode_fkey" FOREIGN KEY ("castCode") REFERENCES "Cast" ("code") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "JobReservationRate_groupCode_fkey" FOREIGN KEY ("groupCode") REFERENCES "Group" ("code") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "JobReservationRate_areaCode_fkey" FOREIGN KEY ("areaCode") REFERENCES "Area" ("code") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_JobReservationRate" ("areaCode", "castCode", "completedAt", "createdAt", "emptyCount", "groupCode", "id", "isLastList", "jobListingId", "reservedCount", "reservedRate", "result", "startedAt", "status", "totalCount", "updatedAt") SELECT "areaCode", "castCode", "completedAt", "createdAt", "emptyCount", "groupCode", "id", "isLastList", "jobListingId", "reservedCount", "reservedRate", "result", "startedAt", "status", "totalCount", "updatedAt" FROM "JobReservationRate";
DROP TABLE "JobReservationRate";
ALTER TABLE "new_JobReservationRate" RENAME TO "JobReservationRate";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
