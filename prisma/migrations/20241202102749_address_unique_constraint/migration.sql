/*
  Warnings:

  - You are about to drop the column `wilaya` on the `Address` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[wilayaValue,commune,address]` on the table `Address` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `stationName` to the `Address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `wilayaLabel` to the `Address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `wilayaValue` to the `Address` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Address" DROP COLUMN "wilaya",
ADD COLUMN     "stationName" TEXT NOT NULL,
ADD COLUMN     "wilayaLabel" TEXT NOT NULL,
ADD COLUMN     "wilayaValue" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Address_wilayaValue_commune_address_key" ON "Address"("wilayaValue", "commune", "address");
