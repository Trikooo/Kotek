import { NextRequest, NextResponse } from "next/server";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import {
  categoryValidation,
  deleteCategory,
  updateCategory,
  getCategoryById,
} from "../../APIservices/controllers/categories";
import { ZodError } from "zod";
import { getToken } from "next-auth/jwt";
import { Prisma } from "@prisma/client";

export async function GET(request: NextRequest, { params }: Params) {
  try {
    if (!params.categoryId) {
      return NextResponse.json(
        { message: "Category ID is required" },
        { status: 400 }
      );
    }

    // Get category by ID
    const category = await getCategoryById(params.categoryId);

    if (!category) {
      return NextResponse.json(
        { message: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(category, { status: 200 });
  } catch (error: unknown) {
    console.error("Error fetching category:", error);

    // Handle Prisma errors
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case "P2025":
          return NextResponse.json(
            { message: "Category not found" },
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
        message: "Failed to retrieve category",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    if (!params.categoryId) {
      return NextResponse.json(
        { message: "Category ID is required" },
        { status: 400 }
      );
    }

    // Authenticate and get user token
    const token = await getToken({ req: request });

    // Check if user is authenticated and is an admin
    if (!token || token.role !== "ADMIN") {
      return NextResponse.json(
        { message: "Unauthorized: Admin access required" },
        { status: 403 }
      );
    }

    // Validate and extract data from request
    const data = await categoryValidation(request, "PUT", params.categoryId);

    // Update category
    const updatedCategory = await updateCategory(params.categoryId, data);

    return NextResponse.json(
      { message: "Category updated successfully!", category: updatedCategory },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Error updating category:", error);

    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          message: "Validation error in category update data",
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
        case "P2025":
          return NextResponse.json(
            { message: "Category not found" },
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
        message: "Failed to update category",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    if (!params.categoryId) {
      return NextResponse.json(
        { message: "Category ID is required" },
        { status: 400 }
      );
    }

    // Authenticate and get user token
    const token = await getToken({ req: request });

    // Check if user is authenticated and is an admin
    if (!token || token.role !== "ADMIN") {
      return NextResponse.json(
        { message: "Unauthorized: Admin access required" },
        { status: 403 }
      );
    }

    // Perform deletion
    await deleteCategory(params.categoryId);

    return NextResponse.json(
      { message: "Category deleted successfully" },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Error deleting category:", error);

    // Handle Prisma errors
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case "P2025":
          return NextResponse.json(
            { message: "Category not found" },
            { status: 404 }
          );
        case "P2003":
          return NextResponse.json(
            {
              message: "Cannot delete category due to existing relationships",
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
        message: "Failed to delete category",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
