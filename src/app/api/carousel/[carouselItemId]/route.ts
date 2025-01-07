import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import {
  deleteCarouselItem,
  updateCarouselItem,
} from "../../APIservices/controllers/carousel";

// PUT method to update an existing carousel item
export async function PUT(
  request: NextRequest,
  { params }: { params: { carouselItemId: string } }
) {
  try {
    const token = await getToken({ req: request });
    if (token?.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const formData = await request.formData();
    const { carouselItemId } = params;

    if (!carouselItemId) {
      console.error("carouselItemId is required");
      return NextResponse.json(
        { message: "carouselItemId is required" },
        { status: 400 }
      );
    }

    // Get the image file separately
    const imageFile = formData.get("image") as File | undefined;
    // Remove image from formData before converting to plain object
    formData.delete("image");

    // Convert remaining form data to plain object
    const carouselItemData = Object.fromEntries(formData.entries());
    if (imageFile) carouselItemData.image = imageFile;
    const updatedCarouselItem = await updateCarouselItem(
      carouselItemId,
      carouselItemData
    );
    return NextResponse.json(updatedCarouselItem, { status: 200 });
  } catch (error) {
    if (error instanceof ZodError) {
      console.error(
        {
          message: "Validation error in CarouselItemData",
          errors: error.errors.map((err) => ({
            path: err.path.join("."),
            message: err.message,
          })),
        },
        { status: 400 }
      );
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
    console.error("PUT Carousel Item Error:", error);

    return NextResponse.json(
      {
        message: "Failed to update CarouselItem",
        error: error instanceof Error ? error.message : error,
      },
      { status: 500 }
    );
  }
}

// DELETE method to remove a carousel item
export async function DELETE(
  request: NextRequest,
  { params }: { params: { carouselItemId: string } }
) {
  try {
    const token = await getToken({ req: request });
    if (token?.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const { carouselItemId } = params;
    const newDisplayIndices = await request.json();
    if (!carouselItemId) {
      console.error("Carousel item ID is required");
      return NextResponse.json(
        { message: "Carousel item ID is required" },
        { status: 400 }
      );
    }

    await deleteCarouselItem(carouselItemId, newDisplayIndices);
    return NextResponse.json(
      { message: "Carousel item deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE Carousel Item Error:", error);

    return NextResponse.json(
      {
        message: "Failed to delete CarouselItem",
        error: error instanceof Error ? error.message : error,
      },
      { status: 500 }
    );
  }
}
