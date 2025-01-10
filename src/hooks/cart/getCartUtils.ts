import { Cart, CartItem, CartUpdateResponse } from "@/types/types";
import axios from "axios";

export const validateGuestCart = (cart: unknown): cart is CartItem[] => {
  return (
    Array.isArray(cart) &&
    cart.every(
      (item) =>
        typeof item === "object" &&
        item !== null &&
        typeof item.productId === "string" &&
        typeof item.quantity === "number" &&
        typeof item.price === "number" &&
        typeof item.product === "object" &&
        item.product !== null &&
        typeof item.product.name === "string" &&
        Array.isArray(item.product.imageUrls) &&
        item.product.imageUrls.every((url: unknown) => typeof url === "string")
    )
  );
};

// Retrieve and validate guest cart from localStorage
export const loadGuestCartItems = (): CartItem[] => {
  try {
    const guestCart = localStorage.getItem("guestCart");
    const parsedCart = guestCart ? JSON.parse(guestCart) : null;

    if (parsedCart && validateGuestCart(parsedCart)) {
      return parsedCart;
    } else {
      localStorage.removeItem("guestCart");
      return [];
    }
  } catch (error) {
    console.error("Failed to parse guest cart from localStorage:", error);
    localStorage.removeItem("guestCart");
    return [];
  }
};

// Retrieve cart from the database itself:
export const fetchUserCart = async (userId: string) => {
  //Fetch cart from server:
  const response = await fetch(`/api/cart?userId=${userId}`, { method: "GET" });
  if (!response.ok)
    throw new Error(`Failed to fetch cart: ${response.statusText}`);

  const data = await response.json();
  const userCart = data.cart;
  const guestCartItems = loadGuestCartItems();
  //now merge the guestCart upon user login (only if there is something valid in localStorage):
  if (guestCartItems.length > 0) {
    const mergedItems: CartItem[] = [...userCart.items];
    guestCartItems.forEach((guestItem) => {
      const existingItem = mergedItems.find(
        (item: CartItem) => item.productId === guestItem.productId
      );
      if (existingItem) {
        existingItem.quantity += guestItem.quantity; // Add quantity if the item exists.
      } else {
        mergedItems.push(guestItem); // Add the new item if not already present in the cart.
      }
    });
    const updatedData = await updateCartFirstTime(userId, mergedItems); // update the cart
    localStorage.removeItem("guestCart");

    return updatedData.cart;
  } else {
    return userCart;
  }
};

const updateCartFirstTime = (
  userId: string,
  items: CartItem[]
): Promise<CartUpdateResponse> => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios.put(`api/cart?userId${userId}`, {
        userId: userId,
        items: items,
      });
      resolve(response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          "Error updating cart:",
          error.response?.data || error.message
        );
      } else {
        console.error("Unexpected error:", error);
      }
      reject(error);
    }
  });
};
