import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import {
  useDeleteCarouselItem,
  useGetAllCarouselItems,
} from "@/hooks/carousel/useCarousel";
import { toast } from "@/hooks/use-toast";
import { CarouselItem } from "@prisma/client";

export default function DeleteCarouselItem({ id }: { id: string }) {
  const { mutateAsync, isPending } = useDeleteCarouselItem();
  const { data: carouselItems } = useGetAllCarouselItems();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const handleDeleteCarouselItem = async () => {
    try {
      if (carouselItems) {
        const newDisplayIndices = carouselItems
          .filter((item) => item.id !== id)
          .map((item, index) => ({
            id: item.id,
            displayIndex: index + 1,
          }));
        const dataToSend = { id, items: [...newDisplayIndices] };
        await mutateAsync(dataToSend);
        setIsOpen(false);
        toast({
          title: "Carousel item deleted successfully",
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "An error occurred while deleting carousel item",
      });
    }
  };
  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger>
        <Button variant="ghost" size="icon" onClick={() => setIsOpen(true)}>
          <Trash2 className="h-4 w-4" strokeWidth={1.5} />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Carousel Item</AlertDialogTitle>
        </AlertDialogHeader>
        <p>Are you sure you want to delete this carousel item?</p>
        <AlertDialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDeleteCarouselItem}>
            Delete
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
