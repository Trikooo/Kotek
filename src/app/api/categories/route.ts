import { NextRequest, NextResponse } from "next/server";
import {
  getAllCategories,
  createCategory,
  categoryValidation,
} from "../controllers/categories";

export async function GET(request: NextRequest) {
  try {
    const categories = await getAllCategories();
    return new Response(JSON.stringify(categories), { status: 200 });
  } catch (error) {
    // Log the error details for debugging
    console.error("Error fetching categories:", error);

    // Return a generic error message for unknown errors
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";

    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await categoryValidation(request, "POST");
    // Create category
    await createCategory(data);

    return NextResponse.json(
      { message: "Category created successfully" },
      { status: 201 }
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      let status = 500;
      let message = error.message;
      if (message.startsWith("Validation")) status = 400;
      if (message.startsWith("Conflict")) status = 409;
      console.error(message);
      return NextResponse.json({ message: message }, { status: status });
    } else {
      console.error("Unknown Error");
      return NextResponse.json({ message: "Unknown Error" }, { status: 500 });
    }
  }
}
