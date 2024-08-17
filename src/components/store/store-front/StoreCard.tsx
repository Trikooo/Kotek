import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { CircleCheck } from "lucide-react";

export default function StoreCard() {
  return (
    <Card>
      <div className="flex flex-col md:flex-row gap-4 p-5">
        <div className="w-full md:w-[200px] flex justify-center md:justify-start pb-6 md:pb-0">
          <div className="w-[200px] h-[200px] relative">
            <Image
              src="/products/image.png"
              layout="fill"
              objectFit="cover"
              alt="product"
              className="rounded-md"
            />
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-xl md:text-2xl font-semibold pb-2">Intel Core i5 14600k</h3>
          <p className="text-sm md:text-base">
            This is going to be a place of description. Nonetheless, there will
            be more text indeed.
          </p>
        </div>
        <div className="mt-4 md:mt-0 md:ml-auto flex flex-col justify-between w-full md:w-1/4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="text-lg md:text-xl font-semibold">78000 DA</span>
              <span className="text-xs md:text-sm line-through text-muted-foreground">85000 DA</span>
            </div>
            <div className="flex items-center text-green-500">
              <CircleCheck className="mr-1 w-4 h-4" strokeWidth={1.5} />
              <span className="text-sm md:text-base">In stock</span>
            </div>
          </div>
          <div className="flex flex-col gap-2 mt-4">
            <Button
              variant="link"
              className="self-start m-0 p-0 hover:text-indigo-600 duration-150"
            >
              Add to wishlist
            </Button>
            <Button className="w-full bg-indigo-600 hover:bg-indigo-500">
              Add to cart
            </Button>
          </div>
        </div>
      </div>

    </Card>
  );
}