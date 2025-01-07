import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCreateNoestOrder } from "@/hooks/orders/noest/useNoestOrders";

import { toast } from "@/hooks/use-toast";
import { KotekOrder, NoestOrderForm } from "@/types/types";
import { createNoestForms } from "@/utils/formDataUtils";
import { OrderStatus } from "@prisma/client";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { Check } from "lucide-react";
import { useState } from "react";

export default function NoestModal({
  order,
  onOrderUpdate,
}: {
  order: KotekOrder;
  onOrderUpdate: (updatedAddress: KotekOrder) => void;
}) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const {
    mutateAsync, // Function to trigger the mutation
    isPending, // Boolean indicating if mutation is in progress
    error: createError,
  } = useCreateNoestOrder();
  const handleCreateNoestOrder = async () => {
    const newOrder = {
      ...order,
      status: "PROCESSING" as OrderStatus,
      items: order.items.map((item) => ({
        ...item,
        noestReady: true,
      })),
    };

    const noestForm = createNoestForms(newOrder);

    const data = { noest: noestForm, kotek: newOrder };
    try {
      if (order.id) {
        // const response = await createNoestOrder(noestOrderData, order.id);
        const response = await mutateAsync(data);
        order.status = "PROCESSING";
        toast({
          title: "Noest Order Created",
          description: `Order created successfully`,
        });
        setIsOpen(false);
        onOrderUpdate(response.kotek as unknown as KotekOrder);
      }
    } catch (error) {
      toast({
        title: "Unexpected Error",
        description: "An unexpected error occurred while creating the order",
        variant: "destructive",
      });
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={() => setIsOpen(!isOpen)}>
      <DialogTrigger>
        <Button
          variant="outline"
          className="hover:text-green-600"
          onClick={() => setIsOpen(true)}
        >
          <Check className="h-4 w-4" strokeWidth={1.5} />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Noest Order</DialogTitle>
          <DialogDescription>
            Create a Noest order from this Kotek order
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <p>
            Are you sure you want to create a Noest order for this Kotek order?
          </p>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreateNoestOrder} disabled={isPending}>
            {isPending ? "Creating..." : "Create Order"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
