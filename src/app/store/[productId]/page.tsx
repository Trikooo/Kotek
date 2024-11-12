"use client";
import ProductDetailsImages from "@/components/store/product-page/ProductDetailsImages";
import ProductInformation from "@/components/store/product-page/ProductInformation";
import FeaturedItemCard from "@/components/store/home/section2/FeaturedItemCard";
import StoreLayout from "../StoreLayout";
import useGetProductById from "@/hooks/products/useGetProductById";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function ProductPage() {
  const params = useParams();
  const { productId } = params;
  const { data, loading, error } = useGetProductById(productId as string);
  const router = useRouter();

  const thumbnails = data?.imageUrls;
  const handleReload = () => window.location.reload();

  if (error) {
    return (
      <StoreLayout>
        <div className="mt-24 w-full flex flex-col gap-4 items-center justify-center text-red-500">
          <AlertCircle className="w-8 h-8" strokeWidth={1.5} />
          An Error has occurred, please try again
          <Button variant={"secondary"} className="mt-4" onClick={handleReload}>
            Reload Page
          </Button>
        </div>
      </StoreLayout>
    );
  }

  return (
    <StoreLayout>
      <div className="flex flex-col md:flex-row gap-8 pt-14">
        <div className="w-full md:flex-1">
          <ProductDetailsImages thumbnails={thumbnails} loading={loading} />
        </div>
        <div className="w-full md:flex-1 mt-8 md:mt-0">
          <ProductInformation product={data} loading={loading} />
        </div>
      </div>

      <div className="mt-14">
        <div className="flex flex-col justify-center items-center mt-24">
          <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-6xl">
            Recommended
          </h1>

          <div className="relative w-full mt-14 px-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 py-10 w-full">
              <FeaturedItemCard />
              <FeaturedItemCard />
              <FeaturedItemCard />
              <FeaturedItemCard />
            </div>
          </div>
        </div>
      </div>
    </StoreLayout>
  );
}
