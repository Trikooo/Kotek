"use client";
import { $Enums } from "@prisma/client";
import { useForm } from "react-hook-form";
import { ProductFormValues, productSchema } from "./productSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateProductV2 } from "@/hooks/products/useCreateProductV2";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { SetStateAction, useState } from "react";
import { useCategoryContext } from "@/context/CategoriesContext";
import { STATUS_OPTIONS } from "@/lib/constants";
import { Plus, RotateCcw } from "lucide-react";
import generateCode128 from "@/utils/code128DataGenerator";

export default function CreateProduct() {
  const { createProduct, isLoading } = useCreateProductV2();
  const { categoryOptions, loading, error } = useCategoryContext();
  const [selectedCategory, setSelectedCategory] = useState<Option[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<Option[]>([
    { label: "ACTIVE", value: "ACTIVE" },
  ]);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      featured: false,
      description: "",
      price: "",
      images: [],
      stock: "",
      barcode: "",
      categoryId: "",
      tags: "",
      keyFeatures: "",
      brand: "",
      status: $Enums.ProductStatus.ACTIVE,
      length: null,
      width: null,
      height: null,
      weight: null,
    },
  });

  const handleGenerateBarcode = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const generatedBarcode = generateCode128();
    form.setValue("barcode", generatedBarcode);
  };
  const onSubmit = async (data: ProductFormValues) => {
        await createProduct(data);
    form.reset();
    setSelectedCategory([]);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Create New Product</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                        <Input placeholder="Enter product name" {...field} />
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
                          <Input type="number" placeholder="00 DA" {...field} />
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
                            loading={loading}
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
                            <RotateCcw className="w-4 h-4" strokeWidth={1.5} />
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
                      onMouseDown={(e) => e.preventDefault()} // Prevent focus scrolling
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
                            onRemoveImage={(
                              e: React.MouseEvent<HTMLButtonElement>,
                              index: number
                            ) => {
                              e.preventDefault();
                              const newImages = [...field.value];
                              newImages.splice(index, 1);
                              field.onChange(newImages);
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

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating Product..." : "Create Product"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
