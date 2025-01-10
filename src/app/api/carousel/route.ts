import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import {
  createCarouselItem,
  getActiveCarouselItems,
  getAllCarouselItems,
  updateCarouselItemsDisplayIndices,
} from "../APIservices/controllers/carousel";

export async function GET(request: NextRequest) {
  try {
    const token = await getToken({ req: request });
    const params = request.nextUrl.searchParams;
    if (token?.role === "ADMIN" && params.has("getInactive")) {
      const allCarouselItems = await getAllCarouselItems();
      return NextResponse.json(allCarouselItems, { status: 200 });
    } else {
      const activeCarouselItems = await getActiveCarouselItems();
      return NextResponse.json(activeCarouselItems, { status: 200 });
    }
  } catch (error) {
    console.error("Error fetching all carousel items: ", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = await getToken({ req: request });
    if (token?.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const formData = await request.formData();

    // Get the image file separately
    const imageFile = formData.get("image") as File | null;
    // Remove image from formData before converting to plain object
    formData.delete("image");

    // Convert remaining form data to plain object
    const carouselItemData = Object.fromEntries(formData.entries());

    // add image if it exists.
    if (imageFile) carouselItemData.image = imageFile;

    // validate and create carouselItem
    const newCarouselItem = await createCarouselItem(carouselItemData);

    return NextResponse.json(newCarouselItem, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      console.error("POST CarouselItem ZodError: ", {
        message: "Validation error in CarouselItemData",
        errors: error.errors.map((err) => ({
          path: err.path.join("."),
          message: err.message,
        })),
      });
      return NextResponse.json(
        {
          message: "Validation error in CarouselItemData",
          errors: error.errors.map((err) => ({
            path: err.path.join("."),
            message: err.message,
          })),
        },
        { status: 400 }
      );
    }
    console.error("POST Carousel Item Error:", error);
    return NextResponse.json(
      {
        message: "Failed to create CarouselItem",
        error: error instanceof Error ? error.message : error,
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const token = await getToken({ req: request });
    if (token?.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }
    const data = await request.json();
    const updatedCarouselItems = await updateCarouselItemsDisplayIndices(data);
    return NextResponse.json(updatedCarouselItems, { status: 200 });
  } catch (error) {
    console.error("PUT error updating carouselItems's displayIndices", error);
    return NextResponse.json(
      {
        message: "Internal server error",
        error: error instanceof Error ? error.message : error,
      },
      { status: 500 }
    );
  }
}
