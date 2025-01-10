import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  ChartColumnIncreasing,
  ClipboardList,
  Home,
  Package,
  PanelLeft,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";

export default function SheetBar() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const pathname = usePathname();

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  const getLinkClassName = (path: string) => {
    const isActive = pathname === path;
    return `flex items-center gap-4 px-2.5 ${
      isActive
        ? "text-foreground"
        : "text-muted-foreground hover:text-foreground"
    }`;
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button size="icon" variant="outline" className="sm:hidden">
          <PanelLeft className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="sm:max-w-xs">
        <nav className="grid gap-6 text-lg font-medium">
          <Link
            href="/admin/dashboard"
            className={getLinkClassName("/admin/dashboard")}
            onClick={handleLinkClick}
          >
            <Home className="h-4 w-4" strokeWidth={1.5} />
            Home
          </Link>
          <Link
            href="/admin/orders"
            className={getLinkClassName("/admin/orders")}
            onClick={handleLinkClick}
          >
            <ClipboardList className="h-4 w-4" strokeWidth={1.5} />
            Orders
          </Link>
          <Link
            href="/admin/products"
            className={getLinkClassName("/admin/products")}
            onClick={handleLinkClick}
          >
            <Package className="h-4 w-4" strokeWidth={1.5} />
            Products
          </Link>
          <Link
            href="/admin/customers"
            className={getLinkClassName("/admin/customers")}
            onClick={handleLinkClick}
          >
            <Users className="h-4 w-4" strokeWidth={1.5} />
            Customers
          </Link>
          <Link
            href="/admin/analytics"
            className={getLinkClassName("/admin/analytics")}
            onClick={handleLinkClick}
          >
            <ChartColumnIncreasing className="h-5 w-5" strokeWidth={1.5} />
            Analytics
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
