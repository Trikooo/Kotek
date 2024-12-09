"use client";
import AdminLayout from "../AdminLayout";
import "../../globals.css";
import { useKotekOrder } from "@/context/KotekOrderContext";
import { useEffect } from "react";

export default function Settings() {
  return (
    <AdminLayout>
      <div className="relative w-full max-w-lg mx-auto p-4 border-2 border-black">
        <div className="child bg-blue-500 border-2 border-black">
          {/* Your content */}
        </div>
      </div>
    </AdminLayout>
  );
}
