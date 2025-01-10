import FilterSideBar from "@/components/store/store-front/FilterSideBar";
import StoreLayout from "./StoreLayout";
import StoreMain from "@/components/store/store-front/StoreMain";
import { Suspense } from "react";

export default function Store() {
  return (
    <Suspense>
      <StoreLayout>
        <div className="flex pt-7">
          <FilterSideBar />
          <div className="w-full lg:ml-10">
            <StoreMain />
          </div>
        </div>
      </StoreLayout>
    </Suspense>
  );
}
