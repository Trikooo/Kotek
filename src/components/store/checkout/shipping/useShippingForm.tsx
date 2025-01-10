import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import getWilayaData from "@/services/wilayaDataService";
import { Address, Wilayas } from "@/types/types";
import { Option } from "@/components/ui/better-select";
import {
  parseCommunes,
  parseNoestStations,
  parseWilayas,
} from "@/utils/wilayaDataParser";
import { toast } from "@/hooks/use-toast";

import { useAddress } from "@/context/AddressContext";
import { useAddressRequest } from "@/hooks/address/useAddress";
import { useSession } from "next-auth/react";
import { AlertCircle } from "lucide-react";
import { ShippingFormValues } from "./FormSchema";
import axios, { AxiosError } from "axios";

export default function useShippingForm() {
  const router = useRouter();
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const { addresses, setAddresses, selectedAddress, setSelectedAddress } =
    useAddress();

  const { handleCreateAddress } = useAddressRequest();
  // const [address, setAddress] = useState<Address>({
  //   fullName: "",
  //   phoneNumber: "",
  //   wilayaValue: "",
  //   wilayaLabel: "",
  //   commune: "",
  //   address: "",

  //   stopDesk: false,
  // });

  const [addressLoading, setAddressLoading] = useState<boolean>(false);
  const [addressError, setAddressError] = useState<boolean>(false);
  const [wilayaData, setWilayaData] = useState<Wilayas | null>(null);
  const [wilayaError, setWilayaError] = useState<boolean>(false);
  const [wilayaLoading, setWilayaLoading] = useState<boolean>(false);
  const [wilayaOptions, setWilayaOptions] = useState<Option[]>([]);
  const [communeOptions, setCommuneOptions] = useState<Option[]>([]);
  const [selectedWilaya, setSelectedWilaya] = useState<Option[]>([]);
  const [selectedCommune, setSelectedCommune] = useState<Option[]>([]);
  const [addSecondPhone, setAddSecondPhone] = useState<boolean>(false);
  const [selectedStopDesk, setSelectedStopDesk] = useState<Option[]>([]);
  const [wilayaHasStopDesk, setWilayaHasStopDesk] = useState<boolean>(false);
  const [stopDeskOptions, setStopDeskOptions] = useState<Option[]>([]);

  // First useEffect to fetch Wilaya data
  useEffect(() => {
    const fetchWilayaData = async () => {
      setWilayaLoading(true);
      try {
        const data = await getWilayaData();
        if (data) {
          setWilayaData(data);
          const parsedWilayaOptions = parseWilayas(data);
          setWilayaOptions(parsedWilayaOptions);
          setWilayaLoading(false);
        }
      } catch (error) {
        setWilayaError(true);
      } finally {
        setWilayaLoading(false);
      }
    };
    if (!wilayaData) {
      fetchWilayaData();
    }
  }, [wilayaData, selectedAddress?.wilayaValue]);

  // Second useEffect for populating communes
  useEffect(() => {
    if (wilayaOptions.length > 0 && wilayaData && selectedWilaya.length > 0) {
      const communes = parseCommunes(wilayaData, selectedWilaya[0].value);
      if (communes) {
        setCommuneOptions(communes);
      }
    }
    if (selectedWilaya.length < 1) {
      setCommuneOptions([]);
      setSelectedCommune([]);
    }
  }, [wilayaOptions, wilayaData, selectedWilaya, selectedAddress?.commune]);

  // Third useEffect for stop desk options
  useEffect(() => {
    const wilaya = selectedWilaya[0];
    if (
      wilaya &&
      wilayaData &&
      wilayaData[wilaya.label].noest.stations.length > 0
    ) {
      setWilayaHasStopDesk(true);
      const noestStations = parseNoestStations(wilayaData, wilaya.value);
      if (noestStations) {
        setStopDeskOptions(noestStations);
      }
    } else {
      setWilayaHasStopDesk(false);
      setSelectedStopDesk([]);
    }
  }, [
    wilayaData,
    selectedWilaya,
    selectedAddress?.stationCode,
    setSelectedAddress,
  ]);
  // Fourth useEffect to set shippingPrice

  // Validation and continue handler
  const handleContinue = async (
    data: ShippingFormValues,
    baseShippingPrice: number
  ) => {
    // Prepare data for submission
    const dataToSend = {
      ...selectedAddress,
      fullName: data.fullName,
      phoneNumber: data.phoneNumber,
      address: data.address,
      secondPhoneNumber: data.secondPhoneNumber || undefined,
      wilayaValue: data.wilaya.value,
      wilayaLabel: data.wilaya.label,
      commune: data.commune.label,
      stopDesk: data.stopDesk,
      stationCode: data.station?.value,
      stationName: data.station?.label,
      baseShippingPrice: baseShippingPrice,
    };

    try {
      setAddressLoading(true);

      if (userId) {
        try {
          const createdAddressData = await handleCreateAddress(
            dataToSend,
            userId
          );
          const newAddress = {
            id: createdAddressData.address.id,
            ...dataToSend,
          };
          setSelectedAddress(newAddress);

          // Update addresses list
          setAddresses((prev) => {
            const currentAddresses = Array.isArray(prev) ? prev : [];
            return [...currentAddresses, newAddress];
          });
        } catch (error) {
          // More granular error handling
          if (axios.isAxiosError(error)) {
            // Handle Axios-specific errors
            const status = error.response?.status;
            switch (status) {
              case 400:
                toast({
                  variant: "destructive",
                  title: "Validation Error",
                  description:
                    "Please check your address details and try again.",
                });
                break;
              case 409:
                toast({
                  variant: "destructive",
                  title: "Duplicate Address",
                  description:
                    "An address with the same details already exists.",
                });
                break;
              case 404:
                toast({
                  variant: "destructive",
                  title: "User Not Found",
                  description: "Please log in again.",
                });
                break;
              case 500:
                toast({
                  variant: "destructive",
                  title: "Server Error",
                  description:
                    "An unexpected server error occurred. Please try again later.",
                });
                break;
              default:
                toast({
                  variant: "destructive",
                  title: "Error",
                  description: error.message || "An unexpected error occurred.",
                });
            }

            // Optionally log the full error for debugging
            console.error("Address creation error:", error);

            // Prevent navigation on error
            return;
          }

          // Handle other types of errors
          toast({
            variant: "destructive",
            title: "Unexpected Error",
            description: "Please refresh the page and try again.",
          });
          console.error("Unexpected error:", error);
          return;
        }
      } else {
        // For guest users, just set the address without API call
        setSelectedAddress(dataToSend);
      }

      // Navigate to review page
      router.push("/checkout/review");
    } catch (error) {
      // Catch-all error handler
      toast({
        variant: "destructive",
        title: "Navigation Error",
        description: "An unexpected error occurred during checkout.",
      });
      console.error("Checkout navigation error:", error);
    } finally {
      setAddressLoading(false);
    }
  };
  return {
    wilayaOptions,
    communeOptions,
    selectedWilaya,
    setSelectedWilaya,
    selectedCommune,
    setSelectedCommune,
    wilayaLoading,
    wilayaError,
    addSecondPhone,
    setAddSecondPhone,
    selectedStopDesk,
    setSelectedStopDesk,
    wilayaHasStopDesk,
    stopDeskOptions,
    handleContinue,
    addressLoading,
    wilayaData,
  };
}
