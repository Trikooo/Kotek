"use client";
import { useState, useEffect } from "react";
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

// Define Category type
interface Category {
  id: string;
  name: string;
  description: string;
  parentCategory?: string;
  imageUrl?: string;
}

export default function ExistingCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch categories from the API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories");
        if (!response.ok) throw new Error("Failed to fetch categories");
        const data: Category[] = await response.json();
        setCategories(data);
        setLoading(false);
      } catch (err) {
        setError((err as Error).message);
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

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
        src={category.imageUrl || "/placeholder.svg"} // Use imageUrl from the category data
        alt={category.name}
        width={64}
        height={64}
        className="rounded-md"
        style={{ aspectRatio: "64/64", objectFit: "cover" }}
      />
    ),
    name: category.name,
    description: category.description,
    parent: category.parentCategory
      ? categories.find((c) => c.id === category.parentCategory)?.name || "None"
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
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleDelete(category.id)}
              >
                <TrashIcon className="h-4 w-4" strokeWidth={1.5} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Delete</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    ),
  }));

  return (
    <div>
      {error ? (
        <p>Error: {error}</p>
      ) : (
        <DataTable
          title={<CategoriesTitle setSearchTerm={setSearchTerm} />}
          columns={columns}
          rows={rows}
          isLoading={loading} // Pass the loading state
        />
      )}
    </div>
  );
}

// Function stubs for handling edit and delete
function handleEdit(category: Category) {
  console.log("Edit category", category);
}

function handleDelete(categoryId: string) {
  console.log("Delete category with id", categoryId);
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
