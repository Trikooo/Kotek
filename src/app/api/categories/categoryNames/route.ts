import { NextRequest } from "next/server";
import { getAllCategoryNames } from "../../APIservices/controllers/categories";

export async function GET(req: NextRequest) {
  try {
    const categoryNames = await getAllCategoryNames();
    return new Response(JSON.stringify(categoryNames), { status: 200 });
  } catch (error) {
    // Log the error for server-side debugging
    console.error("Error fetching category names:", error);

    // Determine the appropriate error response based on the error type
    if (error instanceof Error) {
      return new Response(
        JSON.stringify({
          message: "Failed to retrieve category names",
          error: error.message,
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Fallback for unexpected error types
    return new Response(
      JSON.stringify({
        message: "An unexpected error occurred",
        error: String(error),
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
