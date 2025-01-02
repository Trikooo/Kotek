import {
  useMutation,
  useQuery,
  useQueries,
  UseQueryResult,
} from "@tanstack/react-query";

import {
  ExtendedNoestCreateResponse,
  KotekOrder,
  NoestCreateResponse,
  OrderData,
} from "@/types/types";
import apiClient from "./utils/apiClient";
import { Order } from "@prisma/client";

// Create Order Hook
export const useCreateNoestOrder = () => {
  return useMutation<
    { noest: NoestCreateResponse; kotek: Order },
    Error,
    OrderData
  >({
    mutationFn: (orderData) =>
      apiClient
        .post<{ noest: NoestCreateResponse; kotek: Order }>(
          "/create",
          orderData
        )
        .then((res) => res.data),
  });
};

// Validate Order Hook
export const useValidateNoestOrder = () => {
  return useMutation<
    { noest: NoestCreateResponse; kotek: Order },
    Error,
    KotekOrder
  >({
    mutationFn: (data) =>
      apiClient
        .post<{ noest: NoestCreateResponse; kotek: Order }>("/validate", data)
        .then((res) => res.data),
  });
};

// Update Order Hook
export const useUpdateNoestOrder = () => {
  return useMutation<ExtendedNoestCreateResponse, Error, OrderData>({
    mutationFn: (data) =>
      apiClient
        .post<ExtendedNoestCreateResponse>("/update", data)
        .then((res) => res.data),
  });
};

// Delete Order Hook
export const useDeleteNoestOrder = () => {
  return useMutation<{ success: boolean }, Error, { tracking: string }>({
    mutationFn: (data) =>
      apiClient
        .post<{ success: boolean }>("/delete", data)
        .then((res) => res.data),
  });
};
type LabelData = {
  data: Blob;
  trackingNumber: string;
};

// Get Label Hook
export const useGetOrderLabels = (
  trackingNumbers: string[]
): UseQueryResult<LabelData, Error>[] => {
  return useQueries({
    queries: trackingNumbers.map((tracking) => ({
      queryKey: ["orderLabel", tracking],
      queryFn: async () => {
        const response = await apiClient.get("/label", {
          params: { trackingNumber: tracking },
          responseType: "blob",
          headers: {
            Accept: "application/pdf",
          },
        });
        return { data: response.data, trackingNumber: tracking }; // Return both
      },
      enabled: !!tracking,
    })),
  });
};

// Cancel Order Hook
export const useCancelOrder = () => {
  return useMutation<
    {
      message: string;
      deletedCount: number;
      failedAt?: string;
      failureReason?: string;
      order: Order;
    },
    Error,
    KotekOrder
  >({
    mutationFn: (order) =>
      apiClient
        .post<{
          message: string;
          deletedCount: number;
          failedAt?: string;
          failureReason?: string;
          order: Order;
        }>("/cancel", order)
        .then((res) => res.data),
  });
};
