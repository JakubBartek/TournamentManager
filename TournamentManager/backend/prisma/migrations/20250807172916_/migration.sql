/*
  Warnings:

  - A unique constraint covering the columns `[gameId]` on the table `PlacementGame` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Game" ADD COLUMN "placementGameId" TEXT;
ALTER TABLE "Game" ADD COLUMN "result" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "PlacementGame_gameId_key" ON "PlacementGame"("gameId");
