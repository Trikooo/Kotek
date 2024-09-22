"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import AdminLayout from "@/app/admin/AdminLayout";
import AdminProductDetails from "@/components/admin/products/ProductDetails";
import { Category, Product } from "@prisma/client";
import { Card } from "@/components/ui/card";

export default function ProductDetailPage() {
  const params = useParams();
  const { productId } = params;
  const [product, setProduct] = useState<Product | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProductAndCategory = async () => {
      try {
        setLoading(true);
        // Fetch product
        const productResponse = await axios.get(`/api/products/${productId}`);
        const fetchedProduct = productResponse.data;
        setProduct(fetchedProduct);

        // Fetch category if product has a categoryId
        if (fetchedProduct.categoryId) {
          const categoryResponse = await axios.get(
            `/api/categories/${fetchedProduct.categoryId}`
          );
          setCategory(categoryResponse.data);
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          setError(error.response?.data?.message || JSON.stringify(error));
        } else {
          setError("An unexpected error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProductAndCategory();
    }
  }, [productId]);

  return (
    <AdminLayout>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : product ? (
        <div className="grid grid-cols-3 w-full gap-4 sm:gap-8">
          <AdminProductDetails
            product={product}
            category={category}
            className="col-span-3 lg:col-span-2"
          />
          <Card className="flex justify-center items-center col-span-3 lg:col-span-1 h-96 lg:h-auto">Orders Card</Card>
          <Card className="flex justify-center items-center h-96 col-span-3">
            Reviews Card
          </Card>
        </div>
      ) : (
        "No data available for this product."
      )}
    </AdminLayout>
  );
}
