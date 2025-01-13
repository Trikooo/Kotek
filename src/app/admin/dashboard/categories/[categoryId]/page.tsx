"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { DataTable } from "@/components/dynamic-ui/DataTable";
import Image from "next/image";
import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useGetCategoryById } from "@/hooks/categories/useGetCategoryById";
import { useParams, useRouter } from "next/navigation";
import EditCategory from "@/components/admin/dashboard/categories/EditCategory";
import { DeleteCategory } from "@/components/admin/dashboard/categories/DeleteCategory";
import { CategoryWithSubcategoriesT } from "@/types/types";
import AdminLayout from "@/app/admin/AdminLayout";
import CreateSubcategory from "@/components/admin/dashboard/categories/CreateSubcategory";
import useGetAllCategoryAncestors from "@/hooks/categories/useGetCategoryAncestors";
import CategoryBreadcrumbs from "./components/AncestorsBreadcrumbs";
import { Skeleton } from "@/components/ui/skeleton";

export default function CategorySubcategories() {
  const router = useRouter();
  const params = useParams();
  const categoryId = params.categoryId as string;

  const { category, refetch, loading, error } = useGetCategoryById(categoryId);
  const { data: categoryAncestors, isLoading: ancestorsLoading } =
    useGetAllCategoryAncestors(categoryId);
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Filter subcategories based on the search term
  const filteredSubcategories =
    category?.subcategories?.filter((subcategory) =>
      subcategory.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  // Define your columns
  const columns = [
    { header: "Image", important: true },
    { header: "Name", important: true },
    { header: "Description" },
    { header: "Actions", important: true },
  ];

  // Define your rows dynamically
  const rows = filteredSubcategories.map((subcategory) => ({
    id: subcategory.id,
    image: (
      <Image
        src={subcategory.imageUrl || "/placeholder/placeholder.svg"}
        alt={subcategory.name}
        width={64}
        height={64}
        className="rounded-md object-cover"
      />
    ),
    name: subcategory.name,
    description: subcategory.description,
    actions: (
      <div className="flex items-center gap-2">
        <Tooltip>
          <TooltipTrigger>
            <EditCategory category={subcategory} onUpdateCategory={refetch} />
          </TooltipTrigger>
          <TooltipContent>Edit</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger>
            <DeleteCategory id={subcategory.id} />
          </TooltipTrigger>
          <TooltipContent>Delete</TooltipContent>
        </Tooltip>
      </div>
    ),
  }));

  return (
    <AdminLayout>
      <div className="w-full">
        <div className="flex justify-between items-center mb-4">
          <CategoryBreadcrumbs
            ancestors={categoryAncestors || []}
            currentCategory={category}
            isLoading={ancestorsLoading || loading}
          />
          <div>
            <CreateSubcategory parentId={category?.id} onCreate={refetch} />
          </div>
        </div>
        <DataTable
          title={
            <SubcategoriesTitle
              category={category}
              setSearchTerm={setSearchTerm}
              isLoading={loading}
            />
          }
          columns={columns}
          rows={rows}
          isLoading={loading}
          error={error}
          onRowClick={(row) =>
            router.push(`/admin/dashboard/categories/${row.id}`)
          }
        />
      </div>
    </AdminLayout>
  );
}

const SubcategoriesTitle = ({
  category,
  setSearchTerm,
  isLoading,
}: {
  category?: CategoryWithSubcategoriesT;
  setSearchTerm: (term: string) => void;
  isLoading: boolean; // Add isLoading prop
}) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        {isLoading ? (
          <Skeleton className="h-6 w-40" /> // Skeleton for loading state
        ) : (
          <>Subcategories for {category?.name || "Unknown"}</>
        )}
      </div>
      <div className="relative flex items-center md:grow-0">
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
