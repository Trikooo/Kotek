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
      if (message.startsWith("Validation")) status = 400;
      if (message.startsWith("Conflict")) status = 409;
      return NextResponse.json({ message: message }, { status: status });
    } else {
      return NextResponse.json({ message: "Unknown Error" }, { status: 500 });
    }
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    console.log("this is params: ", typeof params)
    await deleteCategory(params.categoryId);
  } catch (error) {
    if (error instanceof Error) {
      let status = 500;
      let message = error.message;
      if (message.includes("not found")) status = 404
      return NextResponse.json({message: message}, { status: status})
    }
  }
}
