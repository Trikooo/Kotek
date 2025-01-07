import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { GripVertical } from "lucide-react";

const CarouselPageSkeleton = () => {
  return (
    <div className="w-full min-h-screen">
      <div className="w-full px-8 py-6">
        <div className="flex justify-end items-center mb-6 gap-4">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>

        <div className="space-y-4">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <Card key={item} className="p-4 w-full">
              <div className="flex items-center gap-4">
                <GripVertical className="h-5 w-5 cursor-grab text-gray-200" />
                <Skeleton className="h-12 w-12 rounded" /> {/* Image */}
                <Skeleton className="h-4 flex-1" /> {/* Title */}
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-8" /> {/* Edit button */}
                  <Skeleton className="h-8 w-8" /> {/* Delete button */}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CarouselPageSkeleton;
