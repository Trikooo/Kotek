import { NextRequest, NextResponse } from "next/server";
import {
  createProduct,
  getAllProducts,
  productValidation,
} from "../APIservices/controllers/products";
import { ZodError } from "zod";
import { ProductSearchService } from "../APIservices/controllers/search";
import { GetAllProductsResponse, ProductSearchResponse } from "@/types/types";
import { Prisma } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import { getToken } from "next-auth/jwt";

export async function GET(request: NextRequest) {
  const searchService = new ProductSearchService();

  try {
    const searchParams = ProductSearchService.parseSearchParams(request);
    let result: ProductSearchResponse | GetAllProductsResponse;

    // Use the new static method to check for filters
    // const hasFilters = ProductSearchService.hasFilters(searchParams);
    const hasFilters = true
    const token = await getToken({ req: request });
    if (!token || (token.role !== "ADMIN" && !searchParams.store)) {
      searchParams.store = true;
    }
    if (hasFilters) {
      // Use searchService if filtering queries are present
      result = await searchService.searchProducts(searchParams);
    } else {
      // Use getAllProducts for simple pagination
      const page = searchParams.currentPage || 1;
      const pageSize = searchParams.pageSize || 10;
      const store = searchParams.store;
      result = await getAllProducts(page, pageSize, store);
    }

    return NextResponse.json(
      {
        ...result,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in product retrieval:", error);

    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Invalid search parameters", details: error.errors },
        { status: 400 }
      );
    }

    if (error instanceof Error) {
      return NextResponse.json(
        {
          error: "An error occurred while retrieving products",
          message: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "An unknown error occurred" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const id = uuidv4();
    const data = await productValidation(request, "POST", id);

    const createdProduct = await createProduct(id, data);

    return NextResponse.json({ product: createdProduct }, { status: 201 });
  } catch (error: unknown) {
    // Handle Zod Validation Errors
    if (error instanceof ZodError) {
      console.error("Zod Validation Error", {
        errorCount: error.errors.length,
        errors: error.errors.map((err) => ({
          path: err.path.join("."),
          message: err.message,
        })),
      });

      return NextResponse.json(
        {
          message: "Validation Error",
          errors: error.errors.map((err) => ({
            path: err.path.join("."),
            message: err.message,
          })),
        },
        { status: 400 }
      );
    }

    // Handle Prisma Unique Constraint Violations
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case "P2002": // Unique constraint violation
          console.error("Prisma Unique Constraint Violation", {
            errorCode: error.code,
            uniqueFields: error.meta ? error.meta.target : "Unknown",
            originalError: error.message,
          });

          return NextResponse.json(
            {
              message: "A record with these unique fields already exists",
              details: error.meta ? error.meta.target : "Unknown field",
            },
            { status: 409 }
          );

        case "P2003": // Foreign key constraint violation
          console.error("Prisma Foreign Key Constraint Violation", {
            errorCode: error.code,
            field: error.meta ? error.meta.field_name : "Unknown",
            originalError: error.message,
          });

          return NextResponse.json(
            {
              message: "Related record does not exist",
              details: error.meta ? error.meta.field_name : "Unknown relation",
            },
            { status: 400 }
          );

        case "P2025": // Record not found
          console.error("Prisma Record Not Found Error", {
            errorCode: error.code,
            cause: error.meta ? error.meta.cause : "Unknown",
            originalError: error.message,
          });

          return NextResponse.json(
            {
              message: "Related record not found",
              details: error.meta ? error.meta.cause : "Unknown cause",
            },
            { status: 404 }
          );
      }
    }

    // Handle network or database connection errors
    if (error instanceof Prisma.PrismaClientInitializationError) {
      console.error("Prisma Database Connection Error", {
        errorName: error.name,
        errorMessage: error.message,
        errorStack: error.stack,
      });

      return NextResponse.json(
        {
          message: "Database connection error",
          details: error.message,
        },
        { status: 500 }
      );
    }

    // Generic server error for unexpected exceptions
    console.error("Unexpected Server Error", {
      errorName: error instanceof Error ? error.name : "Unknown Error",
      errorMessage: error instanceof Error ? error.message : "No error message",
      errorStack: error instanceof Error ? error.stack : "No stack trace",
      errorType: typeof error,
      stringRepresentation: String(error),
    });

    return NextResponse.json(
      {
        message: "Internal Server Error",
        details:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}
