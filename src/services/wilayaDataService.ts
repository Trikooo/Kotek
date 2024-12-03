import { Wilayas, Wilaya } from "@/types/types";
import axios from "axios";

function isValidWilayaData(data: any): data is Wilayas {
  // Check if data is an object
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return false;
  }

  // Validate each wilaya in the record
  return Object.entries(data).every(([key, wilaya]: [string, any]) => {
    // Validate key
    if (typeof key !== "string") return false;

    // Check required properties of Wilaya
    if (!wilaya || typeof wilaya !== "object") return false;

    // Validate id
    if (typeof wilaya.id !== "string") return false;

    // Validate communes
    if (
      !Array.isArray(wilaya.communes) ||
      !wilaya.communes.every((commune: string) => typeof commune === "string")
    ) {
      return false;
    }

    // Validate noest
    if (!wilaya.noest || typeof wilaya.noest !== "object") return false;

    // Validate stations
    if (
      !Array.isArray(wilaya.noest.stations) ||
      !wilaya.noest.stations.every(
        (station: { commune: string; stationCode: string }) =>
          typeof station === "object" &&
          typeof station.commune === "string" &&
          typeof station.stationCode === "string"
      )
    ) {
      return false;
    }

    // Validate prices
    if (
      !wilaya.noest.prices ||
      typeof wilaya.noest.prices.home !== "number" ||
      typeof wilaya.noest.prices.stopDesk !== "number"
    ) {
      return false;
    }

    // Validate optional legacyData
    if (wilaya.legacyData) {
      if (
        typeof wilaya.legacyData !== "object" ||
        typeof wilaya.legacyData.previousWilaya !== "string" ||
        typeof wilaya.legacyData.previousId !== "string"
      ) {
        return false;
      }
    }

    return true;
  });
}

export default async function getWilayaData(): Promise<Wilayas | undefined> {
  try {
    if (typeof window !== "undefined") {
      // Ensure we are in the browser environment
      const wilayaData = localStorage.getItem("wilayaData");

      if (wilayaData) {
        try {
          const parsedData = JSON.parse(wilayaData);

          if (isValidWilayaData(parsedData)) {
            return parsedData;
          } else {
            // If data is invalid, remove it from localStorage
            localStorage.removeItem("wilayaData");
            throw new Error("Invalid wilaya data format");
          }
        } catch (parseError) {
          // If parsing fails
          localStorage.removeItem("wilayaData");
          console.error("Failed to parse wilaya data", parseError);
        }
      }

      // If no valid data in localStorage, fetch from API
      const response = await axios.get("/api/wilayaData");
      localStorage.setItem("wilayaData", JSON.stringify(response.data));
      return response.data;
    }
  } catch (error) {
    if (error instanceof axios.AxiosError) {
      console.error("Error fetching wilaya data:", error.message);
    } else {
      console.error("Unknown error:", error);
    }
    throw new Error("Failed to fetch wilaya data");
  }
}
