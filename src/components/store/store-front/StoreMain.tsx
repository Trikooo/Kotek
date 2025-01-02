"use client";
import React, { useEffect, useRef, useCallback } from "react";
import { Cpu, Search } from "lucide-react";
import { useProductsContext } from "@/context/ProductsContext";
import StoreCardList from "./StoreCard";
import { Input } from "@/components/ui/input";
import { useHeaderContext } from "@/context/HeaderContext";
import useDebounce from "@/hooks/useDebounce";
import { ProductSearchParams } from "@/types/types";
import SearchSort from "./SearchOptions";

export default function StoreMain() {
  const {
    products,
    loading,
    error,
    productSearchParams,
    setProductSearchParams,
    resetProducts,
    hasFiltered,
    loadMoreProducts,
    pagination,
  } = useProductsContext();

  const { storeInputRef } = useHeaderContext();

  // Ref for the load more trigger
  const loadMoreTriggerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Debounced search function
  const debouncedSearch = useDebounce((newParams: ProductSearchParams) => {
    resetProducts(newParams);
  }, 500);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchQuery = e.target.value.trim();
    const newParams = { ...productSearchParams, query: searchQuery };
    setProductSearchParams(newParams);
    debouncedSearch(newParams);
  };

  // Intersection Observer callback
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (target.isIntersecting && pagination?.hasNextPage && !loading) {
        loadMoreProducts();
      }
    },
    [loadMoreProducts, pagination, loading]
  );

  // Set up Intersection Observer
  useEffect(() => {
    // Create a root margin to trigger 100px before the end
    const options: IntersectionObserverInit = {
      root: null, // viewport
      rootMargin: "0px 0px 100px 0px", // 100px from bottom
      threshold: 0, // trigger as soon as any part is visible
    };

    if (loadMoreTriggerRef.current) {
      observerRef.current = new IntersectionObserver(handleObserver, options);
      observerRef.current.observe(loadMoreTriggerRef.current);
    }

    // Cleanup
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [handleObserver]);

  return (
    <div>
      <div>
        <SearchSort />
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
          <>
            <StoreCardList
              products={products}
              loading={loading}
              error={error ? true : false}
            />
            {/* Load more trigger at the end of the product list */}
            <div ref={loadMoreTriggerRef} style={{ height: "1px" }} />
          </>
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
