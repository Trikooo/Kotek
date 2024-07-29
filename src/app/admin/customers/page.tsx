import Stock from "@/components/admin/dashboard/InsightCard";
import AdminLayout from "../AdminLayout";
import ViewProducts from "@/components/admin/products/ViewProducts";
import LowestStock from "@/components/admin/products/LowestStock";
import InsightCard from "@/components/admin/dashboard/InsightCard";
import NewCustomers from "@/components/admin/customers/NewCustomers";
import { CustomerChart } from "@/components/admin/customers/CustomerChart";

const ProductProps = {
  title: "13% from last month",
  description: "Total number of customers",
  value: "843",
  progressValue: 13,
  ariaLabel: "12% decrease",
};
export default function Products() {
  return (
    <AdminLayout>
      <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
        <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
            <InsightCard
              className="sm:col-span-1 md:col-span-2 lg:col-span-1 xl:col-span-2"
              {...ProductProps}
            />
            <ViewProducts className="sm:col-span-1 md:col-span-2 lg:col-span-1 xl:col-span-2" />
          </div>
          <NewCustomers className=""/>
        </div>
        <CustomerChart />
      </main>
    </AdminLayout>
  );
}
