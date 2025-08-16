-- AlterTable
ALTER TABLE "Tournament" ADD COLUMN "dailyEndTime" TEXT;
ALTER TABLE "Tournament" ADD COLUMN "dailyStartTime" TEXT;
ALTER TABLE "Tournament" ADD COLUMN "playOffStage" TEXT DEFAULT 'ROUND_OF_16';

-- CreateTable
CREATE TABLE "ZamboniTime" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tournamentId" TEXT NOT NULL,
    "startTime" DATETIME NOT NULL,
    "endTime" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ZamboniTime_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "Tournament" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
