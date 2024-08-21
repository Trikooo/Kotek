import CarouselDemo from "@/components/dynamic-ui/Carousel";

const images = [
  "/carousel/image.png",
  "/carousel/image1.png",
  "/carousel/image2.png",
];

export default function Hero() {
  return (
    <div className="overflow-hidden shadow-sm rounded-lg">
      <CarouselDemo images={images} />
    </div>
  );
}
