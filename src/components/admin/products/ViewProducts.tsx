import { Button } from "@/components/ui/button";
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
  return (
    <Card className={className} x-chunk="dashboard-05-chunk-0">
      <CardHeader className="pb-3">
        <CardTitle>Your Products</CardTitle>
        <CardDescription>view and manage your products</CardDescription>
      </CardHeader>
      <CardFooter>
        <Button>View All Products</Button>
      </CardFooter>
    </Card>
  );
}
