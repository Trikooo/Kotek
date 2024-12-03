/*
  Warnings:

  - Added the required column `shippingPrice` to the `Address` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Address" ADD COLUMN     "shippingPrice" INTEGER NOT NULL;
