import { deleteItemFromCart } from "@/app/api/APIservices/controllers/cart";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { itemId: string } }
) {
  try {
    // Access the dynamic 'id' parameter from the URL
    const { itemId } = params;

    // Get the userId from the search params
    const userId = request.nextUrl.searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    // Perform your deletion logic here, using both 'id' and 'userId'
    const deletedItem = await deleteItemFromCart(itemId, userId); // hypothetical function

    if (!deletedItem) {
      return NextResponse.json(
        { message: "Item not found or already deleted" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Item deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting item:", error);

    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { message: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
