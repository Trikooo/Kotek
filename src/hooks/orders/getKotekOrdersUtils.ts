import { KotekOrder, PaginationMetadata } from "@/types/types";
import axios from "axios";

export async function fetchUserKotekOrders(
  userId: string,
  page: number = 1,
  limit: number = 10
): Promise<{ orders: KotekOrder[]; pagination: PaginationMetadata }> {
  const response = await axios.get(`/api/kotekOrders`, {
    params: { userId, page, limit },
  });

  if (response.status !== 200) {
    throw new Error("Failed to fetch Kotek orders");
  }

  return response.data;
}
