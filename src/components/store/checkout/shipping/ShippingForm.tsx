"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { CircleHelp, Loader2 } from "lucide-react";
import { calculateShipping } from "@/utils/generalUtils";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import Select from "@/components/ui/better-select";
import {
  TooltipProvider,
  TooltipTrigger,
  Tooltip,
  TooltipContent,
} from "@/components/ui/tooltip";

import useShippingForm from "./useShippingForm";
import { useAddress } from "@/context/AddressContext";
import { shippingFormSchema, ShippingFormValues } from "./FormSchema";
import { useCart } from "@/context/CartContext";
import { useKotekOrder } from "@/context/KotekOrderContext";
import { useState } from "react";

export default function ShippingForm() {
  const {
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
  } = useShippingForm();
  const { selectedAddress, setSelectedAddress } = useAddress();
  const { kotekOrder, setKotekOrder } = useKotekOrder();
  const { subtotal } = useCart();

  const form = useForm<ShippingFormValues>({
    resolver: zodResolver(shippingFormSchema),
    defaultValues: {
      fullName: selectedAddress?.fullName || "",
      phoneNumber: selectedAddress?.phoneNumber || "",
      secondPhoneNumber: selectedAddress?.secondPhoneNumber || "",
      address: selectedAddress?.address || "",
      wilaya: selectedWilaya[0] || undefined,
      commune: selectedCommune[0] || undefined,
      stopDesk: selectedAddress?.stopDesk || false,
      station: selectedStopDesk[0] || undefined,
    },
  });
  const stopDesk = form.watch("stopDesk");

  function onSubmit(data: ShippingFormValues) {
    const baseShippingPrice = stopDesk
      ? wilayaData?.[selectedWilaya[0].label].noest.prices.stopDesk || 0
      : wilayaData?.[selectedWilaya[0].label].noest.prices.home || 0;
    setSelectedAddress({
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
      baseShippingPrice: stopDesk
        ? wilayaData?.[selectedWilaya[0].label].noest.prices.stopDesk || 0
        : wilayaData?.[selectedWilaya[0].label].noest.prices.home || 0,
    });

    handleContinue(data, baseShippingPrice);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your full name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your phone number"
                    type="tel"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="secondPhoneNumber"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="addSecondPhone"
                  checked={addSecondPhone || !!field.value}
                  onCheckedChange={(checked) => {
                    setAddSecondPhone(checked as boolean);
                    if (!checked) {
                      field.onChange("");
                    }
                  }}
                />
                <FormLabel htmlFor="addSecondPhone" className="font-normal">
                  Add another phone number?
                </FormLabel>
              </div>
              {(addSecondPhone || field.value) && (
                <FormControl>
                  <Input
                    placeholder="Enter second phone number"
                    type="tel"
                    {...field}
                    className="mt-2"
                  />
                </FormControl>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input placeholder="Enter your address" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="wilaya"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Wilaya</FormLabel>
                <Select
                  options={wilayaOptions}
                  selectedOptions={selectedWilaya}
                  setSelectedOptions={setSelectedWilaya}
                  searchable
                  loading={wilayaLoading}
                  error={wilayaError}
                  label="wilaya"
                  onChange={(_, currentWilaya) => {
                    field.onChange(currentWilaya[0]);
                    if (currentWilaya[0]?.value !== selectedWilaya[0]?.value) {
                      setSelectedCommune([]);
                      setSelectedStopDesk([]);
                    }
                    if (currentWilaya[0]?.label) {
                      const baseShippingPrice = stopDesk
                        ? wilayaData?.[currentWilaya[0].label].noest.prices
                            .stopDesk || 0
                        : wilayaData?.[currentWilaya[0].label].noest.prices
                            .home || 0;
                      console.log(
                        "baseShippingPrice in wilaya: ",
                        baseShippingPrice
                      );

                      setKotekOrder((prev) => ({
                        ...prev,
                        shippingPrice: calculateShipping(
                          subtotal,
                          baseShippingPrice
                        ),
                      }));
                    } else {
                      setKotekOrder((prev) => ({
                        ...prev,
                        shippingPrice: 0,
                      }));
                    }
                  }}
                />
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
                <Select
                  options={communeOptions}
                  selectedOptions={selectedCommune}
                  setSelectedOptions={setSelectedCommune}
                  emptyMessage="select a wilaya first"
                  label="commune"
                  onChange={(_, current) => {
                    field.onChange(current[0]);
                  }}
                />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {wilayaHasStopDesk ? (
          <FormField
            control={form.control}
            name="stopDesk"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <div className="flex items-center space-x-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(checked) => {
                        // Call field.onChange to update the form value
                        field.onChange(checked);

                        // Update the shipping price based on the new value
                        if (selectedWilaya[0].label) {
                          const baseShippingPrice = checked
                            ? wilayaData?.[selectedWilaya[0].label].noest.prices
                                .stopDesk || 0
                            : wilayaData?.[selectedWilaya[0].label].noest.prices
                                .home || 0;
                          console.log(
                            "baseShippingPrice in stopDesk: ",
                            baseShippingPrice
                          );
                          setKotekOrder((prev) => ({
                            ...prev,
                            shippingPrice: calculateShipping(
                              subtotal,
                              baseShippingPrice
                            ),
                          }));
                        } else {
                          setKotekOrder((prev) => ({
                            ...prev,
                            shippingPrice: 0,
                          }));
                        }
                      }}
                    />
                  </FormControl>
                  <FormLabel className="font-normal">
                    Use stop desk delivery?
                  </FormLabel>
                </div>
                {field.value && (
                  <FormField
                    control={form.control}
                    name="station"
                    render={({ field: stationField }) => (
                      <FormItem className="mt-4">
                        <FormLabel>Noest Stations</FormLabel>
                        <Select
                          options={stopDeskOptions}
                          selectedOptions={selectedStopDesk}
                          setSelectedOptions={setSelectedStopDesk}
                          label="station"
                          searchable={false}
                          onChange={(_, currentDesk) => {
                            if (currentDesk[0]?.value) {
                              stationField.onChange(currentDesk[0].value);
                              form.setValue("station", {
                                value: currentDesk[0].value,
                                label: currentDesk[0].label,
                              });
                            } else {
                              stationField.onChange(undefined);
                            }
                          }}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </FormItem>
            )}
          />
        ) : (
          !wilayaHasStopDesk &&
          selectedWilaya.length > 0 && (
            <div className="flex items-center justify-start gap-2">
              <h3 className="text-sm">
                Only home delivery available to{" "}
                <strong>{selectedWilaya[0].label}</strong>
              </h3>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger onClick={(e) => e.preventDefault()}>
                    <CircleHelp className="w-4 h-4" strokeWidth={2} />
                  </TooltipTrigger>
                  <TooltipContent className="p-3">
                    <p>
                      No Noest station in {selectedWilaya[0].label}. Items will
                      be shipped <strong>home</strong>.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          )
        )}
        <div className="flex justify-end mt-6">
          <Button type="submit" disabled={addressLoading} className="w-24">
            {addressLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" strokeWidth={1.5} />
            ) : (
              "Continue"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
