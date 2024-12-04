// hooks/cart/useCart.ts
import { useState, useEffect } from "react";
import axios from "axios";
import { Cart, FetchCart } from "@/types/types";
import { useSession } from "next-auth/react";
import { fetchUserCart, loadGuestCartItems } from "./getCartUtils";

export function useGetCart() {
  const { data: session, status } = useSession();
  const userId = session?.user?.id ?? null;

  const [cart, setCart] = useState<FetchCart | null>({
    id: null,
    userId: null,
    items: [],
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCart() {
      setLoading(true);
      setError(null);

      try {
        if (status === "unauthenticated") {
          // Load cart for guest user
          setCart({
            id: null,
            userId: null,
            items: loadGuestCartItems(),
          });
        } else if (status === "authenticated" && userId) {
          // Load cart for authenticated user
          const userCart = await fetchUserCart(userId);
          setCart(userCart);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load cart");
      } finally {
        setLoading(false);
      }
    }

    if (status !== "loading") loadCart();
  }, [status, userId]);

  return { cart, setCart, loading, error } as const;
}

export function useCreateOrUpdateCart() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleCreateCart(
    cartData: Omit<Cart, "id" | "createdAt" | "updatedAt">
  ): Promise<any> {
    setLoading(true);
    setError(null);

    return new Promise(async (resolve, reject) => {
      try {
        const response = await axios.post(
          `/api/cart?userId=${cartData.userId}`,
          {
            userId: cartData.userId,
            items: cartData.items,
          }
        );

        resolve(response.data);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error(
            "Error creating cart:",
            error.response?.data || error.message
          );
          setError("Failed to create cart");
        } else {
          console.error("Unexpected error:", error);
          setError("An unexpected error occurred");
        }
        reject(error);
      } finally {
        setLoading(false);
      }
    });
  }

  function handleUpdateCart(
    userId: string,
    cartData: Omit<Cart, "id" | "createdAt" | "updatedAt">
  ): Promise<any> {
    setLoading(true);
    setError(null);

    return new Promise(async (resolve, reject) => {
      try {
        const response = await axios.put(`/api/cart?userId=${userId}`, {
          userId: userId,
          items: cartData.items,
        });

        resolve(response.data);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error(
            "Error updating cart:",
            error.response?.data || error.message
          );
          setError("Failed to update cart");
        } else {
          console.error("Unexpected error:", error);
          setError("An unexpected error occurred");
        }
        reject(error);
      } finally {
        setLoading(false);
      }
    });
  }

  function handleCreateOrUpdate(
    cartData: Omit<Cart, "id" | "createdAt" | "updatedAt">
  ): Promise<any> {
    setLoading(true);
    setError(null);

    return new Promise(async (resolve, reject) => {
      if (!cartData.userId) {
        setError("User ID is required to create or update the cart.");
        setLoading(false);
        reject(new Error("User ID is required"));
        return;
      }

      try {
        // Check if a cart exists for the user
        const existingCartResponse = await axios.get(
          `/api/cart?userId=${cartData.userId}`
        );

        if (existingCartResponse.status === 200 && existingCartResponse.data) {
          // If a cart exists, update it
          resolve(await handleUpdateCart(cartData.userId, cartData));
        } else {
          // If no cart exists, create a new one
          resolve(await handleCreateCart(cartData));
        }
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
          // Handle not found error if the cart does not exist
          resolve(await handleCreateCart(cartData));
        } else {
          console.error("Error fetching cart:", error);
          setError("Failed to fetch cart for user");
          reject(error);
        }
      } finally {
        setLoading(false);
      }
    });
  }

  return {
    handleCreateCart,
    handleUpdateCart,
    handleCreateOrUpdate,
    loading,
    error,
  };
}

export function useDeleteCartItem() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleDeleteCartItem(
    userId: string,
    cartItemId: string
  ): Promise<any> {
    setLoading(true);
    setError(null);

    return new Promise(async (resolve, reject) => {
      try {
        const response = await axios.delete(
          `/api/cart/items/${cartItemId}?userId=${userId}`
        );

        resolve(response.data);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error(
            "Error deleting cart item:",
            error.response?.data || error.message
          );
          setError("Failed to delete cart item");
        } else {
          console.error("Unexpected error:", error);
          setError("An unexpected error occurred");
        }
        reject(error);
      } finally {
        setLoading(false);
      }
    });
  }

  return {
    handleDeleteCartItem,
    loading,
    error,
  };
}

export function useEmptyCart() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleEmptyCart(userId: string): Promise<any> {
    setLoading(true);
    setError(null);

    return new Promise(async (resolve, reject) => {
      try {
        const response = await axios.delete(`/api/cart?userId=${userId}`);

        resolve(response.data);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error(
            "Error emptying cart:",
            error.response?.data || error.message
          );
          setError("Failed to empty cart");
        } else {
          console.error("Unexpected error:", error);
          setError("An unexpected error occurred");
        }
        reject(error);
      } finally {
        setLoading(false);
      }
    });
  }

  return {
    handleEmptyCart,
    loading,
    error,
  };
}
