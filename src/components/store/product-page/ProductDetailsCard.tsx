"use client";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import Image from "next/image";

export default function ProductDetailsCard() {
  // State to keep track of the currently selected image
  const [mainImage, setMainImage] = useState("/products/image.png");

  // Array of thumbnail images
  const thumbnails = [
    "/products/image.png",
    "/products/image.png",
    "/products/image.png",
    "/products/image.png",
    "/products/image.png",
    "/products/image.png",
    "/products/image.png",
    "/products/image.png",
    "/products/image.png",
  ];

  return (
    <div className="flex flex-col items-start md:flex-row-reverse gap-4 w-full">
      {/* Main Image */}
      <Card className="p-4">
        <Image src={mainImage} alt="product" height={600} width={600} />
      </Card>

      {/* Thumbnails */}
      <div className="flex gap-2 mt-4 md:mt-0 overflow-x-auto md:overflow-y-auto md:flex-col max-w-full md:max-h-[600px]">
        {thumbnails.map((src, index) => (
          <button
            key={index}
            onClick={() => setMainImage(src)}
            className="shrink-0"
          >
            <Card className="p-2 hover:shadow-md">
              <Image
                src={src}
                alt={`Thumbnail ${index}`}
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
