// app/api/orders/delete/route.ts
import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { getToken } from "next-auth/jwt";
import { deleteNoestOrder } from "../../APIservices/controllers/noest";

export async function POST(request: NextRequest) {
  try {
    const token = await getToken({ req: request });
    if (token?.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const { searchParams } = new URL(request.url);
    const tracking = searchParams.get("tracking");
    if (!tracking) {
      return NextResponse.json(
        {
          message: "Tracking number is required",
        },
        { status: 400 }
      );
    }
    const response = await deleteNoestOrder(tracking);
    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }
    console.error("Order deletion failed:", error);
    // intentionally don't wanna send back the error to the client.
    return NextResponse.json(
      { message: "Order deletion failed" },
      { status: 500 }
    );
  }
}
