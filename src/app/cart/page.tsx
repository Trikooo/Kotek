import CartItemCard from "@/components/store/cart/CartItemCard";
import StoreLayout from "../store/StoreLayout";
import OrderSummary from "@/components/store/cart/OrderSummary";

export default function Cart() {
  return (
    <StoreLayout>
      <div className="flex flex-col justify-center items-center mt-24">
        <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-6xl">
          Your Cart
        </h1>
        <div className=" mt-14 w-full">

          <CartItemCard />
          <OrderSummary />
        </div>
      </div>
    </StoreLayout>
  );
}
