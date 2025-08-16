/*
  Warnings:

  - A unique constraint covering the columns `[teamId]` on the table `Standing` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Standing_teamId_key" ON "Standing"("teamId");
