import { NextRequest, NextResponse } from "next/server";
import {
  createProduct,
  getAllProducts,
  productValidation,
} from "../APIservices/controllers/products";
import { ZodError } from "zod";
import { ProductSearchService } from "../APIservices/controllers/search";
import { GetAllProductsResponse, ProductSearchResponse } from "@/types/types";

export async function GET(request: NextRequest) {
  const searchService = new ProductSearchService();

  try {
    const searchParams = ProductSearchService.parseSearchParams(request);
    let result: ProductSearchResponse | GetAllProductsResponse;

    // Use the new static method to check for filters
    const hasFilters = ProductSearchService.hasFilters(request);

    if (hasFilters) {
      // Use searchService if filtering queries are present
      result = await searchService.searchProducts(searchParams);
    } else {
      // Use getAllProducts for simple pagination
      const page = searchParams.currentPage || 1;
      const pageSize = searchParams.pageSize || 10;
      result = await getAllProducts(page, pageSize);
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
    const data = await productValidation(request, "POST", undefined);
    await createProduct(data);
    return NextResponse.json(
      { message: "Product created successfully." },
      { status: 201 }
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      let status = 500;
      let message = error.message;
      if (message.startsWith("Validation")) status = 400;
      if (message.startsWith("Conflict")) status = 409;
      console.error(error);
      return NextResponse.json({ message: message }, { status: status });
    } else {
      console.error("Unknown Error");
      return NextResponse.json({ message: "Unknown Error" }, { status: 500 });
    }
  }
}
