import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import Image from "next/image";

// Export the variables
export const cartItems = [
  {
    id: 1,
    image: "/placeholder.svg",
    name: "Intel Core i5 14600k",
    quantity: 2,
    price: 79.99,
  },
  {
    id: 2,
    image: "/placeholder.svg",
    name: "Intel Core i5 14600k",
    quantity: 1,
    price: 49.99,
  },
  {
    id: 3,
    image: "/placeholder.svg",
    name: "Intel Core i5 14600k",
    quantity: 3,
    price: 12.99,
  },
];

export const subtotal = cartItems.reduce(
  (total, item) => total + item.price * item.quantity,
  0
);
export const discounts = 10;
export const fees = 5;
export const total = subtotal - discounts + fees;

export default function Component() {
  return (
    <div className="py-12">
      <div className="grid gap-8">
        <div className="grid gap-6">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="grid grid-cols-[80px_1fr_auto] items-center gap-4"
            >
              <Image
                src="/products/image.png"
                alt={item.name}
                width={80}
                height={80}
                className="rounded-md object-cover"
                style={{ aspectRatio: "80/80", objectFit: "cover" }}
              />
              <div className="grid gap-1">
                <h3 className="font-medium">{item.name}</h3>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Select defaultValue={item.quantity.toString()}>
                    <SelectTrigger className="w-20">
                      <SelectValue placeholder={item.quantity.toString()} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1</SelectItem>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="3">3</SelectItem>
                      <SelectItem value="4">4</SelectItem>
                      <SelectItem value="5">5</SelectItem>
                    </SelectContent>
                  </Select>
                  <Separator orientation="vertical" className="h-4" />
                  <span>Price: ${item.price.toFixed(2)}</span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="h-5 w-5" />
                <span className="sr-only">Remove {item.name}</span>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
