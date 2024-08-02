-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
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
    CONSTRAINT "JobListing_areaCode_fkey" FOREIGN KEY ("areaCode") REFERENCES "Area" ("code") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_JobListing" ("areaCode", "completedAt", "condition", "createdAt", "id", "listCount", "result", "startedAt", "status", "targetDate", "updatedAt") SELECT "areaCode", "completedAt", "condition", "createdAt", "id", "listCount", "result", "startedAt", "status", "targetDate", "updatedAt" FROM "JobListing";
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
    CONSTRAINT "JobReservationRate_castCode_fkey" FOREIGN KEY ("castCode") REFERENCES "Cast" ("code") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_JobReservationRate" ("areaCode", "castCode", "completedAt", "createdAt", "emptyCount", "groupCode", "id", "isLastList", "jobListingId", "reservedCount", "reservedRate", "result", "startedAt", "status", "totalCount", "updatedAt") SELECT "areaCode", "castCode", "completedAt", "createdAt", "emptyCount", "groupCode", "id", "isLastList", "jobListingId", "reservedCount", "reservedRate", "result", "startedAt", "status", "totalCount", "updatedAt" FROM "JobReservationRate";
DROP TABLE "JobReservationRate";
ALTER TABLE "new_JobReservationRate" RENAME TO "JobReservationRate";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
