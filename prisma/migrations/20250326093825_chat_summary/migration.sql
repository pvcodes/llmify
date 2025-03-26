/*
  Warnings:

  - A unique constraint covering the columns `[chatId]` on the table `ChatSummary` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ChatSummary_chatId_key" ON "ChatSummary"("chatId");
