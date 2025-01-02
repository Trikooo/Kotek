/*
  Warnings:

  - You are about to drop the column `tracking` on the `Order` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Order" DROP COLUMN "tracking";

-- AlterTable
ALTER TABLE "OrderItem" ADD COLUMN     "trackingId" UUID;

-- CreateTable
CREATE TABLE "Tracking" (
    "id" UUID NOT NULL,
    "trackingNumber" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "orderId" UUID NOT NULL,

    CONSTRAINT "Tracking_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Tracking_trackingNumber_key" ON "Tracking"("trackingNumber");

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_trackingId_fkey" FOREIGN KEY ("trackingId") REFERENCES "Tracking"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tracking" ADD CONSTRAINT "Tracking_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;
