"use client";
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
import { ChangeEvent, FormEvent, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";

// Define Category type
interface Category {
  id: number;
  name: string;
}

export default function CreateCategory() {
  // State for categories and the new category
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState<{
    name: string;
    description: string;
    image: File | null; // Can be null initially
    parentId: string | null; // UUID as string or null
    tags: string; // Tags as a comma-separated string
  }>({
    name: "",
    description: "",
    image: null, // Initialize as null
    parentId: null, // Initialize as null
    tags: "", // Initialize as an empty string
  });

  useEffect(() => {
    axios
      .get("/api/categories")
      .then((response) => {
        console.log("Fetched Categories:", response.data); // Log the response data
        console.log("Status Code:", response.status); // Log the status code

        setCategories(response.data);
      })
      .catch((error) => console.error("Failed to fetch categories", error));
  }, []);

  // Handle input change for form fields
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewCategory((prevCategory) => ({
      ...prevCategory,
      [name]: value,
    }));
  };

  // Handle file change
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setNewCategory((prevCategory) => ({
      ...prevCategory,
      image: file,
    }));
  };

  // Handle parent category change
  const handleParentCategoryChange = (value: string) => {
    const newParentCategory = value === "none" ? null : value;
    setNewCategory((prevCategory) => ({
      ...prevCategory,
      parentId: newParentCategory,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("name", newCategory.name);
      formData.append("description", newCategory.description);
      formData.append("parentId", newCategory.parentId || "");
      formData.append("tags", newCategory.tags); // Add tags to form data
      if (newCategory.image) {
        formData.append("image", newCategory.image);
      }
      const response = await axios.post("/api/categories", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Category created successfully.")

      setNewCategory({
        name: "",
        description: "",
        image: null,
        parentId: null,
        tags: "", // Reset tags
      });
    } catch (error) {
      console.error("Failed to create category: ", error);
      toast.error("Couldn't create category")

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
            <Button type="submit">Create Category</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
