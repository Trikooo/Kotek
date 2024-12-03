"use client"
import React, { createContext, useContext, useState } from "react";

interface ShippingPriceContextType {
  shippingPrice: number;
  setShippingPrice: React.Dispatch<React.SetStateAction<number>>;
}

const ShippingPriceContext = createContext<ShippingPriceContextType | undefined>(undefined);

export const useShippingPriceContext = (): ShippingPriceContextType => {
  const context = useContext(ShippingPriceContext);
  if (!context) {
    throw new Error("useShippingPriceContext must be used within a ShippingPriceProvider");
  }
  return context;
};

export const ShippingPriceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [shippingPrice, setShippingPrice] = useState<number>(0);

  return (
    <ShippingPriceContext.Provider value={{ shippingPrice, setShippingPrice }}>
      {children}
    </ShippingPriceContext.Provider>
  );
};
