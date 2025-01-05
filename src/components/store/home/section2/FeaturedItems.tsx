"use client";
import { ArrowUpRight } from "lucide-react";
import FeaturedItemCard from "./FeaturedItemCard";
import { Button } from "@/components/ui/button";
import { useProductsContext } from "@/context/ProductsContext";
import FeaturedItemsSection from "./FeaturedItemCard";

export default function FeaturedItems() {
  return (
    <div className="flex flex-col justify-center items-center mt-12 sm:mt-24">
      <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-6xl">
        Featured Items
      </h1>

      <div className="relative w-full mt-6">
        <Button
          variant="link"
          className="absolute top-0 right-0 hover:text-indigo-600 duration-0 md:text-lg"
        >
          View all <ArrowUpRight className="h-5 w-5 ml-1" strokeWidth={1.5} />
        </Button>

        <FeaturedItemsSection />
      </div>
    </div>
  );
}
