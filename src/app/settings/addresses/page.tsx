"use client";
import { MapPin, Phone, Truck, User } from "lucide-react";
import SettingsLayout from "../SettingsLayout";
import { useAddress } from "@/context/AddressContext";
import DeleteAddressDialog from "./components/DeleteAddressDialog";
import ErrorComponent from "@/components/error/error";
import AddressesSettingsSkeleton from "./components/AddressesSettingsSkeleton";

export default function AddressesSettings() {
  const { addresses, setAddresses, loading, error } = useAddress();
  if (loading) {
    return <AddressesSettingsSkeleton />;
  }
  if (error && !loading) {
    return (
      <SettingsLayout>
        <ErrorComponent />
      </SettingsLayout>
    );
  }
  return (
    <SettingsLayout>
      <div className="flex flex-col flex-1 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight">Addresses</h1>
            <p className="text-sm text-muted-foreground">
              Manage your shipping addresses
            </p>
          </div>
        </div>

        <div className="px-6 py-6">
          {addresses.length === 0 && !loading && !error ? (
            <div className="text-center py-6 text-muted-foreground">
              You don&apos;t have any addresses yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {addresses.map((address) => (
                <div
                  key={address.id}
                  className="border rounded-lg p-4 space-y-4"
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-4 w-full">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{address.fullName}</span>
                      </div>

                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                        <div className="text-sm text-muted-foreground space-y-1">
                          <p>{address.address}</p>
                          <p>
                            {address.commune}, {address.wilayaLabel}
                          </p>
                          <p>Algeria</p>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{address.phoneNumber}</span>
                        </div>
                        {address.secondPhoneNumber && (
                          <div className="flex items-center gap-2 pl-6">
                            <span className="text-sm text-muted-foreground">
                              Secondary: {address.secondPhoneNumber}
                            </span>
                          </div>
                        )}
                      </div>

                      {address.stopDesk && (
                        <div className="flex items-center gap-2">
                          <Truck className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">
                            Stop Desk Station: {address.stationName}
                          </span>
                        </div>
                      )}
                    </div>

                    <DeleteAddressDialog
                      addressId={address.id || ""}
                      onDeleteAddress={(addressId) => {
                        setAddresses([
                          ...addresses.filter(
                            (address) => address.id !== addressId
                          ),
                        ]);
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </SettingsLayout>
  );
}
