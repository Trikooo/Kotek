import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface OrderSummarySkeletonProps {
  className?: string;
}

export function OrderSummarySkeleton({ className }: OrderSummarySkeletonProps) {
  return (
    <Card
      className={`${className} shadow-none bg-gray-50 border-none transition-opacity opacity-50 h-min`}
    >
      <CardHeader>
        <CardTitle>
          <Skeleton className="h-5 w-1/2" />
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-2">
        <div className="flex justify-between">
          <Skeleton className="h-6 w-1/4" />
          <Skeleton className="h-6 w-1/4" />
        </div>
        <div className="flex justify-between">
          <Skeleton className="h-6 w-1/4" />
          <Skeleton className="h-6 w-1/4" />
        </div>
        <Separator />
        <div className="flex justify-between font-medium">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/4" />
        </div>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full bg-indigo-600 hover:bg-indigo-500 animate-pulse"
          disabled
        ></Button>
      </CardFooter>
    </Card>
  );
}

export default function CartItemsCardSkeleton({ className }: {className: string}) {
  return (
    <div className={`py-8 ${className}`}>
      <div className="space-y-8">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="flex items-center gap-4 pb-6 border-b">
            <Skeleton className="w-20 h-20 rounded-md" />
            <div className="flex-grow space-y-4">
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-4 w-1/4" />
              <div className="flex items-center mt-2 gap-2">
                <Skeleton className="w-8 h-8 rounded-md" />
                <Skeleton className="w-16 h-8" />
                <Skeleton className="w-8 h-8 rounded-md" />
              </div>
            </div>
            <Skeleton className="w-8 h-8 rounded-md" />
          </div>
        ))}
      </div>
    </div>
  );
}
