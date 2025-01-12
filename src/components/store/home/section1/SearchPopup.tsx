import { useEffect, useRef, useState, useCallback } from "react";
import { Search, Cpu } from "lucide-react";
import { Input } from "@/components/ui/input";
import useDebounce from "@/hooks/useDebounce";
import { useProductsContext } from "@/context/ProductsContext";
import StoreCardList from "../../store-front/StoreCardList";
import { ProductSearchParams } from "@/types/types";
import { CardStyleToggle } from "../../store-front/CardStyleToggle";

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
    loadMoreProducts,
    pagination,
  } = useProductsContext();

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const loadMoreTriggerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const [visible, setVisible] = useState(open);
  const [style, setStyle] = useState<"grid" | "list">("grid");

  // Handle popup state in browser history
  useEffect(() => {
    if (open) {
      // Push a new state when opening the popup
      window.history.pushState({ searchPopup: true }, "");
    }

    // Handle the back button
    const handlePopState = (event: PopStateEvent) => {
      if (event.state?.searchPopup) {
        // If we're going back to a search popup state, keep it open
        onOpenChange(true);
      } else {
        // If we're going back to any other state, close the popup
        onOpenChange(false);
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [open, onOpenChange]);

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
    const options: IntersectionObserverInit = {
      root: containerRef.current,
      rootMargin: "0px 0px 100px 0px",
      threshold: 0,
    };

    if (loadMoreTriggerRef.current) {
      observerRef.current = new IntersectionObserver(handleObserver, options);
      observerRef.current.observe(loadMoreTriggerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [handleObserver]);

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

  const debouncedSearch = useDebounce((newParams: ProductSearchParams) => {
    resetProducts(newParams);
  }, 500);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchQuery = e.target.value.trim();
    const newParams = {
      ...productSearchParams,
      query: searchQuery,
      currentPage: 1,
    };
    setProductSearchParams(newParams);
    debouncedSearch(newParams);
  };

  return (
    <div
      className={`fixed inset-0 flex items-start justify-center bg-indigo-50/85 backdrop-blur-md z-[1000] transition-opacity duration-300 ease-in-out ${
        open ? "opacity-100" : "opacity-0"
      } ${visible ? "visible" : "invisible"}`}
    >
      <div
        ref={containerRef}
        className={`mt-24 flex flex-col gap-3 relative transition-transform duration-300 ease-in-out  w-full h-full max-h-min px-4 ${
          open ? "transform scale-100" : "transform scale-110"
        }`}
      >
        <div className="flex justify-end">
          <CardStyleToggle
            initialStyle={style}
            onToggle={(style) => setStyle(style)}
          />
        </div>
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
            <>
              <StoreCardList
                products={products}
                loading={loading}
                error={error ? true : false}
                style={style}
              />
              <div ref={loadMoreTriggerRef} style={{ height: "1px" }} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
