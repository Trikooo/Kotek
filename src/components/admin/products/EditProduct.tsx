import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import Select, { Option } from "@/components/ui/better-select";
import { Switch } from "@/components/ui/switch";
import ImageUploader from "./ImageUploader";
import { PenBox, RotateCcw, Plus } from "lucide-react";
import { Category, Product } from "@prisma/client";
import { useForm } from "react-hook-form";
import { ProductFormValues, productSchema } from "./productSchema";
import { zodResolver } from "@hookform/resolvers/zod";

import { STATUS_OPTIONS } from "@/lib/constants";
import { $Enums } from "@prisma/client";
import { useEffect, useState } from "react";
import generateCode128 from "@/utils/code128DataGenerator";
import { useEditProduct } from "@/hooks/products/useEditProduct";
import useGetAllCategoryNames from "@/hooks/categories/useGetAllCategoryNames";

interface EditProductProps {
  product: Product;
  onUpdateProduct: (updatedProduct: Product & { category: Category }) => void;
}

export default function EditProduct({
  product,
  onUpdateProduct,
}: EditProductProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const {
    data: categoryNames,
    isLoading: categoriesLoading,
    error,
  } = useGetAllCategoryNames();
  const { isLoading, updateProduct } = useEditProduct();
  const [selectedCategory, setSelectedCategory] = useState<Option[]>(
    product.categoryId
      ? [{ label: product.categoryId, value: product.categoryId }]
      : []
  );
  const [selectedStatus, setSelectedStatus] = useState<Option[]>([
    {
      label: product.status || "ACTIVE",
      value: product.status || "ACTIVE",
    },
  ]);

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

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product.name || "",
      featured: product.featured || false,
      description: product.description || "",
      price: product.price.toString() || "",
      images: product.imageUrls || [],
      stock: product.stock.toString() || "",
      barcode: product.barcode || "",
      categoryId: product.categoryId || "",
      tags: product.tags.join(", ") || "",
      keyFeatures: product.keyFeatures.join(",\n") || "",
      brand: product.brand || "",
      status:
        (product.status as $Enums.ProductStatus) || $Enums.ProductStatus.ACTIVE,
      length: product.length,
      width: product.width,
      height: product.height,
      weight: product.weight,
    },
  });
  useEffect(() => {
    setSelectedCategory(
      categoryOptions.filter((o) => o.value === product.categoryId)
    );
  }, [categoryOptions, product]);
  const handleGenerateBarcode = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const generatedBarcode = generateCode128();
    form.setValue("barcode", generatedBarcode);
  };

  const onSubmit = async (data: ProductFormValues) => {
    const imageUrls = data.images.filter((image) => typeof image === "string");
    // const images = data.images.filter((image) => image instanceof File);
    const images = data.images;
    const imagesToDelete = product.imageUrls.filter(
      (image) => !imageUrls.includes(image)
    );

    const updatedProduct = await updateProduct(
      {
        ...data,
        images: images,
        imageUrls: imageUrls,
        imagesToDelete: imagesToDelete,
      },
      product.id
    );
    setIsOpen(false);
    onUpdateProduct(updatedProduct);
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => setIsOpen(!isOpen)}>
      <DialogTrigger>
        <Button variant="ghost">
          <PenBox className="w-5 h-5" strokeWidth={1.5} />
        </Button>
      </DialogTrigger>
      <DialogContent className="w-screen h-screen max-w-none">
        <div className="h-full overflow-y-auto p-6">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>
          <div className="w-full pt-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6 pb-16"
              >
                <div className="grid md:grid-cols-3 gap-6">
                  {/* Basic Product Information */}
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Product Name *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter product name"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="brand"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Brand *</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter brand name" {...field} />
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
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Provide a detailed product description"
                              className="min-h-[120px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="keyFeatures"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Key Features *</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="List key features, separated by commas"
                              className="min-h-[100px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="featured"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm flex-1 ">
                          <div className="space-y-0.5">
                            <FormLabel>Featured Product</FormLabel>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Product Details and Management */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Price *</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="00 DA"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="stock"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Stock *</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="Quantity"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="categoryId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category *</FormLabel>
                          <FormControl>
                            <div>
                              <Select
                                options={categoryOptions}
                                selectedOptions={selectedCategory}
                                setSelectedOptions={setSelectedCategory}
                                loading={categoriesLoading}
                                error={error}
                                label="category"
                                onChange={(_, current) => {
                                  if (current[0]?.value) {
                                    field.onChange(current[0].value);
                                  } else {
                                    field.onChange("");
                                  }
                                }}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="barcode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Barcode *</FormLabel>
                          <div className="flex gap-3">
                            <FormControl>
                              <Input {...field} value={field.value || ""} />
                            </FormControl>
                            <Button
                              type="button"
                              variant="outline"
                              onClick={handleGenerateBarcode}
                            >
                              {field.value ? (
                                <RotateCcw
                                  className="w-4 h-4"
                                  strokeWidth={1.5}
                                />
                              ) : (
                                <Plus className="w-4 h-4" strokeWidth={1.5} />
                              )}
                            </Button>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 gap-4">
                      <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Status *</FormLabel>
                            <FormControl>
                              <div>
                                <Select
                                  options={STATUS_OPTIONS}
                                  selectedOptions={selectedStatus}
                                  setSelectedOptions={setSelectedStatus}
                                  label="status"
                                  onChange={(_, current) => {
                                    if (current[0]?.value) {
                                      field.onChange(current[0].value);
                                    } else {
                                      field.onChange("");
                                    }
                                  }}
                                  searchable={false}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="length"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Length (cm)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="Length"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(
                                    e.target.value ? Number(e.target.value) : ""
                                  )
                                }
                                value={field.value ?? ""}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="width"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Width (cm)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="Width"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(
                                    e.target.value ? Number(e.target.value) : ""
                                  )
                                }
                                value={field.value ?? ""}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="height"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Height (cm)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="Height"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(
                                    e.target.value ? Number(e.target.value) : ""
                                  )
                                }
                                value={field.value ?? ""}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="weight"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Weight (g)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="Weight"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(
                                    e.target.value ? Number(e.target.value) : ""
                                  )
                                }
                                value={field.value ?? ""}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="tags"
                        render={({ field }) => (
                          <FormItem className="col-span-2">
                            <FormLabel>Tags</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter tags, separated by commas"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  <div>
                    <FormField
                      control={form.control}
                      name="images"
                      render={({ field }) => (
                        <FormItem
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                          }}
                        >
                          <FormLabel>Product Images *</FormLabel>
                          <FormControl>
                            <div>
                              <ImageUploader
                                images={field.value}
                                onImagesChange={(images) => {
                                  field.onChange(images);
                                }}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <DialogFooter className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t">
                  <DialogClose asChild>
                    <Button type="button" variant="outline">
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Updating Product..." : "Update Product"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
