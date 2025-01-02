import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { AlertCircle, CircleCheck, Loader2, Package } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Product, ProductStatus } from "@prisma/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCreateOrUpdateCart } from "@/hooks/cart/useCart";
import { useToast } from "@/hooks/use-toast";
import { Cart, FetchCart } from "@/types/types";
import { useSession } from "next-auth/react";
import { useCart } from "@/context/CartContext";
import { ToastAction } from "@/components/ui/toast";
import ErrorComponent from "@/components/error/error";
import { formatCurrency } from "@/utils/generalUtils";
import DisplayBadge from "@/components/ui/display-badge";

const gradientAnimation = `
  @keyframes gradient {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }

  .animate-gradient {
    background-size: 200% 200%;
    animation: gradient 3s ease infinite;
  }
`;

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
interface StoreCardProps {
  product: Product;
}

const StoreCard = ({ product }: StoreCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();
  const { handleCreateOrUpdate, loading, error } = useCreateOrUpdateCart();
  const { cart, setCart } = useCart();
  const session = useSession();
  const userId = session.data?.user?.id;
  const { toast } = useToast();

  const isProductInCart = cart?.items.some(
    (item) => item.productId === product.id
  );
  const hasMultipleImages = product.imageUrls.length > 1;

  const handleRedirect = () => {
    router.push(`/store/${product.id}`);
  };

  const handleAddToCart = async () => {
    if (userId) {
      const cartData: Omit<Cart, "id" | "createdAt" | "updatedAt"> = {
        userId: userId,
        items: [
          {
            productId: product.id,
            quantity: 1,
            price: product.price,
            product: {
              name: product.name,
              imageUrls: product.imageUrls,
            },
          },
        ],
      };

      try {
        await handleCreateOrUpdate(cartData);

        toast({
          title: (
            <>
              <CircleCheck className="w-5 h-5" strokeWidth={1.5} />
              Success!
            </>
          ),
          description: "Item has been added to cart.",
          action: (
            <Link href="/cart">
              <ToastAction altText="View cart">View Cart</ToastAction>
            </Link>
          ),
        });
      } catch (error) {
        toast({
          variant: "destructive",
          title: (
            <>
              <AlertCircle className="w-5 h-5" strokeWidth={1.5} />
              Uh oh, there was a problem
            </>
          ),
          description: "Couldn't add item to cart, please try again.",
        });
      }

      setCart(
        (prevCart) =>
          ({
            ...prevCart,
            id: prevCart?.id ?? null,
            userId: prevCart?.userId ?? null,
            items: [...(prevCart?.items || []), ...cartData.items],
          } as FetchCart)
      );
    } else {
      if (typeof window !== "undefined" && window.localStorage) {
        const guestCart = JSON.parse(localStorage.getItem("guestCart") || "[]");

        const newItem = {
          productId: product.id,
          quantity: 1,
          price: product.price,
          product: {
            name: product.name,
            imageUrls: product.imageUrls,
          },
        };
        const updatedCart = [...guestCart, newItem];

        localStorage.setItem("guestCart", JSON.stringify(updatedCart));

        toast({
          title: (
            <>
              <CircleCheck className="w-5 h-5" strokeWidth={1.5} />
              Success!
            </>
          ),
          description: "Item has been added to cart.",
        });

        setCart(
          (prevCart) =>
            ({
              ...prevCart,
              items: [...(prevCart?.items || []), newItem],
            } as FetchCart)
        );
      }
    }
  };

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
              layout="fill"
              objectFit="cover"
              alt={product.name}
              className={`rounded-md transition-opacity duration-300 ${
                hasMultipleImages && isHovered ? "opacity-0" : "opacity-100"
              }`}
            />
            {hasMultipleImages && product.imageUrls[1] && (
              <Image
                src={product.imageUrls[1]}
                layout="fill"
                objectFit="cover"
                alt={product.name}
                className={`rounded-md absolute top-0 left-0 transition-opacity duration-300 ${
                  isHovered ? "opacity-100" : "opacity-0"
                }`}
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

// StoreCardList component
interface StoreCardListProps {
  products: Product[];
  loading?: boolean;
  error?: boolean;
}

export default function StoreCardList({
  products,
  loading = false,
  error = false,
}: StoreCardListProps) {
  if (error) return <ErrorComponent />;

  return (
    <div className="flex flex-col gap-4 w-full">
      {products.map((product) => (
        <StoreCard key={product.id} product={product} />
      ))}

      {loading && (
        <>
          {[...Array(4)].map((_, index) => (
            <SkeletonCard key={`skeleton-${index}`} />
          ))}
        </>
      )}
    </div>
  );
}
