import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import HeroText from "../section1/HeroText";

export default function Section3() {
  return (
    <div className="flex flex-col lg:flex-row items-center justify-between lg:mt-24 lg:ml-10 gap-10">
      <div>
        <HeroText />
      </div>
      <Card className="lg:w-1/2 transition-all duration-100 lg:rounded-r-none mx-5 lg:mx-0">
        <CardContent className="flex aspect-square items-center justify-center">
          <Image
            src="/products/image.png"
            width={600}
            height={600}
            alt="category"
          />
        </CardContent>
      </Card>
    </div>
  );
}
