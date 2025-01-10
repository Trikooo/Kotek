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
                status: true,
              },
            },
          },
        },
      },
    });
    if (cart?.items.some((item) => item.product.status !== "ACTIVE")) {
      const itemsToDelete = cart.items.filter(
        (item) => item.product.status !== "ACTIVE"
      );
      for (const item of itemsToDelete) {
        await deleteItemFromCart(item.id, userId);
      }
      cart.items = cart.items.filter(
        (item) => item.product.status === "ACTIVE"
      );
    }
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
        items: {
          create: items,
        },
      },
      include: {
        items: true, // Include the related items in the response
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

  await prisma.$transaction(async (tx) => {
    const upsertPromises = newItems.map((item) => {
      return tx.cartItem.upsert({
        where: {
          cartId_productId: {
            cartId: cart.id,
            productId: item.productId,
          },
        },
        create: {
          cartId: cart.id,
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        },
        update: {
          quantity: item.quantity,
          price: item.price,
        },
      });
    });

    await Promise.all(upsertPromises);
  });

  // Fetch the updated cart after the transaction is complete
  const newCart = await getUserCart(cart.userId);
  return newCart;
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
