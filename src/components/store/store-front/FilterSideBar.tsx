"use client";
import ErrorComponent from "@/components/error/error";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { useCategoryContext } from "@/context/CategoriesContext";
import { useBrands } from "@/hooks/products/brands/useGetAllBrands";

import { AlertCircle, Loader2 } from "lucide-react";
import { useState } from "react";

const colors = ["Red", "Blue", "Green", "Black"];

export default function FilterSideBar() {
  const { brands, loading: brandsLoading, error: brandsError } = useBrands();
  const [value, setValue] = useState<[number, number]>([0, 100]);
  const [inStock, setInStock] = useState(false);
  const {
    categories,
    loading: categoriesLoading,
    error: categoriesError,
  } = useCategoryContext();

  return (
    <aside className="fixed top-28 left-0 w-60 ml-5 h-full overflow-auto hidden lg:block">
      <h1 className="text-2xl font-semibold pb-7">Filtering</h1>

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger>Price</AccordionTrigger>
          <AccordionContent className="h-auto">
            <Slider
              value={value}
              onValueChange={(value) => setValue(value as [number, number])}
              className="my-4"
            />
            <div className="mt-2">
              Selected range: {value[0]} - {value[1]}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-2">
          <AccordionTrigger>Brand</AccordionTrigger>
          <AccordionContent>
            {brands && brands.length > 0 ? (
              brands.map((brand, index) => (
                <div key={index} className="flex items-center space-x-2 my-2">
                  <Checkbox id={`brand-${index}`} />
                  <label
                    htmlFor={`brand-${index}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {brand}
                  </label>
                </div>
              ))
            ) : brandsLoading ? (
              <div className="w-full h-min flex items-center justify-center">
                <Loader2 className="w-4 h-4 animate-spin" strokeWidth={1.5} />
              </div>
            ) : brandsError ? (
              <div className="w-full h-min flex items-center justify-center">
                <AlertCircle
                  className="w-4 h-4 text-red-500"
                  strokeWidth={1.5}
                />
              </div>
            ) : (
              <div className="w-full h-min flex items-center justify-center">
                <p>No categories available</p>
              </div>
            )}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-3">
          <AccordionTrigger>Categories</AccordionTrigger>
          <AccordionContent>
            {categories && categories.length > 0 ? (
              categories.map((category, index) => (
                <div key={index} className="flex items-center space-x-2 my-2">
                  <Checkbox id={`category-${index}`} />
                  <label
                    htmlFor={`category-${index}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {category.name}
                  </label>
                </div>
              ))
            ) : categoriesLoading ? (
              <div className="w-full h-min flex items-center justify-center">
                <Loader2 className="w-4 h-4 animate-spin" strokeWidth={1.5} />
              </div>
            ) : categoriesError ? (
              <div className="w-full h-min flex items-center justify-center">
                <AlertCircle
                  className="w-4 h-4 text-red-500"
                  strokeWidth={1.5}
                />
              </div>
            ) : (
              <div className="w-full h-min flex items-center justify-center">
                <p>No categories available</p>
              </div>
            )}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-4">
          <AccordionTrigger>Availability</AccordionTrigger>
          <AccordionContent>
            <div className="flex items-center space-x-2 my-2">
              <Checkbox
                id="in-stock"
                checked={inStock}
                onCheckedChange={(checked) => setInStock(checked === true)}
              />
              <label
                htmlFor="in-stock"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Show only items in stock
              </label>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </aside>
  );
}
