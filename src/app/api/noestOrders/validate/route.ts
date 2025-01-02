// app/api/orders/validate/route.ts
import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { getToken } from "next-auth/jwt";
import { validateNoestOrders } from "../../APIservices/controllers/noest";
import { updateKotekOrder } from "../../APIservices/controllers/kotekOrders";
import { KotekOrder } from "@/types/types";

export async function POST(request: NextRequest) {
  try {
    const token = await getToken({ req: request });
    if (token?.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const order: KotekOrder = await request.json();
    if (!order.id) {
      return NextResponse.json(
        {
          message: "Order ID is required",
        },
        { status: 400 }
      );
    }
    const trackingNumbers = order.items
      .map((item) => item.tracking?.trackingNumber)
      .filter((t) => t !== undefined);
    // const response = await validateNoestOrder(tracking);
    const response: any = {};
    let updatedKotekOrder;
    try {
      updatedKotekOrder = await updateKotekOrder(
        order.id,
        order,
        undefined,
        true,
        trackingNumbers
      );
    } catch (error) {
      return NextResponse.json(
        {
          message:
            "CRITICAL ERROR: inconsistent data, manual intervention required.",
        },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { noest: response.data, kotek: updatedKotekOrder },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Validation error", errors: error.errors },
        { status: 400 }
      );
    }
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }
    console.error("Order validation failed:", error);
    return NextResponse.json(
      { message: "Order validation failed" },
      { status: 500 }
    );
  }
}
