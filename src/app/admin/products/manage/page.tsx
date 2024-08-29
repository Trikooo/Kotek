import AllProducts from "@/components/admin/products/AllProducts";
import AdminLayout from "../../AdminLayout";

export default function ManageProducts() {
  // Define a dummy product
  const dummyProducts = [
    {
      id: "1",
      name: "Dummy Product",
      price: 12345, // Example price in DA
      stock: 20,
      imageUrl: "https://via.placeholder.com/150", // Placeholder image URL
      status: "ACTIVE" as const
    }
  ];

  return (
    <AdminLayout>
      <div className="w-full">
      <AllProducts products={dummyProducts} />
      </div>
    </AdminLayout>
  );
}
