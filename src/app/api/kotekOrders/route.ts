import { NextRequest, NextResponse } from "next/server";
import {
  createKotekOrder,
  deleteKotekOrder,
  getAllUserKotekOrders,
  updateKotekOrder,
  getKotekOrderById,
  secondCreateKotekOrder,
  getAllKotekOrders,
} from "../APIservices/controllers/kotekOrders";
import { ZodError } from "zod";
import { getToken } from "next-auth/jwt";

export async function GET(request: NextRequest) {
  try {
    // Authenticate and get user token
    const token = await getToken({ req: request });

    // Check if user is authenticated
    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized: Authentication required" },
        { status: 401 }
      );
    }

    // Extract user role from the token
    const userRole = token.role as string;

    // Get query parameters
    const userId = request.nextUrl.searchParams.get("userId");
    const kotekOrderId = request.nextUrl.searchParams.get("kotekOrderId");
    const page = request.nextUrl.searchParams.get("page") || "1";
    const limit = request.nextUrl.searchParams.get("limit") || "10";

    // If specific order ID is provided, fetch that specific order
    if (kotekOrderId) {
      const kotekOrder = await getKotekOrderById(kotekOrderId);

      // Additional role-based access control for specific order
      if (userRole !== "ADMIN" && kotekOrder.userId !== token.id) {
        return NextResponse.json(
          { message: "Unauthorized: Cannot access this order" },
          { status: 403 }
        );
      }

      if (kotekOrder) {
        return NextResponse.json(kotekOrder, { status: 200 });
      } else {
        return NextResponse.json(
          { message: "Kotek Order not found" },
          { status: 404 }
        );
      }
    }

    // If userId is provided, fetch user-specific orders
    if (userId) {
      // Ensure user can only access their own orders unless they are an admin
      if (userRole !== "ADMIN" && userId !== token.id) {
        return NextResponse.json(
          { message: "Unauthorized: Cannot access other user's orders" },
          { status: 403 }
        );
      }

      const kotekOrders = await getAllUserKotekOrders(
        userId,
        parseInt(page),
        parseInt(limit)
      );
      return NextResponse.json(kotekOrders, { status: 200 });
    }

    // If no specific filters, fetch all orders (admin-only)
    if (userRole !== "ADMIN") {
      return NextResponse.json(
        { message: "Unauthorized: Only admins can view all orders" },
        { status: 403 }
      );
    }

    const kotekOrders = await getAllKotekOrders(
      userRole, // Pass the role to the function
      parseInt(page),
      parseInt(limit)
    );
    return NextResponse.json(kotekOrders, { status: 200 });
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
    // Authenticate and get user token
    const token = await getToken({ req: request });

    // Check if user is authenticated
    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized: Authentication required" },
        { status: 401 }
      );
    }

    // Extract user role from the token
    const userRole = token.role as string;
    const kotekOrderId = request.nextUrl.searchParams.get("kotekOrderId");

    if (!kotekOrderId) {
      return NextResponse.json(
        { message: "User ID and Kotek Order ID are required" },
        { status: 400 }
      );
    }

    // Check if the user has permission to update the order
    if (userRole !== "ADMIN") {
      const existingOrder = await getKotekOrderById(kotekOrderId);

      if (existingOrder.userId !== token.id) {
        return NextResponse.json(
          { message: "Unauthorized: Cannot update this order" },
          { status: 403 }
        );
      }
    }

    // Parse the request body
    const kotekOrderData = await request.json();

    const updatedKotekOrder = await updateKotekOrder(
      kotekOrderId,
      kotekOrderData
    );

    return NextResponse.json(updatedKotekOrder, { status: 200 });
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
    // Authenticate and get user token
    const token = await getToken({ req: request });

    // Check if user is authenticated
    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized: Authentication required" },
        { status: 401 }
      );
    }

    // Extract user role from the token
    const userRole = token.role as string;

    const kotekOrderId = request.nextUrl.searchParams.get("kotekOrderId");

    if (!kotekOrderId) {
      return NextResponse.json(
        { message: "Kotek Order ID is required" },
        { status: 400 }
      );
    }

    // Check if the user has permission to delete the order
    if (userRole !== "ADMIN") {
      const existingOrder = await getKotekOrderById(kotekOrderId);

      if (existingOrder.userId !== token.id) {
        return NextResponse.json(
          { message: "Unauthorized: Cannot delete this order" },
          { status: 403 }
        );
      }
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
