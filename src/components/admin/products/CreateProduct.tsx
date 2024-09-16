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
import { Option } from "@/components/ui/better-select";
import { useCategoryContext } from "@/context/CategoriesContext";
import { ChevronsUpDown, Plus, RotateCcw } from "lucide-react";
import { STATUSES } from "@/lib/constants";

import { useCreateProduct } from "@/hooks/products/useCreateProduct";
import ImageUploader from "./ImageUploader";

export default function CreateProduct() {
  const { categoryOptions, error, loading } = useCategoryContext();
  const {
    newProduct,
    setNewProduct,
    selectedCategory,
    setSelectedCategory,
    selectedStatus,
    setSelectedStatus,
    createIsLoading,
    handleInputChange,

    handleSubmit,
    handleGenerateBarcode,
  } = useCreateProduct();

  let statusOptions: Option[] = [];
  for (const status of STATUSES) {
    statusOptions.push({
      value: status.toUpperCase(),
      label: status.toUpperCase(),
    });
  }
  const handleFileChange = (newImages: File[]) => {
    setNewProduct((prevProduct: any) => ({
      ...prevProduct,
      images: newImages,
    }));
  };
  const handleRemoveImage = (index: number) => {
    setNewProduct((prevProduct: any) => ({
      ...prevProduct,
      images: prevProduct.images.filter((_: any , i: any) => i !== index),
    }));
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="w-4 h-4" strokeWidth={1.5} />
          Create New Product
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Product</DialogTitle>
          <DialogDescription>
            Fill out the form below to add a new product.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-6 py-6">
          <div className="grid gap-3">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              name="name"
              type="text"
              value={newProduct.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={newProduct.description}
              onChange={handleInputChange}
            />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="images">Images *</Label>
            <ImageUploader
              images={newProduct.images || []}
              onImagesChange={handleFileChange}
              onRemoveImage={handleRemoveImage}
            />
          </div>
          <div className="flex gap-3">
            <div className=" flex-1 grid gap-3">
              <Label htmlFor="price">Price *</Label>
              <Input
                id="price"
                name="price"
                type="number"
                value={newProduct.price}
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
                value={newProduct.stock}
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
                value={newProduct.barcode || ""}
                onChange={handleInputChange}
                required
                className="flex-1"
              />
              <Button variant="outline" onClick={handleGenerateBarcode}>
                {newProduct.barcode ? (
                  <RotateCcw className="w-4 h-4" strokeWidth={1.5} />
                ) : (
                  <Plus className="w-4 h-4" strokeWidth={1.5} />
                )}
              </Button>
            </div>
          </div>
          <div className="grid gap-3">
            <Label htmlFor="keyFeatures">Key Features (comma-separated)</Label>
            <Textarea
              id="keyFeatures"
              name="keyFeatures"
              value={newProduct.keyFeatures}
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
                value={newProduct.tags} // Display tags as comma-separated string
                onChange={handleInputChange}
              />
            </div>
            <div className="flex-1 grid gap-3">
              <Label htmlFor="brand">Brand</Label>
              <Input
                id="brand"
                name="brand"
                type="text"
                value={newProduct.brand || ""}
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
                  value={newProduct.length || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex-1 grid gap-3">
                <Label htmlFor="width">Width</Label>
                <Input
                  id="width"
                  name="width"
                  type="number"
                  value={newProduct.width || ""}
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
                  value={newProduct.height || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex-1 grid gap-3">
                <Label htmlFor="weight">Weight</Label>
                <Input
                  id="weight"
                  name="weight"
                  type="number"
                  value={newProduct.weight || ""}
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
              isLoading={createIsLoading}
              loadingText="Creating..."
              className="max-sm:flex-1"
            >
              Create Product
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
