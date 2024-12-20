import React, { useCallback, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

interface ImageUploaderProps {
  images: (string | File)[];
  onImagesChange: (images: (string | File)[]) => void;
  onRemoveImage: (
    e: React.MouseEvent<HTMLButtonElement>,
    index: number
  ) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  images,
  onImagesChange,
  onRemoveImage,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      console.log("acceptedFiles: ", acceptedFiles);
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
        console.log("newFiles: ", newFiles);
        onImagesChange([...images, ...newFiles]);
      }
    },
    [images, onImagesChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
  });

  const handleDropzoneClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  return (
    <div className="space-y-4">
      {/* Add a key here to force remount when images change */}
      <div
        {...getRootProps()}
        onClick={handleDropzoneClick}
        key={images.length}
        className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
          isDragActive
            ? "border-primary bg-primary/10"
            : "border-gray-200 hover:border-primary/35 hover:bg-gray-50"
        }`}
      >
        <Input {...getInputProps()} ref={inputRef} />
        <div className="flex flex-col items-center justify-center h-24">
          <Upload className="h-6 w-6 text-gray-400 mb-2" />
          <p className="text-sm text-gray-500">
            Drop images or <span className="text-primary">browse</span>
          </p>
        </div>
      </div>
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
          {images.map((image, index) => (
            <div key={index} className="relative group aspect-square">
              <Card className="h-full p-1">
                <Image
                  src={
                    image instanceof File ? URL.createObjectURL(image) : image
                  }
                  alt={`Uploaded ${index + 1}`}
                  className="rounded-md object-contain w-full h-full"
                  width={50}
                  height={50}
                />
              </Card>
              <Button
                variant="secondary"
                size="icon"
                className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity rounded-full h-6 w-6 bg-black/50 hover:bg-black/70"
                onClick={(e) => onRemoveImage(e, index)}
              >
                <X className="h-3 w-3 text-white" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
