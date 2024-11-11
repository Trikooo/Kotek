"use client";
import { useSession } from "next-auth/react";
import CartItemsCard from "@/components/store/cart/CartItemCard";
import StoreLayout from "../store/StoreLayout";
import CartPage from "@/components/store/cart/CartPage";

export default function Cart() {
  return (
    <StoreLayout>
      <CartPage />
    </StoreLayout>
  );
}
