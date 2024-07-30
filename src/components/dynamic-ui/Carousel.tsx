import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
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
    Autoplay({ delay: 2000, stopOnInteraction: false, stopOnMouseEnter: false})
  );

  return (
    <Carousel
      plugins={[plugin.current]}
      className="w-full h-full" // Ensure full width and height
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
      opts={{
        loop: true,
      }}
    >
      <CarouselContent>
        {images.map((image, index) => (
          <CarouselItem key={index}>
            <div className="w-full h-full">
              <Card className="h-full border-0">
                <CardContent className="flex aspect-square items-center justify-center p-0 h-full overflow-hidden">
                  <Image
                    src={image}
                    alt={`Slide ${index + 1}`}
                    className="w-full h-full rounded-l-md" // Ensure the image covers the full card
                    width={1000}
                    height={1000}
                  />
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
