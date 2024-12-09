import AdminLayout from "../AdminLayout";
import CreateOrder from "@/components/admin/orders/CreateOrder";
import OrderInfo from "@/components/admin/orders/OrderInfo";
import OrderList from "@/components/admin/orders/OrderList";
import WeeklyOrders from "@/components/admin/orders/WeeklyOrders";
import { useKotekOrder } from "@/context/KotekOrderContext";

export default function Orders() {
  return (
    <AdminLayout>
      <main className="w-full">
        <OrderList />
      </main>
    </AdminLayout>
  );
}
