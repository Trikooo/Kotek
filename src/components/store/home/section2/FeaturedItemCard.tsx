"use client";

import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useProductsContext } from "@/context/ProductsContext";
import { formatCurrency } from "@/utils/generalUtils";

export default function FeaturedItems() {
  const { products, loading, error } = useProductsContext();

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error)
    return (
      <div className="text-center py-10 text-red-500">
        Error: {error.message}
      </div>
    );

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.slice(0, 4).map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105"
            >
              <div className="relative h-48">
                <Image
                  src={product.imageUrls[0] || "/placeholder.svg"}
                  alt={product.name}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2 truncate">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                  {product.description}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-gray-800">
                    {formatCurrency(product.price)}
                  </span>
                  <span className="text-sm text-gray-500">
                    {product.stock} in stock
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
