import { useState } from "react";
import axios from "axios"; // or your preferred HTTP client
import { KotekOrder, NoestOrderForm } from "@/types/types";

import { useKotekOrderRequest } from "./useKotekOrder";
import { useSession } from "next-auth/react";
import { useKotekOrder } from "@/context/KotekOrderContext";

export const useNoestOrderCreation = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderResponse, setOrderResponse] = useState<any>(null);
  const { handleUpdateKotekOrder } = useKotekOrderRequest();
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const createNoestOrder = async (
    noestOrderData: Partial<NoestOrderForm>,
    kotekOrderId: string
  ) => {
    const validationErrors = validateOrderData(noestOrderData);
    if (Object.keys(validationErrors).length > 0) {
      setError(JSON.stringify(validationErrors));
      return null;
    }

    setIsLoading(true);
    setError(null);
    if (userId) {
      try {
        const noestResponse = await axios.post(
          "/api/noestOrders",
          noestOrderData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (noestResponse.status === 201) {
          const kotekOrderUpdatedData: Partial<KotekOrder> = {
            status: "PROCESSING",
          };
          const tracking = noestResponse.data.noestData.tracking;
          if (tracking) {
            kotekOrderUpdatedData.tracking = tracking;
          }
          const responseData = await handleUpdateKotekOrder(
            kotekOrderUpdatedData,
            kotekOrderId,
            userId
          );

          setOrderResponse(noestResponse.data);
        }

        return noestResponse.data;
      } catch (err) {
        console.error(err);
        const errorMessage =
          err instanceof Error ? err.message : "An unexpected error occurred";
        setError(errorMessage);
        return null;
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Validation function with specific checks
  const validateOrderData = (data: Partial<NoestOrderForm>) => {
    const errors: Record<string, string> = {};

    // Required fields check
    if (!data.client) errors.client = "Client name is required";
    if (!data.phone) errors.phone = "Phone number is required";
    if (!data.adresse) errors.adresse = "Address is required";
    if (!data.wilaya_id) errors.wilaya_id = "Wilaya ID is required";
    if (!data.commune) errors.commune = "Commune is required";
    if (!data.produit) errors.produit = "Product is required";

    // Conditional validations
    if (data.stop_desk === 1 && !data.station_code) {
      errors.station_code = "Station code is required for stop desk delivery";
    }

    if (data.stock === 1 && !data.quantite) {
      errors.quantite = "Quantity is required when stock is selected";
    }

    return errors;
  };

  // Reset function to clear state
  const resetOrder = () => {
    setIsLoading(false);
    setError(null);
    setOrderResponse(null);
  };

  return {
    createNoestOrder,
    resetOrder,
    isLoading,
    error,
    orderResponse,
  };
};
