import { useEffect, useRef, useState } from "react";
import { Search, Cpu } from "lucide-react";
import { Input } from "@/components/ui/input";
import useDebounce from "@/hooks/useDebounce";
import { useProductsContext } from "@/context/ProductsContext";
import StoreCardList from "../../store-front/StoreCard";
import { ProductSearchParams } from "@/types/types";

interface SearchPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function SearchPopup({ open, onOpenChange }: SearchPopupProps) {
  const {
    productSearchParams,
    setProductSearchParams,
    products,
    resetProducts,
    loading,
    error,
  } = useProductsContext();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(open);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        onOpenChange(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 0);
      document.body.style.overflow = "hidden";
      setVisible(true);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "";
      setTimeout(() => {
        setVisible(false);
      }, 300);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "";
    };
  }, [open, onOpenChange]);

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
    <div
      className={`fixed inset-0 flex items-start justify-center bg-indigo-50/85 backdrop-blur-md z-50 transition-opacity duration-300 ease-in-out ${
        open ? "opacity-100" : "opacity-0"
      } ${visible ? "visible" : "invisible"}`}
    >
      <div
        ref={containerRef}
        className={`mt-24 flex flex-col gap-3 relative transition-transform duration-300 ease-in-out lg:w-2/3 w-full h-full max-h-min ${
          open ? "transform scale-100" : "transform scale-105"
        }`}
      >
        <div className="relative">
          <Input
            ref={inputRef}
            type="search"
            placeholder="What are you looking for?"
            className="p-4 w-full rounded-md border border-input bg-background text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            onChange={handleInputChange}
          />
          <Search
            className="absolute right-4 top-1/2 transform -translate-y-1/2"
            strokeWidth={1.5}
          />
        </div>
        <div className="overflow-y-auto flex-grow pb-32">
          {!loading && products.length === 0 && productSearchParams.query ? (
            <div className="flex flex-col items-center justify-center mt-28">
              <Cpu className="w-44 h-44 text-gray-400 mb-4" strokeWidth={1.5} />
              <p className="text-lg text-gray-600">
                No results for &quot;{productSearchParams.query}&quot;
              </p>
            </div>
          ) : (
            <StoreCardList
              products={products}
              loading={loading}
              error={error ? true : false}
            />
          )}
        </div>
      </div>
    </div>
  );
}
