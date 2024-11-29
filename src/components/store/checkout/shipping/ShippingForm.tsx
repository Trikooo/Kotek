import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import { Checkbox } from "@/components/ui/checkbox";
import { useEffect, useState } from "react";
import getWilayaData from "@/services/wilayaDataService";
import { Wilayas } from "@/types/types";
import Select, { Option } from "@/components/ui/better-select";
import { parseCommunes, parseWilayas } from "@/utils/wilayaDataParser";

export default function ShippingForm() {
  const [wilayaData, setWilayaData] = useState<Wilayas | null>(null);
  const [wilayaError, setWilayaError] = useState<boolean>(false);
  const [wilayaLoading, setWilayaLoading] = useState<boolean>(false);
  const [wilayaOptions, setWilayaOptions] = useState<Option[]>([]);
  const [communeOptions, setCommuneOptions] = useState<Option[]>([]);
  const [selectedWilaya, setSelectedWilaya] = useState<Option[]>([]);
  const [selectedCommune, setSelectedCommune] = useState<Option[]>([]);
  useEffect(() => {
    const fetchWilayaData = async () => {
      setWilayaLoading(true);
      try {
        const data = await getWilayaData();
        if (data) {
          setWilayaData(data);
          setWilayaOptions(parseWilayas(data));
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
  }, [wilayaData]);
  useEffect(() => {
    if (wilayaOptions.length > 0 && wilayaData && selectedWilaya.length > 0) {
      const communes = parseCommunes(wilayaData, selectedWilaya[0].value);
      if (communes) setCommuneOptions(communes);
    }
    if (selectedWilaya.length < 1) {
      setCommuneOptions([]);
      setSelectedCommune([]);
    }
  }, [wilayaOptions, wilayaData, selectedWilaya, setCommuneOptions]);
  return (
    <form className="grid gap-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name</Label>
          <Input id="fullName" placeholder="Enter your full name" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phoneNumber">Phone Number</Label>
          <Input
            id="phoneNumber"
            placeholder="Enter your phone number"
            type="number"
          />
        </div>
      </div>
      <div className="grid  gap-4">
        <div className="space-y-2">
          <Label htmlFor="address">Address</Label>
          <Input id="address" placeholder="Enter your address" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="wilaya">Wilaya</Label>
          <Select
            options={wilayaOptions}
            selectedOptions={selectedWilaya}
            setSelectedOptions={setSelectedWilaya}
            required
            searchable
            loading={wilayaLoading}
            error={wilayaError}
            label="wilaya"
            onChange={(prevWilaya) => {
              if (prevWilaya[0].value !== selectedWilaya[0]?.value)
                setSelectedCommune([]);
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
          />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="save-address" />
        <Label htmlFor="save-address">Save this address for future use</Label>
      </div>
    </form>
  );
}
