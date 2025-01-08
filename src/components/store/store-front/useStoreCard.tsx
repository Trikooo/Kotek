import { useCart } from "@/context/CartContext";
import { useCreateOrUpdateCart } from "@/hooks/cart/useCart";
import { useToast } from "@/hooks/use-toast";
import { Cart, FetchCart } from "@/types/types";
import { Product } from "@prisma/client";
import { AlertCircle, CircleCheck } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const useStoreCard = (product: Product) => {
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();
  const { handleCreateOrUpdate, loading } = useCreateOrUpdateCart();
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
              <CircleCheck className="w-4 h-4" strokeWidth={1.5} />
              Success!
            </>
          ),
          description: "Item has been added to cart.",
        });
      } catch (error) {
        toast({
          variant: "destructive",
          title: (
            <>
              <AlertCircle className="w-4 h-4" strokeWidth={1.5} />
              Error
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

  return {
    isHovered,
    setIsHovered,
    isProductInCart,
    hasMultipleImages,
    handleRedirect,
    handleAddToCart,
    loading,
  };
};
