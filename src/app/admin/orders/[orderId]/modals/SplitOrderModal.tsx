import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { KotekOrder } from "@/types/types";
import { AlertCircle, Loader2, Minus, Plus, Split } from "lucide-react";
import { DialogDescription } from "@radix-ui/react-dialog";
import Image from "next/image";
import { formatCurrency } from "@/utils/generalUtils";
import { useSplitOrderModal } from "../hooks/useSplitOrder";

interface SplitOrderModalProps {
  order: KotekOrder;
  onOrderSplit: (newOrders: KotekOrder) => void;
}

export function SplitOrderModal({ order, onOrderSplit }: SplitOrderModalProps) {
  const {
    isOpen,
    setIsOpen,
    selectedItems,
    subtotal,
    shippingPrice,
    total,
    handleItemSelect,
    handleCreateNoestOrder,
    isPending,
  } = useSplitOrderModal(order, onOrderSplit);

  return (
    <Dialog open={isOpen} onOpenChange={() => setIsOpen(!isOpen)}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Split className="w-4 h-4" strokeWidth={1.5} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] w-full">
        <DialogHeader>
          <DialogTitle>Split Order</DialogTitle>
          <DialogDescription>
            Choose the items you want to create a new order with.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {order.items
            .filter((item) => !item.noestReady)
            .map((item, index) => (
              <div key={index}>
                <div className="flex items-center space-x-4 py-2">
                  <Checkbox
                    id={`item-${index}`}
                    checked={selectedItems.some(
                      (i) => i.productId === item.productId
                    )}
                    onCheckedChange={() => handleItemSelect(index)}
                  />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center space-x-4">
                      {item.product?.imageUrls &&
                        item.product.imageUrls.length > 0 && (
                          <Image
                            src={item.product.imageUrls[0]}
                            alt={item.product?.name || "Product image"}
                            width={60}
                            height={60}
                            className="rounded-md object-cover"
                          />
                        )}
                      <div className="flex-1">
                        <p className="text-base font-medium">
                          {item.quantity}× {item.product?.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          Price: {formatCurrency(item.price)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                {index <
                  order.items.filter((item) => !item.noestReady).length - 1 && (
                  <hr className="my-2" />
                )}
              </div>
            ))}
        </div>
        <div className="mt-6 space-y-2">
          <p className="text-sm flex justify-between">
            Subtotal <span>{formatCurrency(subtotal)}</span>
          </p>
          <p className="text-sm flex justify-between">
            Shipping <span>{formatCurrency(shippingPrice)}</span>
          </p>
          <p className="text-base font-semibold flex justify-between">
            Total <span>{formatCurrency(total)}</span>
          </p>
          {total > 150000 && (
            <div className="flex items-center justify-start gap-2 text-red-500">
              <AlertCircle className="w-4 h-4" strokeWidth={1.5} />
              <p className="text-sm">Total amount must not exceed 150 000 DA</p>
            </div>
          )}
        </div>
        <DialogFooter className="mt-6">
          <Button
            type="button"
            variant="secondary"
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            disabled={total > 150000 || total <= shippingPrice || isPending}
            onClick={handleCreateNoestOrder}
          >
            {isPending ? (
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="animate-spin w-4 h-4" strokeWidth={1.5} />
                Loading...
              </div>
            ) : (
              "Split Order"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
