import { NextRequest, NextResponse } from "next/server";
import {
  getAllCategories,
  createCategory,
  categoryValidation,
  getParentCategories,
} from "../APIservices/controllers/categories";
import { v4 as uuidv4 } from "uuid";
import { ZodError } from "zod";
import { getToken } from "next-auth/jwt";
import { Prisma } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    // Access the query parameters using request.nextUrl.searchParams
    const isParent = request.nextUrl.searchParams.get("parent") === "true"; // Check if `parent` query param is true

    let categories;
    if (isParent) {
      categories = await getParentCategories(); // Fetch only parent categories if `parent=true`
    } else {
      categories = await getAllCategories(); // Fetch all categories otherwise
    }

    return NextResponse.json(categories, { status: 200 });
  } catch (error: unknown) {
    console.error("Error fetching categories:", error);

    // Handle Prisma errors
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case "P2002":
          return NextResponse.json(
            { message: "Unique constraint violation" },
            { status: 409 }
          );
        case "P2025":
          return NextResponse.json(
            { message: "Record not found" },
            { status: 404 }
          );
      }
    }

    // Handle network or database connection errors
    if (error instanceof Prisma.PrismaClientInitializationError) {
      return NextResponse.json(
        {
          message: "Database connection error",
          details: error.message,
        },
        { status: 500 }
      );
    }

    // Generic server error for unexpected exceptions
    return NextResponse.json(
      {
        message: "Failed to retrieve categories",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Authenticate and get user token
    const token = await getToken({ req: request });

    // Check if user is authenticated and is an admin
    if (!token || token.role !== "ADMIN") {
      return NextResponse.json(
        { message: "Unauthorized: Admin access required" },
        { status: 403 }
      );
    }

    const id = uuidv4();
    const data = await categoryValidation(request, "POST", id);

    // Create category
    const newCategory = await createCategory(id, data);

    return NextResponse.json(newCategory, { status: 201 });
  } catch (error: unknown) {
    console.error("POST Category Error:", error);

    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          message: "Validation error in category data",
          errors: error.errors.map((err) => ({
            path: err.path.join("."),
            message: err.message,
          })),
        },
        { status: 400 }
      );
    }

    // Handle Prisma errors
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case "P2002":
          return NextResponse.json(
            {
              message: "A category with this name already exists",
              details: error.meta ? error.meta.target : "Unknown field",
            },
            { status: 409 }
          );
        case "P2003":
          return NextResponse.json(
            {
              message: "Related record does not exist",
              details: error.meta ? error.meta.field_name : "Unknown relation",
            },
            { status: 400 }
          );
      }
    }

    // Handle network or database connection errors
    if (error instanceof Prisma.PrismaClientInitializationError) {
      return NextResponse.json(
        {
          message: "Database connection error",
          details: error.message,
        },
        { status: 500 }
      );
    }

    // Generic server error for unexpected exceptions
    return NextResponse.json(
      {
        message: "Failed to create category",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
