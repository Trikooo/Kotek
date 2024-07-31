import CarouselDemo from "@/components/dynamic-ui/Carousel";

const images = [
  "/carousel/image.png",
  "/carousel/image1.png",
  "/carousel/image2.png",
];

export default function Hero() {
  return (
    <div className="pt-[72px] lg:pt-20 overflow-hidden">
      <CarouselDemo images={images} />
    </div>
  );
}
