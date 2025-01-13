import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { PenBox } from "lucide-react";
import { CategoryWithSubcategoriesT } from "@/types/types";

import {
  EditCategoryFormData,
  editCategorySchema,
} from "@/validationSchemas/categorySchema";
import { Option } from "@/components/ui/better-select";
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
import { Textarea } from "@/components/ui/textarea";
import Select from "@/components/ui/better-select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useEditCategory } from "@/hooks/categories/useMutateCategory";
import useGetAllCategoryNames from "@/hooks/categories/useGetAllCategoryNames";

interface EditCategoryProps {
  category: CategoryWithSubcategoriesT;
  onUpdateCategory?: () => void;
}

export default function EditCategory({
  category,
  onUpdateCategory,
}: EditCategoryProps) {
  const {
    data: categoryNames,
    isLoading: categoriesLoading,
    error,
  } = useGetAllCategoryNames();
  const [isOpen, setIsOpen] = useState(false);
  const { mutate: editCategory, isPending } = useEditCategory(category.id);
  const [selectedParentCategory, setSelectedParentCategory] = useState<
    Option[]
  >([]);
  const [selectedSubcategories, setSelectedSubcategories] = useState<Option[]>(
    []
  );
  const [previewImage, setPreviewImage] = useState(category.imageUrl || null);
  const [categoryOptions, setCategoryOptions] = useState<Option[]>([]);

  useEffect(() => {
    if (categoryNames) {
      const options = categoryNames.map((category) => ({
        value: category.id,
        label: category.name,
      }));

      setCategoryOptions(options);
    }
  }, [categoryNames]);

  const form = useForm<EditCategoryFormData>({
    resolver: zodResolver(editCategorySchema),
    defaultValues: {
      name: category.name,
      description: category.description || "",
      tags: category.tags.join(","),
    },
  });

  useEffect(() => {
    if (category.subcategories) {
      setSelectedSubcategories(
        category.subcategories.map((subcategory) => ({
          value: subcategory.id,
          label: subcategory.name,
        }))
      );
    }
    if (category.parentId) {
      const parentOption = categoryOptions.find(
        (option) => option.value === category.parentId
      );
      if (parentOption) {
        setSelectedParentCategory([parentOption]);
      }
    }
  }, [category, categoryOptions]);

  const onSubmit = (data: EditCategoryFormData) => {
    editCategory(data, {
      onSuccess: () => {
        setIsOpen(false);
        if (onUpdateCategory) {
          onUpdateCategory();
        }
        form.reset();
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost">
          <PenBox className="w-5 h-5" strokeWidth={1.5} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Category</DialogTitle>
          <DialogDescription>
            Update the details of the selected category.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (optional)</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="image"
              render={({ field: { value, onChange, ...field } }) => (
                <FormItem>
                  <FormLabel>Image (optional)</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          onChange(file);
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setPreviewImage(reader.result as string);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      {...field}
                    />
                  </FormControl>
                  {previewImage && (
                    <Image
                      src={previewImage}
                      alt="Category preview"
                      className="object-cover mt-2"
                      width={50}
                      height={50}
                    />
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags (comma-separated)</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Updating..." : "Update Category"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
