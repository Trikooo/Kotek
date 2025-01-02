/*
  Warnings:

  - A unique constraint covering the columns `[wilayaValue,commune,address,userId,fullName,phoneNumber]` on the table `Address` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Address_wilayaValue_commune_address_userId_key";

-- CreateIndex
CREATE UNIQUE INDEX "Address_wilayaValue_commune_address_userId_fullName_phoneNu_key" ON "Address"("wilayaValue", "commune", "address", "userId", "fullName", "phoneNumber");
