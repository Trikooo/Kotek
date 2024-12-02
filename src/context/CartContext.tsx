"use client"
import { useGetCart } from "@/hooks/cart/useCart";
import { FetchCart } from "@/types/types";
import React, { createContext, useContext, ReactNode, useMemo } from "react";

interface CartContextType {
  cart: FetchCart | null;
  setCart: React.Dispatch<React.SetStateAction<FetchCart | null>>;
  loading: boolean;
  error: string | null;
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

  const value = useMemo(
    () => ({
      cart,
      setCart,
      loading,
      error,
    }),
    [cart, setCart, loading, error]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
