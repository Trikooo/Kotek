import { useState, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";
import { KotekOrder, PaginationMetadata } from "@/types/types";
import { AxiosError } from "axios";
import { useSession } from "next-auth/react";

export function useScrollPaginatedKotekOrders(
  fetchFunction: (
    page: number,
    limit: number
  ) => Promise<{
    orders: KotekOrder[];
    pagination: PaginationMetadata;
  }>,
  initialLimit: number = 10,
  allowedPathnames?: string[] // New optional parameter
) {
  const { data: session } = useSession();
  const userId = session?.user?.role;
  const pathname = usePathname();
  const [orders, setOrders] = useState<KotekOrder[]>([]);
  const [pagination, setPagination] = useState<PaginationMetadata | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AxiosError | null>(null);
  const [page, setPage] = useState(1);

  // Check if current path is allowed
  const isPathAllowed = allowedPathnames
    ? allowedPathnames.some((allowedPath) => pathname.startsWith(allowedPath))
    : true;

  const fetchOrders = useCallback(
    async (currentPage: number) => {
      // Skip fetching if path is not allowed
      if (!isPathAllowed) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const { orders: newOrders, pagination } = await fetchFunction(
          currentPage,
          initialLimit
        );
        setOrders((prevOrders) =>
          currentPage === 1 ? newOrders : [...prevOrders, ...newOrders]
        );
        setPagination(pagination);
      } catch (error) {
        setError(error as AxiosError);
      } finally {
        setLoading(false);
      }
    },
    [fetchFunction, initialLimit, isPathAllowed]
  );

  // Initial fetch
  useEffect(() => {
    if (isPathAllowed && userId) fetchOrders(1);
  }, [isPathAllowed, userId]);

  // Function to load more orders
  const loadMoreOrders = useCallback(() => {
    if (!loading && pagination && pagination.hasNextPage && isPathAllowed) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchOrders(nextPage);
    }
  }, [loading, pagination, page, fetchOrders, isPathAllowed]);

  // Reset orders when needed
  const resetOrders = useCallback(() => {
    setOrders([]);
    setPage(1);
    if (isPathAllowed) fetchOrders(1);
  }, [fetchOrders, isPathAllowed]);

  return {
    orders,
    setOrders,
    loading,
    error,
    pagination,
    loadMoreOrders,
    resetOrders,
  };
}
