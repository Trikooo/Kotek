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

// Define the prop types for CarouselDemo
interface CarouselDemoProps {
  images: string[]; // Array of image URLs
}

export default function CarouselDemo({ images }: CarouselDemoProps) {
  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true, stopOnMouseEnter: false })
  );

  return (
    <Carousel
      plugins={[plugin.current]}
      className="w-full h-auto lg:h-[650px]" // Set a fixed height for the carousel
      onMouseLeave={plugin.current.reset}
      onClick={plugin.current.stop}
      opts={{
        loop: true,
      }}
      buttonHover={true}

    >
      <CarouselContent>
        {images.map((image, index) => (
          <CarouselItem key={index} className="h-full flex items-center">
            <Image
              src={image}
              alt={`Slide ${index + 1}`}
              className="w-full h-full object-cover"
              width={1400}
              height={650}
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
