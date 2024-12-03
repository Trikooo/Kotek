"use client";
import { useGetAddresses } from "@/hooks/address/useAddress";
import { EMPTY_ADDRESS } from "@/lib/constants";
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
  selectedAddress: Address;
  setSelectedAddress: React.Dispatch<React.SetStateAction<Address>>;
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

  const [selectedAddress, setSelectedAddress] = useState<Address>({
    fullName: "",
    phoneNumber: "",
    wilayaValue: "",
    wilayaLabel: "",
    commune: "",
    address: "",
    shippingPrice: 0,
    stopDesk: false,
  });

  const [selectedAddressLoading, setSelectedAddressLoading] = useState(true);

  useEffect(() => {
    if (addresses && addresses.length > 0) {
      const savedAddress = localStorage.getItem("selectedAddress");
      if (savedAddress) {
        try {
          const parsedSavedAddress = JSON.parse(savedAddress);
          const isAddressValid =
            parsedSavedAddress &&
            parsedSavedAddress.wilayaValue &&
            parsedSavedAddress.commune &&
            parsedSavedAddress.address;

          if (isAddressValid) {
            const matchingAddress = addresses.find(
              (address) =>
                address.wilayaValue === parsedSavedAddress.wilayaValue &&
                address.commune === parsedSavedAddress.commune &&
                address.address === parsedSavedAddress.address
            );

            if (matchingAddress) {
              setSelectedAddress(parsedSavedAddress);
            } else {
              setSelectedAddress(addresses[0] || EMPTY_ADDRESS);
              localStorage.removeItem("selectedAddress");
            }
          } else {
            setSelectedAddress(addresses[0] || EMPTY_ADDRESS);
            localStorage.removeItem("selectedAddress");
          }
        } catch {
          setSelectedAddress(EMPTY_ADDRESS);
          localStorage.removeItem("selectedAddress");
        }
      } else {
        setSelectedAddress(addresses[0] || EMPTY_ADDRESS);
      }

      setSelectedAddressLoading(false);
    }
  }, [addresses]);

  useEffect(() => {
    setSelectedAddressLoading(true);

    if (selectedAddress === EMPTY_ADDRESS) {
      localStorage.removeItem("selectedAddress");
    } else {
      const isValidAddress =
        selectedAddress.wilayaValue &&
        selectedAddress.commune &&
        selectedAddress.address;

      if (isValidAddress) {
        localStorage.setItem(
          "selectedAddress",
          JSON.stringify(selectedAddress)
        );
      } else {
        localStorage.removeItem("selectedAddress");
      }
    }

    setSelectedAddressLoading(false);
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
