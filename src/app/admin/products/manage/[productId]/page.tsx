"use client";
import React from "react";
import { useParams, notFound } from "next/navigation";
import AdminLayout from "@/app/admin/AdminLayout";
import AdminProductDetails from "@/components/admin/products/ProductDetails";
import ProductDetailsSkeleton from "@/components/admin/products/ProductDetailsSkeleton";
import ErrorComponent from "@/components/error/error";
import useGetProductById from "@/hooks/products/useGetProductById";

export default function ProductDetailPage() {
  const params = useParams();
  const productId = Array.isArray(params.productId)
    ? params.productId[0]
    : params.productId;
  const { product, setProduct, loading, error } = useGetProductById(
    productId as string
  );

  if (!loading && !product) {
    notFound(); // Redirect to the 404 page if the product is not found
  }

  return (
    <AdminLayout>
      {loading ? (
        <ProductDetailsSkeleton />
      ) : error ? (
        <ErrorComponent />
      ) : product ? (
        <div className="grid grid-cols-3 w-full gap-4 sm:gap-8">
          <AdminProductDetails
            product={product}
            className="col-span-3 lg:col-span-3"
            onUpdateProduct={(updatedProduct) => setProduct(updatedProduct)}
          />
        </div>
      ) : null}
    </AdminLayout>
  );
}
