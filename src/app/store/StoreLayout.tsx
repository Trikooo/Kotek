"use client";
import { ReactNode, useEffect, useState } from "react";
import { HeaderProvider } from "../../context/HeaderContext";
import Header from "@/components/store/home/section1/Header";
import MobileMenu from "@/components/store/home/section1/MobileMenu";
import Footer from "@/components/store/home/footer/Footer";
import { CartProvider } from "@/context/CartContext";
import { useSession } from "next-auth/react";
import { NAME } from "@/lib/constants";

export default function StoreLayout({
  children,
  hideHeader = true,
}: {
  children: ReactNode;
  hideHeader?: boolean;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // useEffect(() => {
  //     // }, []);

  return (
    <HeaderProvider>
      <div className="flex flex-col min-h-screen">
        <Header setMobileMenuOpen={setMobileMenuOpen} hide={hideHeader} />
        <MobileMenu
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
        />
        <main className="flex-1 mt-[72px] lg:mt-20 mx-2 md:mx-5">
          {children}
        </main>
        <Footer />
      </div>
    </HeaderProvider>
  );
}
