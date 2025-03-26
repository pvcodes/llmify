-- CreateTable
CREATE TABLE "ChatSummary" (
    "id" SERIAL NOT NULL,
    "chatId" TEXT NOT NULL,
    "summary" TEXT NOT NULL,

    CONSTRAINT "ChatSummary_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ChatSummary" ADD CONSTRAINT "ChatSummary_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "Chat"("id") ON DELETE CASCADE ON UPDATE CASCADE;
