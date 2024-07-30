"u";
import Image from "next/image";
import { Menu } from "lucide-react";
import AnnouncementBanner from "@/components/dynamic-ui/AnnouncementBanner";
import { CircleUserRound, ShoppingCart, Search } from "lucide-react";
import { ReactElement } from "react";
interface NavigationItem {
  name: string;
  href: string;
  element?: ReactElement;
}
const navigation: NavigationItem[] = [
  { name: "Store", href: "#" },
  { name: "Categories", href: "#" },
  { name: "Company", href: "#" },
  {element: <Search />, name: "Search", href: "#"}


];

const Header = ({ setMobileMenuOpen }: any) => (
  <header className="absolute inset-x-0 top-0 z-50">
    <nav
      aria-label="Global"
      className="flex items-center justify-between p-6 lg:px-8"
    >
      <div className="flex lg:flex-1">
        <a href="#" className="-m-1.5 p-1.5">
          <span className="sr-only">KOTEK</span>
          <Image
            alt="logo"
            src="/kotek.png"
            className="h-6 w-auto"
            width={200}
            height={100}
          />
        </a>
      </div>
      {/* --------------------- phone menu toggle ----------------------------- */}

      <div className="flex lg:hidden">
        <button
          type="button"
          onClick={() => setMobileMenuOpen(true)}
          className="-m-2.5 inline-flex items-center rounded-md p-2.5 text-gray-700"
        >
          <span className="sr-only">Open main menu</span>
          <Menu aria-hidden="true" className="h-6 w-6" />
        </button>
      </div>
      {/* ---------------- end of phone menu toggle ---------------------------- */}
      <div className="hidden lg:flex flex-grow justify-center gap-20">
        <div className="hidden lg:flex justify-center">
        <AnnouncementBanner
          message="Discover our sale for this week."
          link="#"
          linkText="Go Now"
        />
        </div>
        <div className="hidden lg:flex lg:gap-x-6 items-center">
          {navigation.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="text-sm font-semibold"
            >
              {item.element? item.element : item.name}
            </a>
          ))}
        </div>
        </div>
      <div className="hidden lg:flex lg:flex-1 lg:justify-end gap-12 lg:border-l lg:border-slate-900/15 -5">
        <a href="#">
          <ShoppingCart strokeWidth={1.5} />
        </a>
        <a href="#">
          <CircleUserRound strokeWidth={1.5} />
        </a>
      </div>
    </nav>
  </header>
);

export default Header;
