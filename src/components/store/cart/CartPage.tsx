"use client";
import { useState, useEffect, useRef } from "react";
import { useCart } from "@/context/CartContext";
import CartItemsCard from "./CartItemCard";
import OrderSummary from "./OrderSummary";
import { useCreateOrUpdateCart, useDeleteCartItem } from "@/hooks/cart/useCart";
import useDebounce from "@/hooks/useDebounce";
import { FetchCart } from "@/types/types";
import { toast } from "@/hooks/use-toast";
import { AlertCircle } from "lucide-react";
import CartItemsCardSkeleton, { OrderSummarySkeleton } from "./CartSkeleton";

export default function CartPage() {
  const { cart, setCart, loading, error } = useCart();

  const { handleUpdateCart, error: updateError } = useCreateOrUpdateCart();
  const {
    handleDeleteCartItem,
    loading: deleteLoading,
    error: deleteError,
  } = useDeleteCartItem(); // Destructure the hook

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

  const debouncedUpdateCart = useDebounce(async (userId, updatedCart, id) => {
    setLoadingItemId(id);

    try {
      await handleUpdateCart(userId, updatedCart);

      if (!updateError) {
        initialCartRef.current = updatedCart;
      } else {
        setCart(initialCartRef.current); // Revert cart if there's an error
      }
    } catch (err) {
      console.error("Update Cart Error:", err);
      setCart(initialCartRef.current); // Revert cart if there's an error
      toast({
        variant: "destructive",
        title: (
          <>
            <AlertCircle className="w-5 h-5" strokeWidth={1.5} />
            Uh oh, there was a problem
          </>
        ),
        description: "Refresh the page and try again.",
      });
    } finally {
      setLoadingItemId(null);
    }
  }, 700);

  const onUpdateQuantity = async (
    id: string,
    newQuantity: number,
    e?: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (newQuantity < 1 || !cart || !initialCartRef.current) return;

    // Create a new array with updated quantity to ensure the reference changes
    const updatedItems = cart.items.map((item) => {
      if (item.id === id) {
        return { ...item, quantity: newQuantity };
      }
      return item;
    });

    // Only update cart state if the items actually changed
    setCart((prevCart) => {
      return {
        ...prevCart,
        items: [...updatedItems], // Ensure the reference changes
      } as FetchCart;
    });

    const updatedCart = {
      ...cart,
      items: updatedItems,
    };

    // Compare with the initial cart quantity
    const initialItem = initialCartRef.current.items.find(
      (item) => item.id === id
    );
    if (!initialItem || initialItem.quantity === newQuantity) return;

    if (cart.userId) {
      // For authenticated users, update the cart in the backend
      if (document && e?.target !== document.activeElement) {
        await debouncedUpdateCart(cart.userId, updatedCart, id);
      }
    } else {
      // For guest users (no userId)
      if (typeof window !== "undefined" && window.localStorage) {
        // Save the updated cart back to localStorage
        localStorage.setItem("guestCart", JSON.stringify(updatedCart));
      }
    }
  };

  const onRemoveItem = async (id: string) => {
    if (!cart?.userId || !id) return;

    try {
      setDeleteLoadingItemId(id);
      await handleDeleteCartItem(cart.userId, id); // Call the delete handler
      setCart({
        ...cart,
        items: cart.items.filter((item) => item.id !== id), // Remove item from local state
      });
      setDeleteLoadingItemId(null);
    } catch (error) {
      toast({
        variant: "destructive",
        title: (
          <>
            <AlertCircle className="w-5 h-5" strokeWidth={1.5} />
            Uh oh, there was a problem
          </>
        ),
        description: "Failed to remove item. Please try again.",
      });
    }
  };

  return (
    <div className="flex flex-col justify-center items-center mt-2">
      <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-6xl">
        Your Cart
      </h1>

      {loading && (
        <div className="mt-14 w-full flex gap-16 flex-col lg:flex-row">
          <CartItemsCardSkeleton className="flex-1" />
          <OrderSummarySkeleton className="lg:w-1/3" />
        </div>
      )}
      {error && error.includes("Not Found") && (
        <h1>
          Your cart seems to be very empty, start by adding items to your cart
          first.
        </h1>
      )}
      {error && !error.includes("Not Found") && <h1>{error}</h1>}

      {!loading && cart && cart.items && cart.items.length > 0 ? (
        <div className="mt-14 w-full flex gap-16 flex-col lg:flex-row">
          <CartItemsCard
            cartItems={cart.items}
            loadingItemId={loadingItemId}
            deleteLoadingItemId={deleteLoadingItemId}
            className="flex-1"
            onUpdateQuantity={onUpdateQuantity}
            onRemoveItem={onRemoveItem}
          />
          <OrderSummary className="lg:w-1/3" />
        </div>
      ) : (
        !loading && !error && <h1>Your cart is empty</h1>
      )}
    </div>
  );
}
