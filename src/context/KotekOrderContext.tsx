"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { KotekOrder } from "@/types/types";
import { useSession } from "next-auth/react";

// Create the context
const KotekOrderContext = createContext<{
  kotekOrder: KotekOrder;
  setKotekOrder: React.Dispatch<React.SetStateAction<KotekOrder>>;
} | null>(null);

// Provider component
export const KotekOrderProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { data: session } = useSession();

  const [kotekOrder, setKotekOrder] = useState<KotekOrder>({
    status: "PENDING",
    totalAmount: 0,
    userId: "",
    items: [],
    address: {
      fullName: "",
      phoneNumber: "",
      wilayaLabel: "",
      wilayaValue: "",
      commune: "",
      address: "",
      stopDesk: false,
      shippingPrice: 0
    },
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
    <KotekOrderContext.Provider value={{ kotekOrder, setKotekOrder }}>
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
