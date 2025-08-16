-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Standing" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tournamentId" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "teamName" TEXT NOT NULL,
    "groupId" TEXT,
    "wins" INTEGER NOT NULL DEFAULT 0,
    "draws" INTEGER NOT NULL DEFAULT 0,
    "losses" INTEGER NOT NULL DEFAULT 0,
    "goalsFor" INTEGER NOT NULL DEFAULT 0,
    "goalsAgainst" INTEGER NOT NULL DEFAULT 0,
    "points" INTEGER NOT NULL DEFAULT 0,
    "position" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "Standing_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "Tournament" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Standing_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Standing_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Standing" ("draws", "goalsAgainst", "goalsFor", "groupId", "id", "losses", "points", "position", "teamId", "teamName", "tournamentId", "wins") SELECT "draws", "goalsAgainst", "goalsFor", "groupId", "id", "losses", "points", "position", "teamId", "teamName", "tournamentId", "wins" FROM "Standing";
DROP TABLE "Standing";
ALTER TABLE "new_Standing" RENAME TO "Standing";
CREATE UNIQUE INDEX "Standing_teamId_key" ON "Standing"("teamId");
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
    "gameDuration" INTEGER DEFAULT 20,
    "breakDuration" INTEGER DEFAULT 5,
    "zamboniDuration" INTEGER DEFAULT 10,
    "zamboniInterval" INTEGER DEFAULT 90,
    "dailyStartTime" TEXT,
    "dailyEndTime" TEXT
);
INSERT INTO "new_Tournament" ("adminPasswordHash", "breakDuration", "createdAt", "dailyEndTime", "dailyStartTime", "endDate", "gameDuration", "gameType", "id", "location", "name", "startDate", "type", "updatedAt", "zamboniDuration", "zamboniInterval") SELECT "adminPasswordHash", "breakDuration", "createdAt", "dailyEndTime", "dailyStartTime", "endDate", "gameDuration", "gameType", "id", "location", "name", "startDate", "type", "updatedAt", "zamboniDuration", "zamboniInterval" FROM "Tournament";
DROP TABLE "Tournament";
ALTER TABLE "new_Tournament" RENAME TO "Tournament";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
