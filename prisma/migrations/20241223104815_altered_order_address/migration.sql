/*
  Warnings:

  - You are about to drop the column `shippingPrice` on the `Address` table. All the data in the column will be lost.
  - Added the required column `baseShippingPrice` to the `Address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ShippingPrice` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Address" DROP COLUMN "shippingPrice",
ADD COLUMN     "baseShippingPrice" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "ShippingPrice" INTEGER NOT NULL;
