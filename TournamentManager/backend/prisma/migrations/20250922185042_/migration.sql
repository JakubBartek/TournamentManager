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
    "groupGamesInARow" INTEGER NOT NULL DEFAULT 1,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "gameType" TEXT NOT NULL DEFAULT 'GROUP',
    "adminPasswordHash" TEXT,
    "gameDuration" INTEGER DEFAULT 0,
    "breakDuration" INTEGER DEFAULT 0,
    "zamboniDuration" INTEGER DEFAULT 0,
    "zamboniInterval" INTEGER DEFAULT 0,
    "dailyStartTime" TEXT,
    "dailyEndTime" TEXT
);
INSERT INTO "new_Tournament" ("adminPasswordHash", "breakDuration", "createdAt", "dailyEndTime", "dailyStartTime", "endDate", "gameDuration", "gameType", "id", "location", "name", "startDate", "type", "updatedAt", "zamboniDuration", "zamboniInterval") SELECT "adminPasswordHash", "breakDuration", "createdAt", "dailyEndTime", "dailyStartTime", "endDate", "gameDuration", "gameType", "id", "location", "name", "startDate", "type", "updatedAt", "zamboniDuration", "zamboniInterval" FROM "Tournament";
DROP TABLE "Tournament";
ALTER TABLE "new_Tournament" RENAME TO "Tournament";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
