import React from "react";
import { Product } from "@prisma/client";
import AnimatedBestSellerBadge from "./bestseller-badge";
import AnimatedNewBadge from "./new-badge";
import AnimatedPromoBadge from "./promo-badge";

export default function DisplayBadge({ product }: { product: Product }) {
  const isNewProduct = () => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    return new Date(product.createdAt) > oneWeekAgo;
  };

  const isPromoProduct = () => {
    return product.originalPrice > product.price;
  };

  const isBestSeller = () => {
    return product.tags.includes("best-seller");
  };

  // Priority order: Promo > Best Seller > New
  if (isPromoProduct()) {
    return <AnimatedPromoBadge />;
  }

  if (isBestSeller()) {
    return <AnimatedBestSellerBadge />;
  }

  if (isNewProduct()) {
    return <AnimatedNewBadge />;
  }

  return null;
}
