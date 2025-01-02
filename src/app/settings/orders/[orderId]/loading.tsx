import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import SettingsLayout from "../../SettingsLayout";

export default function OrderDetailsSkeleton() {
  return (
    <SettingsLayout>
      <div className="flex flex-col flex-1 overflow-hidden">
        <header className="flex items-center justify-between px-6 py-5">
          <div className="space-y-1">
            <Skeleton className="h-8 w-48" />
            <div className="flex items-center space-x-2">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
          <Skeleton className="h-10 w-36" />
        </header>

        <div className="px-6 py-6 space-y-8">
          {/* Items Section */}
          <section>
            <Skeleton className="h-6 w-24 mb-4" />
            <div className="space-y-4">
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex items-start justify-between">
                  <div className="flex gap-4">
                    <Skeleton className="w-12 h-12 rounded" />
                    <div>
                      <Skeleton className="h-5 w-32 mb-2" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </div>
                  <Skeleton className="h-5 w-16" />
                </div>
              ))}
              <Separator className="my-4" />
              <div className="flex justify-between pt-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-5 w-24" />
              </div>
            </div>
          </section>

          {/* Shipping Section */}
          <section>
            <Skeleton className="h-6 w-24 mb-4" />
            <Skeleton className="h-4 w-full max-w-md mb-6" />

            <div className="space-y-4">
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex gap-4">
                  <div className="relative flex items-center justify-center w-4">
                    <Skeleton className="w-2 h-2 rounded-full" />
                    {item < 3 && (
                      <div className="absolute w-px h-full bg-muted-foreground/20 top-5" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                    <Skeleton className="h-4 w-32 mt-1" />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </SettingsLayout>
  );
}
