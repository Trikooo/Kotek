import { Card } from "@/components/ui/card";
import { CopyPlus, ImagePlus, Plus, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface ImageUploaderProps {
  images: File[]; // Now it's an array of files
  onImagesChange: (newImages: File[]) => void;
  onRemoveImage: (index: number) => void;
}

export default function ImageUploader({
  images,
  onImagesChange,
  onRemoveImage,
}: ImageUploaderProps) {
  // Handle file change and store File objects
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files); // Store file objects directly
      onImagesChange([...images, ...fileArray]);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        {images.map((image, index) => (
          <div key={index} className="relative group">
            <Image
              src={URL.createObjectURL(image)} // Create URL from file object
              alt={`Uploaded image ${index + 1}`}
              className="w-20 h-20 object-cover rounded"
              height={80}
              width={80}
            />
            <button
              type="button"
              className="absolute top-2 right-2 p-1 bg-gray-800 text-white rounded-full opacity-75 group-hover:opacity-100"
              onClick={() => onRemoveImage(index)}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
        <Card className="relative group flex items-center justify-center w-20 h-20 border-dashed">
          <ImagePlus className="w-5 h-5" strokeWidth={1.5}/>
          <input
            type="file"
            accept="image/*"
            className="absolute inset-0 opacity-0 cursor-pointer"
            onChange={handleFileChange}
            multiple
          />
        </Card>
      </div>
    </div>
  );
}
