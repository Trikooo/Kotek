import { useEffect, useRef } from "react";
import { Search } from "lucide-react";

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
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open, onOpenChange]);

  return (
    <>
      <div
        className={`fixed inset-0 flex items-start justify-center backdrop-blur-lg z-50 pt-24 transition-opacity duration-200 ease-in-out ${
          open ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        <div
          ref={containerRef}
          className={`relative transition-transform duration-200 ease-in-out ${
            open ? "transform scale-100" : "transform scale-95"
          }`}
        >
          <div className="relative">
            <input
              ref={inputRef}
              type="search"
              placeholder="What are you looking for?"
              className="p-4 lg:w-[55vw] w-[90vw] bg-slate-50 opacity- rounded-lg shadow-lg pr-16 focus:outline-none"

            />
            <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500" strokeWidth={1.5}/>
          </div>
        </div>
      </div>
    </>
  );
}
