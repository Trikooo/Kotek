import prisma from "../lib/prisma";
import { Cart, CartItem } from "@prisma/client";
import { NextRequest } from "next/server";
import { z } from "zod";
import { CartItemInput, cartUpdateRequestSchema } from "../lib/validation";
export async function getUserCart(
  userId: string
): Promise<Omit<Cart, "createdAt" | "updatedAt"> | null> {
  try {
    const cart = await prisma.cart.findUnique({
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
    return cart;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(
        "An error occurred while fetching cart data: ",
        error.message
      );
      throw new Error(
        `An error occurred while fetching cart data: ${error.message}`
      );
    } else {
      console.error(
        "An unknown error occurred while fetching cart data: ",
        error
      );
      throw new Error(
        `An unknown error occurred while fetching cart data: ${error}`
      );
    }
  }
}

export async function createUserCart(
  userId: string,
  items: Omit<CartItem, "id" | "cartId">[]
): Promise<Cart> {
  try {
    // Create a new cart for the user
    const newCart = await prisma.cart.create({
      data: {
        userId: userId,
        // Omit items or provide an array with the correct structure if needed
        items: {
          create: items, // You can also omit this if you don't need to initialize items
        },
      },
    });

    return newCart; // Return the newly created cart
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(
        "An error occurred while creating the cart:",
        error.message
      );
      throw new Error(
        `An error occurred while creating the cart: ${error.message}`
      );
    } else {
      console.error(
        "An unknown error occurred while creating the cart:",
        error
      );
      throw new Error(
        `An unknown error occurred while creating the cart: ${error}`
      );
    }
  }
}

export async function updateUserCart(
  userId: string,
  newItems: CartItemInput[]
) {
  const cart = await prisma.cart.findUnique({
    where: { userId },
  });

  if (!cart) {
    throw new Error("Cart not found for user");
  }
  return prisma.$transaction(async (tx) => {
    // updatedItems is an array like:
    // [
    //   { productId: 1, quantity: 2, price: 10.99 },
    //   { productId: 2, quantity: 1, price: 15.99 }
    // ]

    // For each item, we create a prisma upsert operation
    const upsertPromises = newItems.map((item) => {
      return tx.cartItem.upsert({
        // First, look for an existing cart item with this cartId and productId
        where: {
          cartId_productId: {
            cartId: cart.id,
            productId: item.productId,
          },
        },
        // If not found, create new cart item with these values
        create: {
          cartId: cart.id,
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        },
        // If found, update the existing item with these values
        update: {
          quantity: item.quantity,
          price: item.price,
        },
      });
    });

    // Wait for all upsert operations to complete
    await Promise.all(upsertPromises);

    // Finally, get the cart with all its items and return it
    return await getUserCart(cart.userId);
  });
}

export async function validateCartData(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = cartUpdateRequestSchema.parse(body);

    return {
      success: true as const,
      data: validatedData,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false as const,
        errors: error.errors.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        })),
      };
    }

    if (error instanceof SyntaxError) {
      return {
        success: false as const,
        errors: [
          {
            field: "body",
            message: "Invalid JSON in request body",
          },
        ],
      };
    }

    return {
      success: false as const,
      errors: [
        {
          field: "unknown",
          message: "An unexpected error occurred",
        },
      ],
    };
  }
}

export async function deleteItemFromCart(
  itemId: string, // Item ID to delete
  userId: string // User ID to identify which cart to delete the item from
) {
  try {
    // Find the cart for the given userId
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: { items: true }, // Include items in the cart to check if the item exists
    });

    if (!cart) {
      throw new Error("Cart not found for user");
    }

    // Find the specific cart item to delete by cartId and itemId
    const cartItem = cart.items.find((item) => item.id === itemId);

    if (!cartItem) {
      throw new Error("Item not found in cart");
    }

    // Perform the deletion of the cart item
    await prisma.cartItem.delete({
      where: {
        id: itemId, // Deleting by the item id
      },
    });

    return { message: "Item deleted successfully" };
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error deleting item from cart:", error.message);
      throw new Error(
        `An error occurred while deleting item from cart: ${error.message}`
      );
    } else {
      console.error("An unknown error occurred:", error);
      throw new Error(
        `An unknown error occurred while deleting item from cart: ${error}`
      );
    }
  }
}

export async function emptyUserCart(userId: string) {
  const cart = await prisma.cart.findUnique({
    where: { userId },
  });

  if (!cart) {
    throw new Error("Cart not found for user");
  }

  // Delete all items associated with this cart
  await prisma.cartItem.deleteMany({
    where: {
      cartId: cart.id,
    },
  });

  // Return the now-empty cart
  return await getUserCart(cart.userId);
}
