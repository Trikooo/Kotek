import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FilePenIcon, Search, TrashIcon } from "lucide-react";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { DataTable } from "@/components/dynamic-ui/DataTable";
import Image from "next/image";
import { useState } from "react";
import EditCategory from "./EditCategory"; // Import the EditCategory component
import { DeleteCategory } from "./DeleteCategory";

interface Category {
  id: string;
  name: string;
  description?: string;
  parentId?: string; // Changed to parentId
  imageUrl: string;
}

interface ExistingCategoriesProps {
  categories: Category[];
  loading: boolean;
  error: string | null;
}

export default function ExistingCategories({ categories, loading, error }: ExistingCategoriesProps) {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [editingCategory, setEditingCategory] = useState<Category | null>(null); // State for editing

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
    image: (
      <Image
        src={category.imageUrl || "/placeholder.svg"}
        alt={category.name}
        width={64}
        height={64}
        className="rounded-md"
        style={{ aspectRatio: "64/64", objectFit: "cover" }}
      />
    ),
    name: category.name,
    description: category.description,
    parent: category.parentId
      ? categories.find((c) => c.id === category.parentId)?.name || "None"
      : "None",
    actions: (
      <div className="flex items-center gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleEdit(category)}
              >
                <FilePenIcon className="h-4 w-4" strokeWidth={1.5} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Edit</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
         <DeleteCategory id={category.id}/>
            </TooltipTrigger>
            <TooltipContent>Delete</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    ),
  }));

  function handleEdit(category: Category) {
    setEditingCategory(category); // Set the category to be edited
  }

  function handleDelete(categoryId: string) {
    console.log("Delete category with id", categoryId);
  }

  return (
    <div>
      {editingCategory ? (
        <EditCategory
          category={editingCategory}
          categories={categories} // Pass the categories for parent selection
          onClose={() => setEditingCategory(null)}
        />
      ) : (
        <DataTable
          title={<CategoriesTitle setSearchTerm={setSearchTerm} />}
          columns={columns}
          rows={rows}
          isLoading={loading}
          error={error}
        />
      )}
    </div>
  );
}

const CategoriesTitle = ({ setSearchTerm }: { setSearchTerm: (term: string) => void }) => {
  return (
    <div className="flex items-center justify-between">
      Existing Categories
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
