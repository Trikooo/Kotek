import { Product } from "@/utils/formDataUtils";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { Option } from "@/components/ui/better-select";
import { createProduct } from "@/services/productService";
import { toast } from "sonner";
import { ProductStatus } from "@prisma/client";

export function useCreateProduct() {
  const defaultProduct: Partial<Product> = {
    name: "",
    description: "",
    price: "",
    images: [],
    stock: "",
    barcode: "",
    categoryId: null,
    tags: "",
    keyFeatures: [],
    brand: "",
    status: "ACTIVE",
    length: "",
    width: "",
    height: "",
    weight: "",
  };
  const [newProduct, setNewProduct] =
    useState<Partial<Product>>(defaultProduct);
  let defaultStatus: Option = {
    value: newProduct.status ? newProduct.status : "",
    label: newProduct.status ? newProduct.status : "",
  };

  const [createIsLoading, setCreateIsLoading] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<Option[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<Option[]>(
    defaultStatus.value ? [defaultStatus] : []
  );

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files: FileList | null = e.target.files;
    if (files && files.length > 0) {
      const imageFiles: File[] = Array.from(files);

      setNewProduct((prevProduct) => ({
        ...prevProduct,
        images: imageFiles,
      }));
    }
  };
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setCreateIsLoading(true);
    console.log(newProduct);
    try {
      await createProduct(newProduct);
      toast.success("Product created successfully!");
      setNewProduct(defaultProduct);
      setSelectedCategory([]);
    } catch (error) {
      console.error("Failed to create Product: ", error);
      toast.error("Failed to create Product");
    } finally {
      setCreateIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedCategory[0]) {
      setNewProduct((prevCategory) => ({
        ...prevCategory,
        categoryId: selectedCategory[0].value,
      }));
    }
    if (selectedStatus[0].value !== defaultStatus.value) {
      setNewProduct((prevCategory) => ({
        ...prevCategory,
        status: selectedStatus[0].value as ProductStatus,
      }));
    }
  }, [selectedCategory, selectedStatus]);

  return {
    newProduct,
    selectedCategory,
    setSelectedCategory,
    selectedStatus,
    setSelectedStatus,
    createIsLoading,
    handleInputChange,
    handleFileChange,
    handleSubmit,
  };
}
