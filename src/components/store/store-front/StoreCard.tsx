import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Image from "next/image";

export default function StoreCard() {
  return (
    <Card>
      <div className="flex gap-4 p-5">
        <Image
          src="/products/image.png"
          height={200}
          width={200}
          alt="product"

        ></Image>
        <div>
          <h3 className="pb-2 text-2xl font-semibold">Intel Core i5 14600k</h3>
          <p>
            this is going to be a place of description, nonetheless, there will
            be more text indeed.
          </p>
        </div>
        <div>
        <h3 className="pb-2 text-2xl font-semibold">78000 DA</h3>

          <Button>
            Add to cart
          </Button>
        </div>
      </div>
    </Card>
  );
}
