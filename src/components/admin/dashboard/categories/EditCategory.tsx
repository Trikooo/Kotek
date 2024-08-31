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
import { Category, useCategoryContext } from "@/context/CategoriesContext";
import Image from "next/image";
import { PenBox, PenBoxIcon, PenIcon, Trash2Icon } from "lucide-react";
import { AlertDialogTrigger } from "@radix-ui/react-alert-dialog";

interface EditCategoryProps {
  category: Category;
}

export default function EditCategory({ category }: EditCategoryProps) {
  const { categoryOptions, error, loading } = useCategoryContext();
  const [selectedParentCategory, setSelectedParentCategory] = useState<
    Option[]
  >([]);
  const [selectedSubCategories, setSelectedSubCategories] = useState<Option[]>(
    []
  );
  const [categoryData, setCategoryData] = useState({
    name: category.name,
    description: category.description,
    image: null as File | null,
    parentId: category.parentId || null,
    tags: category.tags,
    subCategories: category.subCategories,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(category.imageUrl || null);

  useEffect(() => {
    if (category.subCategories) {
      setSelectedSubCategories(
        category.subCategories.map((id) => ({
          value: id,
          label: categoryOptions.find((opt) => opt.value === id)?.label || "",
        }))
      );
    } else {
      setSelectedSubCategories([]);
    }
  }, [category, categoryOptions]);

  useEffect(() => {
    if (selectedParentCategory.length > 0) {
      setCategoryData((prevCategory) => ({
        ...prevCategory,
        parentId: selectedParentCategory[0].value,
      }));
    } else {
      setCategoryData((prevCategory) => ({
        ...prevCategory,
        parentId: null,
      }));
    }
  }, [selectedParentCategory]);

  useEffect(() => {
    const subCategoryIds = selectedSubCategories.map((sub) => sub.value);
    setCategoryData((prevCategory) => ({
      ...prevCategory,
      subCategories: subCategoryIds,
    }));
  }, [selectedSubCategories]);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCategoryData((prevCategory) => ({
      ...prevCategory,
      [name]: value,
    }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setCategoryData((prevCategory) => ({
      ...prevCategory,
      image: file,
    }));
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", categoryData.name);
      formData.append("description", categoryData.description || "");
      formData.append("parentId", categoryData.parentId || "");
      formData.append("tags", categoryData.tags || "");
      formData.append(
        "subCategories",
        JSON.stringify(categoryData.subCategories)
      );

      if (categoryData.image) {
        formData.append("image", categoryData.image);
      }

      await axios.put(`/api/categories/${category.id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Category updated successfully.");

      // Reset state or navigate away
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
      setIsLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger className="p-2 hover:bg-accent rounded-md ">
        <PenBox className="w-5 h-5" strokeWidth={1.5} />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Category</DialogTitle>
          <DialogDescription>
            Update the details of the selected category.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-6">
          <div className="grid gap-3">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              type="text"
              value={categoryData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              name="description"
              value={categoryData.description}
              onChange={handleInputChange}
            />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="image">Image (optional)</Label>

            <Input
              id="image"
              name="image"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
            {previewImage && (
              <Image
                src={previewImage}
                alt="Category preview"
                className="object-cover"
                width={50}
                height={50}
              />
            )}
          </div>
          <div className="grid gap-3">
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input
              id="tags"
              name="tags"
              type="text"
              value={categoryData.tags}
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
            <Label htmlFor="subCategories">Subcategories</Label>
            <Select
              options={categoryOptions}
              selectedOptions={selectedSubCategories}
              onChange={setSelectedSubCategories}
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
            <Button type="submit" isLoading={isLoading} loadingText="Updating">
              Update Category
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
