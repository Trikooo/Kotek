"use client";

import { notFound, useParams } from "next/navigation";
import { format } from "date-fns";
import { useKotekOrder } from "@/context/KotekOrderContext";
import AdminLayout from "../../AdminLayout";
import OrderDetailsSkeletonPage from "./OrderDetailsSkeleton";
import ErrorComponent from "@/components/error/error";
import OrderDetails from "./components/OrderDetails";
import CustomerInformation from "./components/CustomerInformation";
import AddressDetails from "./components/AddressDetails";

export default function OrderDetailsPage() {
  const { orderId } = useParams();

  const { allKotekOrders, allKotekOrdersLoading, allKotekOrdersError } =
    useKotekOrder();

  if (allKotekOrdersLoading) {
    return <OrderDetailsSkeletonPage />;
  }

  if (allKotekOrdersError) {
    return (
      <AdminLayout>
        <ErrorComponent />
      </AdminLayout>
    );
  }

  const order = allKotekOrders.find((order) => order.id === orderId);
  if (!order) {
    notFound();
  }

  return (
    <AdminLayout>
      <div className="w-full">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold hidden lg:block">
            Order ID: {order.id}
          </h1>
          <h1 className="text-lg font-bold lg:hidden">{order.id}</h1>
        </div>

        <div className="text-sm text-muted-foreground mb-4">
          {order.createdAt
            ? format(new Date(order.createdAt), "MMMM d, yyyy 'at' h:mm a")
            : "N/A"}
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:flex-grow">
            <OrderDetails order={order} />
          </div>
          <div className="lg:w-1/3 flex flex-col gap-6">
            <CustomerInformation order={order} />
            <AddressDetails order={order} />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
