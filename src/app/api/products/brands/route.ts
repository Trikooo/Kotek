import { NextResponse } from "next/server";
import prisma from "../../APIservices/lib/prisma";

export async function GET() {
  try {
    const brands = await prisma.product.findMany({
      select: { brand: true },
      distinct: ["brand"],
      where: { brand: { not: null } },
    });
    const parsedBrands = brands.map((brand) => brand.brand);
    return NextResponse.json({ brands: parsedBrands }, { status: 200 });
  } catch (error) {
    // Log the error for server-side tracking
    console.error("Error fetching brands:", error);

    // Determine the appropriate error response based on error type
    if (error instanceof Error) {
      // Database connection or query-specific errors
      if (error.name === "PrismaClientKnownRequestError") {
        return NextResponse.json(
          {
            message: "Database query failed",
            error: "Unable to retrieve brands due to a database error",
          },
          { status: 500 }
        );
      }

      // Network or connection-related errors
      if (error.name === "PrismaClientInitializationError") {
        return NextResponse.json(
          {
            message: "Database connection error",
            error: "Unable to connect to the database",
          },
          { status: 503 }
        );
      }
    }

    // Generic error fallback
    return NextResponse.json(
      {
        message: "Unexpected error",
        error: "An unexpected error occurred while fetching brands",
      },
      { status: 500 }
    );
  }
}
