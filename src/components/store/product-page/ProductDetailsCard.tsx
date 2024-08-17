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
  ];

  return (
    <div className="w-max flex gap-4">
      {/* Main Image */}
      <div className="flex flex-col gap-2">
        {thumbnails.map((src, index) => (
          <button
            key={index}
            onClick={() => setMainImage(src)}
            className="mb-2"
          >
            <Card className="p-4 hover:shadow-md">
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
      <Card className="p-4">
        <Image src={mainImage} alt="product" height={600} width={600} />
      </Card>
    </div>
  );
}
