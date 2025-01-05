"use client";

import { useState, useEffect } from "react";
import { X, Filter, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import useGetAllCategoryNames from "@/hooks/categories/useGetAllCategoryNames";
import { useBrands } from "@/hooks/products/brands/useGetAllBrands";
import { useProductsContext } from "@/context/ProductsContext";
import useDebounce from "@/hooks/useDebounce";
import { ProductSearchParams } from "@/types/types";

export default function FilterSideBar() {
  const { brands, loading: brandsLoading, error: brandsError } = useBrands();
  const { hasFiltered, setHasFiltered } = useProductsContext();
  const { productSearchParams, setProductSearchParams, resetProducts } =
    useProductsContext();
  const MIN_PRICE = 300;
  const MAX_PRICE = 200000;

  const [sliderValue, setSliderValue] = useState<[number, number]>([
    MIN_PRICE,
    MAX_PRICE,
  ]);
  const [inputValues, setInputValues] = useState<[string, string]>([
    sliderValue[0].toString(),
    sliderValue[1].toString(),
  ]);
  const [inStock, setInStock] = useState(false);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [brandSearchTerm, setBrandSearchTerm] = useState("");
  const [categorySearchTerm, setCategorySearchTerm] = useState("");

  const {
    categoryNames,
    loading: categoryNamesLoading,
    error: categoryNamesError,
  } = useGetAllCategoryNames();

  const handleInputChange = (index: number, value: string) => {
    const newInputValues = [...inputValues] as [string, string];
    newInputValues[index] = value;
    setInputValues(newInputValues);
  };

  const handleInputConfirm = (index: number) => {
    const value = parseInt(inputValues[index], 10);
    if (!isNaN(value)) {
      setHasFiltered(true);
      const constrainedValue = Math.max(MIN_PRICE, Math.min(MAX_PRICE, value));
      setSliderValue((prev) => {
        const newValues = [...prev] as [number, number];
        newValues[index] = constrainedValue;
        return newValues;
      });
      setInputValues((prev) => {
        const newInputValues = [...prev] as [string, string];
        newInputValues[index] = constrainedValue.toString();
        return newInputValues;
      });
    }
  };

  const handleSliderChange = (value: [number, number]) => {
    setHasFiltered(true);
    setSliderValue(value);
    setInputValues([value[0].toString(), value[1].toString()]);
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter") {
      handleInputConfirm(index);
    }
  };

  const handleBrandChange = (brand: string, checked: boolean) => {
    setHasFiltered(true);
    setSelectedBrands((prev) =>
      checked ? [...prev, brand] : prev.filter((b) => b !== brand)
    );
  };

  const handleCategoryChange = (category: string, checked: boolean) => {
    setHasFiltered(true);
    setSelectedCategories((prev) =>
      checked ? [...prev, category] : prev.filter((c) => c !== category)
    );
  };

  const handleBrandSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBrandSearchTerm(e.target.value);
  };

  const handleCategorySearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCategorySearchTerm(e.target.value);
  };

  const debouncedSearch = useDebounce((newParams: ProductSearchParams) => {
    resetProducts(newParams);
  }, 500);

  useEffect(() => {
    if (hasFiltered) {
      const newParams: ProductSearchParams = {
        ...productSearchParams,
        currentPage: 1,
        minPrice: sliderValue[0],
        maxPrice: sliderValue[1],
        brands: selectedBrands,
        categoryIds: selectedCategories,
        statuses: inStock ? ["ACTIVE"] : ["ACTIVE", "INACTIVE"],
      };
      setProductSearchParams(newParams);
      debouncedSearch(newParams);
    }
  }, [sliderValue, selectedBrands, selectedCategories, inStock, hasFiltered]);

  const clearFilters = () => {
    setSliderValue([MIN_PRICE, MAX_PRICE]);
    setInputValues([MIN_PRICE.toString(), MAX_PRICE.toString()]);
    setSelectedBrands([]);
    setSelectedCategories([]);
    setInStock(false);
    setBrandSearchTerm("");
    setCategorySearchTerm("");
    setHasFiltered(false);
    const newParams: ProductSearchParams = {
      ...productSearchParams,
      currentPage: 1,
      minPrice: MIN_PRICE,
      maxPrice: MAX_PRICE,
      brands: [],
      categoryIds: [],
      statuses: ["ACTIVE", "INACTIVE"],
    };
    setProductSearchParams(newParams);
    resetProducts(newParams);
  };

  const filterContent = (
    <>
      <div
        className={`flex justify-between items-center mb-4 ${
          isOpen ? "pr-6" : ""
        }`}
      >
        <h1 className="text-2xl font-semibold">Filtering</h1>
        <Button variant="outline" size="sm" onClick={clearFilters}>
          Clear Filters
        </Button>
      </div>

      <Accordion type="multiple" className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger>Price</AccordionTrigger>
          <AccordionContent className="h-auto">
            <Slider
              min={MIN_PRICE}
              max={MAX_PRICE}
              step={100}
              value={sliderValue}
              onValueChange={(value) =>
                handleSliderChange(value as [number, number])
              }
              className="my-4"
            />
            <div className="mt-2 flex items-center justify-between mx-2">
              <Input
                type="number"
                value={inputValues[0]}
                onChange={(e) => handleInputChange(0, e.target.value)}
                onBlur={() => handleInputConfirm(0)}
                onKeyDown={(e) => handleKeyDown(0, e)}
                className="w-24"
              />
              <span>-</span>
              <Input
                type="number"
                value={inputValues[1]}
                onChange={(e) => handleInputChange(1, e.target.value)}
                onBlur={() => handleInputConfirm(1)}
                onKeyDown={(e) => handleKeyDown(1, e)}
                className="w-24"
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-2">
          <AccordionTrigger>Brand</AccordionTrigger>
          <AccordionContent className="p-2">
            <Input
              type="text"
              placeholder="Search brands..."
              value={brandSearchTerm}
              onChange={handleBrandSearch}
              className="mb-6"
            />
            {brands && brands.length > 0 ? (
              brands
                .filter((brand) =>
                  brand.toLowerCase().includes(brandSearchTerm.toLowerCase())
                )
                .map((brand, index) => (
                  <div key={index} className="flex items-center space-x-2 my-2">
                    <Checkbox
                      id={`brand-${index}`}
                      checked={selectedBrands.includes(brand)}
                      onCheckedChange={(checked) =>
                        handleBrandChange(brand, checked === true)
                      }
                    />
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
                <p>No brands available</p>
              </div>
            )}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-3">
          <AccordionTrigger>Categories</AccordionTrigger>
          <AccordionContent className="p-2">
            <Input
              type="text"
              placeholder="Search categories..."
              value={categorySearchTerm}
              onChange={handleCategorySearch}
              className="mb-6"
            />
            {categoryNames && categoryNames.length > 0 ? (
              categoryNames
                .filter((category) =>
                  category.name
                    .toLowerCase()
                    .includes(categorySearchTerm.toLowerCase())
                )
                .map((category, index) => (
                  <div key={index} className="flex items-center space-x-2 my-2">
                    <Checkbox
                      id={`category-${index}`}
                      checked={selectedCategories.includes(category.id)}
                      onCheckedChange={(checked) =>
                        handleCategoryChange(category.id, checked === true)
                      }
                    />
                    <label
                      htmlFor={`category-${index}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {category.name}
                    </label>
                  </div>
                ))
            ) : categoryNamesLoading ? (
              <div className="w-full h-min flex items-center justify-center">
                <Loader2 className="w-4 h-4 animate-spin" strokeWidth={1.5} />
              </div>
            ) : categoryNamesError ? (
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
          <AccordionContent className="p-2">
            <div className="flex items-center space-x-2 my-2">
              <Checkbox
                id="in-stock"
                checked={inStock}
                onCheckedChange={(checked) => {
                  setHasFiltered(true);
                  setInStock(checked === true);
                }}
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
    </>
  );

  return (
    <>
      {/* Desktop view */}
      <aside className="sticky top-28 left-0 w-72 max-h-[calc(100vh-7rem)] overflow-y-auto hidden lg:block z-10">
        {filterContent}
      </aside>

      {/* Mobile view */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            size="icon"
            className="fixed bottom-4 left-4 z-50 rounded-full lg:hidden shadow-md"
          >
            <Filter className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="w-[300px] sm:w-[400px] overflow-y-auto"
        >
          <SheetTitle className="hidden"> Filter </SheetTitle>
          {filterContent}
        </SheetContent>
      </Sheet>
    </>
  );
}
