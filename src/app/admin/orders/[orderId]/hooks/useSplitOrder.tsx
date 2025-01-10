import { useState, useEffect } from "react";
import { KotekOrder, NoestOrderForm } from "@/types/types";
import { calculateShipping } from "@/utils/generalUtils";
import { toast } from "@/hooks/use-toast";
import { useKotekOrderRequest } from "@/hooks/orders/useKotekOrder";
import {
  useCreateNoestOrder,
  useDeleteNoestOrder,
} from "@/hooks/orders/noest/useNoestOrders";
import { createNoestForms } from "@/utils/formDataUtils";

export function useSplitOrderModal(
  order: KotekOrder,
  onOrderSplit: (newOrders: KotekOrder) => void
) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedItems, setSelectedItems] = useState<KotekOrder["items"]>([]);
  const [itemQuantities, setItemQuantities] = useState<number[]>(
    order.items.filter((item) => !item.noestReady).map((item) => item.quantity)
  );
  const [subtotal, setSubtotal] = useState<number>(0);
  const [shippingPrice, setShippingPrice] = useState<number>(
    order.address?.baseShippingPrice ||
      order.guestAddress?.baseShippingPrice ||
      0
  );
  const [total, setTotal] = useState<number>(0);

  const { mutateAsync, isPending } = useCreateNoestOrder();

  useEffect(() => {
    const newSubtotal = selectedItems.reduce((sum, item, index) => {
      return sum + item.price * itemQuantities[index];
    }, 0);

    setSubtotal(newSubtotal);

    const baseShippingPrice =
      order.address?.baseShippingPrice ||
      order.guestAddress?.baseShippingPrice ||
      0;
    const newShippingPrice = calculateShipping(newSubtotal, baseShippingPrice);
    setShippingPrice(newShippingPrice);

    setTotal(newSubtotal + newShippingPrice);
  }, [selectedItems, itemQuantities, order]);

  const handleItemSelect = (index: number) => {
    const filteredItems = order.items.filter((item) => !item.noestReady);
    const item = filteredItems[index];
    const newSelectedItems = [...selectedItems];
    const existingIndex = newSelectedItems.findIndex(
      (i) => i.productId === item.productId
    );

    if (existingIndex !== -1) {
      newSelectedItems.splice(existingIndex, 1);
    } else {
      newSelectedItems.push(item);
    }

    setSelectedItems(newSelectedItems);
  };

  const handleCreateNoestOrder = async () => {
    const newOrder = {
      ...order,
      items: [
        ...selectedItems.map((item) => ({
          ...item,
          noestReady: true,
        })),
        ...order.items.filter(
          (item) =>
            !selectedItems.some((selectedItem) => selectedItem.id === item.id)
        ),
      ],
    };
        const noestOrderForm =  createNoestForms(newOrder);
    const data = {
      noest: noestOrderForm,
      kotek: newOrder,
    };
    try {
      if (order.id) {
        const response = await mutateAsync(data);
        toast({
          title: "Noest Order Created",
          description: `Order created successfully`,
        });
        setIsOpen(false);
        setSelectedItems([]);
        onOrderSplit(response.kotek as unknown as KotekOrder);
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Unexpected Error",
        description: "An unexpected error occurred while creating the order",
        variant: "destructive",
      });
    }
  };

  return {
    isOpen,
    setIsOpen,
    selectedItems,
    subtotal,
    shippingPrice,
    total,
    handleItemSelect,
    handleCreateNoestOrder,
    isPending,
  };
}
