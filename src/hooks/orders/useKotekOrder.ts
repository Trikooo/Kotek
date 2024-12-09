import { KotekOrder } from "@/types/types";
import { handleAxiosError } from "@/utils/handleAxiosError";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { fetchUserKotekOrders } from "./getKotekOrdersUtils";
import { useScrollPaginatedKotekOrders } from "./useScrollPagination";
import { usePathname } from "next/navigation";

export function useGetUserKotekOrders() {
  const { data: session } = useSession();
  const userId = session?.user?.id ?? null;

  const fetchUserOrders = async (page: number, limit: number) => {
    if (!userId) {
      throw new Error("User not authenticated");
    }
    return await fetchUserKotekOrders(userId, page, limit);
  };

  return useScrollPaginatedKotekOrders(fetchUserOrders, 10, [
    "/settings/orders",
    "/admin/orders?userId=",
  ]);
}

export function useGetAllKotekOrders() {
  const fetchAllOrders = useCallback(async (page: number, limit: number) => {
    const response = await axios.get(`/api/kotekOrders`, {
      params: { page, limit },
    });

    if (response.status !== 200) {
      throw new Error("Failed to fetch Kotek orders");
    }

    return response.data;
  }, []);

  return useScrollPaginatedKotekOrders(fetchAllOrders, 10, ["/admin"]);
}

export function useKotekOrderRequest() {
  const handleCreateKotekOrder = (kotekOrder: KotekOrder, userId: string) => {
    return handleRequest(
      "post",
      `/api/kotekOrders?userId=${userId}`,
      kotekOrder
    );
  };

  const handleUpdateKotekOrder = (
    kotekOrder: Partial<KotekOrder>,
    kotekOrderId: string,
    userId: string
  ) => {
    return handleRequest(
      "put",
      `/api/kotekOrders?kotekOrderId=${kotekOrderId}&userId=${userId}`,
      kotekOrder
    );
  };

  const handleDeleteKotekOrder = async (
    kotekOrderId: string,
    userId: string
  ) => {
    return handleRequest(
      "delete",
      `/api/kotekOrders/?kotekOrderId=${kotekOrderId}&userId=${userId}`,
      {}
    );
  };

  return {
    handleCreateKotekOrder,
    handleUpdateKotekOrder,
    handleDeleteKotekOrder,
  };
}

const handleRequest = async (
  method: "post" | "put" | "delete",
  url: string,
  kotekOrder: KotekOrder | {}
): Promise<any> => {
  try {
    console.log("url inside the handleRequest function: ", url);
    const config = {
      method,
      url,
      data: kotekOrder || undefined,
    };

    const response = await axios(config);
    return response.data;
  } catch (error) {
    throw error;
  }
};
