import FilterSideBar from "@/components/store/store-front/FilterSideBar";
import StoreLayout from "./StoreLayout";
import StoreMain from "@/components/store/store-front/StoreMain";
import StoreCard from "@/components/store/store-front/StoreCard";

export default function Store() {
  return (
    <StoreLayout>
      <div className="flex pt-7">
        <FilterSideBar />
        <div className="w-full pl-10">
        <StoreMain />
        <div className="pt-5">

        <StoreCard />
        </div>
        </div>
      </div>
    </StoreLayout>
  );
}
