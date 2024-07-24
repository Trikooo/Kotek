"use client";

import {
  Home,
  LineChart,
  Package,
  Settings2,
  ShoppingCart,
  Users2,
  PanelLeft,
} from "lucide-react";

import SidebarLink from "./SideBarLink";
import { useContext } from "react";
import SideBarContext from "./SideBarContext";

export default function SideBar() {
  const {isExpanded, toggleSideBar} = useContext(SideBarContext)
  return (
    <aside
      className={`fixed inset-y-0 left-0 z-10 border-r bg-background hidden sm:flex flex-col justify-between p-2 ${isExpanded? "w-52": ""}`}
    >
      <div className="flex flex-col gap-5">
      <button onClick={toggleSideBar} className="hover:bg-slate-100 w-max p-3 rounded-lg">
        <PanelLeft className="w-5 h-5" strokeWidth={1.5}/>
        </button>
        <nav className="space-y-1">
        <SidebarLink href="/admin/dashboard" icon={Home} label="Dashboard" />
        <SidebarLink href="/admin/orders" icon={ShoppingCart} label="Orders" />
        <SidebarLink href="/admin/products" icon={Package} label="Products" />
        <SidebarLink href="/admin/customers" icon={Users2} label="Customers" />
        <SidebarLink href="/admin/analytics" icon={LineChart} label="Analytics" />
      </nav>
        </div>

      <nav>
        <SidebarLink href="/admin/settings" icon={Settings2} label="Settings" />
      </nav>
    </aside>
  );
}
