import DynamicDropDown, { DropdownItem } from "@/components/dynamic-ui/DynamicDropDown";
import { ListFilter } from "lucide-react";

interface FilterByProps {
  selectedStatuses: Set<string>;
  setSelectedStatuses: React.Dispatch<React.SetStateAction<Set<string>>>;
  filterOptions: readonly string[]; // Generic name for filter options
}

export default function FilterBy({
  selectedStatuses,
  setSelectedStatuses,
  filterOptions,
}: FilterByProps) {
  const handleStatusChange = (option: string) => {
    setSelectedStatuses((prev: Set<string>) => {
      const newSet = new Set(prev);
      if (newSet.has(option)) {
        newSet.delete(option);
      } else {
        newSet.add(option);
      }
      return newSet;
    });
  };

  const filterItems: DropdownItem[] = [
    {
      label: "No filter",
      value: "",
      checked: selectedStatuses.size === 0,
      onClick: () => setSelectedStatuses(new Set()),
    },
    ...filterOptions.map((option) => ({
      label: option,
      value: option,
      checked: selectedStatuses.has(option),
      onClick: () => handleStatusChange(option),
    })),
  ];

  return (
    <DynamicDropDown
      triggerText="Filter by"
      TriggerIcon={<ListFilter className="w-4 h-4" strokeWidth={1.5} />}
      items={filterItems}
    />
  );
}
