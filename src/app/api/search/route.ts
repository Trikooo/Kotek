import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { ProductSearchService } from "../APIservices/controllers/search";

// Define a type for the search parameters
interface SearchParams {
  query?: string;
  categoryId?: string;
  brands?: string[];
  tags?: string[];
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  pageSize?: number;
  status?: "ACTIVE" | "INACTIVE" | "DRAFT";
}

export async function GET(request: NextRequest) {
  const searchService = new ProductSearchService();

  try {
    // Create an object to hold the parsed query parameters
    const searchParams: SearchParams = {};

    // Parse query parameters
    const urlParams = Object.fromEntries(request.nextUrl.searchParams);

    // Convert array parameters
    if (urlParams.brands) {
      searchParams.brands = urlParams.brands.split(",");
    }
    if (urlParams.tags) {
      searchParams.tags = urlParams.tags.split(",");
    }

    // Convert numeric parameters
    if (urlParams.minPrice) {
      searchParams.minPrice = Number(urlParams.minPrice);
    }
    if (urlParams.maxPrice) {
      searchParams.maxPrice = Number(urlParams.maxPrice);
    }
    if (urlParams.page) {
      searchParams.page = Number(urlParams.page);
    }
    if (urlParams.pageSize) {
      searchParams.pageSize = Number(urlParams.pageSize);
    }

    // Additional parameters
    if (urlParams.query) {
      searchParams.query = urlParams.query;
    }
    if (urlParams.categoryId) {
      searchParams.categoryId = urlParams.categoryId;
    }
    if (urlParams.status) {
      searchParams.status = urlParams.status as "ACTIVE" | "INACTIVE" | "DRAFT";
    }

    const results = await searchService.searchProducts(searchParams);

    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    console.error("Error in product search:", error);

    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Invalid search parameters", details: error.errors },
        { status: 400 }
      );
    }

    if (error instanceof Error) {
      return NextResponse.json(
        { error: "An error occurred while searching for products" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "An unknown error occurred" },
      { status: 500 }
    );
  }
}