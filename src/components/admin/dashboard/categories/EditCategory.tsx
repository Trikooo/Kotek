import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChangeEvent, FormEvent, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import Image from "next/image";

interface Category {
  id: string;
  name: string;
  description?: string;
  imageUrl: string;
  parentId?: string;
}

interface EditCategoryProps {
  category: Category;
  categories: Category[]; // List of all categories for parent selection
  onClose: () => void;
}

export default function EditCategory({ category, categories, onClose }: EditCategoryProps) {
  const [name, setName] = useState(category.name);
  const [description, setDescription] = useState(category.description || "");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(category.imageUrl);
  const [tags, setTags] = useState(""); // Initialize tags if needed
  const [parentId, setParentId] = useState<string | null>(category.parentId || null);
  const [isLoading, setIsLoading] = useState(false); // Add loading state

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImage(file);
    setPreview(file ? URL.createObjectURL(file) : category.imageUrl);
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true); // Start loading

    try {
      const formData = new FormData();
      formData.append("id", category.id);
      formData.append("name", name);
      formData.append("description", description);
      formData.append("tags", tags); // Add tags if needed
      formData.append("parentId", parentId || ""); // Add parentId

      if (image) {
        formData.append("image", image);
      }

      // Make the API request to update the category
      await axios.put(`/api/categories/${category.id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Category updated successfully.");
      onClose(); // Close the editor after saving
    } catch (error) {
      console.error("Failed to update category: ", error);

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
      setIsLoading(false); // Stop loading
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Category</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSave}>
          <div className="grid gap-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea
                id="description"
                name="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
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
              />
              {preview && (
                <Image
                  src={preview}
                  alt="Image preview"
                  width={50}
                  height={50}
                  className="mt-2"
                />
              )}
            </div>
            <div>
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input
                id="tags"
                name="tags"
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="parentCategory">Parent Category</Label>
              <Select
                value={parentId || "none"}
                onValueChange={(value) => setParentId(value === "none" ? null : value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select parent category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="mt-4 flex gap-4">
            <Button type="submit" isLoading={isLoading} loadingText="Please wait">
              Save Changes
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}