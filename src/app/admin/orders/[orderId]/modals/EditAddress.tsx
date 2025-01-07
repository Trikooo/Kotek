"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Address, KotekOrder } from "@/types/types";
import { calculateShipping } from "@/utils/generalUtils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import { AddressFormValues, addressSchema } from "../schemas/EditAddressSchema";
import { EMPTY_ADDRESS } from "@/lib/constants";
import { Edit } from "lucide-react";
import useShippingForm from "@/components/store/checkout/shipping/useShippingForm";
import Select, { Option } from "@/components/ui/better-select";
import { parseCommunes, parseNoestStations } from "@/utils/wilayaDataParser";
import { useAddressRequest } from "@/hooks/address/useAddress";
import { useKotekOrderRequest } from "@/hooks/orders/useKotekOrder";

interface EditAddressModalProps {
  order: KotekOrder;
  onAddressUpdate: (updatedAddress: Address) => void;
}

export function EditAddress({ order, onAddressUpdate }: EditAddressModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const address = order.address || order.guestAddress || EMPTY_ADDRESS;
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const form = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      ...address,
      secondPhoneNumber: address.secondPhoneNumber || "",
      stopDesk: address.stopDesk || false,
    },
  });
  const stopDesk = form.watch("stopDesk");
  const { handleUpdateAddress } = useAddressRequest();
  const { handleUpdateKotekOrder } = useKotekOrderRequest();

  const onSubmit = async (data: AddressFormValues) => {
    const secondPhoneNumber =
      data.secondPhoneNumber === "" ? undefined : data.secondPhoneNumber;
    setIsLoading(true);
    try {
      const baseShippingPrice = stopDesk
        ? wilayaData?.[selectedWilaya[0].label]?.noest?.prices?.stopDesk || 0
        : wilayaData?.[selectedWilaya[0].label]?.noest?.prices?.home || 0;
      const newAddress = {
        ...data,
        secondPhoneNumber: secondPhoneNumber,
        baseShippingPrice,
      };

      const success = () => {
        onAddressUpdate({
          ...data,
          baseShippingPrice: baseShippingPrice,
        } as Address);
        toast({
          title: "Address updated",
          description: "The shipping address has been successfully updated.",
        });
        setIsOpen(!isOpen);
      };
      if (order.addressId && order.id) {
        await handleUpdateAddress(newAddress, order.userId, order.addressId);
        await handleUpdateKotekOrder(order, order.id);

        success();
      } else if (order.id) {
        order.guestAddress = newAddress;
        await handleUpdateKotekOrder(order, order.id);

        success();
      }
    } catch (error) {
      console.error("[EditAddress] Error updating address:", error);
      toast({
        title: "Error",
        description: "An error occurred while updating the address.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const { wilayaOptions, wilayaLoading, wilayaError, wilayaData } =
    useShippingForm();

  const [selectedWilaya, setSelectedWilaya] = useState<Option[]>([
    { value: address.wilayaValue, label: address.wilayaLabel },
  ]);
  const [selectedCommune, setSelectedCommune] = useState<Option[]>([
    {
      value: address.commune,
      label: address.commune,
    },
  ]);
  const [stopDeskOptions, setStopDeskOptions] = useState<Option[]>([]);
  const [wilayaHasStopDesk, setWilayaHasStopDesk] = useState<boolean>(false);
  const [selectedStopDesk, setSelectedStopDesk] = useState<Option[]>(
    address.stationCode && address.stationName
      ? [{ value: address.stationCode, label: address.stationName }]
      : []
  );
  useEffect(() => {}, [selectedStopDesk]);
  const [communeOptions, setCommuneOptions] = useState<Option[]>([]);

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
    } else if (!address.stopDesk) {
      setWilayaHasStopDesk(false);
      setSelectedStopDesk([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wilayaData, selectedWilaya]);

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
  }, [wilayaOptions, wilayaData, selectedWilaya]);

  return (
    <Dialog open={isOpen} onOpenChange={() => setIsOpen(!isOpen)}>
      <DialogTrigger onClick={() => setIsOpen(!isOpen)}>
        <Button variant="outline" size="icon">
          <Edit className="w-4 h-4" strokeWidth={1.5} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Edit Shipping Address</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Form fields */}
            <div className="space-y-2">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number *</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="secondPhoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Second Phone Number</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-2">
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="wilayaValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Wilaya</FormLabel>
                    <FormControl>
                      <Select
                        position="top"
                        options={wilayaOptions}
                        selectedOptions={selectedWilaya}
                        setSelectedOptions={setSelectedWilaya}
                        searchable
                        loading={wilayaLoading}
                        error={wilayaError}
                        label="wilaya"
                        onChange={(_, currentWilaya) => {
                          if (currentWilaya.length > 0) {
                            form.setValue(
                              "wilayaLabel",
                              currentWilaya[0].label
                            );
                            form.setValue(
                              "wilayaValue",
                              currentWilaya[0].value
                            );
                          } else {
                            form.setValue("wilayaLabel", "");
                            form.setValue("wilayaValue", "");
                          }
                          if (
                            currentWilaya[0]?.value !== selectedWilaya[0]?.value
                          ) {
                            setSelectedCommune([]);
                            form.setValue("commune", "");
                            setSelectedStopDesk([]);
                            form.setValue("stationCode", "");
                            form.setValue("stationName", "");
                          }
                          if (currentWilaya[0]?.label) {
                            const baseShippingPrice = stopDesk
                              ? wilayaData?.[currentWilaya[0].label]?.noest
                                  ?.prices?.stopDesk || 0
                              : wilayaData?.[currentWilaya[0].label]?.noest
                                  ?.prices?.home || 0;
                            order.shippingPrice = calculateShipping(
                              order.subtotalAmount,
                              baseShippingPrice
                            );
                          } else {
                            order.shippingPrice = 0;
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="commune"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Commune</FormLabel>
                    <FormControl>
                      <Select
                        position="top"
                        options={communeOptions}
                        selectedOptions={selectedCommune}
                        setSelectedOptions={setSelectedCommune}
                        emptyMessage="select a wilaya first"
                        label="commune"
                        onChange={(_, current) => {
                          if (current[0]?.value) {
                            field.onChange(current[0].value);
                          } else {
                            field.onChange("");
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {wilayaHasStopDesk && (
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="stopDesk"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={(checked) => {
                            field.onChange(checked);
                            if (!checked) {
                              form.setValue("stationCode", null);
                              form.setValue("stationName", null);
                            }
                          }}
                        />
                      </FormControl>
                      <FormLabel>Stop Desk</FormLabel>
                    </FormItem>
                  )}
                />
              </div>
            )}

            {stopDesk && (
              <FormField
                control={form.control}
                name="stationCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Station Code</FormLabel>
                    <FormControl>
                      <Select
                        options={stopDeskOptions}
                        selectedOptions={selectedStopDesk}
                        setSelectedOptions={setSelectedStopDesk}
                        label="station"
                        searchable={false}
                        onChange={(_, currentDesk) => {
                          if (currentDesk[0]?.value) {
                            field.onChange(currentDesk[0].value);
                            form.setValue("stationName", currentDesk[0].label);
                            form.setValue("stationCode", currentDesk[0].value);
                          } else {
                            form.setValue("stationName", null);
                            form.setValue("stationCode", null);
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <DialogFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Updating..." : "Update Address"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
