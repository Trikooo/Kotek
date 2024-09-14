import { NextRequest, NextResponse } from "next/server";
import {
  categoryValidation,
  deleteCategory,
  updateCategory,
} from "../../controllers/categories";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    console.log("Received PUT request with params:", params); // Log params

    // Validate and extract data from request
    const data = await categoryValidation(request, "PUT");
    console.log("Validated data:", data); // Log validated data

    // Update category
    await updateCategory(params.categoryId, data);
    console.log("Category updated successfully with ID:", params.categoryId);

    return NextResponse.json(
      { message: "Category updated successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating category:", error); // Log error details

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
    console.log("Received DELETE request with params:", params); // Log params
    console.log("Deleting category with ID:", params.categoryId);

    // Perform deletion
    await deleteCategory(params.categoryId);
    console.log("Category deleted successfully with ID:", params.categoryId);

    return NextResponse.json(
      { message: "Category deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error occurred while deleting category:", error); // Log error details

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