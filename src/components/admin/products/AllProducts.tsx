"use client";
import { useEffect, useMemo, useState, useRef, useCallback } from "react";
import { DataTable, Column, Row } from "@/components/dynamic-ui/DataTable";
import CreateProduct from "./CreateProduct";
import SortBy from "@/components/ui/sort-by";
import FilterBy from "@/components/ui/filter-by";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import { STATUSES } from "@/lib/constants";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import EditProduct from "./EditProduct";
import { useProductsContext } from "@/context/ProductsContext";
import { DeleteProduct } from "./DeleteProduct";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AllProducts() {
  const { products, loading, error, loadMoreProducts, pagination } =
    useProductsContext();
  const [selectedStatuses, setSelectedStatuses] = useState<Set<string>>(
    new Set()
  );
  const [sortOption, setSortOption] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesStatus =
        selectedStatuses.size === 0 ||
        selectedStatuses.has(product.status.toLowerCase());
      return matchesSearch && matchesStatus;
    });
  }, [products, searchTerm, selectedStatuses]);

  const columns: Column[] = [
    { header: "Image", important: true },
    { header: "Name", important: true },
    { header: "Stock" },
    { header: "Status", badge: true },
    { header: "Actions", important: true },
  ];

  const rows: Row[] = filteredProducts.map((product) => ({
    id: product.id,
    image: (
      <Tooltip>
        <TooltipTrigger>
          <Link
            href={`/admin/products/manage/${product.id}`}
            className="hover:opacity-50"
          >
            <Image
              src={product.imageUrls[0] || "/placeholder/placeholder.svg"}
              alt={product.name}
              width={64}
              height={64}
              className="rounded-md object-cover"
            />
          </Link>
        </TooltipTrigger>
        <TooltipContent>View Details</TooltipContent>
      </Tooltip>
    ),
    name: product.name,
    price: `${product.price}DA`,
    stock: `${product.stock}`,
    status: {
      value: product.status,
      filled: product.status === "ACTIVE" ? true : false,
    },
    actions: (
      <div className="flex-row sm:flex items-center gap-2">
        <Tooltip>
          <TooltipTrigger>
            <EditProduct product={product} />
          </TooltipTrigger>
          <TooltipContent>Edit</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger>
            <DeleteProduct id={product.id} />
          </TooltipTrigger>
          <TooltipContent>Delete</TooltipContent>
        </Tooltip>
      </div>
    ),
  }));

  // Ref for the scrollable container and load more trigger
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreTriggerRef = useRef<HTMLDivElement>(null);

  // Intersection Observer to trigger load more
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (target.isIntersecting && pagination?.hasNextPage && !loading) {
        loadMoreProducts();
      }
    },
    [loadMoreProducts, pagination, loading]
  );

  // Set up Intersection Observer
  useEffect(() => {
    const options: IntersectionObserverInit = {
      root: null, // viewport
      rootMargin: "0px 0px 100px 0px", // 100px from bottom
      threshold: 0, // trigger as soon as any part is visible
    };

    if (loadMoreTriggerRef.current) {
      observerRef.current = new IntersectionObserver(handleObserver, options);
      observerRef.current.observe(loadMoreTriggerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [handleObserver]);

  return (
    <>
      <div className="flex justify-between items-center mb-2">
        <div className="flex space-x-2">
          <FilterBy
            filterOptions={STATUSES}
            selectedStatuses={selectedStatuses}
            setSelectedStatuses={setSelectedStatuses}
          />
          <SortBy sortOption={sortOption} setSortOption={setSortOption} />
        </div>
        <Link href={"/admin/products/manage/create"}>
          <Button className="gap-2">
            <Plus className="w-4 h-4" strokeWidth={1.5} /> Create New Product
          </Button>
        </Link>
      </div>
      <DataTable
        title={<ProductsTitle setSearchTerm={setSearchTerm} />}
        columns={columns}
        rows={rows}
        isLoading={loading}
        error={error}
      />
      {/* Load more trigger at the end of the table */}
      <div ref={loadMoreTriggerRef} style={{ height: "1px" }} />
    </>
  );
}

const ProductsTitle = ({
  setSearchTerm,
}: {
  setSearchTerm: (term: string) => void;
}) => {
  return (
    <div className="flex items-center justify-between">
      <h3 className="flex-1">Existing Products</h3>
      <div className="relative flex items-center flex-1 sm:flex-none">
        <Search
          className="absolute left-2.5 h-4 w-4 text-muted-foreground"
          strokeWidth={1.5}
        />
        <Input
          type="search"
          placeholder="Search..."
          className="w-full rounded-lg bg-background pl-8 font-normal"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
    </div>
  );
};
