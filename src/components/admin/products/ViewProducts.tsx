"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ViewProductsProps {
  className?: string;
}
export default function ViewProducts({ className = "" }: ViewProductsProps) {
  const router = useRouter();
  function handleNavigate() {
    router.push("/admin/products/manage");
  }
  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle>Your Products</CardTitle>
        <CardDescription>view and manage your products</CardDescription>
      </CardHeader>
      <CardFooter>
        <Button onClick={handleNavigate}>Manage Your Products</Button>
      </CardFooter>
    </Card>
  );
}
