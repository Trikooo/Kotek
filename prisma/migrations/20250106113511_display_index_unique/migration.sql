/*
  Warnings:

  - A unique constraint covering the columns `[displayIndex]` on the table `CarouselItem` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "CarouselItem_displayIndex_key" ON "CarouselItem"("displayIndex");
