import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useHeaderContext } from "@/context/HeaderContext";
import { Card } from "../ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CarouselItem as CarouselItemType } from "@prisma/client";
import Link from "next/link";

interface CarouselDemoProps {
  carouselItems: CarouselItemType[] | undefined;
  isLoading: boolean;
}

export default function CarouselDemo({ carouselItems }: CarouselDemoProps) {
  const [isAutoplay, setIsAutoplay] = React.useState(true);
  const { searchFieldVisible } = useHeaderContext();
  const autoplayPlugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true, stopOnMouseEnter: false })
  );

  const handleAutoPlay = () => {
    if (searchFieldVisible) {
      setIsAutoplay(true);
    } else {
      setIsAutoplay(false);
    }
    if (isAutoplay) {
      autoplayPlugin.current.stop();
    } else {
      autoplayPlugin.current.play();
    }
  };

  React.useEffect(() => {
    handleAutoPlay();
  });

  return (
    <Carousel
      plugins={[autoplayPlugin.current]}
      onMouseLeave={autoplayPlugin.current.reset}
      onClick={autoplayPlugin.current.stop}
      opts={{
        loop: true,
      }}
      buttonHover={true}
    >
      <CarouselContent>
        {carouselItems
          ? carouselItems.map((item, index) => (
              <CarouselItem key={index}>
                <Link href={item.link}>
                  <Card className="relative overflow-hidden">
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-min object-contain overflow-hidden hover:scale-105 transition-transform duration-300"
                      width={1080}
                      height={540}
                      priority
                      placeholder="blur"
                      blurDataURL={item.imageUrl}
                    />
                  </Card>
                </Link>
              </CarouselItem>
            ))
          : Array.from({ length: 3 }).map((_, index) => (
              <CarouselItem key={index} className="w-full">
                <Card className="relative w-full pb-[40%] overflow-hidden">
                  <Skeleton className="absolute top-0 left-0 w-full h-full" />
                </Card>
              </CarouselItem>
            ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
