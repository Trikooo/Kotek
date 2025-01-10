"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, Layers } from "lucide-react";
import { useRouter } from "next/navigation";
import AdminLayout from "../AdminLayout";
import Link from "next/link";

export default function ProductPage() {
  const router = useRouter();

  return (
    <AdminLayout>
      <div className="container mx-auto py-10">
        <h1 className="text-4xl font-bold mb-8">Product Management</h1>
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-6 w-6" />
                Manage Products
              </CardTitle>
              <CardDescription>
                View, edit, and add new products to your inventory
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Access your product catalog and make changes as needed.
              </p>
              <Link href="/admin/products/manage">
                <Button className="w-full">Go to Products</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layers className="h-6 w-6" />
                Handle Categories
              </CardTitle>
              <CardDescription>
                Organize and manage your product categories
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Create, edit, or delete categories to keep your products
                organized.
              </p>
              <Link href="/admin/dashboard/categories">
                <Button className="w-full ">Go to Categories</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
