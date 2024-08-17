"use client";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";

const brands = ["Brand A", "Brand B", "Brand C", "Brand D"];
const colors = ["Red", "Blue", "Green", "Black"];

export default function FilterSideBar() {
  const [value, setValue] = useState<[number, number]>([0, 100]);
  const [inStock, setInStock] = useState(false);

  return (
    <aside className="fixed top-28 left-0 w-60 ml-5  h-full overflow-auto hidden lg:block">
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
            {brands.map((brand, index) => (
              <div key={index} className="flex items-center space-x-2 my-2">
                <Checkbox id={`brand-${index}`} />
                <label
                  htmlFor={`brand-${index}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {brand}
                </label>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>Color</AccordionTrigger>
          <AccordionContent>
            {colors.map((color, index) => (
              <div key={index} className="flex items-center space-x-2 my-2">
                <Checkbox id={`color-${index}`} />
                <label
                  htmlFor={`color-${index}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {color}
                </label>
              </div>
            ))}
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
