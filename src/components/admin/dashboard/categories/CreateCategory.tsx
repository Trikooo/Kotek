import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Select from "@/components/ui/better-select";
import { Textarea } from "@/components/ui/textarea";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Option } from "@/components/ui/better-select";
import { useCategoryContext } from "@/context/CategoriesContext";
import { Plus } from "lucide-react";

export default function CreateCategory() {
  const { categoryOptions, error, loading, refetch } = useCategoryContext();
  const [selectedParentCategory, setSelectedParentCategory] = useState<
    Option[]
  >([]);
  const [selectedSubcategories, setSelectedSubcategories] = useState<Option[]>(
    []
  );
  const [newCategory, setNewCategory] = useState<{
    name: string;
    description: string;
    image: File | null;
    parentId: string | null;
    tags: string;
    subcategories: string[]; // Changed to an array of IDs
  }>({
    name: "",
    description: "",
    image: null,
    parentId: null,
    tags: "",
    subcategories: [], // Changed to an array of IDs
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Update the parentId in newCategory based on selectedParentCategory
    if (selectedParentCategory.length > 0) {
      setNewCategory((prevCategory) => ({
        ...prevCategory,
        parentId: selectedParentCategory[0].value, // Assuming value is the ID
      }));
    } else {
      setNewCategory((prevCategory) => ({
        ...prevCategory,
        parentId: null,
      }));
    }
  }, [selectedParentCategory]);

  useEffect(() => {
    // Update the subcategories in newCategory based on selectedSubcategories
    const subCategoryIds = selectedSubcategories.map((sub) => sub.value);
    setNewCategory((prevCategory) => ({
      ...prevCategory,
      subcategories: subCategoryIds, // Changed to array of IDs
    }));
  }, [selectedSubcategories]);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewCategory((prevCategory) => ({
      ...prevCategory,
      [name]: value,
    }));
  };
  useEffect(() => {});
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setNewCategory((prevCategory) => ({
      ...prevCategory,
      image: file,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", newCategory.name);
      formData.append("description", newCategory.description);
      formData.append("parentId", newCategory.parentId || "");
      formData.append("tags", newCategory.tags);
      formData.append(
        "subcategories",
        JSON.stringify(newCategory.subcategories)
      ); // Send as JSON string

      if (newCategory.image) {
        formData.append("image", newCategory.image);
      }

      await axios.post("/api/categories", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      // refetch categories
      refetch();
      toast.success("Category created successfully.");

      setNewCategory({
        name: "",
        description: "",
        image: null,
        parentId: null,
        tags: "",
        subcategories: [], // Reset subcategories
      });
      setSelectedParentCategory([]);
      setSelectedSubcategories([]);
    } catch (error) {
      console.error("Failed to create category: ", error);

      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data.message;

        if (errorMessage.includes("Conflict")) {
          toast.error("A category with this name already exists.");
        } else {
          toast.error("Internal server error.");
        }
      } else {
        toast.error("An unknown error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="flex gap-2">
          <Plus className="w-4 h-4" />
          Create New Category
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Category</DialogTitle>
          <DialogDescription>
            Fill out the form below to add a new category.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-6 py-6">
          <div className="grid gap-3">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              type="text"
              value={newCategory.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              name="description"
              value={newCategory.description}
              onChange={handleInputChange}
            />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="image">Image</Label>
            <Input
              id="image"
              name="image"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              required
            />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input
              id="tags"
              name="tags"
              type="text"
              value={newCategory.tags}
              onChange={handleInputChange}
            />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="parentCategory">Parent Category</Label>
            <Select
              options={categoryOptions}
              selectedOptions={selectedParentCategory}
              onChange={setSelectedParentCategory}
              loading={loading}
              error={error}
            />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="subcategories">subcategories</Label>
            <Select
              options={categoryOptions}
              selectedOptions={selectedSubcategories}
              onChange={setSelectedSubcategories}
              multiple
              loading={loading}
              error={error}
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              isLoading={isLoading}
              loadingText="Creating..."
            >
              Create Category
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
