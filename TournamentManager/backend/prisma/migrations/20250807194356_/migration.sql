/*
  Warnings:

  - You are about to drop the column `playOffStage` on the `Tournament` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Tournament" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'GROUPS',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "gameType" TEXT NOT NULL DEFAULT 'GROUP',
    "adminPasswordHash" TEXT,
    "gameDuration" INTEGER DEFAULT 60,
    "breakDuration" INTEGER DEFAULT 15,
    "zamboniDuration" INTEGER DEFAULT 10,
    "zamboniInterval" INTEGER DEFAULT 60,
    "dailyStartTime" TEXT,
    "dailyEndTime" TEXT
);
INSERT INTO "new_Tournament" ("adminPasswordHash", "breakDuration", "createdAt", "dailyEndTime", "dailyStartTime", "endDate", "gameDuration", "id", "location", "name", "startDate", "type", "updatedAt", "zamboniDuration", "zamboniInterval") SELECT "adminPasswordHash", "breakDuration", "createdAt", "dailyEndTime", "dailyStartTime", "endDate", "gameDuration", "id", "location", "name", "startDate", "type", "updatedAt", "zamboniDuration", "zamboniInterval" FROM "Tournament";
DROP TABLE "Tournament";
ALTER TABLE "new_Tournament" RENAME TO "Tournament";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
