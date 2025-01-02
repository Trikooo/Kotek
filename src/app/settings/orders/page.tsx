"use client";
import { DataTable } from "@/components/dynamic-ui/DataTable";
import SettingsLayout from "../SettingsLayout";
import { useSession } from "next-auth/react";
import UserOrdersDataTable from "./components/UserOrdersDataTable";

export default function OrdersPage() {
  const { data: session } = useSession();
  const username = session?.user?.name;
  const title = username ? `${username}'s Orders` : "Your Orders";
  return (
    <SettingsLayout>
      <UserOrdersDataTable />
    </SettingsLayout>
  );
}
