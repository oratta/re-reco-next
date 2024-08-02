-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Cast" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "name" TEXT,
    "age" INTEGER,
    "height" INTEGER,
    "bust" INTEGER,
    "cup" TEXT,
    "waist" INTEGER,
    "hip" INTEGER,
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
INSERT INTO "new_Cast" ("areaCode", "averageTotalCount", "code", "createdAt", "groupCode", "id", "name", "recent1ReservationRate", "recent30daysReservationRate", "recent5ReservationRate", "reservationUrl", "totalReservationRate", "updatedAt") SELECT "areaCode", "averageTotalCount", "code", "createdAt", "groupCode", "id", "name", "recent1ReservationRate", "recent30daysReservationRate", "recent5ReservationRate", "reservationUrl", "totalReservationRate", "updatedAt" FROM "Cast";
DROP TABLE "Cast";
ALTER TABLE "new_Cast" RENAME TO "Cast";
CREATE UNIQUE INDEX "Cast_code_key" ON "Cast"("code");
CREATE TABLE "new_Group" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "areaCode" TEXT NOT NULL,
    "name" TEXT,
    "totalReservationRate" REAL NOT NULL,
    "recent1ReservationRate" REAL NOT NULL,
    "recent5ReservationRate" REAL NOT NULL,
    "recent30daysReservationRate" REAL NOT NULL,
    "reservationListUrl" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Group_areaCode_fkey" FOREIGN KEY ("areaCode") REFERENCES "Area" ("code") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Group" ("areaCode", "code", "createdAt", "id", "name", "recent1ReservationRate", "recent30daysReservationRate", "recent5ReservationRate", "reservationListUrl", "totalReservationRate", "updatedAt") SELECT "areaCode", "code", "createdAt", "id", "name", "recent1ReservationRate", "recent30daysReservationRate", "recent5ReservationRate", "reservationListUrl", "totalReservationRate", "updatedAt" FROM "Group";
DROP TABLE "Group";
ALTER TABLE "new_Group" RENAME TO "Group";
CREATE UNIQUE INDEX "Group_code_key" ON "Group"("code");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
