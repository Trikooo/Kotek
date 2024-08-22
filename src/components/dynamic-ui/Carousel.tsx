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

// Define the prop types for CarouselDemo
interface CarouselDemoProps {
  images: string[]; // Array of image URLs
}

export default function CarouselDemo({ images }: CarouselDemoProps) {
  const [isAutoplay, setIsAutoplay] = React.useState(true); // State to manage autoplay
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
      autoplayPlugin.current.stop(); // Stop autoplay
    } else {
      autoplayPlugin.current.play(); // Resume autoplay
    }
  };

  React.useEffect(() => {
    handleAutoPlay();
    console.log(isAutoplay);
  });

  return (
    <Carousel
      plugins={[autoplayPlugin.current]}
      className="w-full" // Keep width at full
      onMouseLeave={autoplayPlugin.current.reset}
      onClick={autoplayPlugin.current.stop}
      opts={{
        loop: true,
      }}
      buttonHover={true}
    >
      <CarouselContent>
        {images.map((image, index) => (
          <CarouselItem key={index} className="w-full">

            <Card className="relative w-full pb-[50%] overflow-hidden">
              {" "}
              {/* Aspect ratio container */}
              <Image
                src={image}
                alt={`Slide ${index + 1}`}
                className="absolute top-0 left-0 w-full h-full object-cover overflow-hidden"
                layout="fill" // Ensures the image covers the container
              />
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
