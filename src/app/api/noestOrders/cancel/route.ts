import { KotekOrder } from "@/types/types";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { cancelOrder } from "../../APIservices/controllers/kotekOrders";

export async function POST(request: NextRequest) {
  try {
    const token = await getToken({ req: request });
    if (token?.role !== "ADMIN") {
      console.error({ message: "Unauthorized", status: 401, token });
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const order: KotekOrder = await request.json();

    const result = await cancelOrder(order);
    if (result.failedAt) {
      console.error("Failed to delete Noest order:", {
        trackingNumber: result.failedAt,
        failureReason: result.failureReason,
      });
      return NextResponse.json(
        {
          message: "Failed to cancel order",
          error: `Failed to delete Noest order with tracking number ${result.failedAt}`,
          failureReason: result.failureReason,
          deletedCount: result.deletedCount,
        },
        { status: 500 }
      );
    }

    console.info("Order cancelled successfully:", {
      deletedCount: result.deletedCount,
      order: result.order,
    });
    return NextResponse.json(
      {
        message: "Order cancelled successfully",
        deletedCount: result.deletedCount,
        order: result.order,
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof SyntaxError) {
      console.error("Invalid JSON in request:", error);
      return NextResponse.json(
        {
          message: "Invalid request format",
          error: "Invalid JSON",
        },
        { status: 400 }
      );
    }

    if (error instanceof Error) {
      if (error.message.includes("Order ID is missing")) {
        console.error("Order ID missing in request:", error.message);
        return NextResponse.json(
          {
            message: "Bad Request",
            error: error.message,
          },
          { status: 400 }
        );
      }

      console.error("Order cancellation error:", error);
      return NextResponse.json(
        {
          message: "Failed to process order cancellation",
          error: error.message,
        },
        { status: 500 }
      );
    }

    console.error("Unknown error during order cancellation:", error);
    return NextResponse.json(
      {
        message: "An unexpected error occurred",
      },
      { status: 500 }
    );
  }
}
