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
import { PenBox, Plus } from "lucide-react";
import Image from "next/image";
import { Product } from "@prisma/client";

interface EditProductProps {
  product: Product;
}

export default function EditProduct({ product }: EditProductProps) {
  const { categoryOptions, error, loading } = useCategoryContext();
  const [selectedCategory, setSelectedCategory] = useState<Option[]>([]);
  const [selectedTags, setSelectedTags] = useState<Option[]>([]);
  const [updatedProduct, setUpdatedProduct] = useState({
    name: product.name,
    description: product.description,
    price: product.price,
    image: null as File | null,
    stock: product.stock,
    barcode: product.barcode,
    categoryId: product.categoryId,
    tags: product.tags,
    keyFeatures: product.keyFeatures,
    brand: product.brand,
    status: product.status,
    length: product.length || undefined,
    width: product.width || undefined,
    height: product.height || undefined,
    weight: product.weight || undefined,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(
    product.imageUrls[0]
  );

  useEffect(() => {
    if (product.categoryId) {
      setSelectedCategory([
        {
          value: product.categoryId,
          label:
            categoryOptions.find((opt) => opt.value === product.categoryId)
              ?.label || "",
        },
      ]);
    }
    const tagOptions = product.tags.map((tag) => ({ value: tag, label: tag }));
    setSelectedTags(tagOptions);
  }, [product, categoryOptions]);

  useEffect(() => {
    if (selectedCategory.length > 0) {
      setUpdatedProduct((prevProduct) => ({
        ...prevProduct,
        categoryId: selectedCategory[0].value,
      }));
    } else {
      setUpdatedProduct((prevProduct) => ({
        ...prevProduct,
        categoryId: null,
      }));
    }
  }, [selectedCategory]);

  useEffect(() => {
    const tagValues = selectedTags.map((tag) => tag.value);
    setUpdatedProduct((prevProduct) => ({
      ...prevProduct,
      tags: tagValues,
    }));
  }, [selectedTags]);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setUpdatedProduct((prevProduct) => ({
      ...prevProduct,
      [name]: name === "price" || name === "stock" ? Number(value) : value,
    }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setUpdatedProduct((prevProduct) => ({
      ...prevProduct,
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
      formData.append("name", updatedProduct.name);
      formData.append("description", updatedProduct.description || "");
      formData.append("price", updatedProduct.price.toString());
      formData.append("stock", updatedProduct.stock.toString());
      formData.append("barcode", updatedProduct.barcode || "");
      formData.append("categoryId", updatedProduct.categoryId || "");
      formData.append("tags", updatedProduct.tags.join(","));
      formData.append(
        "keyFeatures",
        JSON.stringify(updatedProduct.keyFeatures)
      );
      formData.append("brand", updatedProduct.brand || "");
      formData.append("status", updatedProduct.status);

      if (updatedProduct.length)
        formData.append("length", updatedProduct.length.toString());
      if (updatedProduct.width)
        formData.append("width", updatedProduct.width.toString());
      if (updatedProduct.height)
        formData.append("height", updatedProduct.height.toString());
      if (updatedProduct.weight)
        formData.append("weight", updatedProduct.weight.toString());

      if (updatedProduct.image) {
        formData.append("image", updatedProduct.image);
      }

      await axios.put(`/api/products/${product.id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Product updated successfully.");

      // Optionally reset state or navigate away
    } catch (error) {
      console.error("Failed to update product: ", error);

      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data.message;

        if (errorMessage.includes("Conflict")) {
          toast.error("A product with this barcode already exists.");
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
      <DialogTrigger>
        <Button variant="ghost">
          <PenBox className="w-5 h-5" strokeWidth={1.5} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
          <DialogDescription>
            Update the details of the selected product.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-6 py-6">
          <div className="grid gap-3">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              name="name"
              type="text"
              value={updatedProduct.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={updatedProduct.description}
              onChange={handleInputChange}
            />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="image">Image *</Label>
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
                alt="Product preview"
                className="object-cover"
                width={50}
                height={50}
              />
            )}
          </div>
          <div className="flex gap-3">
            <div className="flex-1 grid gap-3">
              <Label htmlFor="price">Price *</Label>
              <Input
                id="price"
                name="price"
                type="number"
                value={updatedProduct.price}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="flex-1 grid gap-3">
              <Label htmlFor="stock">Stock *</Label>
              <Input
                id="stock"
                name="stock"
                type="number"
                value={updatedProduct.stock}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex-1 grid gap-3">
              <Label htmlFor="category">Category *</Label>
              <Select
                options={categoryOptions}
                selectedOptions={selectedCategory}
                onChange={setSelectedCategory}
                loading={loading}
                error={error}
                multiple
              />
            </div>
            <div className="flex-1 grid gap-3">
              <Label htmlFor="status">Status *</Label>
              <Input
                id="status"
                name="status"
                type="text"
                value={updatedProduct.status}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          <div className="grid gap-3">
            <Label htmlFor="barcode">Barcode *</Label>
            <Input
              id="barcode"
              name="barcode"
              type="text"
              value={updatedProduct.barcode || ""}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="tags">Tags</Label>
            <Select
              options={categoryOptions.map((category) => ({
                value: category.value,
                label: category.label,
              }))}
              selectedOptions={selectedTags}
              onChange={setSelectedTags}
              loading={loading}
              error={error}
              multiple
            />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="keyFeatures">Key Features</Label>
            <Textarea
              id="keyFeatures"
              name="keyFeatures"
              value={updatedProduct.keyFeatures.join("\n")}
              onChange={(e) =>
                setUpdatedProduct((prev) => ({
                  ...prev,
                  keyFeatures: e.target.value.split("\n"),
                }))
              }
            />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="brand">Brand *</Label>
            <Input
              id="brand"
              name="brand"
              type="text"
              value={updatedProduct.brand || ""}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="dimensions">Dimensions (Optional)</Label>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="grid gap-3">
                <Label htmlFor="length">Length</Label>
                <Input
                  id="length"
                  name="length"
                  type="number"
                  value={updatedProduct.length || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="width">Width</Label>
                <Input
                  id="width"
                  name="width"
                  type="number"
                  value={updatedProduct.width || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="height">Height</Label>
                <Input
                  id="height"
                  name="height"
                  type="number"
                  value={updatedProduct.height || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="weight">Weight</Label>
                <Input
                  id="weight"
                  name="weight"
                  type="number"
                  value={updatedProduct.weight || ""}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Product"}
            </Button>
            <DialogClose asChild>
              <Button type="button">Cancel</Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
