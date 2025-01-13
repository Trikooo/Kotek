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
import { Button } from "@/components/ui/button";
import { Category, Product } from "@prisma/client";
import EditProduct from "./EditProduct";
import { DeleteProduct } from "./DeleteProduct";
import { Star } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface AdminProductDetailProps {
  product: Product & { category: Category };
  className?: string;
  onUpdateProduct: (updatedProduct: Product & { category: Category }) => void;
}

type ProductStatus = "ACTIVE" | "INACTIVE" | "DRAFT";

export default function AdminProductDetail({
  product,
  className,
  onUpdateProduct,
}: AdminProductDetailProps) {
  const [showAllImages, setShowAllImages] = useState(false);

  const getStatusColor = (status: ProductStatus) => {
    switch (status) {
      case "ACTIVE":
        return "default";
      case "INACTIVE":
        return "outline";
      case "DRAFT":
        return "outline";
      default:
        return "outline";
    }
  };

  const displayedImages = showAllImages
    ? product.imageUrls
    : product.imageUrls.slice(0, 4);

  return (
    <Card className={`${className}`}>
      <CardHeader className="flex flex-row items-center justify-between px-3 sm:px-6">
        <CardTitle className="flex text-2xl leading-0 font-bold gap-2 items-center">
          {product.name}
          <div className="flex items-center gap-2">
            <Badge
              variant={`${getStatusColor(product.status as ProductStatus)}`}
            >
              {product.status}
            </Badge>
            {product.featured && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Star className="w-3 h-3" /> Featured
              </Badge>
            )}
          </div>
        </CardTitle>

        <div className="flex items-center">
          <EditProduct
            product={product}
            onUpdateProduct={(updatedProduct) =>
              onUpdateProduct(updatedProduct)
            }
          />
          <DeleteProduct id={product.id} />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <div className="prose prose-sm max-w-none [&>*]:leading-relaxed [&>*]:mb-4 text-muted-foreground">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {product.description}
                </ReactMarkdown>
              </div>
            </div>
            {product.keyFeatures && product.keyFeatures.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Key Features</h3>
                <div className="prose prose-sm max-w-none [&>*]:leading-relaxed [&>*]:mb-4">
                  <ul className="list-disc list-inside space-y-2">
                    {product.keyFeatures.map((feature, index) => (
                      <li key={index} className="text-muted-foreground">
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
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
                <p>{product.category?.name || "Uncategorized"}</p>
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
        <div>
          <h3 className="font-semibold mb-2">Images</h3>
          <div className="relative">
            <div className="flex space-x-2 overflow-x-auto pb-2">
              {displayedImages.map((url, index) => (
                <div
                  key={index}
                  className="relative w-40 h-40 flex-shrink-0 hover:opacity-80 transition-all duration-100"
                >
                  <Image
                    src={url}
                    alt={`Product image ${index + 1}`}
                    layout="fill"
                    objectFit="contain"
                    className="rounded-md"
                  />
                </div>
              ))}
            </div>
            {product.imageUrls.length > 4 && (
              <Button
                variant="outline"
                className="mt-2"
                onClick={() => setShowAllImages(!showAllImages)}
              >
                {showAllImages
                  ? "Show Less"
                  : `View All (${product.imageUrls.length})`}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end space-x-2"></CardFooter>
    </Card>
  );
}
