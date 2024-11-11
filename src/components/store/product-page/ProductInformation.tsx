import { Button } from "@/components/ui/button";
import { AlertCircle, CircleCheck, Minus, Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCreateOrUpdateCart } from "@/hooks/cart/useCart";
import { toast } from "@/hooks/use-toast";
import { Cart } from "@/types/types";
import { Input } from "@/components/ui/input";
import { useCart } from "@/context/CartContext"; // Import useCart

interface ProductInformationProps {
  product: {
    id: string;
    name: string;
    price: number;
    originalPrice?: number;
    keyFeatures: string[];
    stock: number;
  } | null;
  loading: boolean;
  error?: boolean;
}

export default function ProductInformation({
  product,
  loading = true,
  error,
}: ProductInformationProps) {
  const { data: session } = useSession();
  const { handleCreateOrUpdate } = useCreateOrUpdateCart();
  const [quantity, setQuantity] = useState(1);
  const router = useRouter();
  const { cart } = useCart(); // Get the cart state

  const userId = session?.user?.id;

  // Check if the product is already in the cart
  const isProductInCart = cart?.items.some(
    (item) => item.productId === product?.id
  );

  const handleAddToCart = async () => {
    if (product) {
      const cartData: Omit<Cart, "id" | "createdAt" | "updatedAt"> = {
        userId: userId as string,
        items: [{ productId: product.id, quantity, price: product.price }],
      };

      try {
        await handleCreateOrUpdate(cartData);
        toast({
          title: "Success!",
          description: "Item has been added to cart.",
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
    }
  };

  const handleViewCart = () => {
    router.push("/cart");
  };

  const handleIncrease = () => {
    if (product?.stock && quantity < product?.stock) {
      setQuantity(quantity + 1);
    }
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    setQuantity(value);
  };

  const handleOnBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newQuantity = parseInt(e.target.value, 10);
    if (newQuantity === 0 || isNaN(newQuantity)) {
      setQuantity(1);
    } else if (product?.stock && newQuantity > product.stock) {
      setQuantity(product.stock);
    }
  };

  if (loading) {
    return (
      <div className="md:p-6 md:space-y-6 space-y-4">
        {/* Skeletons */}
        <Skeleton className="h-9 w-3/4" />
        <div className="space-y-2 w-1/3">
          {Array(3)
            .fill(0)
            .map((_, index) => (
              <Skeleton key={index} className="h-4 w-full" />
            ))}
        </div>
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-10 w-[100px]" />
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  if (product) {
    return (
      <div className="md:p-6 space-y-4">
        <h3 className="text-xl md:text-3xl font-semibold">{product.name}</h3>
        <ul className="text-muted-foreground space-y-1">
          {product.keyFeatures.map((feature, index) => (
            <li key={index}>{feature}</li>
          ))}
        </ul>
        <div className="flex items-center gap-2">
          <p className="text-2xl font-bold">{product.price} DA</p>
          {product.originalPrice && (
            <span className="text-xs md:text-sm line-through text-muted-foreground">
              {product.originalPrice} DA
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <p className="font-semibold mb-1">Quantity</p>
          <Button
            variant="outline"
            size="icon"
            className="p-2"
            onClick={handleDecrease}
            disabled={quantity <= 1}
          >
            <Minus className="w-4 h-4" strokeWidth={1.5} />
          </Button>
          <Input
            type="number"
            value={quantity}
            onChange={handleQuantityChange}
            onBlur={handleOnBlur}
            className="w-[60px] text-center"
            min={1}
            max={product.stock}
          />
          <Button
            variant="outline"
            size="icon"
            className="p-2"
            onClick={handleIncrease}
            disabled={quantity >= product.stock}
          >
            <Plus className="w-4 h-4" strokeWidth={1.5} />
          </Button>
        </div>
        <div className="flex items-center text-green-500">
          <CircleCheck className="mr-1 w-4 h-4" strokeWidth={1.5} />
          <span className="text-sm md:text-base">
            {product.stock > 0 ? "In stock" : "Out of stock"}
          </span>
        </div>
        {isProductInCart ? (
          <Button variant="outline" className="w-full mt-2" onClick={handleViewCart}>
            View Cart
          </Button>
        ) : (
          <Button
            className="bg-indigo-600 hover:bg-indigo-500 w-full"
            onClick={handleAddToCart}
          >
            Add to Cart
          </Button>
        )}
      </div>
    );
  }

  return null;
}
