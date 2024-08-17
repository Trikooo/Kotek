import ProductDetailsCard from "@/components/store/product-page/ProductDetailsCard";
import StoreLayout from "../store/StoreLayout";
import ProductInformation from "@/components/store/product-page/ProductInformation";
import FeaturedItemCard from "@/components/store/home/section2/FeaturedItemCard";

import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ProductPage() {
  return (
    <StoreLayout>
      <div className="flex gap-8 pt-14">
        {/* Set flex-1 to make each component split the width evenly */}
        <div className="flex-1">
          <ProductDetailsCard />
        </div>
        <div className="flex-1">
          <ProductInformation />
        </div>
      </div>

      {/* Key Features Section */}
      <div className="pt-8">
        <h4 className="text-xl font-semibold mb-4">Key Features</h4>
        <ul className="list-disc list-inside space-y-2">
          <li>
            <strong>14-Core Processor:</strong> Includes 6 performance cores and
            8 efficiency cores for a total of 14 cores.
          </li>
          <li>
            <strong>3.5 GHz Base Clock Speed:</strong> Allows for fast
            processing with a base speed of 3.5 GHz.
          </li>
          <li>
            <strong>5.1 GHz Turbo Boost:</strong> Turbo boosts up to 5.1 GHz for
            intensive tasks and gaming.
          </li>
          <li>
            <strong>125W Power Consumption:</strong> Efficient performance with
            a maximum power draw of 125W.
          </li>
          <li>
            <strong>Advanced Cooling Technology:</strong> Keeps the processor
            cool even under heavy workloads.
          </li>
        </ul>
      </div>
      <div className="mt-14">
        <div className="flex flex-col justify-center items-center mt-24">
          <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-6xl">
            Recommended Items
          </h1>

          <div className="relative w-full mt-14 px-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 py-10 w-full">
              <FeaturedItemCard />
              <FeaturedItemCard />
              <FeaturedItemCard />
              <FeaturedItemCard />
            </div>
          </div>
        </div>
      </div>
    </StoreLayout>
  );
}
