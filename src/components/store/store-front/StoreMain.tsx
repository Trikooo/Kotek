"use client";
import { Search } from "lucide-react";
import StoreCard from "./StoreCard";
import SearchOptions from "./SearchOptions";

import { Product } from "@prisma/client";
import { useProductContext } from "@/context/ProductsContext";
import { useEffect } from "react";
import StoreCardList from "./StoreCard";

export default function StoreMain() {
  const { data, loading, error } = useProductContext(); // Use the context to get products
  useEffect(() => {
    console.log("loading: ", loading);
  });

  return (
    <div className="lg:pl-10">
      <div>
        <SearchOptions />
      </div>
      <div className="relative mt-5">
        <input
          type="search"
          placeholder="What are you looking for?"
          className="p-4 w-full rounded-md border border-input bg-background text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
        />
        <Search
          className="absolute right-4 top-1/2 transform -translate-y-1/2"
          strokeWidth={1.5}
        />
      </div>

      <div className="flex flex-col mt-5 gap-4">
        <StoreCardList
          products={data.products}
          loading={loading}
          error={error as boolean}
        />
      </div>
    </div>
  );
}
