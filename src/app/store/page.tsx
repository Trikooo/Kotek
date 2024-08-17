import FilterSideBar from "@/components/store/store-front/FilterSideBar";
import StoreLayout from "./StoreLayout";
import StoreMain from "@/components/store/store-front/StoreMain";

export default function Store() {
  return (
    <StoreLayout>
      <div className="flex pt-7">
        <FilterSideBar />
        <div className="w-full lg:ml-60">
        <StoreMain />

        </div>
      </div>
    </StoreLayout>
  );
}
