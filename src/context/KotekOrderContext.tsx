"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { KotekOrder } from "@/types/types";
import { useSession } from "next-auth/react";
import { useAddress } from "./AddressContext";
import { useGetKotekOrders } from "@/hooks/orders/usKotekOrder";

// Create the context
const KotekOrderContext = createContext<{
  kotekOrder: KotekOrder;
  setKotekOrder: React.Dispatch<React.SetStateAction<KotekOrder>>;
  existingKotekOrders: KotekOrder[];
  loading: boolean;
  error: string | null;
} | null>(null);

// Provider component
export const KotekOrderProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { data: session } = useSession();
  const { selectedAddress } = useAddress();
  const { existingKotekOrders, loading, error } = useGetKotekOrders(); // Use the hook

  const [kotekOrder, setKotekOrder] = useState<KotekOrder>({
    status: "PENDING",
    totalAmount: 0,
    subtotalAmount: 0,
    userId: "",
    items: [],
  });

  useEffect(() => {
    if (session?.user?.id) {
      setKotekOrder((prevState) => ({
        ...prevState,
        userId: session.user?.id || "",
      }));
    }
  }, [session]);

  return (
    <KotekOrderContext.Provider
      value={{
        kotekOrder,
        setKotekOrder,
        existingKotekOrders,
        loading,
        error,
      }}
    >
      {children}
    </KotekOrderContext.Provider>
  );
};

// Custom hook to use the context
export const useKotekOrder = () => {
  const context = useContext(KotekOrderContext);
  if (!context) {
    throw new Error("useKotekOrder must be used within a KotekOrderProvider");
  }
  return context;
};
