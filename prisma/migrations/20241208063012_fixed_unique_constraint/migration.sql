/*
  Warnings:

  - A unique constraint covering the columns `[wilayaValue,commune,address,userId]` on the table `Address` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Address_wilayaValue_commune_address_key";

-- CreateIndex
CREATE UNIQUE INDEX "Address_wilayaValue_commune_address_userId_key" ON "Address"("wilayaValue", "commune", "address", "userId");
