"use client";
import { DataTable, Column, Row } from "@/components/dynamic-ui/DataTable";
import DynamicDropDown, {
  DropdownItem,
} from "@/components/dynamic-ui/DynamicDropDown";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, ListFilter, Search, ArrowDownWideNarrow } from "lucide-react";
import { useMemo, useState } from "react";
import { STATUSES, SORT_OPTIONS } from "@/lib/constants";
import CreateProduct from "./CreateProduct";

interface AllProductsProps {
  products: {
    id: string;
    name: string;
    price: number; // Integer price in DA
    stock: number;
    imageUrl: string;
    status: "ACTIVE" | "INACTIVE" | "DRAFT"; // Adjust to match your enum values
  }[];
}

export default function AllProducts({ products }: AllProductsProps) {
  // ------------------ filter by ----------------------------------

  const [selectedStatuses, setSelectedStatuses] = useState<Set<string>>(
    new Set()
  );

  const handleStatusChange = (status: string) => {
    setSelectedStatuses((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(status)) {
        newSet.delete(status);
      } else {
        newSet.add(status);
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
    ...STATUSES.map((status) => ({
      label: status,
      value: status,
      checked: selectedStatuses.has(status),
      onClick: () => handleStatusChange(status),
    })),
  ];

  // ------------------ end of filter by ----------------------------------

  // ------------------ sort by ----------------------------------

  const [sortOption, setSortOption] = useState<string>("");
  function handleSortChange(option: string) {
    setSortOption(option);
  }

  const sortItems: DropdownItem[] = SORT_OPTIONS.map((option) => ({
    label: option.label,
    value: option.value,
    checked: sortOption === option.value,
    onClick: () => handleSortChange(option.value),
  }));

  // ------------------ end of sort by ----------------------------------

  // ------------------ search ----------------------------------

  const [searchTerm, setSearchTerm] = useState("");

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesStatus =
        selectedStatuses.size === 0 || selectedStatuses.has(product.status);
      return matchesSearch && matchesStatus;
    });
  }, [products, searchTerm, selectedStatuses]);

  // ------------------ end of search ----------------------------------

  // ------------------ dataTable ----------------------------------

  const columns: Column[] = [
    { header: "Image", important: true },
    { header: "Name", important: true },
    { header: "Price", important: true },
    { header: "Stock" },
    { header: "Status", badge: true },
  ];

  const rows: Row[] = filteredProducts.map((product) => ({
    image: product.imageUrl,
    name: product.name,
    price: `${product.price} DA`, // Format price as integer with DA currency
    stock: `${product.stock}`, // Render stock as a string
    status: { value: product.status.toLowerCase(), filled: true },
  }));

  // ------------------ end of dataTable ----------------------------------

  return (
    <>
      <div className="flex justify-between items-center mb-2">
        <div className="flex space-x-2">
          <DynamicDropDown
            triggerText="Filter by"
            TriggerIcon={<ListFilter className="w-4 h-4" strokeWidth={1.5} />}
            items={filterItems}
          />
          <DynamicDropDown
            triggerText="Sort by"
            TriggerIcon={
              <ArrowDownWideNarrow className="w-4 h-4" strokeWidth={1.5} />
            }
            items={sortItems}
          />
        </div>
        <div>
         <CreateProduct />
        </div>
      </div>
      <DataTable
        title={<ProductsTitle setSearchTerm={setSearchTerm} />}
        columns={columns}
        rows={rows}
        isLoading={false} // Replace with a loading state if necessary
      />
    </>
  );
}

const ProductsTitle = ({
  setSearchTerm,
}: {
  setSearchTerm: (term: string) => void;
}) => {
  return (
    <div className="flex items-center justify-between">
      Existing Products
      <div className="relative flex items-center md:grow-0">
        <Search
          className="absolute left-2.5 h-4 w-4 text-muted-foreground"
          strokeWidth={1.5}
        />
        <Input
          type="search"
          placeholder="Search..."
          className="w-full rounded-lg bg-background pl-8 font-normal"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
    </div>
  );
};
