// app/api/orders/update/route.ts
import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { getToken } from "next-auth/jwt";
import { updateNoestOrders } from "../../APIservices/controllers/noest";
import {
  getKotekOrderById,
  updateKotekOrder,
} from "../../APIservices/controllers/kotekOrders";
import { KotekOrder, NoestOrderForm } from "@/types/types";
import { createNoestForms } from "@/utils/formDataUtils";
interface OrderData {
  kotek: Partial<KotekOrder>;
  noest: NoestOrderForm[];
}
export async function POST(request: NextRequest) {
  try {
    const token = await getToken({ req: request });
    if (token?.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const data: OrderData = await request.json();
    if (!data.kotek.id) {
      return NextResponse.json(
        { message: "Order ID is required" },
        { status: 400 }
      );
    }
    const prevOrder = await getKotekOrderById(data.kotek.id);
    const response = await updateNoestOrders(data.noest);
    let updatedKotekOrder;
    try {
      updatedKotekOrder = updateKotekOrder(data.kotek.id, data.kotek);
    } catch (error) {
      const noestData = createNoestForms(prevOrder as unknown as KotekOrder);
      await updateNoestOrders(noestData);
      throw error;
    }
    return NextResponse.json(
      { noest: response, kotek: updatedKotekOrder },
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
    console.error("Order update failed:", error);
    return NextResponse.json(
      { message: "Order update failed" },
      { status: 500 }
    );
  }
}
