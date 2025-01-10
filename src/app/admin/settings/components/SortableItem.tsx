import React, { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { GripVertical, Loader2, X } from "lucide-react";
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
  const [isImageLoading, setIsImageLoading] = useState(true);

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

          <div className="relative h-12 w-12">
            {isImageLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded">
                <div className="flex items-center justify-center w-full h-full">
                  <Loader2 className="w-4 h-4 animate-spin text-primary" />
                </div>
              </div>
            )}
            <Image
              src={item.imageUrl}
              alt={item.title || "slide"}
              className={cn(
                "h-12 w-12 object-cover rounded cursor-pointer",
                isImageLoading && "opacity-0"
              )}
              width={100}
              height={100}
              onClick={handleImageClick}
              onLoad={() => setIsImageLoading(false)}
            />
          </div>

          <span className="flex-1 font-medium">{item.title}</span>

          <span className="flex-1 font-medium">{item.displayIndex}</span>

          <div className="flex gap-2">
            <EditCarouselItem item={item} />
            <DeleteCarouselItem id={item.id} />
          </div>
        </div>
      </Card>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative rounded-md bg-white p-2"
              onClick={(e) => e.stopPropagation()}
            >
              <Button
                size="icon"
                className="absolute top-4 right-4 rounded-full bg-white/20"
                onClick={closeModal}
                variant="ghost"
              >
                <X className="w-4 h-4" strokeWidth={1.5} />
              </Button>
              <div className="relative w-[80vw] h-[80vh]">
                {isImageLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded">
                    <div className="flex items-center justify-center w-full h-full">
                      <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                  </div>
                )}
                <Image
                  src={item.imageUrl}
                  alt={item.title || "expanded image"}
                  className={cn(
                    "w-full h-full object-contain rounded-md",
                    isImageLoading && "opacity-0"
                  )}
                  layout="fill"
                  onLoad={() => setIsImageLoading(false)}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
