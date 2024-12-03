import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ExistingAddressesSkeleton() {
  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        {[...Array(4)].map((_, index) => (
          <Card key={index} className="border-gray-200">
            <CardHeader className="p-4">
              <Skeleton className="h-4 w-3/4" />
            </CardHeader>
            <CardContent className="space-y-4 p-4">
              <div className="flex items-start gap-3">
                <Skeleton className="h-5 w-5 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-48" />
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Skeleton className="h-5 w-5 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Skeleton className="h-5 w-5 rounded-full" />
                <div>
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-40" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-1/2 mx-auto" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-4 w-3/4 mx-auto" />
        </CardContent>
        <CardFooter className="justify-center">
          <Skeleton className="h-10 w-32" />
        </CardFooter>
      </Card>
      <CardFooter className="justify-end">
        <Skeleton className="h-10 w-32" />
      </CardFooter>
    </div>
  );
}
