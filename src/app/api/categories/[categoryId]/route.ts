import { NextRequest, NextResponse } from "next/server";
import {
  categoryValidation,
  deleteCategory,
  updateCategory,
} from "../../controllers/categories";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const data = await categoryValidation(request);
    await updateCategory(params.categoryId, data);
    return NextResponse.json(
      { message: "Category updated successfully!" },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error) {
      let status = 500;
      let message = error.message;
      if (message.includes("Validation")) status = 400;
      if (message.includes("Conflict")) status = 409;
      return NextResponse.json({ message: message }, { status: status });
    } else {
      return NextResponse.json({ message: "Unknown Error" }, { status: 500 });
    }
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    console.log("this is params: ", params); // Log params
    console.log("Deleting category with ID:", params.categoryId);
    await deleteCategory(params.categoryId);
    console.log("hello i am below the deletion process");
    return NextResponse.json(
      { message: "Category deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error occurred:", error); // Log the error
    if (error instanceof Error) {
      let status = 500;
      let message = error.message;
      if (message.includes("not found")) status = 404;
      return NextResponse.json({ message: message }, { status: status });
    }
    return NextResponse.json(
      { message: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
