import React, { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card } from "@/components/ui/card";

import { GripVertical, X } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import DeleteCarouselItem from "./DeleteCarouselItem";
import EditCarouselItem from "./EditCarouselItem";
import { CarouselItem } from "@prisma/client";
import { Button } from "@/components/ui/button";

interface SortableItemProps {
  item: CarouselItem;
}

export const SortableItem: React.FC<SortableItemProps> = ({ item }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleImageClick = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn("mb-4 w-full", isDragging && "opacity-50")}
    >
      <Card className="p-4 w-full">
        <div className="flex items-center gap-4">
          <div {...attributes} {...listeners}>
            <GripVertical className="h-5 w-5 cursor-grab text-gray-500" />
          </div>

          <Image
            src={item.imageUrl}
            alt={item.title || "slide"}
            className="h-12 w-12 object-cover rounded cursor-pointer"
            width={100}
            height={100}
            onClick={handleImageClick}
          />

          <span className="flex-1 font-medium">{item.title}</span>

          <span className="flex-1 font-medium">{item.displayIndex}</span>

          <div className="flex gap-2">
            <EditCarouselItem item={item} />
            <DeleteCarouselItem id={item.id} />
          </div>
        </div>
      </Card>

      {/* Modal for Expanded Image */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClick={closeModal}
        >
          <div
            className="relative rounded-md"
            onClick={(e) => e.stopPropagation()}
          >
            <Button
              size="icon"
              className="absolute top-2 right-2 rounded-full bg-white/20"
              onClick={closeModal}
              variant="ghost"
            >
              <X className="w-4 h-4" strokeWidth={1.5} />
            </Button>
            <Image
              src={item.imageUrl}
              alt={item.title || "expanded image"}
              className="max-w-full max-h-[80vh] rounded-md"
              width={800}
              height={800}
            />
          </div>
        </div>
      )}
    </div>
  );
};
