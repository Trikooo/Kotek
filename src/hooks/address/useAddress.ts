import { Address } from "@/types/types";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { fetchUserAddresses } from "./getAddressUtils";
import axios, { AxiosError } from "axios";
import { handleAxiosError } from "@/utils/handleAxiosError";

export function useGetAddresses() {
  const { data: session, status } = useSession();
  const userId = session?.user?.id ?? null;
  const [addresses, setAddresses] = useState<Address[] | []>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<AxiosError | null>(null);
  useEffect(() => {
    async function loadAddresses() {
      setLoading(true);
      setError(null);
      try {
        if (status === "authenticated" && userId) {
          const userAddress = await fetchUserAddresses(userId);
          setAddresses(userAddress);
        }
      } catch (error) {
        setError(error as AxiosError);
      } finally {
        setLoading(false);
      }
    }
    if (status !== "loading") loadAddresses();
  }, [status, userId]);
  return {
    addresses,
    setAddresses,
    loading,
    error,
  };
}

// Unified hook
export function useAddressRequest() {
  const handleCreateAddress = (address: Address, userId: string) => {
    return handleAddressRequest(
      "post",
      `/api/addresses/?userId=${userId}`,
      address,
      userId
    );
  };

  const handleUpdateAddress = (address: Address, userId: string) => {
    return handleAddressRequest(
      "put",
      `/api/addresses?userId=${userId}`,
      address,
      userId
    );
  };

  const handleDeleteAddress = async (addressId: string, userId: string) => {
    try {
      const response = await handleAddressRequest(
        "delete",
        `/api/addresses/${addressId}?userId=${userId}`,
        {},
        userId
      );
      return response;
    } catch (error) {
      throw error;
    }
  };

  return { handleCreateAddress, handleUpdateAddress, handleDeleteAddress };
}

// Request handler
const handleAddressRequest = async (
  method: "post" | "put" | "delete",
  url: string,
  address: Address | {},
  userId: string
): Promise<any> => {
  try {
    const config = {
      method,
      url,
      data: address ? address : undefined,
    };
    const response = await axios(config);
    return response.data;
  } catch (error) {
    throw error;
  }
};
