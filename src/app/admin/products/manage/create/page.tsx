import AdminLayout from "@/app/admin/AdminLayout";
import CreateProduct from "@/components/admin/products/CreateProduct";

export default function createProductPage() {
  return (
    <AdminLayout>
      <CreateProduct />
    </AdminLayout>
  );
}
