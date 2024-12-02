/*
  Warnings:

  - Added the required column `stationCode` to the `Address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stopDesk` to the `Address` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Address" ADD COLUMN     "stationCode" TEXT NOT NULL,
ADD COLUMN     "stopDesk" BOOLEAN NOT NULL;
