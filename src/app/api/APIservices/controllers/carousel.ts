import { CarouselItem } from "@prisma/client";
import prisma from "../lib/prisma";
import {
  createCarouselItemSchema,
  updateCarouselItemSchema,
} from "../lib/validation";
import { r2Client } from "./r2";

export async function getAllCarouselItems() {
  return await prisma.carouselItem.findMany();
}

export async function getActiveCarouselItems() {
  return await prisma.carouselItem.findMany({
    where: {
      isActive: true,
    },
  });
}
export async function createCarouselItem(data: {
  [k: string]: FormDataEntryValue;
}) {
  const validatedData = createCarouselItemSchema.parse(data);
  const r2Urls = await r2Client.uploadImages(
    [validatedData.image],
    `carouselItem/${validatedData.displayIndex}`
  );
  const carouselItem = await prisma.carouselItem.create({
    data: {
      ...validatedData,
      imageUrl: r2Urls[0],
    },
  });
  return carouselItem;
}
export async function updateCarouselItem(
  id: string,
  data: { [k: string]: FormDataEntryValue }
) {
  // validate data
  const validatedData = updateCarouselItemSchema.parse(data);
  let r2Urls;

  // if data has new image file, delete previous and post new.
  if (validatedData.image) {
    r2Client.deleteImages([validatedData.imageUrl]);
    r2Urls = await r2Client.uploadImages(
      [validatedData.image],
      `carouselItem/${validatedData.displayIndex}`
    );
  }
  const { image, ...queryData } = validatedData;
  const updatedCarouselItem = await prisma.carouselItem.update({
    where: {
      id: id,
    },
    data: {
      ...queryData,
      imageUrl: r2Urls ? r2Urls[0] : queryData.imageUrl,
    },
  });
  return updatedCarouselItem;
}

export async function deleteCarouselItem(id: string) {
  return await prisma.carouselItem.delete({
    where: {
      id: id,
    },
  });
}

export async function updateCarouselItemsOrder(
  carouselItems: Partial<CarouselItem>[]
) {
  const isUnique = areDisplayIndicesUnique(carouselItems);
  if (!isUnique) {
    throw new Error(
      "Each displayIndex must be unique. Duplicate values were found."
    );
  }
  const updatePromises = carouselItems.map((item) =>
    prisma.carouselItem.update({
      where: {
        id: item.id,
      },
      data: {
        displayIndex: item.displayIndex,
      },
    })
  );
  return await Promise.all(updatePromises);
}

function areDisplayIndicesUnique(
  carouselItems: Partial<CarouselItem>[]
): boolean {
  const indices = carouselItems.map((item) => item.displayIndex);
  const uniqueIndices = new Set(indices);
  return uniqueIndices.size === indices.length;
}
