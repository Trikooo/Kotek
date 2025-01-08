import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Product } from "@prisma/client";
import ErrorComponent from "@/components/error/error";
import StoreCardWide from "./StoreCardWide";
import StoreCardCompact from "./StoreCardCompact";

// Skeleton component for loading state (wide)
const SkeletonCardWide = () => (
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

const SkeletonCardCompact = () => (
  <Card className="flex flex-col h-full">
    <Skeleton className="w-full pt-[100%] rounded-t-md" />
    <div className="p-4 flex flex-col flex-grow">
      <Skeleton className="h-6 w-3/4 mb-2 rounded-md" />
      <Skeleton className="h-4 w-1/2 mb-2 rounded-md" />
      <Skeleton className="h-4 w-1/4 mb-4 rounded-md" />
      <Skeleton className="h-8 w-full mt-auto rounded-md" />
    </div>
  </Card>
);

// StoreCardList component
interface StoreCardListProps {
  products: Product[];
  loading?: boolean;
  error?: boolean;
  style: "grid" | "list";
}

export default function StoreCardList({
  products,
  loading = false,
  error = false,
  style,
}: StoreCardListProps) {
  if (error) return <ErrorComponent />;

  const CardComponent = style === "grid" ? StoreCardCompact : StoreCardWide;
  const SkeletonComponent =
    style === "grid" ? SkeletonCardCompact : SkeletonCardWide;

  return (
    <div
      className={`w-full ${
        style === "grid"
          ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
          : "flex flex-col gap-4"
      }`}
    >
      {products.map((product) => (
        <CardComponent key={product.id} product={product} />
      ))}

      {loading && (
        <>
          {[...Array(4)].map((_, index) => (
            <SkeletonComponent key={`skeleton-${index}`} />
          ))}
        </>
      )}
    </div>
  );
}
