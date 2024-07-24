"use client";  // Ensure this component is rendered on the client side

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Fragment } from "react";

const BreadCrumbs: React.FC = () => {
  const pathname = usePathname();

  // Split the pathname into segments and remove the leading empty segment
  const segments = pathname.split('/').filter(segment => segment);

  // Define a map for breadcrumb names if necessary
  const breadcrumbNames: { [key: string]: string } = {
    'dashboard': 'Dashboard',
    'orders': 'Orders',
    'recent-orders': 'Recent Orders',
    // Add more mappings as needed
  };

  return (
    <Breadcrumb className="hidden md:flex">
      <BreadcrumbList>
        {segments.map((segment, index) => {
          const href = '/' + segments.slice(0, index + 1).join('/');
          const isLast = index === segments.length - 1;
          const label = breadcrumbNames[segment] || segment.charAt(0).toUpperCase() + segment.slice(1).replace('-', ' ');

          return (
            <Fragment key={href}>
              {index > 0 && <BreadcrumbSeparator />}
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  {isLast ? (
                    <BreadcrumbPage>{label}</BreadcrumbPage>
                  ) : (
                    <Link href={href}>{label}</Link>
                  )}
                </BreadcrumbLink>
              </BreadcrumbItem>
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

export default BreadCrumbs;
