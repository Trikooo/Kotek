/*
  Warnings:

  - Made the column `title` on table `CarouselItem` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "CarouselItem" ALTER COLUMN "title" SET NOT NULL;
