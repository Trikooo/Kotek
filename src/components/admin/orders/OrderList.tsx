"use client";
import React, { useEffect, useRef, useCallback } from "react";
import { Column, DataTable, Row } from "@/components/dynamic-ui/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useKotekOrder } from "@/context/KotekOrderContext";
import { KotekOrder } from "@/types/types";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { formatCurrency, humanReadableDate } from "@/utils/generalUtils";
import {
  getStatusColor,
  getStatusVariant,
} from "@/app/admin/orders/[orderId]/utils/AdminOrderUtils";
import { useRouter } from "next/navigation";

interface OrderListProps {
  className?: string;
}

const columns: Column[] = [
  { header: "Customer", important: true },
  { header: "Wilaya", important: true },
  { header: "Status", important: true },
  { header: "Date", important: true },
  { header: "Subtotal", important: true },
  { header: "Shipping price" },
  { header: "Phone number" },
];

export default function OrderList({ className = "" }: OrderListProps) {
  const {
    allKotekOrders,
    allKotekOrdersLoading,
    allKotekOrdersError,
    loadMoreAllKotekOrders,
    allKotekOrdersPagination,
  } = useKotekOrder();

  // Ref for the scrollable container and load more trigger
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreTriggerRef = useRef<HTMLDivElement>(null);

  // Intersection Observer to trigger load more
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (
        target.isIntersecting &&
        allKotekOrdersPagination?.hasNextPage &&
        !allKotekOrdersLoading
      ) {
        loadMoreAllKotekOrders();
      }
    },
    [loadMoreAllKotekOrders, allKotekOrdersPagination, allKotekOrdersLoading]
  );

  // Set up Intersection Observer
  useEffect(() => {
    // Create a root margin to trigger 100px before the end
    const options: IntersectionObserverInit = {
      root: null, // viewport
      rootMargin: "0px 0px 100px 0px", // 100px from bottom
      threshold: 0, // trigger as soon as any part is visible
    };

    if (loadMoreTriggerRef.current) {
      observerRef.current = new IntersectionObserver(handleObserver, options);
      observerRef.current.observe(loadMoreTriggerRef.current);
    }

    // Cleanup
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [handleObserver]);

  // Prepare rows for the DataTable
  const rows: Row[] = allKotekOrders.map((order) => ({
    id: order.id ? order.id : "",
    customer: <OrderUserInfo order={order} />,
    wilaya:
      order.address?.wilayaLabel || order.guestAddress?.wilayaLabel || "N/A",
    status: (
      <Badge
        variant={getStatusVariant(order.status)}
        className={getStatusColor(order.status)}
      >
        {order.status}
      </Badge>
    ),
    subtotal: formatCurrency(order.subtotalAmount),
    shipping_price: formatCurrency(order.shippingPrice),
    date: order.createdAt ? humanReadableDate(order.createdAt) : "N/A",
    phone_number: order.address?.phoneNumber || order.guestAddress?.phoneNumber,
  }));

  return (
    <div>
      <DataTable
        title="Orders"
        description="All your orders"
        columns={columns}
        rows={rows}
        isLoading={allKotekOrdersLoading}
        error={allKotekOrdersError}
      />
      {/* Load more trigger at the end of the table */}
      <div ref={loadMoreTriggerRef} style={{ height: "1px" }} />
    </div>
  );
}

export function OrderUserInfo({ order }: { order: KotekOrder }) {
  const name =
    order.address?.fullName || order.guestAddress?.fullName || "Nameless";
  const email = order.user?.email || "Non registered.";

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            href={`/admin/orders/${order.id}`}
            className="block p-2 hover:bg-gray-100 rounded transition-colors"
          >
            <div className="font-medium">{name}</div>
            <div className="text-sm text-gray-500">{email}</div>
          </Link>
        </TooltipTrigger>
        <TooltipContent>
          <p>View details</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
