-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Game" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "team1Id" TEXT,
    "team2Id" TEXT,
    "score1" INTEGER NOT NULL DEFAULT 0,
    "score2" INTEGER NOT NULL DEFAULT 0,
    "rinkId" TEXT,
    "rinkName" TEXT,
    "date" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "tournamentId" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'GROUP',
    "groupId" TEXT,
    "teamId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'SCHEDULED',
    "placementGameId" TEXT,
    "result" TEXT,
    "name" TEXT,
    CONSTRAINT "Game_team1Id_fkey" FOREIGN KEY ("team1Id") REFERENCES "Team" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Game_team2Id_fkey" FOREIGN KEY ("team2Id") REFERENCES "Team" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Game_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "Tournament" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Game_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Game_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Game" ("createdAt", "date", "groupId", "id", "name", "placementGameId", "result", "rinkId", "rinkName", "score1", "score2", "status", "team1Id", "team2Id", "teamId", "tournamentId", "updatedAt") SELECT "createdAt", "date", "groupId", "id", "name", "placementGameId", "result", "rinkId", "rinkName", "score1", "score2", "status", "team1Id", "team2Id", "teamId", "tournamentId", "updatedAt" FROM "Game";
DROP TABLE "Game";
ALTER TABLE "new_Game" RENAME TO "Game";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
