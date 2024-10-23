"use client"; // Add this at the top of the file

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CircleUserRound } from "lucide-react";
import React from "react";
import Image from "next/image";

interface DropdownMenuItem {
  label: string;
  onClick?: () => void;
  icon?: React.ReactNode; // Optional icon prop
}

interface DropdownMenuProps {
  label: string;
  items: DropdownMenuItem[]; // Updated to use the new interface
  image?: string; // Optional image prop
}

export default function DynamicDropdownMenu({
  label,
  items,
  image, // Destructure the image prop
}: DropdownMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center">
          {image ? (
            <Image
              src={image}
              alt="User avatar"
              className="h-5 w-5 rounded-full cursor-pointer"
              width={50}
              height={50}
            />
          ) : (
            <CircleUserRound
              className="h-5 w-5 cursor-pointer"
              strokeWidth={1.5}
            />
          )}
          <span className="sr-only">Toggle menu</span>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{label}</DropdownMenuLabel>
        {items.map((item, index) => (
          <DropdownMenuItem
            key={index}
            onClick={item.onClick}
            className="flex items-center"
          >
            {item.icon && (
              <span className="mr-3">
                {/* Apply w-4 h-4 and strokeWidth to the icon */}
                {React.cloneElement(item.icon as React.ReactElement<any>, {
                  className: "w-4 h-4", // Set width and height
                  strokeWidth: 1.5, // Set stroke width
                })}
              </span>
            )}
            {item.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
