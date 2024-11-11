import { NextRequest, NextResponse } from "next/server";
import {
  createUserCart,
  getUserCart,
  updateUserCart,
  validateCartData,
} from "../APIservices/controllers/cart";
import prisma from "../APIservices/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get("userId");

    // Check if userId is provided
    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required." },
        { status: 400 }
      );
    }

    const cart = await getUserCart(userId);

    // Return the cart as a JSON response
    if (cart) {
      return NextResponse.json({ cart: cart }, { status: 200 }); // Respond with the cart data
    } else {
      return NextResponse.json({ message: "Cart not found." }, { status: 404 });
    }
  } catch (error) {
    console.error("Error fetching cart:", error);

    // Differentiate between JSON parsing errors and other errors
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { message: "Invalid JSON format." },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "An error occurred while fetching the cart." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get("userId");

    // Check if userId is provided
    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required." },
        { status: 400 }
      );
    }

    // Check if the cart exists
    const existingCart = await prisma.cart.findUnique({
      where: {
        userId: userId,
      },
      select: {
        id: true,
        userId: true,
        items: {
          select: {
            id: true,
            quantity: true,
            price: true,
            productId: true,
            cartId: true,
            product: {
              select: {
                name: true,
                imageUrls: true,
              },
            },
          },
        },
      },
    });

    // If the cart exists, return it; otherwise, create a new one

    if (existingCart) {
      const cart = existingCart;
      return NextResponse.json(
        {
          message: "User Cart already exists",
          cart: cart,
        },

        {
          status: 200,
        }
      );
    } else {
      const validation = await validateCartData(request);
      if (!validation.success) {
        return NextResponse.json(
          {
            errors: validation.errors,
          },
          {
            status: 400,
          }
        );
      }
      const { userId, items } = validation.data;
      const cart = await createUserCart(userId, items);

      return NextResponse.json(
        {
          message: "Cart created successfully",
          cart: cart,
        },

        {
          status: 200,
        }
      );
    }
  } catch (error) {
    console.error("Error handling user cart:", error);

    // Differentiate between JSON parsing errors and other errors
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { message: "Invalid JSON format." },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "An error occurred while handling the cart." },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  const validation = await validateCartData(request);

  if (!validation.success) {
    return NextResponse.json(
      {
        error: validation.errors,
      },
      {
        status: 400,
      }
    );
  }

  try {
    const { userId, items } = validation.data;
    const updatedCart = await updateUserCart(userId, items);

    return NextResponse.json(
      {
        message: "Cart updated successfully",
        updatedCart: updatedCart,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "Failed to update cart",
        error: error,
      },
      {
        status: 500,
      }
    );
  }
}
