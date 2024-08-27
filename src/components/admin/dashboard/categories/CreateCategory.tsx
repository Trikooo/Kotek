import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ChangeEvent, FormEvent, useState } from "react";
import axios from "axios";
import { toast } from "sonner";

interface Category {
  id: string;
  name: string;
}

interface CreateCategoryProps {
  categories: Category[];
}

export default function CreateCategory({ categories }: CreateCategoryProps) {
  const [newCategory, setNewCategory] = useState<{
    name: string;
    description: string;
    image: File | null;
    parentId: string | null;
    tags: string;
  }>({
    name: "",
    description: "",
    image: null,
    parentId: null,
    tags: "",
  });
  const [isLoading, setIsLoading] = useState(false); // Add loading state

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewCategory((prevCategory) => ({
      ...prevCategory,
      [name]: value,
    }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setNewCategory((prevCategory) => ({
      ...prevCategory,
      image: file,
    }));
  };

  const handleParentCategoryChange = (value: string) => {
    const newParentCategory = value === "none" ? null : value;
    setNewCategory((prevCategory) => ({
      ...prevCategory,
      parentId: newParentCategory,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true); // Start loading

    try {
      const formData = new FormData();
      formData.append("name", newCategory.name);
      formData.append("description", newCategory.description);
      formData.append("parentId", newCategory.parentId || "");
      formData.append("tags", newCategory.tags);

      if (newCategory.image) {
        formData.append("image", newCategory.image);
      }

      // Make the API request to create the category
      await axios.post("/api/categories", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Category created successfully.");

      // Reset form state
      setNewCategory({
        name: "",
        description: "",
        image: null,
        parentId: null,
        tags: "",
      });
    } catch (error) {
      console.error("Failed to create category: ", error);

      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data.message || "Server error, couldn't create category";

        if (errorMessage.includes("Conflict")) {
          toast.error("A category with this name already exists.");
        } else {
          toast.error(errorMessage);
        }
      } else {
        toast.error("An unknown error occurred.");
      }
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Category</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4">
            <div>
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
            <div>
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea
                id="description"
                name="description"
                value={newCategory.description}
                onChange={handleInputChange}
              />
            </div>
            <div>
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
            <div>
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input
                id="tags"
                name="tags"
                type="text"
                value={newCategory.tags}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="parentCategory">Parent Category</Label>
              <Select
                value={
                  newCategory.parentId
                    ? newCategory.parentId.toString()
                    : "none"
                }
                onValueChange={handleParentCategoryChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select parent category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {categories.map((category) => (
                    <SelectItem
                      key={category.id}
                      value={category.id.toString()}
                    >
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="mt-4">
            <Button type="submit" isLoading={isLoading} loadingText="Please wait">
              Create Category
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
