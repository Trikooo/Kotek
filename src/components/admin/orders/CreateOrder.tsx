import { Button } from "@/components/ui/button";
import DynamicCard from "@/components/dynamic-ui/DynamicCard"; // Adjust the import path if necessary

export default function CreateOrder({ className = "" }: { className?: string }) {
  return (
    <DynamicCard
      className={className}
      title="Your Orders"
      description={
        <span className="max-w-lg text-balance leading-relaxed">
          Introducing Our Dynamic Orders Dashboard for Seamless Management and
          Insightful Analysis.
        </span>
      }
      content={"Manage all your orders in one place"} // You can replace this with actual content if needed
      footer={<Button>Create New Order</Button>}
    />
  );
}
