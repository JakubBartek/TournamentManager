-- CreateTable
CREATE TABLE "PlacementGame" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "gameId" TEXT NOT NULL,
    "placement" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "PlacementGame_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "FinalPlacement" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tournamentId" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "placement" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "FinalPlacement_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "Tournament" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "FinalPlacement_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

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
    "playOffStage" TEXT DEFAULT 'ROUND_OF_16',
    "adminPasswordHash" TEXT,
    "gameDuration" INTEGER DEFAULT 60,
    "breakDuration" INTEGER DEFAULT 15,
    "zamboniDuration" INTEGER DEFAULT 10,
    "zamboniInterval" INTEGER DEFAULT 60,
    "dailyStartTime" TEXT,
    "dailyEndTime" TEXT
);
INSERT INTO "new_Tournament" ("adminPasswordHash", "breakDuration", "createdAt", "dailyEndTime", "dailyStartTime", "endDate", "gameDuration", "id", "location", "name", "playOffStage", "startDate", "type", "updatedAt", "zamboniDuration", "zamboniInterval") SELECT "adminPasswordHash", "breakDuration", "createdAt", "dailyEndTime", "dailyStartTime", "endDate", "gameDuration", "id", "location", "name", "playOffStage", "startDate", "type", "updatedAt", "zamboniDuration", "zamboniInterval" FROM "Tournament";
DROP TABLE "Tournament";
ALTER TABLE "new_Tournament" RENAME TO "Tournament";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
