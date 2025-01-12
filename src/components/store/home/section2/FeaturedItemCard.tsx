"use client";

import Image from "next/image";
import { useProductsContext } from "@/context/ProductsContext";
import { formatCurrency } from "@/utils/generalUtils";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import ErrorComponent from "@/components/error/error";

import Link from "next/link";

export default function FeaturedItems() {
  const { products, loading, error } = useProductsContext();

  if (loading) return <FeaturedItemsSkeleton />;
  if (error) return <ErrorComponent />;

  return (
    <section className="py-12 w-full">
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
        <div className="flex overflow-x-auto pb-4 md:grid md:grid-cols-3 lg:grid-cols-5 gap-8 hide-scrollbar p-1">
          {products.slice(0, 5).map((product) => (
            <div key={product.id} className="flex-shrink-0 w-64 md:w-auto">
              <Card className="overflow-hidden hover:shadow-md bg-card">
                <CardContent className="p-0">
                  <div className="relative aspect-square">
                    <Link href={`/store/${product.id}`}>
                      <Image
                        src={product.imageUrls[0] || "/placeholder.svg"}
                        alt={product.name}
                        layout="fill"
                        objectFit="contain"
                        className="hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </Link>
                  </div>
                </CardContent>
              </Card>
              <Link
                href={`/store/${product.id}`}
                className="mt-2 text-base font-semibold line-clamp-1 text-left p-0 h-auto hover:text-indigo-600 duration-0 w-full overflow-hidden hover:underline"
              >
                {product.name}
              </Link>
              <p className="text-sm ">{formatCurrency(product.price)}</p>
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
