import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import HeroText from "../section1/HeroText";

export default function Section3() {
  return (
    <div className="flex flex-col lg:flex-row items-center justify-between mt-24 ml-10">
      <HeroText />
      <Card className="transition-all duration-100 lg:rounded-r-none">
        <CardContent className="flex aspect-square items-center justify-center  lg:w-full">
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
