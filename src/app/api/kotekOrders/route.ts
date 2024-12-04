import { NextRequest, NextResponse } from "next/server";
import {
  createKotekOrder,
  deleteKotekOrder,
  getAllKotekOrders,
  updateKotekOrder,
  getKotekOrderById,
  secondCreateKotekOrder,
} from "../APIservices/controllers/kotekOrders";
import { ZodError } from "zod";

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get("userId");
    const kotekOrderId = request.nextUrl.searchParams.get("kotekOrderId");

    if (!userId && !kotekOrderId) {
      return NextResponse.json(
        { message: "User ID or Kotek Order ID is required" },
        { status: 400 }
      );
    }

    if (kotekOrderId) {
      const kotekOrder = await getKotekOrderById(kotekOrderId);
      if (kotekOrder) {
        return NextResponse.json({ kotekOrder }, { status: 200 });
      } else {
        return NextResponse.json(
          { message: "Kotek Order not found" },
          { status: 404 }
        );
      }
    }

    const kotekOrders = await getAllKotekOrders(userId!);
    if (kotekOrders && kotekOrders.length > 0) {
      return NextResponse.json({ kotekOrders }, { status: 200 });
    } else {
      return NextResponse.json(
        { message: "No Kotek Orders found for this user" },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("GET Kotek Orders Error:", error);
    return NextResponse.json(
      {
        message: "Failed to retrieve Kotek Orders",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get("userId");

    // Parse the request body
    const kotekOrderData = await request.json();

    const kotekOrder = await secondCreateKotekOrder(userId, kotekOrderData);
    return NextResponse.json({ kotekOrder }, { status: 201 });
  } catch (error) {
    console.error("POST Kotek Order Error:", error);

    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          message: "Validation error in Kotek Order data",
          errors: error.errors.map((err) => ({
            path: err.path.join("."),
            message: err.message,
          })),
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        message: "Failed to create Kotek Order",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get("userId");
    const kotekOrderId = request.nextUrl.searchParams.get("kotekOrderId");

    if (!userId || !kotekOrderId) {
      return NextResponse.json(
        { message: "User ID and Kotek Order ID are required" },
        { status: 400 }
      );
    }

    // Parse the request body
    const kotekOrderData = await request.json();

    const updatedKotekOrder = await updateKotekOrder(
      kotekOrderId,
      kotekOrderData
    );

    return NextResponse.json(
      { kotekOrder: updatedKotekOrder },
      { status: 200 }
    );
  } catch (error) {
    console.error("PUT Kotek Order Error:", error);

    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          message: "Validation error in Kotek Order update data",
          errors: error.errors.map((err) => ({
            path: err.path.join("."),
            message: err.message,
          })),
        },
        { status: 400 }
      );
    }

    if (error instanceof Error && error.message === "Kotek Order not found") {
      return NextResponse.json(
        { message: "Kotek Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Failed to update Kotek Order",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const kotekOrderId = request.nextUrl.searchParams.get("kotekOrderId");

    if (!kotekOrderId) {
      return NextResponse.json(
        { message: "Kotek Order ID is required" },
        { status: 400 }
      );
    }

    const deletedKotekOrder = await deleteKotekOrder(kotekOrderId);

    if (deletedKotekOrder) {
      return NextResponse.json(
        { message: "Kotek Order deleted successfully" },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: "Kotek Order not found" },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("DELETE Kotek Order Error:", error);
    return NextResponse.json(
      {
        message: "Failed to delete Kotek Order",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
