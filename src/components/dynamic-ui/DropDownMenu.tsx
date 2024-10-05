// @/components/dynamic-ui/DropDownMenu.tsx

"use client"; // Add this at the top of the file

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CircleUserRound, MoreHorizontal } from "lucide-react";

interface DropdownMenuProps {
  label: string;
  items: { label: string; onClick?: () => void }[];
}
export default function DynamicDropdownMenu({
  label,
  items,
}: DropdownMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div>
          <CircleUserRound className="h-5 w-5 cursor-pointer" strokeWidth={1.5} />
          <span className="sr-only">Toggle menu</span>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{label}</DropdownMenuLabel>
        {items.map((item, index) => (
          <DropdownMenuItem key={index} onClick={item.onClick}>
            {item.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
