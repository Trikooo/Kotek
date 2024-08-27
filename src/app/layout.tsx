import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Toaster } from "sonner";


const inter = Inter({ subsets: ["latin"]});

export const metadata: Metadata = {
  title: "KOTEK",
  description: "kotek informatique est une boutique de vente de materiel informatique de tous les types",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased"
        )}
      >
        {children}
        <SpeedInsights />
        <Toaster />
      </body>
    </html>
  );
}
