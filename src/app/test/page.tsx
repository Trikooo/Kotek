"use client";
import ImageUploader from "@/components/admin/products/ImageUploader";
import { useEffect, useState } from "react";

export default function Page() {
  // Define the state for images
  const [images, setImages] = useState<(string | File)[]>([]);

  // Define the function to handle image changes
  const onImagesChange = (newImages: (string | File)[]) => {
    setImages(newImages);
  };
  useEffect(() => {
    console.log("currentImages: ", images);
  }, [images]);
  // Define the function to handle image removal
  const onRemoveImage = (
    e: React.MouseEvent<HTMLButtonElement>,
    index: number
  ) => {
    e.preventDefault();
    setImages(images.filter((_, i) => i !== index));
  };

  return (
    <div>
      <ImageUploader
        images={images}
        onImagesChange={onImagesChange}
        onRemoveImage={onRemoveImage}
      />
    </div>
  );
}
