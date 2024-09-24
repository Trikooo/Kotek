import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { Option } from "@/components/ui/better-select";
import { sendProduct } from "@/services/productService";
import { toast } from "sonner";
import { ProductStatus } from "@prisma/client";
import { CreateProductT } from "@/types/types";
import generateCode128 from "@/utils/code128DataGenerator";

export function useCreateProduct() {
  const defaultProduct: Partial<CreateProductT> = {
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
  }, [selectedCategory, selectedStatus, setNewProduct, defaultStatus.value]);

  const handleFileChange = (newImages: File[]) => {
    setNewProduct((prevProduct: any) => ({
      ...prevProduct,
      images: newImages,
    }));
  };
  const handleRemoveImage = (index: number) => {
    setNewProduct((prevProduct: any) => ({
      ...prevProduct,
      images: prevProduct.images.filter((_: any, i: any) => i !== index),
    }));
  };


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
  };
}
