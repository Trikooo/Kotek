"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from "react";
import { KotekOrder, PaginationMetadata } from "@/types/types";
import { useSession } from "next-auth/react";
import {
  useGetAllKotekOrders,
  useGetUserKotekOrders,
} from "@/hooks/orders/useKotekOrder";
import { AxiosError } from "axios";

// Create the context
const KotekOrderContext = createContext<
  | {
      kotekOrder: KotekOrder;
      setKotekOrder: React.Dispatch<React.SetStateAction<KotekOrder>>;
      userKotekOrders: KotekOrder[];
      setUserKotekOrders: React.Dispatch<React.SetStateAction<KotekOrder[]>>;
      userOrdersLoading: boolean;
      userOrdersError: AxiosError | null;
      allKotekOrders: KotekOrder[];
      setAllKotekOrders: React.Dispatch<React.SetStateAction<KotekOrder[]>>;
      allKotekOrdersLoading: boolean;
      allKotekOrdersError: AxiosError | null;
      loadMoreAllKotekOrders: () => void;
      allKotekOrdersPagination: PaginationMetadata | null;
      loadMoreUserKotekOrders: () => void;
      userKotekOrdersPagination: PaginationMetadata | null;
    }
  | undefined
>(undefined);

// Provider component
export const KotekOrderProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { data: session } = useSession();
  const {
    orders: userKotekOrders,
    setOrders: setUserKotekOrders,
    loading: userOrdersLoading,
    error: userOrdersError,
    loadMoreOrders: loadMoreUserKotekOrders,
    pagination: userKotekOrdersPagination,
  } = useGetUserKotekOrders();

  const {
    orders: allKotekOrders,
    setOrders: setAllKotekOrders,
    loading: allKotekOrdersLoading,
    error: allKotekOrdersError,
    loadMoreOrders: loadMoreAllKotekOrders,
    pagination: allKotekOrdersPagination,
  } = useGetAllKotekOrders();

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

  // Memoize the context value
  const contextValue = useMemo(
    () => ({
      kotekOrder,
      setKotekOrder,
      userKotekOrders,
      setUserKotekOrders,
      userOrdersLoading,
      userOrdersError,
      loadMoreUserKotekOrders,
      userKotekOrdersPagination,
      allKotekOrders,
      setAllKotekOrders,
      allKotekOrdersLoading,
      allKotekOrdersError,
      loadMoreAllKotekOrders,
      allKotekOrdersPagination,
    }),
    [
      kotekOrder,
      setKotekOrder,
      userKotekOrders,
      setUserKotekOrders,
      userOrdersLoading,
      userOrdersError,
      loadMoreUserKotekOrders,
      userKotekOrdersPagination,
      allKotekOrders,
      setAllKotekOrders,
      allKotekOrdersLoading,
      allKotekOrdersError,
      loadMoreAllKotekOrders,
      allKotekOrdersPagination,
    ]
  );

  return (
    <KotekOrderContext.Provider value={contextValue}>
      {children}
    </KotekOrderContext.Provider>
  );
};

// Custom hook to use the context
export const useKotekOrder = () => {
  const context = useContext(KotekOrderContext);
  if (context === undefined) {
    throw new Error("useKotekOrder must be used within a KotekOrderProvider");
  }
  return context;
};
