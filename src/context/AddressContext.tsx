"use client";
import { useGetAddresses } from "@/hooks/address/useAddress";
import { Address } from "@/types/types";
import {
  createContext,
  ReactNode,
  useContext,
  useMemo,
  useState,
  useEffect,
} from "react";

interface AddressContextType {
  addresses: Address[];
  setAddresses: React.Dispatch<React.SetStateAction<Address[]>>;
  loading: boolean;
  error: string | null;
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
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [selectedAddressLoading, setSelectedAddressLoading] = useState(true);

  // Load the selected address from localStorage on mount
  useEffect(() => {
    const savedAddress = localStorage.getItem("selectedAddress");
    if (savedAddress) {
      setSelectedAddress(JSON.parse(savedAddress));
    }
    setSelectedAddressLoading(false);
  }, []);

  // Save the selected address to localStorage when it changes
  useEffect(() => {
    if (selectedAddress) {
      setSelectedAddressLoading(true);
      localStorage.setItem("selectedAddress", JSON.stringify(selectedAddress));
      setSelectedAddressLoading(false);
    }
  }, [selectedAddress]);

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
    [addresses, setAddresses, loading, error, selectedAddress, selectedAddressLoading]
  );

  return (
    <AddressContext.Provider value={value}>{children}</AddressContext.Provider>
  );
};
