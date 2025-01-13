import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`/api/categories/${id}`);
    },
    onSuccess: () => {
      // Invalidate both queries to trigger a refresh
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["categoryNames"] });
      toast.success("Category deleted successfully.");
    },
    onError: (error) => {
      console.error("Failed to delete category: ", error);
      toast.error("Failed to delete category.");
    },
  });
}
