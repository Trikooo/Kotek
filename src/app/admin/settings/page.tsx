"use client";
import AdminLayout from "../AdminLayout";
import "../../globals.css";
import { useKotekOrder } from "@/context/KotekOrderContext";
import { useEffect } from "react";
import CarouselSettings from "./components/carouselPage";

export default function Settings() {
  return (
    <AdminLayout>
     <CarouselSettings />
    </AdminLayout>
  );
}
