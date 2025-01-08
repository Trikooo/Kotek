"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CircleUserRound } from "lucide-react";
import React from "react";

interface DropdownMenuItem {
  label: string;
  onClick?: () => void;
  icon?: React.ReactNode;
}

interface DropdownMenuProps {
  label: string;
  items: DropdownMenuItem[];
  image?: string;
  username?: string | null;
  isLoggedIn: boolean;
}

export default function DynamicDropdownMenu({
  label,
  items,
  image,
  username,
  isLoggedIn,
}: DropdownMenuProps) {
  const getFallbackLetter = (username: string) => {
    return username ? username[0].toUpperCase() : "";
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-5 w-5 rounded-full p-0">
          <Avatar className="h-5 w-5">
            {isLoggedIn ? (
              <>
                <AvatarImage src={image} alt={username || "user image"} />
                <AvatarFallback className="bg-gray-200 text-gray-600">
                  {getFallbackLetter(username || "")}
                </AvatarFallback>
              </>
            ) : (
              <CircleUserRound className="h-5 w-5" strokeWidth={1.5} />
            )}
          </Avatar>
        </Button>
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
                {React.cloneElement(item.icon as React.ReactElement<any>, {
                  className: "w-4 h-4",
                  strokeWidth: 1.5,
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
