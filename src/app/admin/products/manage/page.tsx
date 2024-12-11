import AllProducts from "@/components/admin/products/AllProducts";
import AdminLayout from "../../AdminLayout";

export default function ManageProducts() {
  return (
    <AdminLayout>
      <div className="w-full">
        <AllProducts />
      </div>
    </AdminLayout>
  );
}
