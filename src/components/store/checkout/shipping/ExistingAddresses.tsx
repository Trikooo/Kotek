import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useAddress } from "@/context/AddressContext";
import { Truck, User, MapPin, Phone, Loader2 } from "lucide-react";
import ErrorComponent from "@/components/error/error";
import { useRouter } from "next/navigation";
import { EMPTY_ADDRESS } from "@/lib/constants";
import ExistingAddressesSkeleton from "./ExistingAddressesSkeleton";

type ExistingAddressesProps = {
  onAddNew: () => void;
};

export default function ExistingAddresses({
  onAddNew,
}: ExistingAddressesProps) {
  const router = useRouter();
  const { addresses, loading, error, selectedAddress, setSelectedAddress } =
    useAddress();
  const { status } = useSession();

  useEffect(() => {
    if (addresses.length > 0 && !selectedAddress) {
      setSelectedAddress(addresses[0]);
    }
  }, [addresses, selectedAddress, setSelectedAddress]);

  const handleContinue = () => {
    router.push("/checkout/review");
  };

  if (loading) {
    return <ExistingAddressesSkeleton />;
  }

  if (error && error?.status !== 404) {
    return (
      <>
        {JSON.stringify(error)}
        <ErrorComponent />
      </>
    );
  }

  return (
    <div className="space-y-4">
      <RadioGroup
        className="grid md:grid-cols-2 gap-4"
        value={
          selectedAddress
            ? `${selectedAddress.commune}-${selectedAddress.address}`
            : ""
        }
        onValueChange={(value) => {
          const [commune, address] = value.split("-");
          const matchedAddress = addresses.find(
            (addr) => addr.commune === commune && addr.address === address
          );
          setSelectedAddress(matchedAddress || null);
        }}
      >
        {addresses.map((address) => (
          <label
            key={`${address.commune}-${address.address}`}
            htmlFor={`address-${address.commune}-${address.address}`}
            className="w-full"
          >
            <Card
              className={`${
                selectedAddress?.commune === address.commune &&
                selectedAddress?.address === address.address
                  ? "border-indigo-600 border-2"
                  : ""
              } hover:border-indigo-600/60 cursor-pointer h-full transition-colors`}
              onClick={() => setSelectedAddress(address)}
            >
              <CardHeader className="p-0 m-0">
                <CardTitle className="flex items-center gap-2 text-primary ">
                  <RadioGroupItem
                    value={`${address.commune}-${address.address}`}
                    id={`address-${address.commune}-${address.address}`}
                    className="mr-2 hidden"
                  />
                  <Label
                    htmlFor={`address-${address.commune}-${address.address}`}
                  ></Label>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-start gap-3">
                  <User
                    className="h-5 w-5 text-muted-foreground mt-0.5"
                    strokeWidth={1.5}
                  />
                  <div>
                    <p className="font-medium">{address.fullName}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin
                    className="h-5 w-5 text-muted-foreground mt-0.5"
                    strokeWidth={1.5}
                  />
                  <div>
                    <p>{address.address}</p>
                    <p>
                      {address.commune && `${address.commune}, `}
                      {address.wilayaLabel}
                    </p>
                    <p>Algeria</p>
                  </div>
                </div>

                {(address.phoneNumber || address.secondPhoneNumber) && (
                  <div className="flex items-start gap-3">
                    <Phone
                      className="h-5 w-5 text-muted-foreground mt-0.5"
                      strokeWidth={1.5}
                    />
                    <div>
                      {address.phoneNumber && <p>{address.phoneNumber}</p>}
                      {address.secondPhoneNumber && (
                        <p className="text-sm text-muted-foreground">
                          Secondary: {address.secondPhoneNumber}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {address.stopDesk && address.stationName && (
                  <div className="flex items-start gap-3">
                    <Truck
                      className="h-5 w-5 text-muted-foreground mt-0.5"
                      strokeWidth={1.5}
                    />
                    <div>
                      <p className="text-sm">
                        Stop Desk Station:{" "}
                        <span className="font-medium">
                          {address.stationName}
                        </span>
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </label>
        ))}
      </RadioGroup>

      {addresses.length === 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-muted-foreground justify-center">
              {status === "authenticated"
                ? "Start by adding a new address"
                : "Login to save your address"}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            {status === "authenticated" ? (
              <p className="text-muted-foreground">
                You haven&apos;t added any shipping addresses yet.
              </p>
            ) : (
              <p className="text-muted-foreground">
                Please log in to save and manage your shipping addresses.
              </p>
            )}
          </CardContent>
          <CardFooter className="justify-center">
            {status === "authenticated" ? (
              <Button
                onClick={() => {
                  setSelectedAddress(null);
                  onAddNew();
                }}
              >
                Add New Address
              </Button>
            ) : (
              <Button onClick={() => router.push("/login")}>Login</Button>
            )}
          </CardFooter>
        </Card>
      )}

      <CardFooter className="p-0 mt-4 justify-end">
        <Button
          onClick={handleContinue}
          disabled={selectedAddress || addresses.length === 0 ? false : true}
          className="w-32"
        >
          Continue
        </Button>
      </CardFooter>
    </div>
  );
}
