"use client";

import { useGetAddresses } from "@/hooks/address/useAddress";
import { Address } from "@/types/types";
import { AxiosError } from "axios";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useKotekOrder } from "./KotekOrderContext";
import { useCart } from "./CartContext";
import { calculateShipping } from "@/utils/generalUtils";
import { useSession } from "next-auth/react";

interface AddressContextType {
  addresses: Address[];
  setAddresses: React.Dispatch<React.SetStateAction<Address[]>>;
  loading: boolean;
  error: AxiosError | null;
  selectedAddress: Address | null;
  setSelectedAddress: React.Dispatch<React.SetStateAction<Address | null>>;
  selectedAddressLoading: boolean;
}

const AddressContext = createContext<AddressContextType | null>(null);

export const useAddress = (): AddressContextType => {
  const context = useContext(AddressContext);
  if (!context) {
    throw new Error("useAddress must be used within an AddressProvider");
  }
  return context;
};

export const AddressProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { addresses, setAddresses, loading, error } = useGetAddresses();
  const { setKotekOrder } = useKotekOrder();
  const { subtotal } = useCart();
  const [selectedAddressLoading, setSelectedAddressLoading] = useState(true);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const { data: session, status } = useSession();

  // Load saved address only after addresses are fetched
  useEffect(() => {
    const savedAddress = localStorage.getItem("selectedAddress");
    if (savedAddress) {
      const parsedAddress: Address = JSON.parse(savedAddress);
      if (!loading && addresses.length > 0 && status === "authenticated") {
        try {
          // Convert IDs to strings for comparison
          const addressExists = addresses.some(
            (addr) => String(addr.id) === parsedAddress.id
          );

          if (addressExists) {
            // Find the fresh address data
            const currentAddress = addresses.find(
              (addr) => addr.id === parsedAddress.id
            );
            setSelectedAddress(currentAddress || null);

            if (currentAddress) {
              setKotekOrder((prev) => ({
                ...prev,
                shippingPrice: calculateShipping(
                  subtotal,
                  currentAddress.baseShippingPrice
                ),
              }));
            }
          } else {
            localStorage.removeItem("selectedAddress");
          }
        } catch (e) {
          console.error("Error parsing saved address:", e);
          localStorage.removeItem("selectedAddress");
        }
      } else if (status === "unauthenticated") {
        setSelectedAddress(parsedAddress);
        setKotekOrder((prev) => ({
          ...prev,
          shippingPrice: parsedAddress.baseShippingPrice,
        }));
      }
    }
    setSelectedAddressLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, addresses, status, subtotal]);

  // Save address changes
  useEffect(() => {
    if (selectedAddress && !loading) {
      localStorage.setItem("selectedAddress", JSON.stringify(selectedAddress));
    } else if (!selectedAddress && !loading) {
      localStorage.removeItem("selectedAddress");
    }
  }, [selectedAddress, loading]);

  const value = useMemo(
    () => ({
      addresses: addresses || [],
      setAddresses,
      loading,
      error,
      selectedAddress,
      setSelectedAddress,
      selectedAddressLoading,
    }),
    [
      addresses,
      setAddresses,
      loading,
      error,
      selectedAddress,
      selectedAddressLoading,
    ]
  );

  return (
    <AddressContext.Provider value={value}>{children}</AddressContext.Provider>
  );
};
