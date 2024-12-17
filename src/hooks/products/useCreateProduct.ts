import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { Option } from "@/components/ui/better-select";
import { sendProduct } from "@/services/productService";
import { toast } from "sonner";
import { ProductStatus } from "@prisma/client";
import { CreateProductT } from "@/types/types";
import generateCode128 from "@/utils/code128DataGenerator";
import { CheckedState } from "@radix-ui/react-checkbox";

export function useCreateProduct() {
  const defaultProduct: Partial<CreateProductT> = {
    name: "",
    featured: false,
    description: "",
    price: "",
    images: [],
    stock: "",
    barcode: "",
    categoryId: null,
    tags: "",
    keyFeatures: "",
    brand: "",
    status: "ACTIVE",
    length: "",
    width: "",
    height: "",
    weight: "",
  };
  const [newProduct, setNewProduct] =
    useState<Partial<CreateProductT>>(defaultProduct);
  let defaultStatus: Option = {
    value: newProduct.status ? newProduct.status : "",
    label: newProduct.status ? newProduct.status : "",
  };

  const [createIsLoading, setCreateIsLoading] = useState<boolean>(false);
  const [barcode, setBarcode] = useState<string | null>(generateCode128());
  const [selectedCategory, setSelectedCategory] = useState<Option[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<Option[]>(
    defaultStatus.value ? [defaultStatus] : []
  );
  const handleCheckedChange = (checked: CheckedState) => {
    setNewProduct((prevProduct) => ({
      ...prevProduct,
      featured: checked === true, // This explicitly converts to boolean
    }));
  };
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  const handleGenerateBarcode = (e: any) => {
    e.preventDefault();
    setBarcode(generateCode128());
    newProduct.barcode = barcode;
  };
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setCreateIsLoading(true);
    try {
      await sendProduct(newProduct);
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
      setNewProduct((prevProduct) => ({
        ...prevProduct,
        categoryId: selectedCategory[0].value,
      }));
    }
    if (selectedStatus[0].value !== defaultStatus.value) {
      setNewProduct((prevProduct) => ({
        ...prevProduct,
        status: selectedStatus[0].value as ProductStatus,
      }));
    }
  }, [selectedCategory, selectedStatus, setNewProduct, defaultStatus.value]);

  const handleFileChange = (newImages: File[]) => {
    setNewProduct((prevProduct: any) => ({
      ...prevProduct,
      images: [...prevProduct.images, ...newImages],
    }));
  };
  const handleRemoveImage = (index: number) => {
    setNewProduct((prevProduct: any) => ({
      ...prevProduct,
      images: prevProduct.images.filter((_: any, i: any) => i !== index),
    }));
  };
  useEffect(() => {
    console.log(newProduct.featured);
  }, [newProduct.featured]);

  return {
    newProduct,
    setNewProduct,
    selectedCategory,
    setSelectedCategory,
    selectedStatus,
    setSelectedStatus,
    createIsLoading,
    handleInputChange,
    handleFileChange,
    handleRemoveImage,
    handleSubmit,
    handleGenerateBarcode,
    handleCheckedChange,
  };
}
