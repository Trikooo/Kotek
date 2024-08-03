import { ArrowUpRight } from "lucide-react";
import FeaturedItemCard from "./FeaturedItemCard";
import { Button } from "@/components/ui/button";

export default function FeaturedItems() {
  return (
    <div className="flex flex-col justify-center items-center mt-24">
      <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-6xl">
        Featured Items
      </h1>

      <div className="relative w-full mt-14 px-5">
        <Button
          variant="link"
          className="absolute top-0 right-0 hover:text-indigo-600 duration-0 md:text-lg"
        >
          View all <ArrowUpRight className="h-5 w-5 ml-1" strokeWidth={1.5} />
        </Button>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 py-10 w-full">
          <FeaturedItemCard />
          <FeaturedItemCard />
          <FeaturedItemCard />
          <FeaturedItemCard />
        </div>
      </div>
    </div>
  );
}
