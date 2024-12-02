
import { useEffect } from "react";
import { useCart } from "@/context/CartContext"; // Assuming you have this context
import { useKotekOrder } from "@/context/KotekOrderContext";

export default function useCreateKotekOrder() {
  const { kotekOrder, setKotekOrder } = useKotekOrder(); // Use context here
  const { cart } = useCart(); // Get cart from context

  // Set cart items and total amount
  useEffect(() => {
    if (cart && cart.items.length > 0) {
      // Calculate totalAmount
      const totalAmount = cart.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );

      // Map cart items to the order items structure
      const orderItems = cart.items.map((item) => ({
        quantity: item.quantity,
        price: item.price,
        productId: item.productId,
      }));

      setKotekOrder((prevState) => ({
        ...prevState,
        items: orderItems,
        totalAmount, // Update totalAmount based on cart items
      }));
    }
  }, [cart, setKotekOrder]); // Update when cart changes

  return {
    kotekOrder,
    setKotekOrder,
  };
}
