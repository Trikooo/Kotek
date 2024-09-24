import { Option } from "@/components/ui/better-select";
export const STATUSES = ["active", "inactive", "draft"] as const;

export const SORT_OPTIONS: Option[] = [
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Name: A to Z", value: "name-asc" },
  { label: "Name: Z to A", value: "name-desc" },
  { label: "Lowest Stock", value: "stock-low" },
] as const;

let statusOptions: Option[] = [];
for (const status of STATUSES) {
  statusOptions.push({
    value: status.toUpperCase(),
    label: status.toUpperCase(),
  });
}

export const STATUS_OPTIONS = statusOptions;
