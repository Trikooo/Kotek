import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CircleCheck } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface ProductInformationProps {
  product: {
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
  if (loading) {
    return (
      <div className="md:p-6 md:space-y-6 space-y-4">
        {/* Skeleton Product Title */}
        <Skeleton className="h-9 w-3/4" />

        {/* Skeleton Key Features */}
        <div className="space-y-2 w-1/3">
          {Array(3)
            .fill(0)
            .map((_, index) => (
              <Skeleton key={index} className="h-4 w-full" />
            ))}
        </div>

        {/* Skeleton Price */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-24" />
        </div>

        {/* Skeleton Quantity Selection */}
        <div className="space-y-1">
          <Skeleton className="h-10 w-[100px]" />
        </div>

        {/* Skeleton Stock Status */}
        <Skeleton className="h-5 w-24" />

        {/* Skeleton Button */}
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }
  if (product)
    return (
      <div className="md:p-6 space-y-4">
        {/* Product Title */}
        <h3 className="text-xl md:text-3xl font-semibold">{product.name}</h3>

        {/* Key Features */}
        <ul className="text-muted-foreground space-y-1">
          {product.keyFeatures.map((feature, index) => (
            <li key={index}>{feature}</li>
          ))}
        </ul>

        {/* Price and Optional Original Price */}
        <div className="flex items-center gap-2">
          <p className="text-2xl font-bold">{product.price} DA</p>
          {product.originalPrice && (
            <span className="text-xs md:text-sm line-through text-muted-foreground">
              {product.originalPrice} DA
            </span>
          )}
        </div>

        {/* Quantity Selection */}
        <div>
          <p className="font-semibold mb-1">Quantity</p>
          <Select defaultValue="1">
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Select a quantity" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="1">1</SelectItem>
                <SelectItem value="2">2</SelectItem>
                <SelectItem value="3">3</SelectItem>
                <SelectItem value="4">4</SelectItem>
                <SelectItem value="5">5</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* Stock Status */}
        <div className="flex items-center text-green-500">
          <CircleCheck className="mr-1 w-4 h-4" strokeWidth={1.5} />
          <span className="text-sm md:text-base">
            {product.stock > 0 ? "In stock" : "Out of stock"}
          </span>
        </div>

        {/* Add to Cart Button */}
        <Button className="bg-indigo-600 hover:bg-indigo-500 w-full">
          Add to Cart
        </Button>
      </div>
    );
}
