import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from "../ui/dropdown-menu";
import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ReactElement, ReactNode } from "react";

export interface DropdownItem {
  label: string;
  value: string;
  checked: boolean;
  onClick: () => void;
}
interface DynamicDropDownProps {
  className?: string;
  variant?:
    | "link"
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | null
    | undefined;
  triggerText: string;
  TriggerIcon?: ReactElement;
  items: DropdownItem[];
}
export default function DynamicDropDown({
  className,
  variant,
  triggerText,
  TriggerIcon,
  items,
}: DynamicDropDownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={variant ? variant : "outline"}
          className={className ? className : "h-7 gap-1 text-sm"}
        >
          {TriggerIcon && TriggerIcon}
          <span className="sr-only sm:not-sr-only">{triggerText}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{triggerText}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {items.map((item: DropdownItem) => (
          <DropdownMenuCheckboxItem
            key={item.value}
            checked={item.checked}
            onClick={item.onClick}
          >
            {item.label}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
