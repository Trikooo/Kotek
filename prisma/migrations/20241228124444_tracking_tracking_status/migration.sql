/*
  Warnings:

  - Added the required column `trackingStatus` to the `Tracking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Tracking" ADD COLUMN     "trackingStatus" "OrderStatus" NOT NULL;
