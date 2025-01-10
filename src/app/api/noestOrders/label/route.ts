// app/api/orders/label/route.ts
import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { getToken } from "next-auth/jwt";
import { getLabel } from "../../APIservices/controllers/noest";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const token = await getToken({ req: request });
    if (token?.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const trackingNumber = searchParams.get("trackingNumber");
    if (!trackingNumber) {
      console.error("trackingNumber is required.");
      return NextResponse.json(
        {
          message: "trackingNumber is required",
        },
        { status: 400 }
      );
    }
    const response = await getLabel(trackingNumber);

    return new NextResponse(response.data, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${trackingNumber}.pdf"`,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Validation error", errors: error.errors },
        { status: 400 }
      );
    }
    if (axios.isAxiosError(error)) {
      console.error({ status: error.status, message: error.message });
      return NextResponse.json(
        { message: error.message },
        { status: error.status }
      );
    }
    console.error("Label retrieval failed:", error);
    return NextResponse.json(
      { message: "Label retrieval failed", error: error },
      { status: 500 }
    );
  }
}
