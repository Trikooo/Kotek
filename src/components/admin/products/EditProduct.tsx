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
import { useCategoryContext } from "@/context/CategoriesContext";
import { ChevronsUpDown, PenBox, RotateCcw } from "lucide-react";
import { STATUS_OPTIONS } from "@/lib/constants";
import { Product } from "@prisma/client";
import ImageUploader from "./ImageUploader";
import { useEditProduct } from "@/hooks/products/useEditProduct";

interface EditProductProps {
  product: Product;
}

export default function EditProduct({ product }: EditProductProps) {
  const { categoryOptions, error, loading } = useCategoryContext();
  const {
    updatedProduct,
    selectedCategory,
    setSelectedCategory,
    selectedStatus,
    setSelectedStatus,
    updateIsLoading,
    displayedImages,
    handleInputChange,
    handleFileChange,
    handleRemoveImage,
    handleGenerateBarcode,
    handleSubmit,
  } = useEditProduct(product)



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
              images={displayedImages}
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
                setSelectedOptions={setSelectedCategory}
                loading={loading}
                error={error}
              />
            </div>
            <div className="flex-1 grid gap-3">
              <Label htmlFor="status">Status *</Label>
              <Select
                options={STATUS_OPTIONS}
                selectedOptions={selectedStatus}
                setSelectedOptions={setSelectedStatus}
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
              isLoading={updateIsLoading}
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
