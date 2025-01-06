import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useValidateNoestOrder } from "@/hooks/orders/noest/useNoestOrders";

import { toast } from "@/hooks/use-toast";
import { KotekOrder } from "@/types/types";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { Send } from "lucide-react";
import { useState } from "react";

export default function DispatchAllModal({
  order,
  onOrderUpdate,
}: {
  order: KotekOrder;
  onOrderUpdate: (updatedOrder: KotekOrder) => void;
}) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { mutateAsync: validateAll, isPending } = useValidateNoestOrder();

  const handleDispatchAll = async () => {
    try {
      if (order.id) {
        // IF NO ITEM HAS A TRACKING NUMBER AND DISPATCH IS PRESSED, STATUS SHOULD BE CHANGED TO DISPATCHED.
        if (order.items.some((item) => item.trackingId !== undefined)) {
          order.status = "DISPATCHED";
        }
        const updatedOrder = await validateAll(order);
        toast({
          title: "Order Dispatched",
          description: "All items have been dispatched successfully",
        });
        setIsOpen(false);
        onOrderUpdate(updatedOrder.kotek as unknown as KotekOrder);
      }
    } catch (err) {
      toast({
        title: "Dispatch Failed",
        description: "An error occurred while dispatching the items",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => setIsOpen(!isOpen)}>
      <DialogTrigger>
        <Button
          variant="outline"
          className="hover:text-blue-600"
          onClick={() => setIsOpen(true)}
        >
          <Send className="h-4 w-4" strokeWidth={1.5} />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Dispatch All Items</DialogTitle>
          <DialogDescription>
            Dispatch all items in this order
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <p>Are you sure you want to dispatch all items in this order?</p>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleDispatchAll} disabled={isPending}>
            {isPending ? "Dispatching..." : "Dispatch All"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
