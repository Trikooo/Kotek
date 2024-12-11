"use client";
import { Input } from "@/components/ui/input";
import { useProductsContext } from "@/context/ProductsContext";
import useDebounce from "@/hooks/useDebounce";
import { ProductSearchParams } from "@/types/types";
import { useEffect } from "react";

export default function TestPage() {
  const {
    productSearchParams,
    products,
    setProductSearchParams,
    resetProducts,
  } = useProductsContext();
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newState: ProductSearchParams = {
      ...productSearchParams,
      query: e.target.value,
    };
    console.log(newState);
    setProductSearchParams(newState);
    resetProducts(newState);
  };

  return (
    <div className="w-full h-[100vh] flex items-center justify-center">
      <Input className="w-40" onChange={handleInputChange} />
    </div>
  );
}
