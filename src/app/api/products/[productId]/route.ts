import { NextRequest, NextResponse } from "next/server";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import {
  productValidation,
  deleteProduct,
  updateProduct,
  getProductById,
} from "../../APIservices/controllers/products";
import { Prisma } from "@prisma/client";
import { ZodError } from "zod";

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
  } catch (error: unknown) {
    // Handle Prisma errors
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case "P2025": // Record not found
          console.error("Prisma Record Not Found Error", {
            errorCode: error.code,
            cause: error.meta ? error.meta.cause : "Unknown",
            originalError: error.message,
          });

          return NextResponse.json(
            {
              message: "Product not found",
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

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    // Validate and extract data from request
    const data = await productValidation(request, "PUT", params.productId);

    // Update product
    const updatedProduct = await updateProduct(params.productId, data);

    return NextResponse.json(
      { product: updatedProduct, message: "Product updated successfully!" },
      { status: 200 }
    );
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

export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    // Perform deletion
    await deleteProduct(params.productId);

    return NextResponse.json(
      { message: "Product deleted successfully" },
      { status: 200 }
    );
  } catch (error: unknown) {
    // Handle Prisma errors
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case "P2025": // Record not found
          console.error("Prisma Record Not Found Error", {
            errorCode: error.code,
            cause: error.meta ? error.meta.cause : "Unknown",
            originalError: error.message,
          });

          return NextResponse.json(
            {
              message: "Product not found",
              details: error.meta ? error.meta.cause : "Unknown cause",
            },
            { status: 404 }
          );

        case "P2003": // Foreign key constraint violation
          console.error("Prisma Foreign Key Constraint Violation", {
            errorCode: error.code,
            field: error.meta ? error.meta.field_name : "Unknown",
            originalError: error.message,
          });

          return NextResponse.json(
            {
              message: "Cannot delete product due to existing relationships",
              details: error.meta ? error.meta.field_name : "Unknown relation",
            },
            { status: 400 }
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
