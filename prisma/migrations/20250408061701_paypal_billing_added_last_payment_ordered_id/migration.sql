/*
  Warnings:

  - A unique constraint covering the columns `[lastPaymentOrderId]` on the table `PaypalOrderDetails` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `lastPaymentOrderId` to the `PaypalOrderDetails` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PaypalOrderDetails" ADD COLUMN     "lastPaymentOrderId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "PaypalOrderDetails_lastPaymentOrderId_key" ON "PaypalOrderDetails"("lastPaymentOrderId");
