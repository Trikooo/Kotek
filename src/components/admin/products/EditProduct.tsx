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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
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
import { ChevronsUpDown, PenBox, Plus, RotateCcw } from "lucide-react";
import { STATUSES } from "@/lib/constants";
import { Product } from "@prisma/client";
import ImageUploader from "./ImageUploader";

interface EditProductProps {
  product: Product;
}

export default function EditProduct({ product }: EditProductProps) {
  const { categoryOptions, error, loading } = useCategoryContext();
  const [selectedCategory, setSelectedCategory] = useState<Option[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<Option[]>([]);
  const [updatedProduct, setUpdatedProduct] = useState({
    name: product.name,
    description: product.description,
    price: product.price,
    images: [] as File[],
    stock: product.stock,
    barcode: product.barcode,
    categoryId: product.categoryId,
    tags: product.tags.join(", "),
    keyFeatures: product.keyFeatures.join(", "),
    brand: product.brand,
    status: product.status,
    length: product.length || undefined,
    width: product.width || undefined,
    height: product.height || undefined,
    weight: product.weight || undefined,
  });
  const [isLoading, setIsLoading] = useState(false);

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
    setSelectedStatus([
      {
        value: product.status,
        label: product.status,
      },
    ]);
  }, [product, categoryOptions]);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setUpdatedProduct((prevProduct) => ({
      ...prevProduct,
      [name]: name === "price" || name === "stock" ? Number(value) : value,
    }));
  };

  const handleFileChange = (newImages: File[]) => {
    setUpdatedProduct((prevProduct) => ({
      ...prevProduct,
      images: newImages,
    }));
  };

  const handleRemoveImage = (index: number) => {
    setUpdatedProduct((prevProduct) => ({
      ...prevProduct,
      images: prevProduct.images.filter((_, i) => i !== index),
    }));
  };

  const handleGenerateBarcode = () => {
    // Implement barcode generation logic here
    const generatedBarcode = Math.random().toString(36).substring(7);
    setUpdatedProduct((prevProduct) => ({
      ...prevProduct,
      barcode: generatedBarcode,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData();
      Object.entries(updatedProduct).forEach(([key, value]) => {
        if (key === "images") {
          value.forEach((image: File) => {
            formData.append("images", image);
          });
        } else if (value !== undefined) {
          formData.append(key, value.toString());
        }
      });

      await axios.put(`/api/products/${product.id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Product updated successfully.");
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

  let statusOptions: Option[] = STATUSES.map((status) => ({
    value: status.toUpperCase(),
    label: status.toUpperCase(),
  }));

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
              value={updatedProduct.description as string}
              onChange={handleInputChange}
            />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="images">Images *</Label>
            <ImageUploader
              images={updatedProduct.images}
              onImagesChange={handleFileChange}
              onRemoveImage={handleRemoveImage}
            />
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
              />
            </div>
            <div className="flex-1 grid gap-3">
              <Label htmlFor="status">Status *</Label>
              <Select
                options={statusOptions}
                selectedOptions={selectedStatus}
                onChange={setSelectedStatus}
                searchable={false}
              />
            </div>
          </div>
          <div className="grid gap-3">
            <Label htmlFor="barcode">Barcode *</Label>
            <div className="flex gap-3">
              <Input
                id="barcode"
                name="barcode"
                type="text"
                value={updatedProduct.barcode || ""}
                onChange={handleInputChange}
                required
                className="flex-1"
              />
              <Button variant="outline" onClick={handleGenerateBarcode}>
                <RotateCcw className="w-4 h-4" strokeWidth={1.5} />
              </Button>
            </div>
          </div>
          <div className="grid gap-3">
            <Label htmlFor="keyFeatures">Key Features (comma-separated)</Label>
            <Textarea
              id="keyFeatures"
              name="keyFeatures"
              value={updatedProduct.keyFeatures}
              onChange={handleInputChange}
            />
          </div>
          <OptionalFields>
            <div className="grid gap-3">
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input
                id="tags"
                name="tags"
                type="text"
                value={updatedProduct.tags}
                onChange={handleInputChange}
              />
            </div>
            <div className="flex-1 grid gap-3">
              <Label htmlFor="brand">Brand</Label>
              <Input
                id="brand"
                name="brand"
                type="text"
                value={updatedProduct.brand || ""}
                onChange={handleInputChange}
              />
            </div>
            <div className="flex gap-3">
              <div className="flex-1 grid gap-3">
                <Label htmlFor="length">Length</Label>
                <Input
                  id="length"
                  name="length"
                  type="number"
                  value={updatedProduct.length || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex-1 grid gap-3">
                <Label htmlFor="width">Width</Label>
                <Input
                  id="width"
                  name="width"
                  type="number"
                  value={updatedProduct.width || ""}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-1 grid gap-3">
                <Label htmlFor="height">Height</Label>
                <Input
                  id="height"
                  name="height"
                  type="number"
                  value={updatedProduct.height || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex-1 grid gap-3">
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
          </OptionalFields>
          <DialogFooter className="">
            <DialogClose asChild className="max-sm:flex-1">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              isLoading={isLoading}
              loadingText="Updating..."
              className="max-sm:flex-1"
            >
              Update Product
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

interface OptionalFieldsProps {
  children: React.ReactNode;
}

function OptionalFields({ children }: OptionalFieldsProps) {
  return (
    <Collapsible>
      <CollapsibleTrigger asChild>
        <Button
          variant="secondary"
          size="sm"
          className="flex items-center justify-between space-x-4 w-full mb-6"
        >
          <h4 className="text-sm font-semibold">Show other optional fields</h4>
          <ChevronsUpDown className="h-4 w-4" />
          <span className="sr-only">Toggle</span>
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="grid gap-y-6">
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
}
