import { NextRequest, NextResponse } from "next/server";
import { getToken, JWT } from "next-auth/jwt";
import {
  createAddress,
  deleteAddress,
  getAllAddresses,
  updateAddress,
} from "../APIservices/controllers/addresses";
import { Prisma } from "@prisma/client";
import { ZodError } from "zod";

interface ErrorResponse {
  message: string;
  errors?: Array<{ path: string; message: string }>;
  details?: string | unknown;
  status: number;
}

function formatErrorResponse(error: unknown): ErrorResponse {
  // [Previous error handling code remains the same]
  if (error instanceof ZodError) {
    return {
      message: "Validation Error",
      errors: error.errors.map((err) => ({
        path: err.path.join("."),
        message: err.message,
      })),
      status: 400,
    };
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case "P2002":
        return {
          message: "An address with these details already exists",
          details: error.meta?.target,
          status: 409,
        };
      case "P2003":
        return {
          message: "Related record does not exist",
          details: error.meta?.field_name,
          status: 400,
        };
      case "P2025":
        return {
          message: "Record not found",
          details: error.meta?.cause,
          status: 404,
        };
      default:
        return {
          message: "Database error occurred",
          details: error.code,
          status: 500,
        };
    }
  }

  if (error instanceof Prisma.PrismaClientInitializationError) {
    return {
      message: "Database connection error",
      details: error.message,
      status: 500,
    };
  }

  return {
    message: "An unexpected error occurred",
    details: error instanceof Error ? error.message : "Unknown error",
    status: 500,
  };
}

function checkAccess(token: JWT, targetUserId: string): boolean {
  return token.role === "ADMIN" || token.id === targetUserId;
}

export async function GET(request: NextRequest) {
  try {
    const token = await getToken({ req: request });
    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized: Authentication required" },
        { status: 401 }
      );
    }

    const userId = request.nextUrl.searchParams.get("userId");
    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    if (!checkAccess(token, userId)) {
      return NextResponse.json(
        { message: "Forbidden: Insufficient permissions" },
        { status: 403 }
      );
    }

    const addresses = await getAllAddresses(userId);

    return NextResponse.json({ addresses }, { status: 200 });
  } catch (error: unknown) {
    const errorResponse = formatErrorResponse(error);
    return NextResponse.json(errorResponse, { status: errorResponse.status });
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = await getToken({ req: request });
    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized: Authentication required" },
        { status: 401 }
      );
    }

    const userId = request.nextUrl.searchParams.get("userId");
    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    if (!checkAccess(token, userId)) {
      return NextResponse.json(
        { message: "Forbidden: Insufficient permissions" },
        { status: 403 }
      );
    }

    const addressData = await request.json();
    const address = await createAddress(userId, addressData);
    return NextResponse.json({ address }, { status: 201 });
  } catch (error: unknown) {
    const errorResponse = formatErrorResponse(error);
    return NextResponse.json(errorResponse, { status: errorResponse.status });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const token = await getToken({ req: request });
    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized: Authentication required" },
        { status: 401 }
      );
    }

    const userId = request.nextUrl.searchParams.get("userId");
    const addressId = request.nextUrl.searchParams.get("addressId");

    if (!userId || !addressId) {
      return NextResponse.json(
        { message: "User ID and Address ID are required" },
        { status: 400 }
      );
    }

    if (!checkAccess(token, userId)) {
      return NextResponse.json(
        { message: "Forbidden: Insufficient permissions" },
        { status: 403 }
      );
    }

    const addressData = await request.json();
    const updatedAddress = await updateAddress(addressId, addressData);
    return NextResponse.json({ address: updatedAddress }, { status: 200 });
  } catch (error: unknown) {
    const errorResponse = formatErrorResponse(error);
    return NextResponse.json(errorResponse, { status: errorResponse.status });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const token = await getToken({ req: request });
    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized: Authentication required" },
        { status: 401 }
      );
    }

    const userId = request.nextUrl.searchParams.get("userId");
    const addressId = request.nextUrl.searchParams.get("addressId");

    if (!userId || !addressId) {
      return NextResponse.json(
        { message: "User ID and Address ID are required" },
        { status: 400 }
      );
    }

    if (!checkAccess(token, userId)) {
      return NextResponse.json(
        { message: "Forbidden: Insufficient permissions" },
        { status: 403 }
      );
    }

    const address = await deleteAddress(addressId);
    return NextResponse.json(address, { status: 200 });
  } catch (error: unknown) {
    const errorResponse = formatErrorResponse(error);
    return NextResponse.json(errorResponse, { status: errorResponse.status });
  }
}
