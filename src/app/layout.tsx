import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Toaster as SonnerToaster } from "sonner";
import { Toaster as RadixToaster } from "@/components/ui/toaster";
import SessionProviderWrapper from "@/components/SessionProviderWrapper";

import { CartProvider } from "@/context/CartContext";
import { KotekOrderProvider } from "@/context/KotekOrderContext";
import { AddressProvider } from "@/context/AddressContext";
import { ProductsProvider } from "@/context/ProductsContext";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import QueryProvider from "@/context/QueryProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Kotek",
  description:
    "kotek informatique, vente de materiel informatique, draria alger, ouedkniss, facebook instagram tiktok, informatics, geekzone, el assli, chiinformatique, lahlou",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn("min-h-screen font-sans antialiased relative")}>
        {/* Background layer with gradient */}
        <div className="fixed inset-0 bg-custom-gradient" />

        {/* Grid pattern overlay with mask */}
        <div
          className="fixed inset-0 w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgb(228, 228, 231) 1px, transparent 1px),
              linear-gradient(to bottom, rgb(228, 228, 231) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
            opacity: 0.8,
            maskImage: `linear-gradient(to right,
              transparent,
              rgba(0, 0, 0, 0.1) 10%,
              rgba(0, 0, 0, 0.3) 20%,
              rgba(0, 0, 0, 0.6) 45%,
              rgba(0, 0, 0, 0.9) 60%,
              black 75%
            )`,
            WebkitMaskImage: `linear-gradient(to right,
              transparent,
              rgba(0, 0, 0, 0.1) 15%,
              rgba(0, 0, 0, 0.3) 50%,
              rgba(0, 0, 0, 0.6) 55%,
              rgba(0, 0, 0, 0.9) 60%,
              black 75%
            )`,
          }}
        />

        {/* Content layer */}
        <div className="relative">
          <SessionProviderWrapper>
            <QueryProvider>
              <ProductsProvider>
                <CartProvider>
                  <KotekOrderProvider>
                    <AddressProvider>{children}</AddressProvider>
                  </KotekOrderProvider>
                </CartProvider>
                <SpeedInsights />
                <SonnerToaster />
                <RadixToaster />
                <ReactQueryDevtools />
              </ProductsProvider>
            </QueryProvider>
          </SessionProviderWrapper>
        </div>
      </body>
    </html>
  );
}
