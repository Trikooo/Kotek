import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import axios, { AxiosError } from "axios";
import { NoestOrderForm } from "@/types/types";

export async function POST(request: NextRequest) {
  try {
    // Authenticate and get user token
    const token = await getToken({ req: request });

    // Check if user is authenticated
    if (!token || (token && token.role !== "ADMIN")) {
      return NextResponse.json(
        { message: "Unauthorized: Authentication required" },
        { status: 401 }
      );
    }

    // Parse the request body
    const orderData: NoestOrderForm = await request.json();
    orderData.api_token = process.env.NOEST_TOKEN;
    orderData.user_guid = process.env.NOEST_GUID;

    // Make the API call to create the order using Axios
    try {
      const response = await axios.post(
        "https://app.noest-dz.com/api/public/create/order",
        orderData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Axios automatically throws for non-2xx status codes
      return NextResponse.json(
        {
          message: "Order created successfully",
          noestData: response.data,
        },
        { status: 201 }
      );
    } catch (error) {
      // Handle Axios-specific errors
      if (error instanceof AxiosError) {
        return NextResponse.json(
          {
            message: "Failed to create order",
            error: error,
          },
          { status: error.response?.status || 500 }
        );
      }

      // Fallback for other types of errors
      throw error;
    }
  } catch (error) {
    console.error("Create Noest Order Error:", error);
    return NextResponse.json(
      {
        message: "Failed to create Noest Order",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}


