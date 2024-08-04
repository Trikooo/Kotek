import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";

export default function FeaturedItemCard() {
  return (
    <div>
      <Card
        className="transition-all duration-100 hover:shadow-md"
      >
        <CardContent className="flex aspect-square items-center justify-center">
          <Image
            src="/products/image.png"
            alt="intel cpu"
            className="object-cover"
            width={200}
            height={200}
          />
        </CardContent>
      </Card>
      <div className="pt-2 flex justify-between items-center">
        <p className="text-sm">Intel Core i5 14600k</p>
        <p className="text-sm font-semibold leading-6 text-gray-900">78000DA</p>
      </div>
    </div>
  );
}
