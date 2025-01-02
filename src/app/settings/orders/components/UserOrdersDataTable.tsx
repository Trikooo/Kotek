"use client";
import { useEffect, useRef, useCallback, useState } from "react";
import {
  getStatusColor,
  getStatusVariant,
} from "@/app/admin/orders/[orderId]/utils/AdminOrderUtils";
import { Column, DataTable, Row } from "@/components/dynamic-ui/DataTable";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useKotekOrder } from "@/context/KotekOrderContext";
import { formatCurrency, humanReadableDate } from "@/utils/generalUtils";
import { Search } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const columns: Column[] = [
  { header: "Date", important: true },
  { header: "Status", important: true },
  { header: "Subtotal", important: true },
  { header: "Shipping price" },
];

export default function UserOrdersDataTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const {
    userKotekOrders,
    userOrdersLoading,
    loadMoreUserKotekOrders,
    userKotekOrdersPagination,
  } = useKotekOrder();
  const router = useRouter();
  // Ref for intersection observer and load more trigger
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreTriggerRef = useRef<HTMLDivElement>(null);

  // Intersection Observer callback
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (
        target.isIntersecting &&
        userKotekOrdersPagination?.hasNextPage &&
        !userOrdersLoading
      ) {
        loadMoreUserKotekOrders();
      }
    },
    [loadMoreUserKotekOrders, userKotekOrdersPagination, userOrdersLoading]
  );

  // Set up Intersection Observer
  useEffect(() => {
    const options: IntersectionObserverInit = {
      root: null,
      rootMargin: "0px 0px 100px 0px",
      threshold: 0,
    };

    if (loadMoreTriggerRef.current) {
      observerRef.current = new IntersectionObserver(handleObserver, options);
      observerRef.current.observe(loadMoreTriggerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [handleObserver]);

  // Filter rows based on search term
  const filteredRows: Row[] = userKotekOrders
    .filter((order) => {
      if (!searchTerm) return true;
      const searchLower = searchTerm.toLowerCase();
      return (
        order.status.toLowerCase().includes(searchLower) ||
        order.createdAt?.toString().toLowerCase().includes(searchLower) ||
        order.subtotalAmount.toString().includes(searchLower)
      );
    })
    .map((order) => ({
      id: order.id ? order.id : "",
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
      date: order.createdAt ? order.createdAt.split("T")[0] : "N/A",
    }));

  return (
    <div className="pt-10 sm:pt-0">
      <DataTable
        title={<Title setSearchTerm={setSearchTerm} />}
        columns={columns}
        rows={filteredRows}
        isLoading={userOrdersLoading}
        onRowClick={(row) => router.push(`/settings/orders/${row.id}`)}
      />
      {/* Load more trigger */}
      <div ref={loadMoreTriggerRef} style={{ height: "1px" }} />
    </div>
  );
}

const Title = ({
  setSearchTerm,
}: {
  setSearchTerm: (term: string) => void;
}) => {
  const { data: session } = useSession();
  const username = session?.user?.name;
  const title = username ? `${username}'s Orders` : "Your Orders";

  return (
    <div className="flex items-center justify-between">
      <h3 className="flex-1">{title}</h3>
      <div className="relative flex items-center flex-1 sm:flex-none">
        <Search
          className="absolute left-2.5 h-4 w-4 text-muted-foreground"
          strokeWidth={1.5}
        />
        <Input
          type="search"
          placeholder="Search..."
          className="w-full rounded-lg bg-background pl-8 font-normal"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
    </div>
  );
};
