import AllProducts from "@/components/admin/products/AllProducts";
import AdminLayout from "../../AdminLayout";
import { CategoryProvider } from "@/context/CategoriesContext";
import { ProductProvider } from "@/context/ProductsContext";

export default function ManageProducts() {
  return (
    <AdminLayout>

          <div className="w-full">
            <AllProducts/>
          </div>
    </AdminLayout>
  );
}
