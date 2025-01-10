"use client";
import { useState } from "react";
import { AlignJustify, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type Style = "list" | "grid";

interface CardStyleToggleProps {
  initialStyle?: Style;
  onToggle?: (style: Style) => void;
}

export function CardStyleToggle({
  initialStyle = "list",
  onToggle,
}: CardStyleToggleProps) {
  const [selectedIcon, setSelectedIcon] = useState<Style>(initialStyle);

  const handleToggle = (style: Style) => {
    setSelectedIcon(style);
    if (onToggle) {
      onToggle(style);
    }
  };

  const baseButtonStyles =
    "relative z-10 transition-colors duration-200 rounded-none py-0 bg-transparent hover:bg-transparent focus:bg-transparent active:bg-transparent disabled:bg-transparent";

  return (
    <Card className="flex w-min overflow-hidden relative">
      {/* Sliding background */}
      <div
        className={`absolute top-0 bottom-0 w-1/2 bg-indigo-600 transition-transform duration-200 ease-in-out ${
          selectedIcon === "grid" ? "translate-x-full" : "translate-x-0"
        }`}
      />

      {/* List button */}
      <button
        onClick={() => handleToggle("list")}
        className={`${baseButtonStyles} rounded-tl-md rounded-bl-md ${
          selectedIcon === "list"
            ? "text-white hover:text-white focus:text-white"
            : "text-gray-600 hover:text-indigo-600"
        }`}
      >
        <div className="px-3 py-2">
          <AlignJustify className="w-4 h-4" strokeWidth={1.5} />
          <span className="sr-only">List view</span>
        </div>
      </button>

      {/* Grid button */}
      <button
        onClick={() => handleToggle("grid")}
        className={`${baseButtonStyles} rounded-tr-md rounded-br-md ${
          selectedIcon === "grid"
            ? "text-white hover:text-white focus:text-white"
            : "text-gray-600 hover:text-indigo-600"
        }`}
      >
        <div className="px-3 py-2">
          <LayoutGrid className="w-4 h-4" strokeWidth={1.5} />
          <span className="sr-only">Grid view</span>
        </div>
      </button>
    </Card>
  );
}

export default CardStyleToggle;
