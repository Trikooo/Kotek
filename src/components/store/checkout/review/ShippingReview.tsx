import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Truck, User, MapPin, Phone, AlertCircle, Loader2 } from "lucide-react";
import { useAddress } from "@/context/AddressContext";

export default function ShippingReview() {
  const { selectedAddress, selectedAddressLoading, loading, error } =
    useAddress();

  const hasAddress =
    selectedAddress &&
    (selectedAddress.fullName ||
      selectedAddress.address ||
      selectedAddress.wilayaLabel);

  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle className="flex items-center gap-2 text-primary">
          <Truck className="h-5 w-5" strokeWidth={1.5} />
          Shipping Address
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-4">
        {selectedAddressLoading || loading ? (
          <div className="flex items-center justify-center text-muted-foreground gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            <p>Loading...</p>
          </div>
        ) : error ? (
          <div className="flex items-center gap-3 text-red-600">
            <AlertCircle className="h-5 w-5" strokeWidth={1.5} />
            <p>Error: {error}</p>
          </div>
        ) : hasAddress ? (
          <>
            <div className="flex items-start gap-3">
              <User
                className="h-5 w-5 text-muted-foreground mt-0.5"
                strokeWidth={1.5}
              />
              <div>
                <p className="font-medium">{selectedAddress.fullName}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin
                className="h-5 w-5 text-muted-foreground mt-0.5"
                strokeWidth={1.5}
              />
              <div>
                <p>{selectedAddress.address}</p>
                <p>
                  {selectedAddress.commune && `${selectedAddress.commune}, `}
                  {selectedAddress.wilayaLabel}
                </p>
                <p>Algeria</p>
              </div>
            </div>

            {(selectedAddress.phoneNumber ||
              selectedAddress.secondPhoneNumber) && (
              <div className="flex items-start gap-3">
                <Phone
                  className="h-5 w-5 text-muted-foreground mt-0.5"
                  strokeWidth={1.5}
                />
                <div>
                  {selectedAddress.phoneNumber && (
                    <p>{selectedAddress.phoneNumber}</p>
                  )}
                  {selectedAddress.secondPhoneNumber && (
                    <p className="text-sm text-muted-foreground">
                      Secondary: {selectedAddress.secondPhoneNumber}
                    </p>
                  )}
                </div>
              </div>
            )}

            {selectedAddress.stopDesk && selectedAddress.stationName && (
              <div className="flex items-start gap-3">
                <Truck
                  className="h-5 w-5 text-muted-foreground mt-0.5"
                  strokeWidth={1.5}
                />
                <div>
                  <p className="text-sm">
                    Stop Desk Station:{" "}
                    <span className="font-medium">
                      {selectedAddress.stationName}
                    </span>
                  </p>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex items-center gap-3 text-yellow-600">
            <AlertCircle className="h-5 w-5" strokeWidth={1.5} />
            <p>
              It seems like you haven&apos;t entered a shipping address yet.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
