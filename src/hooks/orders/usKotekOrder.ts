import { KotekOrder } from "@/types/types";
import { handleAxiosError } from "@/utils/handleAxiosError";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { fetchUserKotekOrders } from "./getKotekOrdersUtils";
export function useGetKotekOrders() {
  const { data: session, status } = useSession();
  const userId = session?.user?.id ?? null;
  const [existingKotekOrders, setExistingKotekOrders] = useState<
    KotekOrder[] | []
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadKotekOrders() {
      setLoading(true);
      setError(null);
      try {
        if (status === "authenticated" && userId) {
          const userKotekOrders = await fetchUserKotekOrders(userId);
          setExistingKotekOrders(userKotekOrders);
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : (error as string));
      } finally {
        setLoading(false);
      }
    }

    if (status !== "loading") loadKotekOrders();
  }, [status, userId]);

  return {
    existingKotekOrders,
    setExistingKotekOrders,
    loading,
    error,
  };
}

export function useKotekOrderRequest() {
  const handleCreateKotekOrder = (kotekOrder: KotekOrder, userId: string) => {
    console.log("kotekOrder just before sending: ", kotekOrder);
    return handleKotekOrderRequest(
      "post",
      `/api/kotekOrders?userId=${userId}`,
      kotekOrder
    );
  };

  const handleUpdateKotekOrder = (kotekOrder: KotekOrder, userId: string) => {
    return handleKotekOrderRequest(
      "put",
      `/api/kotekOrders?userId=${userId}`,
      kotekOrder
    );
  };

  const handleDeleteKotekOrder = async (
    kotekOrderId: string,
    userId: string
  ) => {
    try {
      const response = await handleKotekOrderRequest(
        "delete",
        `/api/kotekOrders/${kotekOrderId}?userId=${userId}`,
        {}
      );
      return response;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : (error as string)
      );
    }
  };

  return {
    handleCreateKotekOrder,
    handleUpdateKotekOrder,
    handleDeleteKotekOrder,
  };
}

const handleKotekOrderRequest = async (
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
    throw handleAxiosError(error);
  }
};
