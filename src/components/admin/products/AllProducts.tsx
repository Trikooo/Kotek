"use client";
import { useEffect, useMemo, useState } from "react";
import { DataTable, Column, Row } from "@/components/dynamic-ui/DataTable";
import CreateProduct from "./CreateProduct";
import SortBy from "@/components/ui/sort-by";
import FilterBy from "@/components/ui/filter-by";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { STATUSES } from "@/lib/constants";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import EditProduct from "./EditProducct";
import { useProductContext } from "@/context/ProductsContext";
import { DeleteProduct } from "./DeleteProduct";


export default function AllProducts() {
  const { products, loading, error } = useProductContext()
  const [selectedStatuses, setSelectedStatuses] = useState<Set<string>>(
    new Set()
  );
  const [sortOption, setSortOption] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesStatus =
        selectedStatuses.size === 0 ||
        selectedStatuses.has(product.status.toLowerCase());
      console.log(product.status);
      return matchesSearch && matchesStatus;
    });
  }, [products, searchTerm, selectedStatuses]);
  useEffect(() => {
    console.log(selectedStatuses);
  });
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
    price: `${product.price} DA`,
    stock: `${product.stock}`,
    status: { value: product.status.toLowerCase(), filled: true },
    actions: (
      <div className="flex items-center gap-2">
        <Tooltip>
          <TooltipTrigger>
            <EditProduct product={product} />
          </TooltipTrigger>
          <TooltipContent>Edit</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger>
            <DeleteProduct id={product.id} />
          </TooltipTrigger>
          <TooltipContent>Delete</TooltipContent>
        </Tooltip>
      </div>
    ),
  }));

  return (
    <>
      <div className="flex justify-between items-center mb-2">
        <div className="flex space-x-2">
          <FilterBy
            filterOptions={STATUSES}
            selectedStatuses={selectedStatuses}
            setSelectedStatuses={setSelectedStatuses}
          />
          <SortBy sortOption={sortOption} setSortOption={setSortOption} />
        </div>
        <div>
          <CreateProduct />
        </div>
      </div>
      <DataTable
        title={<ProductsTitle setSearchTerm={setSearchTerm} />}
        columns={columns}
        rows={rows}
        isLoading={false}
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
