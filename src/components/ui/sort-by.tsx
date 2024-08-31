import { useState } from "react";
import DynamicDropDown, { DropdownItem } from "@/components/dynamic-ui/DynamicDropDown";
import { ArrowDownWideNarrow } from "lucide-react";
import { SORT_OPTIONS } from "@/lib/constants";

interface SortByProps {
  sortOption: string;
  setSortOption: (option: string) => void;
}

export default function SortBy({ sortOption, setSortOption }: SortByProps) {
  const sortItems: DropdownItem[] = SORT_OPTIONS.map((option) => ({
    label: option.label,
    value: option.value,
    checked: sortOption === option.value,
    onClick: () => setSortOption(option.value),
  }));

  return (
    <DynamicDropDown
      triggerText="Sort by"
      TriggerIcon={<ArrowDownWideNarrow className="w-4 h-4" strokeWidth={1.5} />}
      items={sortItems}
    />
  );
}
