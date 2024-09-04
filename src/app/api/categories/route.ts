import { NextRequest, NextResponse } from "next/server";
import { getAllCategories, createCategory, categoryValidation } from "../controllers/categories";
import { categorySchema } from "../lib/validation";
import path from "path";
import { writeFile } from "fs/promises";
import { Category } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    const categories = await getAllCategories();
    return new Response(JSON.stringify(categories), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await categoryValidation(request)
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
      return NextResponse.json({ message: message }, { status: status });
    } else {
      return NextResponse.json({ message: "Unknown Error" }, { status: 500 });
    }
  }
}
