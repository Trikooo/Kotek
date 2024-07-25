import AdminLayout from "../AdminLayout";
import CreateOrder from "@/components/admin/orders/CreateOrder";
import OrderInfo from "@/components/admin/orders/OrderInfo";
import OrderList from "@/components/admin/orders/OrderList";
import WeeklyOrders from "@/components/admin/orders/WeeklyOrders";

export default function Orders() {
  return (
    <AdminLayout>
      <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
        <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
            <CreateOrder className="sm:col-span-1 md:col-span-2 lg:col-span-1 xl:col-span-2"/>
            <WeeklyOrders className="sm:col-span-1 md:col-span-2 lg:col-span-1 xl:col-span-2"/>
          </div>
          <OrderList />
        </div>
        <div>
          <OrderInfo />
        </div>
      </main>
    </AdminLayout>
  );
}
