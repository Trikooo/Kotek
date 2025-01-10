import React, { useEffect, useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableItem } from "./SortableItem";
import CreateCarouselItem from "./CreateCarouselItem";
import { Button } from "@/components/ui/button";
import {
  useGetAllCarouselItems,
  useUpdateDisplayIndices,
} from "@/hooks/carousel/useCarousel";
import CarouselPageSkeleton from "./CarouselPageSkeleton";
import { CarouselItem } from "@prisma/client";
import { Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function CarouselSettings() {
  const { data: carouselItems, isLoading } = useGetAllCarouselItems();
  const { mutateAsync, isPending } = useUpdateDisplayIndices();
  const [items, setItems] = useState<CarouselItem[]>([]);
  const [changeMade, setChangeMade] = useState(false);

  useEffect(() => {
    if (carouselItems) {
      setItems(carouselItems);
    }
  }, [carouselItems]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  useEffect(() => {
    if (JSON.stringify(items) !== JSON.stringify(carouselItems)) {
      setChangeMade(true);
    } else {
      setChangeMade(false);
    }
  }, [items, carouselItems]);
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setItems((prevItems) => {
        const oldIndex = prevItems.findIndex((item) => item.id === active.id);
        const newIndex = prevItems.findIndex((item) => item.id === over.id);
        return arrayMove(prevItems, oldIndex, newIndex);
      });
    }
  };

  const handleUpdateIndices = async () => {
    try {
      const data = items.map((item, index) => ({
        id: item.id,
        displayIndex: index + 1,
      }));
      await mutateAsync(data);
      toast({
        title: "Updated carousel order successfully",
      });
    } catch (error) {
      console.error("error updating carousel order", error);
      toast({
        title: "An error occurred while updating carousel order",
        variant: "destructive",
      });
      if (carouselItems) setItems(carouselItems);
    }
  };

  if (isLoading) {
    return <CarouselPageSkeleton />;
  }

  return (
    <div className="w-full min-h-screen">
      <div className="w-full px-8 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Carousel Settings</h1>
          <div className="flex justify-between items-center gap-4">
            <CreateCarouselItem />
            <Button
              disabled={!changeMade || isPending}
              onClick={handleUpdateIndices}
            >
              {isPending ? (
                <div className="flex items-center space-x-2">
                  <Loader2 className="animate-spin w-4 h-4" strokeWidth={1.5} />
                  <span>Loading...</span>
                </div>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </div>

        {items.length > 0 ? (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={items}
              strategy={verticalListSortingStrategy}
            >
              <div className="w-full">
                {items.map((item) => (
                  <SortableItem item={item} key={item.id} />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        ) : (
          <div className="w-full h-[calc(100vh-200px)] flex items-center justify-center">
            <p className="text-gray-500 text-xl">
              The carousel doesn&apos;t have any items yet, start by adding a
              new item.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
