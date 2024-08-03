import CarouselDemo from "@/components/dynamic-ui/Carousel";

const images = [
  "/carousel/image.png",
  "/carousel/image1.png",
  "/carousel/image2.png",
];

export default function Hero() {
  return (
    <div className="mt-[72px] lg:mt-20 overflow-hidden mx-5 shadow-sm rounded-lg">
      <CarouselDemo images={images} />
    </div>
  );
}
