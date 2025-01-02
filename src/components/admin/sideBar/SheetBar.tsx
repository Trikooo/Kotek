import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  ChartColumnIncreasing,
  ClipboardList,
  Home,
  LineChart,
  Package,
  Package2,
  PanelLeft,
  ShoppingCart,
  Users,
  Users2,
} from "lucide-react";
import Link from "next/link";

export default function SheetBar() {
  return (
    <Sheet>
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
            className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
          >
            <Home className="h-4 w-4" strokeWidth={1.5} />
            Home
          </Link>
          <Link
            href="#"
            className="flex items-center gap-4 px-2.5 text-foreground"
          >
            <ClipboardList className="h-4 w-4" strokeWidth={1.5} />
            Orders
          </Link>
          <Link
            href="#"
            className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
          >
            <Package className="h-4 w-4" strokeWidth={1.5} />
            Products
          </Link>
          <Link
            href="#"
            className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
          >
            <Users className="h-5 w-5" strokeWidth={1.5} />
            Customers
          </Link>
          <Link
            href="/admin/analytics"
            className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
          >
            <ChartColumnIncreasing className="h-5 w-5" strokeWidth={1.5} />
            Analytics
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
