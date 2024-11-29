import { Wilayas } from "@/types/types";
import axios from "axios";
export default async function getWilayaData(): Promise<Wilayas | undefined> {
  try {
    if (typeof window !== "undefined") {
      // Ensure we are in the browser environment
      const wilayaData = localStorage.getItem("wilayaData");
      if (wilayaData) {
        return JSON.parse(wilayaData) as Wilayas; // Return the parsed data from localStorage with type assertion
      } else {
        const response = await axios.get("/api/wilayaData");
        localStorage.setItem("wilayaData", JSON.stringify(response.data)); // Store the raw data in localStorage
        return response.data as Wilayas; // Return the fetched data with type assertion
      }
    }
  } catch (error) {
    if (error instanceof axios.AxiosError) {
      console.error("Error fetching wilaya data:", error.message);
    } else {
      console.error("Unknown error:", error);
    }
    throw new Error("Failed to fetch wilaya data"); // Throw a custom error
  }
}
