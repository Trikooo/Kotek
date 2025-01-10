"use client";
import { useGetCart } from "@/hooks/cart/useCart";
import { FetchCart } from "@/types/types";
import React, { createContext, useContext, ReactNode, useMemo } from "react";

interface CartContextType {
  cart: FetchCart | null;
  setCart: React.Dispatch<React.SetStateAction<FetchCart | null>>;
  subtotal: number;
  loading: boolean;
  error: unknown;
}

const CartContext = createContext<CartContextType>({
  cart: {
    id: null,
    userId: null,
    items: [],
  },
  setCart: () => {},
  loading: false,
  error: null,
  subtotal: 0,
});

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartProvider: React.FC<{
  children: ReactNode;
}> = ({ children }) => {
  const { cart, setCart, loading, error } = useGetCart();
  const calculateSubtotal = () => {
    return (
      cart?.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      ) ?? 0
    );
  };

  const subtotal = calculateSubtotal();

  const value = useMemo(
    () => ({
      cart,
      setCart,
      loading,
      error,
      subtotal,
    }),
    [cart, setCart, loading, error, subtotal]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
