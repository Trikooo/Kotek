import { getAncestors } from "@/app/api/APIservices/controllers/categories";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const categoryId = params.categoryId;
    if (!categoryId) {
      console.error({ message: "Category ID is required" }, { status: 400 });
      return NextResponse.json(
        { message: "Category ID is required" },
        { status: 400 }
      );
    }
    const ancestors = await getAncestors(categoryId);
    return NextResponse.json(ancestors, { status: 200 });
  } catch (error) {
    console.error("Error occurred while fetching category ancestors", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
