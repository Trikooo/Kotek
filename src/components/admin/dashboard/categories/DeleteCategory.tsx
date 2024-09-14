import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { TrashIcon, Loader2, Trash2Icon } from "lucide-react"; // Import a loading icon
import axios from "axios";
import { toast } from "sonner";
import { useState } from "react";
import { useCategoryContext } from "@/context/CategoriesContext";

interface DeleteCategoryProps {
  id: string;
}

export function DeleteCategory({ id }: DeleteCategoryProps) {
  const [isLoading, setIsLoading] = useState(false); // Add loading state
  const { refetch } = useCategoryContext();
  const handleDelete = async () => {
    setIsLoading(true); // Set loading state to true before starting request
    try {
      await axios.delete(`/api/categories/${id}`);
      refetch();
      toast.success("Category deleted successfully.");
    } catch (error) {
      console.error("Failed to delete category: ", error);
      toast.error("Failed to delete category.");
    } finally {
      setIsLoading(false); // Reset loading state after request is complete
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger className="p-2 hover:bg-accent rounded-md">
        {isLoading ? (
          <Loader2 className="w-5 h-5 animate-spin" strokeWidth={1.5} />
        ) : (
          <Trash2Icon className="w-5 h-5" strokeWidth={1.5} />
        )}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            The category is going to be permanently deleted. This action cannot
            be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={isLoading}>
            {/* Disable action button when loading */}
            {isLoading ? "Deleting..." : "Continue"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
