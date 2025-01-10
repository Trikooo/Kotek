import getWilayaData from "@/services/wilayaDataService";
import { v4 as uuidv4 } from "uuid";

export function formatCurrency(
  amount: number,
  currencySuffix: boolean = true
): string {
  const formattedAmount = amount
    .toLocaleString("en-US", { useGrouping: true })
    .replace(/,/g, " ");

  return currencySuffix ? `${formattedAmount} DA` : formattedAmount;
}

export function generateKey(prefix: string): string {
  const date = new Date();
  const formattedDate = `${date.getFullYear()}${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}${date.getDate().toString().padStart(2, "0")}${date
    .getHours()
    .toString()
    .padStart(2, "0")}${date.getMinutes().toString().padStart(2, "0")}${date
    .getSeconds()
    .toString()
    .padStart(2, "0")}`;

  const uuid = uuidv4();
  return `${prefix}/${formattedDate}-${uuid}`;
}

/**
 * Calculate shipping price based on order subtotal and base shipping price.
 * @param subtotal - Total amount of items in thousands 150 000 DA
 * @param baseShippingPrice - Base shipping price in da (e.g., 500 DA)
 * @returns Total shipping price in DA
 */
export const calculateShipping = (
  subtotal: number,
  baseShippingPrice: number
): number => {
  const STANDARD_THRESHOLD = 100000; // 100,000 da
  const MAX_SINGLE_PARCEL = 150000; // 150,000 da

  // If amount is under standard threshold, just return base price
  if (subtotal <= STANDARD_THRESHOLD) {
    return baseShippingPrice;
  }

  // For everything else, calculate number of parcels needed
  const fullParcels = Math.floor(subtotal / MAX_SINGLE_PARCEL);
  const remainder = subtotal % MAX_SINGLE_PARCEL;
    let multiplier = fullParcels * 2; // Each full parcel (150k) costs double

  // Handle the remainder
  if (remainder > 0) {
    if (remainder < STANDARD_THRESHOLD) {
      multiplier += 1; // Add base price for remainder under 10
    } else {
      multiplier += 2; // Add double price for remainder between 10-15
    }
  }

  return baseShippingPrice * multiplier;
};

// Existing helper functions remain the same
export const humanReadableDate = (isoString: string): string => {
  const date = new Date(isoString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
};

export async function getNoestWilayaValue(
  wilayaValue: string,
  wilayaLabel: string
): Promise<number | undefined> {
  try {
    const parsedValue = parseInt(wilayaValue, 10);
    if (parsedValue <= 48) {
      return parsedValue;
    }

    const wilayaData = await getWilayaData();
    if (wilayaData) {
      const noestWilayaValue = wilayaData[wilayaLabel]?.legacyData?.previousId;
      if (noestWilayaValue) {
        return parseInt(noestWilayaValue, 10);
      }
    }
  } catch (error) {
    console.error("Error in getNoestWilayaValue:", error);
    throw error
  }

  return undefined;
}
