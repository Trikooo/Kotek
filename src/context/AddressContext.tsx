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

interface AddressContextType {
  addresses: Address[];
  setAddresses: React.Dispatch<React.SetStateAction<Address[]>>;
  loading: boolean;
  error: AxiosError | null;
  selectedAddress: Address | null;
  setSelectedAddress: React.Dispatch<React.SetStateAction<Address | null>>;
  selectedAddressLoading: boolean;
  shippingPrice: number;
  setShippingPrice: React.Dispatch<React.SetStateAction<number>>;
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

  const [selectedAddressLoading, setSelectedAddressLoading] = useState(true);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [shippingPrice, setShippingPrice] = useState<number>(0);

  useEffect(() => {
    const savedAddress = localStorage.getItem("selectedAddress");
    if (savedAddress) {
      setSelectedAddress(JSON.parse(savedAddress));
      setShippingPrice(JSON.parse(savedAddress).shippingPrice || 0);
    }
    setSelectedAddressLoading(false);
  }, []);

  useEffect(() => {
    if (selectedAddress) {
      localStorage.setItem("selectedAddress", JSON.stringify(selectedAddress));
      setShippingPrice(selectedAddress.shippingPrice || 0);
    } else {
      localStorage.removeItem("selectedAddress");
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
      shippingPrice,
      setShippingPrice,
    }),
    [
      addresses,
      setAddresses,
      loading,
      error,
      selectedAddress,
      selectedAddressLoading,
      shippingPrice,
    ]
  );

  return (
    <AddressContext.Provider value={value}>{children}</AddressContext.Provider>
  );
};
