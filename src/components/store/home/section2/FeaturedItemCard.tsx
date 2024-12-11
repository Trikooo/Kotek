import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/utils/generalUtils";
import { Product } from "@prisma/client";
import Image from "next/image";

interface FeaturedItemCardProps {
  products: Product[];
}

export default function FeaturedItemCard({ products }: FeaturedItemCardProps) {
  return (
    <div className="max-h-[calc(100vh-16rem)] overflow-y-auto">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 md:gap-6">
        {products.map((product) => (
          <div key={product.id}>
            <Card className="transition-all duration-100 hover:shadow-md">
              <CardContent className="flex aspect-square items-center justify-center p-4">
                <Image
                  src={product.imageUrls[0] || "/placeholder.svg"}
                  alt={product.name}
                  className="object-cover"
                  width={200}
                  height={200}
                />
              </CardContent>
            </Card>
            <div className="pt-2 flex justify-between items-center">
              <p className="text-sm truncate">{product.name}</p>
              <p className="text-sm font-semibold leading-6 text-gray-900">
                {formatCurrency(product.price)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
