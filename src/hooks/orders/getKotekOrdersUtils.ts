import { KotekOrder } from "@/types/types";
import axios from "axios";

export async function fetchUserKotekOrders(
  userId: string
): Promise<KotekOrder[]> {
  const response = await axios.get(`/api/kotek-orders?userId=${userId}`);
  if (response.status !== 200) {
    throw new Error("Failed to fetch Kotek orders");
  }
  return response.data.kotekOrders;
}
