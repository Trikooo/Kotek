import { KotekOrder } from "@/types/types";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useCallback, useState, useEffect } from "react";
import { fetchUserKotekOrders } from "./getKotekOrdersUtils";
import { useScrollPaginatedKotekOrders } from "./useScrollPagination";
import { Order } from "@prisma/client";

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

export function useGetKotekOrderById(orderId: string) {
  const [order, setOrder] = useState<KotekOrder | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchOrder = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`/api/kotekOrders?kotekOrderId=${id}`);

      if (response.status !== 200) {
        throw new Error("Failed to fetch Kotek order");
      }
      console.log(response);
      setOrder(response.data);
      return response.data;
    } catch (err) {
      const error = err instanceof Error ? err : new Error("An error occurred");
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (orderId) {
      fetchOrder(orderId);
    }
  }, []);

  return {
    order,
    loading,
    error,
    fetchOrder,
  };
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
    kotekOrderId: string
  ): Promise<Order> => {
    return handleRequest(
      "put",
      `/api/kotekOrders?kotekOrderId=${kotekOrderId}`,
      kotekOrder
    );
  };

  const handleDeleteKotekOrder = async (kotekOrderId: string) => {
    return handleRequest(
      "delete",
      `/api/kotekOrders/?kotekOrderId=${kotekOrderId}`,
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
    const config = {
      method,
      url,
      data: kotekOrder || undefined,
    };

    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
