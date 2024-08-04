import { useEffect, useRef } from "react";
import { Search } from "lucide-react";
import FeaturedItemCard from "../section2/FeaturedItemCard";

interface SearchPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function SearchPopup({ open, onOpenChange }: SearchPopupProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        onOpenChange(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      if (inputRef.current) {
        inputRef.current.focus();
      }
      // Disable scrolling
      document.body.style.overflow = "hidden";
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
      // Re-enable scrolling
      document.body.style.overflow = "";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      // Ensure scrolling is re-enabled if the component unmounts
      document.body.style.overflow = "";
    };
  }, [open, onOpenChange]);

  return (
    <>
      <div
        className={`fixed inset-0 flex items-start justify-center bg-white/85 backdrop-blur-md z-50 pt-24 transition-opacity duration-200 ease-in-out ${
          open ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        <div
          ref={containerRef}
          className={`p-4 flex flex-col gap-3  relative transition-transform duration-200 ease-in-out${
            open ? "transform scale-100" : "transform scale-95"
          }`}
        >
          <div className="relative">
            <input
              ref={inputRef}
              type="search"
              placeholder="What are you looking for?"
              className="p-4 w-full rounded-md border border-input bg-background text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            />
            <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500" strokeWidth={1.5}/>
          </div>
          <div className="max-h-[calc(100vh-16rem)] overflow-y-auto">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 md:gap-6">
              <FeaturedItemCard />
              <FeaturedItemCard />
              <FeaturedItemCard />
              <FeaturedItemCard />
              <FeaturedItemCard />
              <FeaturedItemCard />
              <FeaturedItemCard />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
