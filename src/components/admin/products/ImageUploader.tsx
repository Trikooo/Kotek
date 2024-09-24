import React from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ImagePlus, X } from "lucide-react";
import Image from "next/image";

interface ImageUploaderProps {
  images: (File | string)[];
  onImagesChange: (newImages: File[]) => void;
  onRemoveImage: (index: number) => void;
}

export default function ImageUploader({
  images,
  onImagesChange,
  onRemoveImage,
}: ImageUploaderProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files);
      const newFiles = fileArray.filter((file) => {
        return !images.some(
          (image) => image instanceof File && image.name === file.name
        );
      });
      console.log(images);
      if (newFiles.length > 0) {
        onImagesChange(newFiles);
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
        {images.map((image, index) => (
          <div
            key={index}
            className="relative group w-20 rounded overflow-hidden"
          >
            <Image
              src={image instanceof File ? URL.createObjectURL(image) : image}
              alt={`Uploaded image ${index + 1}`}
              className="w-20 h-20 object-cover group-hover:opacity-80 duration-100"
              height={80}
              width={80}
            />
            <Button
              type="button"
              variant="outline"
              className="absolute top-2 right-1 p-1 h-min rounded-full"
              onClick={() => onRemoveImage(index)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ))}
        <Card className="relative group flex items-center justify-center w-20 h-20 border-dashed focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
          <ImagePlus className="w-5 h-5" strokeWidth={1.5} />
          <div className="absolute inset-0 pointer-events-none" />
          <Input
            type="file"
            accept="image/*"
            className="absolute inset-0 cursor-pointer opacity-0 w-full h-full"
            onChange={handleFileChange}
            multiple
          />
        </Card>
      </div>
    </div>
  );
}