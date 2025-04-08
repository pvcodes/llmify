/*
  Warnings:

  - You are about to drop the column `lastPaymentOrderId` on the `PaypalOrderDetails` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[paymentOrderId]` on the table `Billing` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "PaypalOrderDetails_lastPaymentOrderId_key";

-- AlterTable
ALTER TABLE "Billing" ADD COLUMN     "paymentOrderId" TEXT;

-- AlterTable
ALTER TABLE "PaypalOrderDetails" DROP COLUMN "lastPaymentOrderId";

-- CreateIndex
CREATE UNIQUE INDEX "Billing_paymentOrderId_key" ON "Billing"("paymentOrderId");
