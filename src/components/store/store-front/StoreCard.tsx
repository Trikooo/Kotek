import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { AlertCircle, CircleCheck } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Product } from "@prisma/client";
import { useRouter } from "next/navigation";

// Interface for StoreCard props
interface StoreCardProps {
  imageUrls: string[];
  title: string;
  features: string[];
  price: number;
  originalPrice?: number;
  inStock: boolean;
  id: string;
}

// Skeleton component for loading state
const SkeletonCard = () => (
  <Card>
    <div className="flex flex-col md:flex-row gap-4 p-5">
      <div className="w-full md:w-[200px] flex justify-center md:justify-start pb-6 md:pb-0">
        <Skeleton className="w-[200px] h-[200px] rounded-md" />
      </div>
      <div className="flex-1 gap-3">
        <Skeleton className="h-8 mb-2 rounded-md" />
        <Skeleton className="h-4 mb-1 rounded-md w-1/2" />
        <Skeleton className="h-4 mb-1 rounded-md w-1/2" />
        <Skeleton className="h-4 mb-1 rounded-md w-1/2" />
        <Skeleton className="h-4 mb-1 rounded-md w-1/2" />
      </div>
      <div className="mt-4 md:mt-0 md:ml-auto flex flex-col justify-between w-full md:w-1/4">
        <Skeleton className="h-6 mb-2 rounded-md" />
        <Skeleton className="h-8 rounded-md" />
      </div>
    </div>
  </Card>
);

// StoreCard component

const StoreCard = ({
  imageUrls,
  title,
  features,
  price,
  originalPrice,
  inStock,
  id, // Add productId prop
}: StoreCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();

  const hasMultipleImages = imageUrls.length > 1; // Check if there are multiple images

  const handleRedirect = () => {
    router.push(`/store/${id}`);
  };

  return (
    <Card>
      <div className="flex flex-col md:flex-row gap-4 p-5">
        <div
          className="w-full md:w-[200px] flex justify-center md:justify-start pb-6 md:pb-0"
          onMouseEnter={() => hasMultipleImages && setIsHovered(true)} // Only set hovered state if multiple images exist
          onMouseLeave={() => hasMultipleImages && setIsHovered(false)}
          onClick={handleRedirect} // Redirect on image click
        >
          <div className="w-[200px] h-[200px] relative cursor-pointer">
            <Image
              src={imageUrls[0]}
              layout="fill"
              objectFit="cover"
              alt={title}
              className={`rounded-md transition-opacity duration-300 ${
                hasMultipleImages && isHovered ? "opacity-0" : "opacity-100"
              }`} // Fade out first image only if multiple images are present
            />
            {hasMultipleImages && imageUrls[1] && (
              <Image
                src={imageUrls[1]}
                layout="fill"
                objectFit="cover"
                alt={title}
                className={`rounded-md absolute top-0 left-0 transition-opacity duration-300 ${
                  isHovered ? "opacity-100" : "opacity-0"
                }`} // Fade in second image on hover only if multiple images are present
              />
            )}
          </div>
        </div>
        <div className="flex-1">
          <h3
            className="text md:text-2xl font-semibold pb-2 cursor-pointer hover:text-indigo-600 hover:underline "
            onClick={handleRedirect} // Redirect on title click
          >
            {title}
          </h3>
          <ul className="text-sm md:text-base list-disc pl-5">
            {features.map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>
        </div>
        <div className="mt-4 md:mt-0 md:ml-auto flex flex-col justify-between w-full md:w-1/4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="text-lg md:text-xl font-semibold">
                {price} DA
              </span>
              {originalPrice && (
                <span className="text-xs md:text-sm line-through text-muted-foreground">
                  {originalPrice} DA
                </span>
              )}
            </div>
            <div className="flex items-center text-green-500">
              <CircleCheck className="mr-1 w-4 h-4" strokeWidth={1.5} />
              <span className="text-sm md:text-base">
                {inStock ? "In stock" : "Out of stock"}
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-2 mt-4">
            <Button className="w-full bg-indigo-600 hover:bg-indigo-500">
              Add to cart
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

// StoreCardList component
interface StoreCardListProps {
  products: Product[];
  loading: boolean;
  error: boolean;
}

// StoreCardList component
export default function StoreCardList({
  products,
  loading = false,
  error = false,
}: StoreCardListProps) {
  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        {[...Array(4)].map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    );
  }
  if (error)
    return (
      <Card className="w-full text-red-500 flex items-center justify-center flex-col p-8">
        <AlertCircle className="w-8 h-8" strokeWidth={1.5} />
        <span>An error has occurred, please reload to retry.</span>
      </Card>
    );

  return (
    <div className="flex flex-col gap-4">
      {products.map((product) => (
        <StoreCard
          id={product.id}
          key={product.id}
          imageUrls={product.imageUrls}
          title={product.name}
          features={product.keyFeatures}
          price={product.price}
          originalPrice={undefined}
          inStock={product.stock > 0}
        />
      ))}
    </div>
  );
}
