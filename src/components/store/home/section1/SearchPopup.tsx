import { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";
import FeaturedItemCard from "../section2/FeaturedItemCard";

interface SearchPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function SearchPopup({ open, onOpenChange }: SearchPopupProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(open);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        onOpenChange(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      // Focus the input after a short delay to ensure the component is fully rendered
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 0);
      // Disable scrolling
      document.body.style.overflow = "hidden";
      setVisible(true);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
      // Re-enable scrolling
      document.body.style.overflow = "";
      // Delay setting visibility to false to allow the transition to complete
      setTimeout(() => {
        setVisible(false);
      }, 300); // Match the duration of the transition
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
        className={`fixed inset-0 flex items-start justify-center bg-indigo-50/85 backdrop-blur-md z-50 pt-24 transition-opacity duration-300 ease-in-out ${
          open ? "opacity-100" : "opacity-0"
        } ${visible ? "visible" : "invisible"}`}
      >
        <div
          ref={containerRef}
          className={`p-4 flex flex-col gap-3 relative transition-transform duration-300 ease-in-out ${
            open ? "transform scale-100" : "transform scale-105"
          }`}
        >
          <div className="relative">
            <input
              ref={inputRef}
              type="search"
              placeholder="What are you looking for?"
              className="p-4 w-full rounded-md border border-input bg-background text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            />
            <Search className="absolute right-4 top-1/2 transform -translate-y-1/2" strokeWidth={1.5} />
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