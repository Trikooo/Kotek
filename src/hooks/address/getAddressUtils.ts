import { Address } from "@/types/types";
import axios from "axios";

export function validateGuestAddresses(addresses: Address[]): boolean {
  return addresses.every((address) => {
    // Validate required fields
    if (typeof address.fullName !== "string" || address.fullName.trim() === "")
      return false;
    if (
      typeof address.phoneNumber !== "string" ||
      address.phoneNumber.trim() === ""
    )
      return false;
    if (
      typeof address.wilayaValue !== "string" ||
      address.wilayaValue.trim() === ""
    )
      return false;
    if (
      typeof address.wilayaLabel !== "string" ||
      address.wilayaLabel.trim() === ""
    )
      return false;
    if (typeof address.commune !== "string" || address.commune.trim() === "")
      return false;
    if (typeof address.address !== "string" || address.address.trim() === "")
      return false;

    if (typeof address.stopDesk !== "boolean") return false;

    // Optional fields
    if (
      address.secondPhoneNumber &&
      typeof address.secondPhoneNumber !== "string"
    )
      return false;
    if (address.stationCode && typeof address.stationCode !== "string")
      return false;
    if (address.stationName && typeof address.stationName !== "string")
      return false;

    return true;
  });
}

export function loadGuestAddresses() {
  try {
    const guestAddresses = localStorage.getItem("guestAddresses");
    const parsedAddresses = guestAddresses ? JSON.parse(guestAddresses) : null;
    if (parsedAddresses && validateGuestAddresses(parsedAddresses)) {
      return parsedAddresses;
    } else {
      localStorage.removeItem("guestAddresses");
      return [];
    }
  } catch (error) {
    console.error("Failed to parse guest addresses from localStorage:", error);
    localStorage.removeItem("guestAddresses");
    return [];
  }
}

export async function fetchUserAddresses(userId: string): Promise<Address[]> {
  const response = await axios.get(`/api/addresses?userId=${userId}`);
  if (response.status !== 200) {
    throw new Error("Failed to fetch addresses");
  }
  return response.data.addresses;
}
