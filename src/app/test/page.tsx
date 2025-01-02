import AnimatedBestSellerBadge from "@/components/ui/bestseller-badge";
import AnimatedNewBadge from "@/components/ui/new-badge";
import AnimatedPromoBadge from "@/components/ui/promo-badge";

export default function page() {
  return (
    <div className="w-full h-[100vh] flex justify-center items-center gap-4">
      <AnimatedBestSellerBadge />
      <AnimatedNewBadge />
      <AnimatedPromoBadge />
    </div>
  );
}
