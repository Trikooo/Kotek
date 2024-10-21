"use client";
import SideBar from "@/components/admin/sideBar/SideBar";
import Header from "@/components/admin/header/Header";
import { useContext } from "react";
import SideBarContext, {
  SideBarContextProvider,
} from "@/context/SideBarContext";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CategoryProvider } from "@/context/CategoriesContext";
import { ProductProvider } from "@/context/ProductsContext";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isExpanded } = useContext(SideBarContext);

  return (
    <TooltipProvider>
      <SideBarContextProvider>
        <CategoryProvider>
          <ProductProvider>
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
          </ProductProvider>
        </CategoryProvider>
      </SideBarContextProvider>
    </TooltipProvider>
  );
}
