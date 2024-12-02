import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import Select from "@/components/ui/better-select";
import {
  TooltipProvider,
  TooltipTrigger,
  Tooltip,
  TooltipContent,
} from "@/components/ui/tooltip";
import { AlertCircle, CircleHelp, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

import useShippingForm from "./useShippingForm";
import { useEffect } from "react";

export default function ShippingForm() {
  const {
    address,
    setAddress,
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
  } = useShippingForm();

  useEffect(() => {
    console.log("address: ", address);
  }, [address]);
  return (
    <form className="grid gap-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            id="fullName"
            placeholder="Enter your full name"
            value={address.fullName || ""}
            onChange={(e) =>
              setAddress((prev) => ({
                ...prev,
                fullName: e.target.value,
              }))
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phoneNumber">Phone Number</Label>
          <Input
            id="phoneNumber"
            placeholder="Enter your phone number"
            type="tel"
            value={address.phoneNumber || ""}
            onChange={(e) =>
              setAddress((prev) => ({
                ...prev,
                phoneNumber: e.target.value,
              }))
            }
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="addSecondPhone"
            checked={!!(addSecondPhone || address.secondPhoneNumber)}
            onCheckedChange={(checked) => {
              setAddSecondPhone(checked as boolean);
              if (checked === false) {
                setAddress((prev) => ({
                  ...prev,
                  secondPhoneNumber: "",
                }));
              }
            }}
          />

          <Label htmlFor="addSecondPhone">Add another phone number?</Label>
        </div>
        {(addSecondPhone || address.secondPhoneNumber) && (
          <div className="pt-6">
            <Label htmlFor="secondPhoneNumber">Phone Number 2</Label>
            <Input
              id="secondPhoneNumber"
              placeholder="Enter second phone number"
              type="tel"
              value={address.secondPhoneNumber || ""}
              onChange={(e) =>
                setAddress((prev) => ({
                  ...prev,
                  secondPhoneNumber: e.target.value,
                }))
              }
            />
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          placeholder="Enter your address"
          value={address.address || ""}
          onChange={(e) =>
            setAddress((prev) => ({
              ...prev,
              address: e.target.value,
            }))
          }
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="wilaya">Wilaya</Label>
          <Select
            options={wilayaOptions}
            selectedOptions={selectedWilaya}
            setSelectedOptions={setSelectedWilaya}
            searchable
            loading={wilayaLoading}
            error={wilayaError}
            label="wilaya"
            onChange={(_, currentWilaya) => {
              if (currentWilaya[0].value !== selectedWilaya[0]?.value) {
                setSelectedCommune([]);
                setSelectedStopDesk([]);
              }
              if (currentWilaya[0].value)
                setAddress((prev) => {
                  return {
                    ...prev,
                    wilayaValue: currentWilaya[0].value,
                    wilayaLabel: currentWilaya[0].label,
                  };
                });
            }}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="commune">Commune</Label>
          <Select
            options={communeOptions}
            selectedOptions={selectedCommune}
            setSelectedOptions={setSelectedCommune}
            emptyMessage="select a wilaya first"
            label="commune"
            onChange={(_, current) => {
              if (current[0]?.value) {
                setAddress((prev) => ({
                  ...prev,
                  commune: current[0].value,
                }));
              }
            }}
          />
        </div>
      </div>

      {wilayaHasStopDesk ? (
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="stopDesk"
              checked={address.stopDesk}
              onCheckedChange={(checked) => {
                setAddress((prev) => ({
                  ...prev,
                  stopDesk: checked as boolean,
                }));
              }}
            />
            <Label htmlFor="stopDesk">Use stop desk delivery?</Label>
          </div>
          {address.stopDesk && (
            <div className="space-y-2">
              <Label htmlFor="stopDeskSelect">Noest Stations</Label>
              <Select
                options={stopDeskOptions}
                selectedOptions={selectedStopDesk}
                setSelectedOptions={setSelectedStopDesk}
                label="station"
                searchable={false}
                onChange={(_, currentDesk) => {
                  if (currentDesk[0].value) {
                    setAddress((prev) => ({
                      ...prev,
                      stationCode: currentDesk[0].value,
                      stationName: currentDesk[0].label,
                    }));
                  }
                }}
              />
            </div>
          )}
        </div>
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
                    No Noest station in {selectedWilaya[0].label}. Items will be
                    shipped <strong>home</strong>.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )
      )}
      <div className="flex justify-end mt-6">
        <Button onClick={handleContinue} disabled={addressLoading} className="w-24">
          {addressLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" strokeWidth={1.5} />
          ) : (
            "Continue"
          )}
        </Button>
      </div>
    </form>
  );
}
