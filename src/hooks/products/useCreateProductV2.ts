import { useState } from "react";
import { toast } from "sonner";
import { ProductFormValues } from "@/components/admin/products/productSchema";
import { sendProduct } from "@/services/productService";
import { CreateProductT } from "@/types/types";

export const useCreateProductV2 = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<unknown | null>(null);

  const createProduct = async (data: ProductFormValues) => {
    // Reset error state
    setError(null);

    try {
      // Set loading state
      setIsLoading(true);

      // Call API to create product
      const createdProduct = await sendProduct(data as CreateProductT);

      // Show success toast
      toast.success("Product created successfully", {
        description: `${createdProduct.name} has been added to your inventory.`,
      });

      // Return the created product in case it's needed
      return createdProduct;
    } catch (error) {
      // Handle any errors during product creation
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An unexpected error occurred while creating the product";

      // Set error state
      setError(error);

      // Show error toast
      toast.error("Failed to create product", {
        description: errorMessage,
      });
      console.error(error);
      // Rethrow the error for the component to handle if needed
      throw error;
    } finally {
      // Reset loading state
      setIsLoading(false);
    }
  };

  return {
    createProduct,
    isLoading,
    error,
  };
};
