import CarouselDemo from "@/components/dynamic-ui/Carousel";
import { useGetActiveCarouselItems } from "@/hooks/carousel/useCarousel";

export default function Hero() {
  const { data: carouselItems, isLoading } = useGetActiveCarouselItems();

  return <CarouselDemo carouselItems={carouselItems} isLoading={isLoading} />;
}
