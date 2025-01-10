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

const StoreCardWide = ({ product }: StoreCardProps) => {
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
    <Card>
      <div className="flex flex-col md:flex-row gap-4 p-5">
        <div
          className="w-full md:w-[200px] flex justify-center md:justify-start pb-6 md:pb-0"
          onMouseEnter={() => hasMultipleImages && setIsHovered(true)}
          onMouseLeave={() => hasMultipleImages && setIsHovered(false)}
          onClick={handleRedirect}
        >
          <div className="w-[200px] h-[200px] relative cursor-pointer">
            <div className="absolute -right-2 -top-2 z-10">
              <DisplayBadge product={product} />
            </div>
            <Image
              src={product.imageUrls[0]}
              objectFit="contain"
              fill // Changed from width/height/layout to fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              alt={product.name}
              className={`rounded-md transition-opacity duration-300 ${
                hasMultipleImages && isHovered ? "opacity-0" : "opacity-100"
              }`}
              loading="lazy"
            />
            {hasMultipleImages && product.imageUrls[1] && (
              <Image
                src={product.imageUrls[1]}
                layout="fill"
                objectFit="contain"
                fill // Changed from width/height/layout to fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                alt={product.name}
                className={`rounded-md absolute top-0 left-0 transition-opacity duration-300 ${
                  isHovered ? "opacity-100" : "opacity-0"
                }`}
                loading="lazy"
              />
            )}
          </div>
        </div>
        <div className="flex-1">
          <Link
            className="text md:text-2xl font-semibold pb-2 cursor-pointer hover:text-indigo-600 hover:underline w-max"
            href={`/store/${product.id}`}
          >
            {product.name}
          </Link>
          <ul className="text-sm md:text-base list-disc pl-5">
            {product.keyFeatures.map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>
        </div>
        <div className="mt-4 md:mt-0 md:ml-auto flex flex-col justify-between w-full md:w-1/4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="text-lg md:text-xl font-semibold">
                {formatCurrency(product.price)}
              </span>

              {product.originalPrice > product.price && (
                <span className="text-xs md:text-sm line-through text-muted-foreground">
                  {formatCurrency(product.originalPrice)}
                </span>
              )}
            </div>
            {product.status === "ACTIVE" ? (
              <div className="flex items-center justify-start text-sm">
                <Package className="w-4 h-4 mr-1 text-green-500" />
                <span className="font-semibold text-green-500">In Stock</span>
              </div>
            ) : (
              <div className="flex items-center justify-start text-sm">
                <Package className="w-4 h-4 mr-1 text-red-500" />
                <span className="font-semibold text-red-500">Out of Stock</span>
              </div>
            )}
          </div>
          <div className="flex flex-col gap-2 mt-4">
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
      </div>
    </Card>
  );
};

export default StoreCardWide;
