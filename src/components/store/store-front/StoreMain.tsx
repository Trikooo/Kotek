"use client";
import { Cpu, Search } from "lucide-react";
import SearchOptions from "./SearchOptions";
import { useProductsContext } from "@/context/ProductsContext";
import StoreCardList from "./StoreCard";
import { Input } from "@/components/ui/input";
import { useHeaderContext } from "@/context/HeaderContext";
import useDebounce from "@/hooks/useDebounce";
import { ProductSearchParams } from "@/types/types";

export default function StoreMain() {
  const {
    products,
    loading,
    error,
    productSearchParams,
    setProductSearchParams,
    resetProducts,
    hasFiltered,
  } = useProductsContext(); // Use the context to get products
  const { storeInputRef } = useHeaderContext();
  const debouncedSearch = useDebounce(
    (newParams: ProductSearchParams) => {
      // Trigger reset to fetch products based on current search params
      resetProducts(newParams);
    },
    500 // Reduced debounce time for better responsiveness
  );
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchQuery = e.target.value.trim();
    const newParams = { ...productSearchParams, query: searchQuery };
    setProductSearchParams(newParams);
    debouncedSearch(newParams);
  };

  return (
    <div>
      <div>
        <SearchOptions />
      </div>
      <div className="relative mt-5">
        <Input
          ref={storeInputRef}
          type="search"
          placeholder="What are you looking for?"
          className="p-4 w-full rounded-md border border-input bg-background text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 h-full"
          onChange={handleInputChange}
        />
        <Search
          className="absolute right-4 top-1/2 transform -translate-y-1/2"
          strokeWidth={1.5}
        />
      </div>

      <div className="flex flex-col mt-5 gap-4">
        {!loading && products.length === 0 ? (
          <NoResultsView
            query={productSearchParams.query}
            hasFiltered={hasFiltered}
          />
        ) : (
          <StoreCardList
            products={products}
            loading={loading}
            error={error ? true : false}
          />
        )}
      </div>
    </div>
  );
}

interface NoResultsViewProps {
  query?: string;
  hasFiltered: boolean;
}

function NoResultsView({ query, hasFiltered }: NoResultsViewProps) {
  return (
    <div className="flex flex-col items-center justify-center mt-28">
      <Cpu className="w-44 h-44 text-gray-400 mb-4" strokeWidth={1.5} />
      <p className="text-lg text-gray-600">
        {query && hasFiltered
          ? `No results for "${query}" with these specific filters`
          : !query && hasFiltered
          ? "No results for your specific filters"
          : query && !hasFiltered
          ? `No results for "${query}"`
          : "No results"}
      </p>
    </div>
  );
}
