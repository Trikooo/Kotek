"use client";

import ProductDetailsImages from "@/components/store/product-page/ProductDetailsImages";
import ProductInformation from "@/components/store/product-page/ProductInformation";
import StoreLayout from "../StoreLayout";
import useGetProductById from "@/hooks/products/useGetProductById";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import FeaturedItems from "@/components/store/home/section2/FeaturedItemCard";
import { Card, CardContent } from "@/components/ui/card";
import remarkGfm from "remark-gfm";
import ReactMarkdown from "react-markdown";

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

      {/* Product Description Section */}
      <div className="mt-14 w-full">
        <CardContent className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Product Description</h2>
          {loading ? (
            <div className="h-24 bg-gray-200 animate-pulse rounded" />
          ) : (
            <div className="prose prose-sm max-w-none">
              {data.description ? (
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  className="prose prose-lg max-w-none leading-relaxed prose-p:leading-relaxed prose-li:leading-relaxed"
                  components={{
                    p: ({ children }) => (
                      <p className="leading-relaxed my-4">{children}</p>
                    ),
                    li: ({ children }) => (
                      <li className="leading-relaxed">{children}</li>
                    ),
                  }}
                >
                  {data.description}
                </ReactMarkdown>
              ) : (
                <p className="leading-relaxed">
                  No description available for this product.
                </p>
              )}
            </div>
          )}
        </CardContent>
      </div>

      {/* Recommended Section */}
      <div className="mt-14 w-full">
        <div className="flex flex-col justify-center items-center mt-24">
          <h1 className="text-4xl font-bold text-primary sm:text-6xl">
            Recommended
          </h1>
          <FeaturedItems />
        </div>
      </div>
    </StoreLayout>
  );
}
