import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { DataTable } from "@/components/dynamic-ui/DataTable";
import Image from "next/image";
import { useState } from "react";
import { DeleteCategory } from "./DeleteCategory";
import SortBy from "@/components/ui/sort-by";
import CreateCategory from "./CreateCategory";
import EditCategory from "./EditCategory";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useGetAllCategories } from "@/hooks/categories/useGetAllCategories";
import { useRouter } from "next/navigation";

export default function ExistingCategories() {
  // Mark it as true to get only parent categories...
  const { categories = [], loading, error } = useGetAllCategories(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortOption, setSortOption] = useState<string>("");
  const router = useRouter();

  // Filter categories based on the search term
  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Define your columns
  const columns = [
    { header: "Image", important: true },
    { header: "Name", important: true },
    { header: "Parent" },
    { header: "Actions", important: true },
  ];

  // Define your rows dynamically
  const rows = filteredCategories.map((category) => ({
    id: category.id,
    image: (
      <Image
        src={category.imageUrl || "/placeholder/placeholder.svg"}
        alt={category.name}
        width={64}
        height={64}
        className="rounded-md object-cover"
      />
    ),
    name: category.name,
    description: category.description,
    parent: category.parentId
      ? categories.find((c) => c.id === category.parentId)?.name || "None"
      : "None",
    actions: (
      <div className="flex items-center gap-2">
        <Tooltip>
          <TooltipTrigger>
            <EditCategory category={category} />
          </TooltipTrigger>
          <TooltipContent>Edit</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger>
            <DeleteCategory id={category.id} />
          </TooltipTrigger>
          <TooltipContent>Delete</TooltipContent>
        </Tooltip>
      </div>
    ),
  }));

  return (
    <>
      <div className="flex justify-between items-center mb-2">
        <div className="flex space-x-2">
          <SortBy sortOption={sortOption} setSortOption={setSortOption} />
        </div>
        <div>
          <CreateCategory />
        </div>
      </div>
      <DataTable
        title={<CategoriesTitle setSearchTerm={setSearchTerm} />}
        columns={columns}
        rows={rows}
        isLoading={loading}
        error={error}
        onRowClick={(category) => {
          router.push(`/admin/dashboard/categories/${category.id}`);
        }}
      />
    </>
  );
}

const CategoriesTitle = ({
  setSearchTerm,
}: {
  setSearchTerm: (term: string) => void;
}) => {
  return (
    <div className="flex items-center justify-between">
      Top Level Categories
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
