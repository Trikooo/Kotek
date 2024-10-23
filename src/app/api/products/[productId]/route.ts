import { NextRequest, NextResponse } from "next/server";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import {
  productValidation,
  deleteProduct,
  updateProduct,
  getProductById,
} from "../../APIservices/controllers/products";

export async function GET(request: NextRequest, { params }: Params) {
  try {
    // Get product by ID
    const product = await getProductById(params.productId);

    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    console.error("Error fetching product:", error);

    if (error instanceof Error) {
      return NextResponse.json(
        { message: error.message },
        { status: 500 }
      );
    }

    console.error("Unexpected error type:", error);
    return NextResponse.json(
      { message: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    // Validate and extract data from request
    const data = await productValidation(request, "PUT", params.productId);

    // Update product
    await updateProduct(params.productId, data);

    return NextResponse.json(
      { message: "Product updated successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating product:", error); // Log error details

    if (error instanceof Error) {
      let status = 500;
      let message = error.message;

      if (message.includes("Validation")) status = 400;
      if (message.includes("Conflict")) status = 409;

      return NextResponse.json({ message: message }, { status: status });
    } else {
      console.error("Unknown error type:", error); // Log unknown error types
      return NextResponse.json({ message: "Unknown Error" }, { status: 500 });
    }
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    // Perform deletion
    await deleteProduct(params.productId);

    return NextResponse.json(
      { message: "Product deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error occurred while deleting product:", error);

    if (error instanceof Error) {
      let status = 500;
      let message = error.message;

      if (message.includes("not found")) status = 404;

      return NextResponse.json({ message: message }, { status: status });
    }

    console.error("Unexpected error type:", error); // Log unexpected error types
    return NextResponse.json(
      { message: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}