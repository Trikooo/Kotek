import React, { useCallback, useRef, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
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
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface ImageUploaderProps {
  images: (string | File)[];
  onImagesChange: (images: (string | File)[]) => void;
}

interface ImageItem {
  id: string;
  image: string | File;
  index: number;
}

interface SortableImageProps {
  item: ImageItem;
  onRemove: (e: React.MouseEvent) => void;
}

const SortableImage = React.memo(({ item, onRemove }: SortableImageProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const [imageUrl, setImageUrl] = useState<string>("");

  useEffect(() => {
    let url = "";
    if (item.image instanceof File) {
      url = URL.createObjectURL(item.image);
      setImageUrl(url);
    } else {
      setImageUrl(item.image as string);
    }

    return () => {
      if (url) {
        URL.revokeObjectURL(url);
      }
    };
  }, [item.image]);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative group overflow-hidden ${
        isDragging ? "z-10" : ""
      } w-32 flex-shrink-0 m-2`}
      {...attributes}
      {...listeners}
    >
      <Card
        className={`h-32 p-1 cursor-grab ${
          isDragging ? "cursor-grabbing shadow-lg" : ""
        }`}
      >
        <div className="absolute top-1 left-1 z-10 bg-black/50 text-white rounded-full w-6 h-6 flex items-center justify-center">
          {item.index + 1}
        </div>
        {imageUrl && (
          <Image
            src={imageUrl}
            alt={`Uploaded ${item.index + 1}`}
            className="rounded-md object-contain w-full h-full"
            width={192}
            height={192}
            draggable={false}
          />
        )}
      </Card>
      <Button
        variant="secondary"
        size="icon"
        type="button"
        className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity rounded-full h-6 w-6 bg-black/50 hover:bg-black/70"
        onClick={onRemove}
      >
        <X className="h-3 w-3 text-white" />
      </Button>
    </div>
  );
});
SortableImage.displayName = "SortableImage";

const ImageUploader: React.FC<ImageUploaderProps> = ({
  images,
  onImagesChange,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [items, setItems] = useState<ImageItem[]>([]);

  // Create stable items from images
  React.useEffect(() => {
    const newItems = images.map((image, index) => ({
      id: `image-${index}-${typeof image === "string" ? image : image.name}`,
      image,
      index,
    }));
    setItems(newItems);
  }, [images]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const isDuplicateFile = (file: File): boolean => {
        return images.some((existingImage) => {
          if (existingImage instanceof File) {
            return (
              existingImage.name === file.name &&
              existingImage.size === file.size
            );
          }
          return false;
        });
      };

      const newFiles = acceptedFiles.filter((file) => !isDuplicateFile(file));
      if (newFiles.length > 0) {
        const newImages = [...images, ...newFiles];

        onImagesChange(newImages);
      }
    },
    [images, onImagesChange]
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);

      const newItems = arrayMove(items, oldIndex, newIndex);
      const newImages = newItems.map((item) => item.image);

      onImagesChange(newImages);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    noKeyboard: true,
  });

  const handleDropzoneClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const handleRemoveImage = useCallback(
    (id: string) => (e: React.MouseEvent) => {
      e.stopPropagation();
      const index = items.findIndex((item) => item.id === id);
      const newImages = images.filter((_, i) => i !== index);
      onImagesChange(newImages);
    },
    [items, images, onImagesChange]
  );

  return (
    <div className="space-y-4 w-full" onClick={(e) => e.stopPropagation()}>
      <div
        {...getRootProps()}
        onClick={handleDropzoneClick}
        className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
          isDragActive
            ? "border-primary bg-primary/10"
            : "border-gray-200 hover:border-primary/35 hover:bg-gray-50"
        }`}
      >
        <Input
          {...getInputProps()}
          ref={inputRef}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
            }
          }}
        />
        <div className="flex flex-col items-center justify-center h-24">
          <Upload className="h-6 w-6 text-gray-400 mb-2" />
          <p className="text-sm text-gray-500">
            Drop images or <span className="text-primary">browse</span>
          </p>
        </div>
      </div>
      {items.length > 0 && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={items.map((item) => item.id)}
            strategy={rectSortingStrategy}
          >
            <div className="flex flex-wrap -m-2">
              {items.map((item) => (
                <SortableImage
                  key={item.id}
                  item={item}
                  onRemove={handleRemoveImage(item.id)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
};

export default ImageUploader;
