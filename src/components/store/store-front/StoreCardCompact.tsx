import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import DisplayBadge from "@/components/ui/display-badge";
import { formatCurrency } from "@/utils/generalUtils";

import { Product } from "@prisma/client";
import { Loader2, Package } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useStoreCard } from "./useStoreCard";

interface StoreCardProps {
  product: Product;
}

const StoreCardCompact = ({ product }: StoreCardProps) => {
  const {
    isHovered,
    setIsHovered,
    isProductInCart,
    hasMultipleImages,
    handleRedirect,
    handleAddToCart,
    loading,
  } = useStoreCard(product);

  return (
    <Card className="flex flex-col h-full bg-card">
      <div
        className="relative w-full pt-[75%]"
        onMouseEnter={() => hasMultipleImages && setIsHovered(true)}
        onMouseLeave={() => hasMultipleImages && setIsHovered(false)}
        onClick={handleRedirect}
      >
        <div className="absolute top-2 right-2 z-10">
          <DisplayBadge product={product} />
        </div>
        <Image
          src={product.imageUrls[0]}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          alt={product.name}
          className={`rounded-md object-contain transition-opacity duration-300 ${
            hasMultipleImages && isHovered ? "opacity-0" : "opacity-100"
          }`}
          loading="lazy"
        />
        {hasMultipleImages && product.imageUrls[1] && (
          <Image
            src={product.imageUrls[1]}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            alt={product.name}
            className={`rounded-md object-contain absolute top-0 left-0 transition-opacity duration-300 ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
            loading="lazy"
          />
        )}
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <Link href={`/store/${product.id}`} className="group">
          <h3 className="text-base font-semibold mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors hover:underline">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center justify-start gap-2 mb-2">
          <span className="text-lg font-semibold">
            {formatCurrency(product.price)}
          </span>
          {product.originalPrice > product.price && (
            <span className="text-sm line-through text-muted-foreground">
              {formatCurrency(product.originalPrice)}
            </span>
          )}
        </div>
        <div className="flex items-center text-sm mb-4">
          <Package
            className={`w-4 h-4 mr-1 ${
              product.status === "ACTIVE" ? "text-green-500" : "text-red-500"
            }`}
          />
          <span
            className={`font-semibold ${
              product.status === "ACTIVE" ? "text-green-500" : "text-red-500"
            }`}
          >
            {product.status === "ACTIVE" ? "In Stock" : "Out of Stock"}
          </span>
        </div>
        <div className="mt-auto">
          {!isProductInCart ? (
            <Button
              className="w-full"
              onClick={handleAddToCart}
              disabled={loading || product.status !== "ACTIVE"}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" strokeWidth={1.5} />
              ) : (
                "Add to cart"
              )}
            </Button>
          ) : (
            <Link href="/cart">
              <Button variant="outline" className="w-full" disabled={loading}>
                View Cart
              </Button>
            </Link>
          )}
        </div>
      </div>
    </Card>
  );
};

export default StoreCardCompact;
