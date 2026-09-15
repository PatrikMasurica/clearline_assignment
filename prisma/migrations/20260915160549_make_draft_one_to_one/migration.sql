/*
  Warnings:

  - A unique constraint covering the columns `[requestId]` on the table `Draft` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Draft_requestId_key" ON "Draft"("requestId");
