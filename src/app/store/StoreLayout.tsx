"use client";
import { ReactNode, useState } from "react";
import { HeaderProvider } from "../../context/HeaderContext";
import Header from "@/components/store/home/section1/Header";
import MobileMenu from "@/components/store/home/section1/MobileMenu";
import Footer from "@/components/store/home/footer/Footer";
import { CartProvider } from "@/context/CartContext";
import { useSession } from "next-auth/react";

export default function StoreLayout({ children }: { children: ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: session } = useSession();
  const userId = session?.user?.id;

  return (
    <CartProvider>
      <HeaderProvider>
        <div className="flex flex-col min-h-screen">
          <Header setMobileMenuOpen={setMobileMenuOpen} />
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
    </CartProvider>
  );
}
