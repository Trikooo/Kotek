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

export default function ProductInformation() {
  return (
    <div className="md:p-6 space-y-4">
      {/* Product Title */}
      <h3 className="text-xl md:text-3xl font-semibold">
        Intel Core i5 14600k
      </h3>

      {/* Product Description */}
      <p className="text-muted-foreground">
        The Intel Core i5 14600k is a powerful 14-core processor that offers
        excellent performance for gaming and productivity tasks. With high clock
        speeds and a balanced architecture, it&apos;s a great choice for those
        who need both speed and efficiency.
      </p>
      <div className="flex items-center gap-2">
      <p className="text-2xl font-bold">78000DA</p>
      <span className="text-xs md:text-sm line-through text-muted-foreground">85000 DA</span>
      </div>

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

      <div className="flex items-center text-green-500">
        <CircleCheck className="mr-1 w-4 h-4" strokeWidth={1.5} />
        <span className="text-sm md:text-base">In stock</span>
      </div>

      {/* Add to Cart Button */}
      <Button className="bg-indigo-600 hover:bg-indigo-500 w-full">
        Add to Cart
      </Button>
    </div>
  );
}
