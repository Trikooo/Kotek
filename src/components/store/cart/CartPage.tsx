import { useState, useEffect, useRef } from "react";
import { useCart } from "@/context/CartContext";
import CartItemsCard from "./CartItemCard";
import OrderSummary from "./OrderSummary";
import { useCreateOrUpdateCart, useDeleteCartItem } from "@/hooks/cart/useCart";
import useDebounce from "@/hooks/useDebounce";
import { FetchCart } from "@/types/types";
import { toast } from "@/hooks/use-toast";
import { AlertCircle, BaggageClaim } from "lucide-react";
import CartItemsCardSkeleton, { OrderSummarySkeleton } from "./CartSkeleton";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CartPage() {
  const { cart, setCart, loading, error } = useCart();
  const { handleUpdateCart, error: updateError } = useCreateOrUpdateCart();
  const { handleDeleteCartItem, error: deleteError } = useDeleteCartItem();

  const [loadingItemId, setLoadingItemId] = useState<string | null>(null);
  const [deleteLoadingItemId, setDeleteLoadingItemId] = useState<string | null>(
    null
  );
  const initialCartRef = useRef<FetchCart | null>(null);

  useEffect(() => {
    if (cart && !initialCartRef.current && cart.items.length > 0) {
      initialCartRef.current = cart;
    }
  }, [cart, loading]);

  const debouncedUpdateCart = useDebounce(
    async (userId, updatedCart, productId) => {
      setLoadingItemId(productId);
      try {
        await handleUpdateCart(userId, updatedCart);
        if (!updateError) initialCartRef.current = updatedCart;
        else setCart(initialCartRef.current);
      } catch (err) {
        console.error("Update Cart Error:", err);
        setCart(initialCartRef.current);
        toast({
          variant: "destructive",
          title: (
            <>
              <AlertCircle className="w-5 h-5" strokeWidth={1.5} /> Uh oh, there
              was a problem
            </>
          ),
          description: "Refresh the page and try again.",
        });
      } finally {
        setLoadingItemId(null);
      }
    },
    700
  );

  const onUpdateQuantity = async (
    productId: string,
    newQuantity: number,
    e?: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (newQuantity < 1 || !cart || !initialCartRef.current) return;
    const updatedItems = cart.items.map((item) =>
      item.productId === productId ? { ...item, quantity: newQuantity } : item
    );
    setCart({ ...cart, items: updatedItems });
    const initialItem = initialCartRef.current.items.find(
      (item) => item.productId === productId
    );
    if (initialItem?.quantity === newQuantity) return;
    if (cart.userId && document && e?.target !== document.activeElement) {
      await debouncedUpdateCart(
        cart.userId,
        { ...cart, items: updatedItems },
        productId
      );
    } else if (typeof window !== "undefined") {

      localStorage.setItem("guestCart", JSON.stringify([...updatedItems]));
    }
  };

  const onRemoveItem = async (productId: string, itemId: string) => {
    if (cart && !cart.userId && typeof window !== "undefined") {
      setDeleteLoadingItemId(productId);
      const updatedItems = cart.items.filter((item) => {
        return item.productId !== productId;
      });

      localStorage.setItem("guestCart", JSON.stringify([...updatedItems]));
      setDeleteLoadingItemId(null);

      setCart({
        ...cart,
        items: updatedItems,
      });
      initialCartRef.current = {
        ...cart,
        items: updatedItems,
      };
    } else if (cart && cart.userId) {
      const updatedItems = cart.items.filter(
        (item) => item.productId !== productId
      );
      try {
        setDeleteLoadingItemId(productId);
        await handleDeleteCartItem(cart.userId, itemId);
        setCart({
          ...cart,
          items: updatedItems,
        });
        initialCartRef.current = {
          ...cart,
          items: updatedItems,
        };

        setDeleteLoadingItemId(null);
      } catch {
        toast({
          variant: "destructive",
          title: (
            <>
              <AlertCircle className="w-5 h-5" strokeWidth={1.5} /> Uh oh, there
              was a problem
            </>
          ),
          description: "Failed to remove item. Please try again.",
        });
      }
    }
  };

  const handleReload = () => window.location.reload();

  return (
    <div className="flex flex-col justify-center items-center mt-2">
      <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-6xl">
        Your Cart
      </h1>

      {loading ? (
        <div className="mt-14 w-full flex gap-16 flex-col lg:flex-row">
          <CartItemsCardSkeleton className="flex-1" />
          <OrderSummarySkeleton className="lg:w-5/12" />
        </div>
      ) : error && !error.includes("Not Found") ? (
        <div className="mt-24 w-full flex flex-col gap-4 items-center justify-center text-red-500">
          <AlertCircle className="w-8 h-8" strokeWidth={1.5} />
          An Error has occurred, please try again
          <Button variant={"secondary"} className="mt-4" onClick={handleReload}>
            Reload Page
          </Button>
        </div>
      ) : !cart || cart.items.length < 1 || error?.includes("Not Found") ? (
        <div className="mt-24 flex flex-col items-center p-6 text-center">
          <div className="rounded-full flex items-center justify-center mb-6">
            <BaggageClaim
              className="w-40 h-40 lg:w-52 lg:h-52 text-gray-400"
              strokeWidth={1.5}
            />
          </div>
          <h2 className="text-2xl font-bold mb-2">Empty</h2>
          <p className="text-gray-500 mb-6">
            Looks like you haven&apos;t added anything to your cart yet.
          </p>
          <Link href={"/"}>
            <Button className="w-full sm:w-auto">
              Continue Shopping -&gt;
            </Button>
          </Link>
        </div>
      ) : (
        <div className="mt-14 w-full flex gap-16 flex-col lg:flex-row">
          <CartItemsCard
            cartItems={cart.items}
            loadingItemId={loadingItemId}
            deleteLoadingItemId={deleteLoadingItemId}
            className="flex-1"
            onUpdateQuantity={onUpdateQuantity}
            onRemoveItem={onRemoveItem}
          />
          <OrderSummary className="lg:w-5/12" />
        </div>
      )}
    </div>
  );
}
