import { NextRequest, NextResponse } from "next/server";
import handleError from "../APIutils/APIutils";
import {
  createAddress,
  deleteAddress,
  getAllAddresses,
  updateAddress,
} from "../APIservices/controllers/addresses";

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get("userId");
    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required." },
        { status: 400 }
      );
    }
    const addresses = await getAllAddresses(userId);
    if (addresses) {
      return NextResponse.json({ addresses: addresses }, { status: 200 });
    } else {
      return NextResponse.json(
        { message: "No address was found" },
        { status: 404 }
      );
    }
  } catch (error) {
    handleError(error, "addresses");
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get("userId");
    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    // Parse the request body
    const addressData = await request.json();

    const address = await createAddress(userId, addressData);
    if (address)
      return NextResponse.json({ addresses: address }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}

// PUT handler to update an address
export async function PUT(request: NextRequest) {
  try {
    const addressId = request.nextUrl.searchParams.get("addressId");

    if (!addressId) {
      return NextResponse.json(
        { message: "Address ID is required" },
        { status: 400 }
      );
    }

    // Parse the request body
    const addressData = await request.json();

    const updatedAddress = await updateAddress(addressId, addressData);

    if (updatedAddress) {
      return NextResponse.json({ address: updatedAddress }, { status: 200 });
    } else {
      return NextResponse.json(
        { message: "Failed to update the address" },
        { status: 404 }
      );
    }
  } catch (error) {
    handleError(error, "address");
  }
}
// DELETE handler to delete an address
export async function DELETE(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    const deletedAddress = await deleteAddress(userId);

    if (deletedAddress) {
      return NextResponse.json(
        { message: "Address deleted successfully" },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: "Address not found or could not be deleted" },
        { status: 404 }
      );
    }
  } catch (error) {
    handleError(error, "address");
  }
}
