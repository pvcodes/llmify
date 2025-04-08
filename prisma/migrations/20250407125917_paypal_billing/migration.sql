-- CreateEnum
CREATE TYPE "PaypalOrderStatus" AS ENUM ('CREATED', 'COMPLETED', 'FAILED');

-- CreateTable
CREATE TABLE "PaypalOrderDetails" (
    "id" SERIAL NOT NULL,
    "orderId" TEXT NOT NULL,
    "tier" "BillingLevel" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "PaypalOrderStatus" NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "PaypalOrderDetails_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PaypalOrderDetails_orderId_key" ON "PaypalOrderDetails"("orderId");

-- AddForeignKey
ALTER TABLE "PaypalOrderDetails" ADD CONSTRAINT "PaypalOrderDetails_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
