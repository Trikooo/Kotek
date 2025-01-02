import { OrderData } from "@/types/types";
import axios from "axios";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { updateKotekOrder } from "../../APIservices/controllers/kotekOrders";

import { 
  createSingleNoestOrder,
  deleteNoestOrder,
} from "../../APIservices/controllers/noest";

export async function POST(request: NextRequest) {
  try {
    const token = await getToken({ req: request });
    if (token?.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const orderData: OrderData = await request.json();
    if (!orderData.kotek.id) {
      return NextResponse.json({ message: "Order ID is required" });
    }
    const response = await createSingleNoestOrder(orderData.noest[0]);
    let updatedKotekOrder;
    try {
      updatedKotekOrder = await updateKotekOrder(
        orderData.kotek.id,
        orderData.kotek,
        response.data.tracking
      );
    } catch (error) {
      //roll back and delete the created noest  order
      deleteNoestOrder(response.data.tracking);
      console.error(error);
      throw error;
    }

    return NextResponse.json(
      { noest: response.data, kotek: updatedKotekOrder },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Validation error:", JSON.stringify(error.errors, null, 2));
      return NextResponse.json(
        { message: "Validation error", errors: error.errors },
        { status: 400 }
      );
    }
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return NextResponse.json(
        { message: "Resource not found" },
        { status: 404 }
      );
    }
    console.error(
      "Order creation failed:",
      axios.isAxiosError(error) ? error.response?.data : error
    );
    return NextResponse.json(
      { message: "Order creation failed" },
      { status: 500 }
    );
  }
}
