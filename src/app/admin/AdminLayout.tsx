"use client";
import SideBar from "@/components/admin/sideBar/SideBar";
import Header from "@/components/admin/header/Header";
import SideBarContext, {
  SideBarContextProvider,
} from "@/context/SideBarContext";
import { useContext } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CategoryProvider } from "@/context/CategoriesContext";
import { ProductProvider } from "@/context/ProductsContext";
import { KotekOrderProvider } from "@/context/KotekOrderContext";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <TooltipProvider>
      <SideBarContextProvider>
        <Layout>{children}</Layout>
      </SideBarContextProvider>
    </TooltipProvider>
  );
}

function Layout({ children }: { children: React.ReactNode }) {
  const { isExpanded } = useContext(SideBarContext);

  return (
    <div className="flex-1 min-h-screen w-auto flex-col bg-muted/40">
      <SideBar />
      <div
        className={`flex flex-1 flex-col sm:gap-4 sm:py-4 ${
          isExpanded ? "sm:ml-52" : "sm:ml-14"
        }`}
      >
        <Header />
        <main className="flex items-start gap-4 p-4">{children}</main>
      </div>
    </div>
  );
}
