"use client";

import Image from "next/image";
import { useProductsContext } from "@/context/ProductsContext";
import { formatCurrency } from "@/utils/generalUtils";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import ErrorComponent from "@/components/error/error";

export default function FeaturedItems() {
  const { products, loading, error } = useProductsContext();

  if (loading) return <FeaturedItemsSkeleton />;
  if (error) return <ErrorComponent />;

  return (
    <section className="py-12">
      <style jsx>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      <div>
        <div className="flex overflow-x-auto pb-4 md:grid md:grid-cols-2 lg:grid-cols-4 gap-8 hide-scrollbar">
          {products.slice(0, 4).map((product) => (
            <div key={product.id} className="flex-shrink-0 w-64 md:w-auto">
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="relative aspect-square">
                    <Image
                      src={product.imageUrls[0] || "/placeholder.svg"}
                      alt={product.name}
                      layout="fill"
                      objectFit="contain"
                    />
                  </div>
                </CardContent>
              </Card>
              <h3 className="mt-2 text-lg font-semibold text-gray-800 truncate">
                {product.name}
              </h3>
              <p className="text-sm text-gray-600">
                {formatCurrency(product.price)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FeaturedItemsSkeleton() {
  return (
    <>
      <style jsx>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      <div className="flex overflow-x-auto md:grid md:grid-cols-2 lg:grid-cols-4 gap-8 hide-scrollbar py-12">
        {Array(4)
          .fill(null)
          .map((_, index) => (
            <div key={index} className="flex-shrink-0 w-64 md:w-auto">
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <Skeleton className="aspect-square w-full" />
                </CardContent>
              </Card>
              <Skeleton className="mt-2 h-6 w-3/4" />
              <Skeleton className="mt-1 h-4 w-1/2" />
            </div>
          ))}
      </div>
    </>
  );
}
