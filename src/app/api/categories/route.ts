import { NextRequest, NextResponse } from "next/server";
import {
  getAllCategories,
  createCategory,
  CategoryData,
} from "../controllers/categories";
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
    const formData = await request.formData();

    // Utility function to capitalize the first letter of a string
    const capitalizeFirstLetter = (str: string) => {
      return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    };

    // Extract fields
    let name = formData.get("name")?.toString().trim() || "";
    let description = formData.get("description")?.toString().trim() || "";
    const parentId = formData.get("parentId")?.toString().trim() || "";
    const tags = formData.get("tags")?.toString().split(",").map(tag => tag.trim()).filter(tag => tag) || [];

    // Capitalize first letter of name and description
    name = capitalizeFirstLetter(name);
    description = capitalizeFirstLetter(description);

    // Extract and save file
    const file = formData.get("image") as File;
    if (!file) {
      throw new Error("Validation error: Image file is required.");
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = file.name.replaceAll(" ", "_");
    const filePath = path.join(process.cwd(), "public/uploads", filename);

    writeFile(filePath, buffer);
    const imageUrl = `/uploads/${filename}`;

    // Construct data object, filtering out empty fields
    const data: Partial<Category> = {
      ...(name && { name }),
      ...(description && { description }),
      ...(parentId && parentId !== "" && { parentId }),
      ...(tags.length > 0 && { tags }),
      ...(imageUrl && { imageUrl }),
    };

    // Validate data
    categorySchema.parse(data);

    // Create category
    await createCategory(data as Category);

    return NextResponse.json(
      { msg: "Category created successfully" },
      { status: 201 }
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      let status = 500;
      let message = error.message;
      if (message.startsWith("Validation")) status = 400;
      return NextResponse.json({ msg: message }, { status: status });
    } else {
      return NextResponse.json({ msg: "Unknown Error" }, { status: 500 });
    }
  }
}
