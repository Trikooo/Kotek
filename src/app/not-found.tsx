"use client";
import { usePathname } from "next/navigation"; // Correct hook for pathname
import Background from "@/components/store/home/section1/Background";
import StoreLayout from "./store/StoreLayout";

export default function NotFound() {
  const pathname = usePathname(); // Get the current pathname
  const isAdminRoute = pathname.startsWith("/admin");

  // Only use StoreLayout if it's not an admin route
  return (
    <>
      {!isAdminRoute ? (
        <StoreLayout>
          <div className="flex justify-center items-center h-[95vh] overflow-hidden">
            <Background heightPercentage={125} />
            <h2 className="text-2xl font-semibold mr-5 pr-5 py-2 border-r border-primary">
              404
            </h2>
            <h2 className="py-2">This page could not be found.</h2>
          </div>
        </StoreLayout>
      ) : (
        <div className="flex justify-center items-center h-[95vh] overflow-hidden">
          <Background />
          <h2 className="text-2xl font-semibold mr-5 pr-5 py-2 border-r border-primary">
            404
          </h2>
          <h2 className="py-2">This page could not be found.</h2>
        </div>
      )}
    </>
  );
}
