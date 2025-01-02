"use client";


import { Skeleton } from "@/components/ui/skeleton";
import SettingsLayout from "../../SettingsLayout";

export default function AddressesSettingsSkeleton() {
  return (
    <SettingsLayout>
      <div className="flex flex-col flex-1 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5">
          <div className="space-y-2">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>

        <div className="px-6 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="border rounded-lg p-4 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-12 w-full">
                    <div className="flex items-center gap-8">
                      <Skeleton className="h-4 w-4" />
                      <Skeleton className="h-4 w-32" />
                    </div>

                    <div className="flex items-start gap-2">
                      <Skeleton className="h-4 w-4" />
                      <div className="space-y-1 w-full">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-16" />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-4 w-4" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                    </div>
                  </div>

                  <Skeleton className="h-8 w-8" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SettingsLayout>
  );
}
