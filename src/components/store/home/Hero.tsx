import Background from "./Background";
import HeroText from "./HeroText";
import CarouselDemo from "@/components/dynamic-ui/Carousel";

const images = [ "/carousel/image.png", "/carousel/image1.png", "/carousel/image2.png" ]

export default function Hero() {
  return (
    <div className="relative isolate overflow-hidden py-60 h-screen flex items-center justify-center">
      <Background />
      <div className="ml-10 w-full flex flex-col lg:flex-row gap-x-10 gap-y-16 sm:gap-y-20 lg:gap-x-20">
        <div className="flex-1 flex items-center">
          <HeroText />
        </div>
        <div className="flex-1 flex items-center">
          <CarouselDemo images={images}/>
        </div>
      </div>
    </div>
  );
}
