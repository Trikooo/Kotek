import React from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import StoreLayout from "../store/StoreLayout";
import SettingsSidebar from "./components/SettingsSidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <StoreLayout hideHeader={false}>
      <SidebarProvider>
        <SettingsSidebar />
        <main className="pt-5 flex w-full">
          <SidebarTrigger className="fixed w-5 h-5" />
          <div className="w-full items-center justify-center  lg:pl-10">
            {children}
          </div>
        </main>
      </SidebarProvider>
    </StoreLayout>
  );
}
