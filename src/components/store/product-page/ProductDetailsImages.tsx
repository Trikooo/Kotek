"use client";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import Image from "next/image";

interface ProductDetailsCardProps {
  thumbnails: string[];
  thumbnailPosition?: 'left' | 'right';
}

export default function ProductDetailsImages({ thumbnails, thumbnailPosition = 'left' }: ProductDetailsCardProps) {
  // State to keep track of the currently selected image
  const [mainImage, setMainImage] = useState(thumbnails[0]);

  // Determine flex direction based on thumbnail position
  const containerDirection = thumbnailPosition === 'left' ? 'md:flex-row-reverse' : 'md:flex-row';

  return (
    <div className={`flex flex-col items-start ${containerDirection} gap-1 w-full`}>
      {/* Main Image */}
      <Card className="p-4 flex-grow">
        <Image src={mainImage} alt="product" height={600} width={600} className="w-full h-auto" />
      </Card>

      {/* Thumbnails */}
      <div className="flex p-1 gap-2 mt-4 md:mt-0 overflow-x-auto md:overflow-y-auto md:flex-col max-w-full md:max-h-[600px]">
        {thumbnails.map((src, index) => (
          <button
            key={index}
            onClick={() => setMainImage(src)}
            className="shrink-0"
          >
            <Card className={`p-2 hover:shadow-md ${src === mainImage ? 'ring-2 ring-indigo-600' : ''}`}>
              <Image
                src={src}
                alt={`Thumbnail ${index + 1}`}
                height={50}
                width={50}
              />
            </Card>
          </button>
        ))}
      </div>
    </div>
  );
}