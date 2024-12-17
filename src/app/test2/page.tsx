import CreateProductV3 from "@/components/admin/products/CreateProduct";
import AdminLayout from "../admin/AdminLayout";

export default function page() {
  return (
    <AdminLayout>
      <CreateProductV3 />
    </AdminLayout>
  );
}
