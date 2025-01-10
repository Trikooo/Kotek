import TopProducts  from "@/components/admin/dashboard/TopProducts";
import AdminLayout from "../AdminLayout";
import InsightCard from "@/components/admin/dashboard/InsightCard";
import WeeklyProductSales from "@/components/admin/dashboard/WeeklyProductSales";
import RecentOrders from "@/components/admin/dashboard/RecentOrders";

// Define the props object for the InsightCard
const monthProps = {
  title: "+10% from last month",
  description: "This Month",
  value: "23 4500 DZD",
  progressValue: 12,
  ariaLabel: "12% increase",
};
const weekProps = {
  title: "-12% from last week",
  description: "This Week",
  value: "5 5600 DZD",
  progressValue: 0,
  ariaLabel: "12% decrease",
};

export default function Dashboard() {
  return (
    <AdminLayout>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-4 w-full h-full">
        <InsightCard {...monthProps} />
        <InsightCard {...weekProps} />
        <WeeklyProductSales className="sm:col-span-2 md:col-span-1" />
        <RecentOrders className="sm:col-span-2 row-span-2" />
        <TopProducts />
      </div>
    </AdminLayout>
  );
}

{
  /* <div className="outline col-span-2 h-52 rounded bg-gray-200"></div>
<div className="outline col-span-1 h-52 rounded bg-gray-300"></div>
<div className="outline col-span-1 h-52 rounded-xl bg-gray-300"></div> */
}
