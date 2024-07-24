"use client";
import SideBar from "@/components/admin/sideBar/SideBar";
import Header from "@/components/admin/header/Header";
import SideBarContext, { SideBarContextProvider } from "@/components/admin/sideBar/SideBarContext";
import { useContext } from "react";


export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isExpanded } = useContext(SideBarContext)

  return (
    <SideBarContextProvider>
      <div className="flex-1 min-h-screen w-auto flex-col bg-muted/40">
        <SideBar/>
        <div
          className={`flex flex-1 flex-col sm:gap-4 sm:py-4  ${
            isExpanded ? "sm:pl-14" : "sm:pl-52"
          }`}
        >
          <Header />
          <main className="flex items-start gap-4 p-4">{children}</main>
        </div>
      </div>
    </SideBarContextProvider>
  );
}
