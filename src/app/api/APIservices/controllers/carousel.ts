import { CarouselItem, Prisma } from "@prisma/client";
import prisma from "../lib/prisma";
import {
  createCarouselItemSchema,
  updateCarouselItemSchema,
} from "../lib/validation";
import { r2Client } from "./r2";

export async function getAllCarouselItems() {
  return await prisma.carouselItem.findMany({
    orderBy: { displayIndex: "asc" },
  });
}

export async function getActiveCarouselItems() {
  return await prisma.carouselItem.findMany({
    where: {
      isActive: true,
    },

    orderBy: { displayIndex: "asc" },
  });
}
export async function createCarouselItem(data: {
  [k: string]: FormDataEntryValue;
}) {
  const validatedData = createCarouselItemSchema.parse(data);
  const displayIndex = (await prisma.carouselItem.count()) + 1;
  const r2Urls = await r2Client.uploadImages(
    [validatedData.image],
    `carouselItems`
  );
  const { image, ...createData } = validatedData;
  const carouselItem = await prisma.carouselItem.create({
    data: {
      ...createData,
      imageUrl: r2Urls[0],
      displayIndex: displayIndex,
    },
  });
  return carouselItem;
}
export async function updateCarouselItem(
  id: string,
  data: { [k: string]: FormDataEntryValue }
) {
  // validate data
  const dataToValidate: any = { ...data };
  if (dataToValidate.isActive === "true") {
    dataToValidate.isActive = true;
  } else {
    dataToValidate.isActive = false;
  }
  if (dataToValidate.displayIndex) {
    dataToValidate.displayIndex = parseInt(dataToValidate.displayIndex);
  }
  const validatedData = updateCarouselItemSchema.parse(dataToValidate);
  let r2Urls;

  // if data has new image file, delete previous and post new.
  if (validatedData.image) {
    r2Client.deleteImages([validatedData.imageUrl]);
    r2Urls = await r2Client.uploadImages([validatedData.image], `carouselItem`);
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

export async function deleteCarouselItem(
  id: string,
  newDisplayIndices: Partial<CarouselItem>[]
) {
  const deletedItem = await prisma.carouselItem.delete({
    where: {
      id: id,
    },
  });
  await updateCarouselItemsDisplayIndices(newDisplayIndices);
  if (deletedItem) await r2Client.deleteImages([deletedItem.imageUrl]);
  else throw new Error("not found");
  return deletedItem;
}

export async function updateCarouselItemsDisplayIndices(
  carouselItems: Partial<CarouselItem>[]
) {
  const isUnique = areDisplayIndicesUnique(carouselItems);
  if (!isUnique) {
    throw new Error(
      "Each displayIndex must be unique. Duplicate values were found."
    );
  }

  return await prisma.$transaction(async (tx) => {
    // First, update all items to have temporary negative indices
    // This avoids conflicts during the update process
    await tx.carouselItem.updateMany({
      where: { id: { in: carouselItems.map((item) => item.id!) } },
      data: {
        displayIndex: {
          multiply: -1,
        },
      },
    });

    // Then, update each item with its new display index
    for (const item of carouselItems) {
      await tx.carouselItem.update({
        where: { id: item.id },
        data: { displayIndex: item.displayIndex },
      });
    }

    // Return the updated items
    return await tx.carouselItem.findMany({
      where: { id: { in: carouselItems.map((item) => item.id!) } },
    });
  });
}

function areDisplayIndicesUnique(
  carouselItems: Partial<CarouselItem>[]
): boolean {
  const indices = carouselItems.map((item) => item.displayIndex);
  const uniqueIndices = new Set(indices);
  return uniqueIndices.size === indices.length;
}
