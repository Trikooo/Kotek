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

  return (
    <Card className="flex">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => handleToggle("list")}
        className={` transition-all duration-100 rounded-none  rounded-tl-md rounded-bl-md ${
          selectedIcon === "list"
            ? "border-2 border-indigo-600 text-indigo-600 hover:text-indigo-600"
            : "hover:bg-indigo-50"
        }`}
      >
        <AlignJustify className="w-4 h-4" strokeWidth={1.5} />
        <span className="sr-only">List view</span>
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => handleToggle("grid")}
        className={`transition-all duration-100 rounded-none  rounded-tr-md rounded-br-md py-1 ${
          selectedIcon === "grid"
            ? "border-2 border-indigo-600 text-indigo-600 hover:text-indigo-600"
            : "hover:bg-indigo-50"
        }`}
      >
        <LayoutGrid className="w-4 h-4" strokeWidth={1.5} />
        <span className="sr-only">Grid view</span>
      </Button>
    </Card>
  );
}
