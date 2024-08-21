"use client";

import * as React from "react";
import { Check, ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Section3() {
  const components: {
    [key: string]: { value: string; label: string }[];
  } = {
    CPU: [
      { value: "amd_ryzen_5", label: "AMD Ryzen 5" },
      { value: "amd_ryzen_7", label: "AMD Ryzen 7" },
      { value: "amd_ryzen_9", label: "AMD Ryzen 9" },
      { value: "intel_core_i5", label: "Intel Core i5" },
      { value: "intel_core_i7", label: "Intel Core i7" },
      { value: "intel_core_i9", label: "Intel Core i9" },
    ],
    GPU: [
      { value: "nvidia_geforce_rtx_3060", label: "NVIDIA GeForce RTX 3060" },
      { value: "nvidia_geforce_rtx_3070", label: "NVIDIA GeForce RTX 3070" },
      { value: "nvidia_geforce_rtx_3080", label: "NVIDIA GeForce RTX 3080" },
      { value: "nvidia_geforce_rtx_4090", label: "NVIDIA GeForce RTX 4090" },
      { value: "amd_radeon_rx_6600", label: "AMD Radeon RX 6600" },
      { value: "amd_radeon_rx_6700", label: "AMD Radeon RX 6700" },
      { value: "amd_radeon_rx_6800", label: "AMD Radeon RX 6800" },
      { value: "amd_radeon_rx_6900", label: "AMD Radeon RX 6900" },
    ],
    RAM: [
      { value: "corsair_vengeance_16gb", label: "Corsair Vengeance 16GB" },
      { value: "corsair_vengeance_32gb", label: "Corsair Vengeance 32GB" },
      { value: "gskill_ripjaws_16gb", label: "G.Skill Ripjaws 16GB" },
      { value: "gskill_ripjaws_32gb", label: "G.Skill Ripjaws 32GB" },
      { value: "kingston_fury_16gb", label: "Kingston Fury 16GB" },
      { value: "kingston_fury_32gb", label: "Kingston Fury 32GB" },
    ],
    Storage: [
      { value: "samsung_970_evo_1tb", label: "Samsung 970 EVO 1TB NVMe" },
      { value: "samsung_980_pro_1tb", label: "Samsung 980 PRO 1TB NVMe" },
      { value: "wd_black_1tb", label: "WD Black 1TB NVMe" },
      { value: "wd_blue_500gb", label: "WD Blue 500GB SATA" },
      { value: "crucial_mx500_1tb", label: "Crucial MX500 1TB SATA" },
      { value: "seagate_barracuda_2tb", label: "Seagate Barracuda 2TB HDD" },
    ],
    Motherboard: [
      { value: "asus_rog_strix_b550_f", label: "ASUS ROG Strix B550-F" },
      { value: "msi_b550_ace", label: "MSI B550 ACE" },
      { value: "gigabyte_z690_aorus_pro", label: "Gigabyte Z690 AORUS PRO" },
      { value: "asus_prime_z790_a", label: "ASUS Prime Z790-A" },
      { value: "msi_meg_z790_unify", label: "MSI MEG Z790 UNIFY" },
      { value: "asrock_b550_fatal1ty", label: "ASRock B550 Fatal1ty" },
    ],
    PowerSupply: [
      { value: "corsair_rm750x", label: "Corsair RM750x 750W" },
      { value: "evga_supernova_850_g3", label: "EVGA SuperNOVA 850 G3" },
      { value: "seasonic_focus_gx_650", label: "Seasonic FOCUS GX 650W" },
      {
        value: "be_quiet_dark_power_12_850",
        label: "be quiet! Dark Power 12 850W",
      },
    ],
    Case: [
      { value: "nzxt_h510", label: "NZXT H510" },
      { value: "corsair_4000d", label: "Corsair 4000D" },
      { value: "fractal_design_meshify_c", label: "Fractal Design Meshify C" },
      { value: "be_quiet_dark_base_700", label: "be quiet! Dark Base 700" },
    ],
    Cooling: [
      { value: "noctua_nh_d15", label: "Noctua NH-D15" },
      {
        value: "corsair_h100i_rgb_platinum",
        label: "Corsair H100i RGB Platinum",
      },
      { value: "be_quiet_dark_rock_pro_4", label: "be quiet! Dark Rock Pro 4" },
      { value: "arctic_freezer_34", label: "ARCTIC Freezer 34" },
    ],
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-col items-center mb-6 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-6xl">
          Try Out PC Builder!
        </h1>
        <p className="my-4 text-muted-foreground text-center">
          Configure your dream PC and see it come to life in real-time.
        </p>
      </div>
      <Card className="flex flex-col items-center w-full md:max-w-4xl gap-y-6 p-6">
        <CardTitle className="">PC Configuration</CardTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12 w-full">
          {Object.keys(components).map((key) => (
            <ComboboxDemo key={key} label={key} components={components[key]} />
          ))}
          <Button className="w-auto md:col-span-2">Configure</Button>
        </div>
      </Card>
    </div>
  );
}

interface Component {
  value: string;
  label: string;
}

interface ComboboxDemoProps {
  label: string;
  components: Component[];
}

export function ComboboxDemo({ label, components }: ComboboxDemoProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<string>("");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value
            ? components.find((item) => item.value === value)?.label
            : `Select ${label}...`}
          <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder={`Search ${label}...`} className="p-2" />
          <CommandList>
            <CommandEmpty>No {label} found.</CommandEmpty>
            <CommandGroup>
              {components.map((item) => (
                <CommandItem
                  key={item.value}
                  value={item.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === item.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {item.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
