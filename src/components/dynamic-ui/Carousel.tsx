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
  const [isAutoplay, setIsAutoplay] = React.useState(true); // State to manage autoplay
  const autoplayPlugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true, stopOnMouseEnter: false })
  );

  const handleKeyPress = (event: KeyboardEvent) => {
    if (event.metaKey && event.key === 'k') {
      event.preventDefault();
      if (isAutoplay) {
        autoplayPlugin.current.stop(); // Stop autoplay
      } else {
        autoplayPlugin.current.play(); // Resume autoplay
      }
      setIsAutoplay(!isAutoplay); // Toggle autoplay state
    }
  };

  React.useEffect(() => {
    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [isAutoplay]);

  return (
    <Carousel
      plugins={[autoplayPlugin.current]}
      className="w-full h-auto lg:h-[650px]" // Set a fixed height for the carousel
      onMouseLeave={autoplayPlugin.current.reset}
      onClick={autoplayPlugin.current.stop}
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
              width={800}
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
