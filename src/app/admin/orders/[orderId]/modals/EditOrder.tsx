/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Edit, Loader2, Plus, X } from "lucide-react";
import { calculateShipping } from "@/utils/generalUtils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import BetterSelect, { Option } from "@/components/ui/better-select";
import { useKotekOrderRequest } from "@/hooks/orders/useKotekOrder";
import { KotekOrder, ProductSearchParams } from "@/types/types";
import { OrderFormValues, orderSchema } from "../schemas/EditOrderSchema";
import { useProductsContext } from "@/context/ProductsContext";
import Image from "next/image";
import useDebounce from "@/hooks/useDebounce";
import { formatCurrency } from "@/utils/generalUtils";
import { toast } from "@/hooks/use-toast";

interface EditOrderProps {
  order: KotekOrder;
  onOrderUpdate: (updatedOrder: KotekOrder) => void;
}

export function EditOrder({ order, onOrderUpdate }: EditOrderProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { handleUpdateKotekOrder } = useKotekOrderRequest();
  const { products } = useProductsContext();
  const productOptions: Option[] = products.map((product) => ({
    value: product.id,
    label: product.name,
  }));
  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      items:
        order.items
          .filter((item) => !item.trackingId)
          .map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            noestReady: item.noestReady,
            trackingId: item.trackingId,
            tracking: item.tracking,
            product: {
              name: item.product?.name || "",
              imageUrls: item.product?.imageUrls || [],
              weight: item.product?.weight || 0,
            },
          })) || [],
      subtotalAmount: order.subtotalAmount || 0,
      shippingPrice: order.shippingPrice || 0,
    },
  });
  const [orderUpdateLoading, setOrderUpdateLoading] = useState<boolean>(false);
  useEffect(() => {
    console.log("order.items: ", order.items);
  });
  useEffect(() => {
    // Update form values when order.items changes
    const updatedItems = order.items
      .filter((item) => !item.trackingId)
      .map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
        noestReady: item.noestReady,
        trackingId: item.trackingId,
        tracking: item.tracking,
        product: {
          name: item.product?.name || "",
          imageUrls: item.product?.imageUrls || [],
          weight: item.product?.weight || 0,
        },
      }));

    form.reset({
      ...form.getValues(),
      items: updatedItems,
      subtotalAmount: order.subtotalAmount || 0,
      shippingPrice: order.shippingPrice || 0,
    });
  }, [order.items]);
  const handleSubmit = async (values: OrderFormValues) => {
    try {
      // Validate the entire form data with Zod schema
      const validationResult = orderSchema.safeParse(values);

      if (!validationResult.success) {
        console.error(
          "Zod Validation Errors:",
          validationResult.error.format()
        );
        toast({
          title: "Validation Error",
          description: "Please check the form for errors",
          variant: "destructive",
        });
        return;
      }

      setOrderUpdateLoading(true);
      // Filter out items with an empty productId
      const filteredItems = values.items.filter((item) => {
        if (!item.productId) {
          return false;
        }
        return true;
      });
      console.log("filteredItems: ", filteredItems);
      if (order.id) {
        const newTotalAmount = values.subtotalAmount + values.shippingPrice;
        console.log("Calculated new total amount:", newTotalAmount);

        const updatedOrderData = {
          ...order,
          ...values,
          items: filteredItems,
          totalAmount: newTotalAmount,
        };
        console.log("Sending updated order data:", updatedOrderData);

        const updatedOrder = await handleUpdateKotekOrder(
          updatedOrderData,
          order.id
        );
        console.log("Received updated order response:", updatedOrder);

        onOrderUpdate(updatedOrder as unknown as KotekOrder);
        toast({
          title: "Success!",
          description: "Order updated Successfully",
        });
        setIsOpen(!isOpen);
      }
    } catch (error) {
      console.error("Failed to update order:", error);
      // Log the full error details
      if (error instanceof Error) {
        console.error("Error name:", error.name);
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
      }
      toast({
        title: "Uh oh, there was a problem",
        description: "couldn't save your changes.",
        variant: "destructive",
      });
    } finally {
      setOrderUpdateLoading(false);
    }
  };

  const calculateSubtotal = (items: OrderFormValues["items"]) => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  useEffect(() => {
    const newSubtotal = calculateSubtotal(form.getValues("items"));
    form.setValue("subtotalAmount", newSubtotal);
  }, [form.watch("items")]);

  const itemsRef = useRef(form.getValues("items"));

  useEffect(() => {
    const filteredItems = form
      .getValues("items")
      .filter((item) => item.productId !== "");
    if (JSON.stringify(itemsRef.current) !== JSON.stringify(filteredItems)) {
      const newShippingPrice = calculateShipping(
        form.getValues("subtotalAmount"),
        order.address?.baseShippingPrice ||
          order.guestAddress?.baseShippingPrice ||
          0
      );
      form.setValue("shippingPrice", newShippingPrice);
    }
  }, [form.watch("items")]);

  useEffect(() => {
    const subscription = form.watch((value, { name, type }) =>
      console.log("Form updated:", { field: name, type, value })
    );
    return () => subscription.unsubscribe();
  }, [form.watch, order.items]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger>
        <Button
          variant="outline"
          onClick={() => {
            setIsOpen(!isOpen);
            form.reset({
              items: order.items
                .filter((item) => !item.trackingId)
                .map((item) => ({
                  productId: item.productId,
                  quantity: item.quantity,
                  price: item.price,
                  noestReady: item.noestReady,
                  trackingId: item.trackingId,
                  tracking: item.tracking,
                  product: {
                    name: item.product?.name || "",
                    imageUrls: item.product?.imageUrls || [],
                    weight: item.product?.weight || 0,
                  },
                })),
              subtotalAmount: order.subtotalAmount || 0,
              shippingPrice: order.shippingPrice || 0,
            });
          }}
        >
          <Edit className="w-4 h-4" strokeWidth={1.5} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] w-full">
        <DialogHeader>
          <DialogTitle>Edit Order</DialogTitle>
          <DialogDescription>
            You can only edit items that are still pending
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-8"
          >
            <FormField
              control={form.control}
              name="items"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Items</FormLabel>
                    {field.value.map((item, index) => (
                      <div key={index} className="flex gap-4">
                        {item.product.imageUrls.length > 0 && (
                          <Image
                            src={item.product.imageUrls[0]}
                            alt={item.product.name}
                            width={50}
                            height={50}
                            className="w-14 sm:w-32 aspect-square object-contain"
                          />
                        )}
                        <div className="w-full flex flex-col justify-center gap-2">
                          <div className="flex items-center space-x-2">
                            <IterableSelect
                              item={item}
                              productOptions={productOptions}
                              onChange={(_, currentOptions) => {
                                console.log(
                                  "IterableSelect onChange - Current options:",
                                  currentOptions
                                );
                                if (currentOptions[0]?.value) {
                                  const selectedProduct = products.find(
                                    (product) =>
                                      product.id === currentOptions[0].value
                                  );
                                  console.log(
                                    "Selected product:",
                                    selectedProduct
                                  );

                                  if (selectedProduct) {
                                    const newOrderItem: typeof item = {
                                      ...item,
                                      price: selectedProduct.price,
                                      productId: selectedProduct.id,
                                      noestReady: item.noestReady,
                                      product: {
                                        name: selectedProduct.name,
                                        imageUrls: selectedProduct.imageUrls,
                                        weight: selectedProduct.weight || 0,
                                      },
                                    };

                                    console.log(
                                      "New order item:",
                                      newOrderItem
                                    );
                                    field.onChange(
                                      field.value.map((item, i) =>
                                        i === index ? newOrderItem : item
                                      )
                                    );
                                  }
                                } else {
                                  console.log(
                                    "No product selected, setting empty item"
                                  );
                                  const emptyItem = {
                                    productId: "",
                                    quantity: 1,
                                    price: 0,
                                    noestReady: false,
                                    product: {
                                      name: "",
                                      imageUrls: [],
                                      weight: 0,
                                    },
                                  };
                                  field.onChange(
                                    field.value.map((item, i) =>
                                      i === index ? emptyItem : item
                                    )
                                  );
                                }
                              }}
                            />

                            <Input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => {
                                const newQuantity = parseInt(e.target.value);
                                const newProducts = [...field.value];
                                newProducts[index] = {
                                  ...newProducts[index],
                                  quantity: newQuantity,
                                };
                                form.setValue("items", newProducts);
                              }}
                              className="w-14"
                            />

                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => {
                                const newProducts = [...field.value];
                                newProducts.splice(index, 1);
                                form.setValue("items", newProducts);
                              }}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>

                          <div>
                            {item.productId && (
                              <span className="text-sm text-muted-foreground pl-2">
                                {formatCurrency(item.price)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      onClick={() =>
                        form.setValue("items", [
                          ...field.value,
                          {
                            productId: "",
                            quantity: 1,
                            price: 0,
                            noestReady: false,
                            trackingId: null,
                            tracking: undefined,
                            product: {
                              name: "",
                              imageUrls: [],
                              weight: 0,
                            },
                          },
                        ])
                      }
                      disabled={
                        field.value[field.value.length - 1].productId === ""
                          ? true
                          : false
                      }
                    >
                      <Plus className="mr-2 h-4 w-4" /> Add Item
                    </Button>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              control={form.control}
              name="subtotalAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subtotal</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="shippingPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Shipping</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value))
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setIsOpen(!isOpen)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={orderUpdateLoading}>
                {orderUpdateLoading ? (
                  <div className="flex items-center justify-center">
                    <Loader2
                      className="w-4 h-4 mr-2 animate-spin"
                      strokeWidth={1.5}
                    />
                    Loading...
                  </div>
                ) : (
                  "Save changes"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
interface IterableSelectProps {
  item: {
    quantity: number;
    price: number;
    productId: string;
    product?: {
      name: string;
      imageUrls: string[];
      weight: number;
    };
  };
  productOptions: Option[];
  onChange?: (prevOptions: Option[], currentOptions: Option[]) => void;
}
function IterableSelect({
  item,
  productOptions,
  onChange,
}: IterableSelectProps) {
  const {
    resetProducts,
    productSearchParams,
    setProductSearchParams,
    loading,
    error,
  } = useProductsContext();
  const [selectedProduct, setSelectedProduct] = useState<Option[]>(
    item.productId && item.product?.name
      ? [
          {
            value: item.productId,
            label: item.product.name,
          },
        ]
      : []
  );

  const debouncedSearch = useDebounce((value: string) => {
    const newParams: ProductSearchParams = {
      ...productSearchParams,
      query: value,
    };
    setProductSearchParams(newParams);

    resetProducts(newParams);
  }, 500);
  const handleSearchChange = (value: string) => {
    debouncedSearch(value);
  };

  return (
    <BetterSelect
      options={productOptions}
      selectedOptions={selectedProduct}
      setSelectedOptions={setSelectedProduct}
      onChange={onChange}
      dbSearch={handleSearchChange}
      loading={loading}
      error={error}
    />
  );
}
