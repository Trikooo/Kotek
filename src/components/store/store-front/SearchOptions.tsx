import { useEffect } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
} from "@/components/ui/select";
import { useProductsContext } from "@/context/ProductsContext";

export default function SearchSort() {
  const { productSearchParams, setProductSearchParams, resetProducts } =
    useProductsContext();

  const handleSortChange = (value: string) => {
    const newParams = {
      ...productSearchParams,
      sort: value,
      currentPage: 1,
    };
    setProductSearchParams(newParams);
    resetProducts(newParams);
  };
  return (
    <div className="flex gap-2 items-center">
      <span className="font-semibold text-sm">Sort by: </span>
      <Select
        onValueChange={handleSortChange}
        value={productSearchParams.sort || "featured"}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="featured">Featured</SelectItem>
            <SelectItem value="price-asc">Price: Low to High</SelectItem>
            <SelectItem value="price-desc">Price: High to Low</SelectItem>
            <SelectItem value="newest">Newest</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
