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
import { Loader2, Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDeleteCategory } from "@/hooks/categories/useDeleteCategory";

interface DeleteCategoryProps {
  id: string;
}

export function DeleteCategory({ id }: DeleteCategoryProps) {
  const { mutate: deleteCategory, isPending } = useDeleteCategory();

  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Button variant="ghost">
          {isPending ? (
            <Loader2 className="w-5 h-5 animate-spin" strokeWidth={1.5} />
          ) : (
            <Trash2Icon className="w-5 h-5 text-red-500" strokeWidth={1.5} />
          )}
        </Button>
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
          <AlertDialogAction
            className="bg-red-600 hover:bg-red-500"
            onClick={() => deleteCategory(id)}
            disabled={isPending}
          >
            {isPending ? "Deleting..." : "Continue"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
