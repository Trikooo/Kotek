"use client"
import { ReactNode, useState } from "react";
import { HeaderProvider } from "../../context/HeaderContext";
import Header from "@/components/store/home/section1/Header";
import MobileMenu from "@/components/store/home/section1/MobileMenu";

export default function StoreLayout({ children }: { children: ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <HeaderProvider>
      <Header setMobileMenuOpen={setMobileMenuOpen} />
      <MobileMenu
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />
      <div className="mt-[72px] lg:mt-20 mx-5">
      {children}
      </div>
    </HeaderProvider>
  );
}
