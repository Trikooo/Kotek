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

interface OrderSummaryProps{
className?: string
}
export function OrderSummarySkeleton({className}: OrderSummaryProps) {
  return (
    <Card className={` ${className} shadow-sm bg-gray-50 border-0`}>
      <CardHeader className="border-b">
        <CardTitle className="text-2xl font-bold">Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-2 mb-4">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="flex justify-between items-center">
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>
          ))}
        </div>
        <Separator className="my-4" />
        <div className="space-y-2">
          <div className="flex justify-between">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          </div>
          <div className="flex justify-between">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          </div>
          <Separator className="my-2" />
          <div className="flex justify-between">
            <div className="h-6 bg-gray-200 rounded w-1/4"></div>
            <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-6">
        <div className="w-full h-10 bg-gray-200 rounded"></div>
      </CardFooter>
    </Card>
  )
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
