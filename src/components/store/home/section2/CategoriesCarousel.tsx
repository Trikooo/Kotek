"use client";
import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import { useHeaderContext } from "@/context/HeaderContext";
import { useCategoryContext } from "@/context/CategoriesContext";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

const CategorySkeleton = () => (
  <CarouselItem className="basis-2/3 md:basis-1/3 lg:basis-1/4 py-1">
    <Card className="transition-all duration-100 overflow-hidden">
      <CardContent className="p-0">
        <div className="relative w-full aspect-square">
          <Skeleton className="w-full h-full" />
          <div className="absolute bottom-0 left-0 right-0 bg-indigo-600/70 p-4"></div>
        </div>
      </CardContent>
    </Card>
  </CarouselItem>
);

export default function CategoriesCarousel() {
  const { categories, loading, error } = useCategoryContext();
  const [isAutoplay, setIsAutoplay] = React.useState(true);
  const [isMobile, setIsMobile] = React.useState(false);
  const { searchFieldVisible } = useHeaderContext();
  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true, stopOnMouseEnter: false })
  );

  const handleAutoPlay = () => {
    if (searchFieldVisible) {
      setIsAutoplay(true);
    } else {
      setIsAutoplay(false);
    }
    if (isAutoplay) {
      plugin.current.stop();
    } else {
      plugin.current.play();
    }
  };

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  React.useEffect(() => {
    handleAutoPlay();
  });

  if (error) {
    return <div>Error loading categories</div>;
  }

  return (
    <Carousel
      plugins={[plugin.current]}
      onMouseLeave={plugin.current.reset}
      onClick={plugin.current.stop}
      opts={{
        align: "start",
        loop: true,
      }}
      buttonPosition={1}
      buttonHover={false}
      hideButtons={isMobile}
    >
      <CarouselContent>
        {loading
          ? Array.from({ length: 5 }).map((_, index) => (
              <CategorySkeleton key={`skeleton-${index}`} />
            ))
          : categories.map((category) => (
              <CarouselItem
                key={category.id}
                className="basis-2/3 md:basis-1/3 lg:basis-1/5 py-1"
              >
                <Link href={`/store?categoryId=${category.id}`}>
                  <Card className="transition-all duration-100 hover:shadow-md overflow-hidden bg-card">
                    <CardContent className="p-0">
                      <div className="relative w-full aspect-square">
                        <Image
                          src={category.imageUrl}
                          fill
                          alt={category.name}
                          className="object-contain hover:scale-105 transition-all duration-300"
                          sizes="(max-width: 768px) 66vw, (max-width: 1024px) 33vw, 25vw"
                          loading="lazy"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-indigo-600/70 p-2">
                          <p className="font-medium text-sm text-center text-white">
                            {category.name}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </CarouselItem>
            ))}
      </CarouselContent>
    </Carousel>
  );
}
