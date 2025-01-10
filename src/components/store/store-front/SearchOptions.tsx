import { useEffect } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
} from "@/components/ui/select";
import { useProductsContext } from "@/context/ProductsContext";

export default function SearchSort() {
  const { productSearchParams, setProductSearchParams, resetProducts } =
    useProductsContext();

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const sortParam = searchParams.get("sort");

    if (sortParam && sortParam !== productSearchParams.sort) {
      const validSortOptions = [
        "featured",
        "price-asc",
        "price-desc",
        "newest",
      ];
      if (validSortOptions.includes(sortParam)) {
        const newParams = {
          ...productSearchParams,
          sort: sortParam,
          currentPage: 1,
        };
        setProductSearchParams(newParams);
        resetProducts(newParams);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]); // React to searchParams changes

  const handleSortChange = (value: string) => {
    // Create new URLSearchParams object
    const params = new URLSearchParams(searchParams);
    params.set("sort", value);

    // Update URL using Next.js router
    router.push(`${pathname}?${params.toString()}`);

    const newParams = {
      ...productSearchParams,
      sort: value,
      currentPage: 1,
    };
    setProductSearchParams(newParams);
    resetProducts(newParams);
  };

  return (
    <div className="flex gap-2 items-center">
      <span className="font-semibold text-sm">Sort by: </span>
      <Select
        onValueChange={handleSortChange}
        value={productSearchParams.sort || "featured"}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="featured">Featured</SelectItem>
            <SelectItem value="price-asc">Price: Low to High</SelectItem>
            <SelectItem value="price-desc">Price: High to Low</SelectItem>
            <SelectItem value="newest">Newest</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
