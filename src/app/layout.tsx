import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Toaster as SonnerToaster } from "sonner";
import { Toaster as RadixToaster } from "@/components/ui/toaster";
import SessionProviderWrapper from "@/components/SessionProviderWrapper";
import { ProductProvider } from "@/context/ProductsContext";
import { CategoryProvider } from "@/context/CategoriesContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "KOTEK",
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
      <body className={cn("min-h-screen bg-background font-sans antialiaseds")}>
        <SessionProviderWrapper>
          <ProductProvider>
            <CategoryProvider>
              {children}
              <SpeedInsights />
              <SonnerToaster />
              <RadixToaster />
            </CategoryProvider>
          </ProductProvider>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
