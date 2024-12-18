import { useState } from "react";
import { toast } from "sonner";
import { ProductFormValues } from "@/components/admin/products/productSchema";
import { sendProduct, sendUpdateProduct } from "@/services/productService";
import { CreateProductT } from "@/types/types";

export const useEditProduct = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<unknown | null>(null);

  const updateProduct = async (
    data: ProductFormValues & { imageUrls: string[]; imagesToDelete: string[] },
    id: string
  ) => {
    // Reset error state
    setError(null);

    try {
      // Set loading state
      setIsLoading(true);

      // Call API to create product
      const updatedProduct = await sendUpdateProduct(data, id);

      // Show success toast
      toast.success("Product created successfully", {
        description: `${updatedProduct.name} has been added to your inventory.`,
      });

      // Return the created product in case it's needed
      return updatedProduct;
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
    updateProduct,
    isLoading,
    error,
  };
};
