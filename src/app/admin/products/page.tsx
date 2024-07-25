import Stock from "@/components/admin/products/Stock";
import AdminLayout from "../AdminLayout";
import ViewProducts from "@/components/admin/products/ViewProducts";
import LowestStock from "@/components/admin/products/LowestStock";

const ProductProps = {
  title: "🔻 12% from last week",
  description: "Number of products in stock",
  value: "843",
  progressValue: -12,
  ariaLabel: "12% decrease",
};
export default function Products() {
  return (
    <AdminLayout>
      <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
        <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
            <ViewProducts className="sm:col-span-1 md:col-span-2 lg:col-span-1 xl:col-span-2" />
            <Stock
              className="sm:col-span-1 md:col-span-2 lg:col-span-1 xl:col-span-2"
              {...ProductProps}
            />
          </div>
          <LowestStock />
        </div>
      </main>
    </AdminLayout>
  );
}
