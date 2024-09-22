import { useState } from "react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Category, Product } from "@prisma/client";
import EditProduct from "./EditProduct";
import { DeleteProduct } from "./DeleteProduct";

interface AdminProductDetailProps {
  product: Product;
  category?: Category | null;
  className?: string
}

type ProductStatus = "ACTIVE" | "INACTIVE" | "DRAFT";

export default function AdminProductDetail({
  product,
  category,
  className,
}: AdminProductDetailProps) {

  const getStatusColor = (status: ProductStatus) => {
    switch (status) {
      case "ACTIVE":
        return "";
      case "INACTIVE":
        return "outline";
      case "DRAFT":
        return "outline";
      default:
        return "outline";
    }
  };

  return (

      <Card className={`${className}`}>
        <CardHeader className="flex flex-row items-center justify-between px-3 sm:px-6">
          <CardTitle className="flex text-2xl leading-0 font-bold gap-2">
            {product.name}
            <div className="flex items-center">
              <Badge
                className={`${getStatusColor(product.status as ProductStatus)}`}
              >
                {product.status}
              </Badge>
            </div>
          </CardTitle>

          <div className="flex items-center">
            <EditProduct product={product} />
            <DeleteProduct id={product.id} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-muted-foreground">{product.description}</p>
              </div>
              {product.keyFeatures && product.keyFeatures.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Key Features</h3>
                  <ul className="list-disc list-inside">
                    {product.keyFeatures.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </div>
              )}
              <div>
                <h3 className="font-semibold mb-2">Images</h3>
                <div className="flex space-x-2 overflow-x-auto">
                  {product.imageUrls.map((url, index) => (
                    <Image
                      key={index}
                      src={url}
                      alt={`Product image ${index + 1}`}
                      width={100}
                      height={100}
                      className="rounded-md"
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-semibold">Price</p>
                  <p>{product.price}DA</p>
                </div>
                <div>
                  <p className="font-semibold">Stock</p>
                  <p>{product.stock}</p>
                </div>
                <div>
                  <p className="font-semibold">Brand</p>
                  <p>{product.brand || "N/A"}</p>
                </div>
                <div>
                  <p className="font-semibold">Category</p>
                  <p>{category?.name || "Uncategorized"}</p>
                </div>
                <div>
                  <p className="font-semibold">Barcode</p>
                  <p>{product.barcode || "N/A"}</p>
                </div>
              </div>
              {product.tags && product.tags.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              <div>
                <h3 className="font-semibold mb-2">Dimensions</h3>
                <p>
                  {product.length && product.width && product.height
                    ? `${product.length} x ${product.width} x ${product.height} cm`
                    : "N/A"}
                </p>
                <p>Weight: {product.weight ? `${product.weight} g` : "N/A"}</p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end space-x-2"></CardFooter>
      </Card>

  );
}
