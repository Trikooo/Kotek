"use client";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton"; // Assuming the skeleton is exported here
import Image from "next/image";

interface ProductDetailsCardProps {
  thumbnails: string[];
  thumbnailPosition?: "left" | "right";
  loading: boolean;
}

export default function ProductDetailsImages({
  thumbnails,
  thumbnailPosition = "left",
  loading = false,
}: ProductDetailsCardProps) {
  const [mainImage, setMainImage] = useState<string>();
  const [zoom, setZoom] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const { offsetX, offsetY, target } = e.nativeEvent;
    const { offsetWidth, offsetHeight } = target as HTMLElement;

    const xPos = (offsetX / offsetWidth) * 100;
    const yPos = (offsetY / offsetHeight) * 100;

    setZoomPosition({ x: xPos, y: yPos });
  };

  useEffect(() => {
    if (thumbnails && thumbnails.length > 0) {
      setMainImage(thumbnails[0]);
    }
  }, [thumbnails]);

  // Rendering logic for main image
  const renderMainImage = () => {
    if (loading) {
      return (
        <Skeleton className="h-[300px] md:h-[600px] rounded-md md:flex-grow overflow-hidden w-full md:w-auto" />
      );
    }
    return (
      <Card className="flex-grow overflow-hidden">
        <div
          className="relative overflow-hidden"
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setZoom(true)}
          onMouseLeave={() => setZoom(false)}
        >
          <Image
            src={mainImage || "placeholder/placeholder.svg"}
            alt="product"
            height={1000}
            width={1000}
            className={`w-full h-auto rounded-md ${
              zoom ? "scale-150" : ""
            } transition-transform duration-300`}
            style={{
              transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
            }}
          />
        </div>
      </Card>
    );
  };

  // Rendering logic for thumbnails
  const renderThumbnails = () => {
    if (loading) {
      return Array(4)
        .fill(0)
        .map((_, index) => (
          <Skeleton
            key={index}
            className="h-[70px] w-[70px] rounded-md shrink-0"
          />
        ));
    }

    return (
      thumbnails &&
      thumbnails.map((src, index) => (
        <button
          key={index}
          onClick={() => setMainImage(src)}
          className="shrink-0"
        >
          <Card
            className={`hover:shadow-md overflow-hidden p-2 ${
              src === mainImage ? "ring-2 ring-indigo-600" : ""
            }`}
          >
            <Image
              src={src}
              alt={`Thumbnail ${index + 1}`}
              height={50}
              width={50}
            />
          </Card>
        </button>
      ))
    );
  };

  return (
    <div
      className={`flex flex-col items-start ${
        thumbnailPosition === "left" ? "md:flex-row-reverse" : "md:flex-row"
      } gap-1 w-full`}
    >
      {/* Main Image */}
      {renderMainImage()}

      {/* Thumbnails */}
      <div className="flex p-1 gap-2 mt-4 md:mt-0 overflow-x-auto md:overflow-y-auto md:flex-col max-w-full md:max-h-[600px]">
        {renderThumbnails()}
      </div>
    </div>
  );
}
