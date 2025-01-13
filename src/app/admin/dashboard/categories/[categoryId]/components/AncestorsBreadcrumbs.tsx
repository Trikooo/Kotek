import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Skeleton } from "@/components/ui/skeleton";
import { CategoryWithSubcategoriesT } from "@/types/types";
import { Category } from "@prisma/client";

const CategoryBreadcrumbs = ({
  ancestors,
  currentCategory,
  isLoading,
}: {
  ancestors: Partial<Category>[];
  currentCategory?: CategoryWithSubcategoriesT;
  isLoading: boolean;
}) => {
  if (isLoading) {
    return <Skeleton className="w-48 h-8" />;
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/admin/dashboard/categories">
            Categories
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        {ancestors.map((ancestor, index) => (
          <BreadcrumbItem key={ancestor.id}>
            <BreadcrumbLink href={`/admin/dashboard/categories/${ancestor.id}`}>
              {ancestor.name}
            </BreadcrumbLink>
            <BreadcrumbSeparator />
          </BreadcrumbItem>
        ))}
        <BreadcrumbItem>
          {currentCategory && (
            <BreadcrumbPage>{currentCategory.name}</BreadcrumbPage>
          )}
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
};
export default CategoryBreadcrumbs;
