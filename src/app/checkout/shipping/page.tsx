"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import CheckoutLayout from "../CheckoutLayout";
import ShippingForm from "@/components/store/checkout/shipping/ShippingForm";
import ExistingAddresses from "@/components/store/checkout/shipping/ExistingAddresses";
import { useSession } from "next-auth/react";
import { useAddress } from "@/context/AddressContext";

export default function Shipping() {
  const { data: session } = useSession();
  const { addresses } = useAddress();
  const [showForm, setShowForm] = useState(false);
  const currentStep = 1;

  useEffect(() => {
    if (!session || addresses.length === 0) {
      setShowForm(true);
    }
  }, [session, addresses]);

  return (
    <CheckoutLayout step={currentStep}>
      <h2 className="text-2xl font-bold">Shipping Information</h2>
      {session && addresses.length > 0 ? (
        <div className="md:flex items-start justify-between">
          <p className="text-muted-foreground mb-4">
            Select an existing address or enter a new one.
          </p>
          <Button onClick={() => setShowForm(!showForm)} variant={"outline"}>
            {showForm ? "Show Existing Addresses" : "Add New Address"}
          </Button>
        </div>
      ) : (
        <p className="text-muted-foreground mb-4">
          Please enter your shipping information.
        </p>
      )}
      {showForm ? (
        <ShippingForm />
      ) : (
        <ExistingAddresses onAddNew={() => setShowForm(true)} />
      )}
    </CheckoutLayout>
  );
}
