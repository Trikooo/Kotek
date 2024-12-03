"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import CheckoutLayout from "../CheckoutLayout";
import ShippingForm from "@/components/store/checkout/shipping/ShippingForm";
import ExistingAddresses from "@/components/store/checkout/shipping/ExistingAddresses";
import { useSession } from "next-auth/react";
import { useAddress } from "@/context/AddressContext";
import useShippingForm from "@/components/store/checkout/shipping/useShippingForm";
import { EMPTY_ADDRESS } from "@/lib/constants";

export default function Shipping() {
  const { setSelectedAddress } = useAddress();
  const { data: session, status } = useSession();
  const { addresses, loading } = useAddress();
  const { addressLoading } = useShippingForm();
  const [showForm, setShowForm] = useState(
    status === "unauthenticated" || false
  );
  const currentStep = 1;

  useEffect(() => {
    // Determine whether to show form immediately when loading is complete
    const shouldShowForm =
      status === "unauthenticated" ||
      (addresses.length === 0 && loading === false);

    setShowForm(shouldShowForm);
  }, [status, addresses, loading, addressLoading]);

  return (
    <CheckoutLayout step={currentStep}>
      <h2 className="text-2xl font-bold">Shipping Information</h2>
      {status === "authenticated" &&
      addresses.length > 0 &&
      loading === false ? (
        <div className="md:flex items-start justify-between">
          <p className="text-muted-foreground mb-4">
            Select an existing address or enter a new one.
          </p>
          <Button
            onClick={() => {
              setSelectedAddress(EMPTY_ADDRESS);
              setShowForm(!showForm);
            }}
            variant={"outline"}
          >
            {showForm ? "Show Existing Addresses" : "Add New Address"}
          </Button>
        </div>
      ) : (
        <div className="md:flex items-start justify-between">
          <p className="text-muted-foreground mb-4">
            Please enter your shipping information.
          </p>
          <Button onClick={() => setShowForm(!showForm)} variant={"outline"}>
            {showForm ? "Show Existing Addresses" : "Add New Address"}
          </Button>
        </div>
      )}
      {showForm ? (
        <ShippingForm />
      ) : (
        <ExistingAddresses onAddNew={() => setShowForm(true)} />
      )}
    </CheckoutLayout>
  );
}
