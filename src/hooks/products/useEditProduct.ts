import { Product, ProductStatus } from "@prisma/client";
import { FormEvent, useEffect, useState } from "react";
import { Option } from "@/components/ui/better-select";
import { useCategoryContext } from "@/context/CategoriesContext";
import generateCode128 from "@/utils/code128DataGenerator";
import axios from "axios";
import { toast } from "sonner";
import { sendUpdateProduct } from "@/services/productService";

export function useEditProduct(product: Product) {
  const { categoryOptions } = useCategoryContext();
  const [updatedProduct, setUpdatedProduct] = useState({
    name: product.name,
    description: product.description,
    price: product.price,
    newImages: [] as File[],
    imageUrls: product.imageUrls || [],
    stock: product.stock,
    barcode: product.barcode,
    categoryId: product.categoryId,
    tags: product.tags?.join(", "),
    keyFeatures: product.keyFeatures?.join(", "),
    brand: product.brand,
    status: product.status,
    length: product.length || undefined,
    width: product.width || undefined,
    height: product.height || undefined,
    weight: product.weight || undefined,
  });
  const [barcode, setBarcode] = useState(generateCode128());
  const [selectedCategory, setSelectedCategory] = useState<Option[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<Option[]>([]);
  const [updateIsLoading, setUpdateIsLoading] = useState(false);
  const [displayedImages, setDisplayedImages] = useState([
    ...updatedProduct.imageUrls,
    ...updatedProduct.newImages,
  ]);
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
    if (product.status) {
      setSelectedStatus([
        {
          value: product.status,
          label: product.status,
        },
      ]);
    }
  }, [product, categoryOptions]);
  useEffect(() => {
    if (selectedCategory[0]) {
      setUpdatedProduct((prevProduct) => ({
        ...prevProduct,
        categoryId: selectedCategory[0].value,
      }));
    }
    if (selectedStatus[0]?.value !== product.status) {
      setUpdatedProduct((prevProduct) => ({
        ...prevProduct,
        status: selectedStatus[0]?.value as ProductStatus,
      }));
    }
  }, [selectedCategory, selectedStatus, setUpdatedProduct, product.status]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setUpdatedProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  const handleFileChange = (newImages: File[]) => {
    setUpdatedProduct((prevProduct) => {
      return {
        ...prevProduct,
        newImages: [...prevProduct.newImages, ...newImages],
      };
    });
  };

  useEffect(() => {
    setDisplayedImages([
      ...updatedProduct.imageUrls,
      ...updatedProduct.newImages,
    ]);
  }, [updatedProduct.newImages, updatedProduct.imageUrls]);

  const handleRemoveImage = (index: number) => {
    setUpdatedProduct((prevProduct) => {
      if (index < prevProduct.newImages.length) {
        // Remove from newImages
        const newImages = prevProduct.newImages.filter((_, i) => i !== index);
        return { ...prevProduct, newImages };
      } else {
        // Remove from imageUrls
        const adjustedIndex = index - prevProduct.newImages.length;
        const imageUrls = prevProduct.imageUrls.filter(
          (_, i) => i !== adjustedIndex
        );
        return { ...prevProduct, imageUrls };
      }
    });
  };
  const handleGenerateBarcode = (e: any) => {
    e.preventDefault();
    setBarcode(generateCode128());
    updatedProduct.barcode = barcode;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setUpdateIsLoading(true);

    try {
      await sendUpdateProduct(updatedProduct, product.id);
      toast.success("Product updated successfully.");
    } catch (error) {
      console.error("Failed to update product: ", error);

      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data.message;

        if (errorMessage.includes("Conflict")) {
          toast.error("A product with the same unique fields already exists.");
        } else {
          toast.error("Internal server error.");
        }
      } else {
        toast.error("An unknown error occurred.");
      }
    } finally {
      setUpdateIsLoading(false);
    }
  };
  return {
    updatedProduct,
    setUpdatedProduct,
    barcode,
    setBarcode,
    selectedCategory,
    setSelectedCategory,
    selectedStatus,
    setSelectedStatus,
    updateIsLoading,
    setUpdateIsLoading,
    displayedImages,
    handleInputChange,
    handleFileChange,
    handleRemoveImage,
    handleGenerateBarcode,
    handleSubmit,
  };
}
