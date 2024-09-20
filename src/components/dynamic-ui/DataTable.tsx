import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { CircleAlert } from "lucide-react"; // Import icons
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export interface Column {
  header: string;
  important?: boolean;
  badge?: boolean;
  hasSecondaryData?: boolean;
}

export interface Row {
  [key: string]: any;
}

interface DataTableProps {
  title: React.ReactNode;
  description?: string;
  columns: Column[];
  rows: Row[];
  actions?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  isLoading?: boolean;
  error?: unknown;
  currentPage: number;
  totalPages: number;
  setPage: Function;

}

export function DataTable({
  title,
  description,
  columns,
  rows,
  actions,
  footer,
  className = "",
  isLoading = false,
  error,
  currentPage,
  totalPages,
  setPage,

}: DataTableProps) {
  const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".avif", ".webp"];

  const isImage = (value: any): boolean => {
    if (typeof value !== "string") return false;
    return (
      imageExtensions.some((extension) =>
        value.toLowerCase().endsWith(extension)
      ) || value.startsWith("http")
    );
  };

  return (
    <Card className={`${className}`}>
      <CardHeader>
        <div className="flex flex-col">
          {!error && <CardTitle className="sm:pb-2">{title}</CardTitle>}
          {description && !error && (
            <CardDescription className="hidden sm:block">
              {description}
            </CardDescription>
          )}
          {actions && !error && <div className="mt-2">{actions}</div>}
        </div>
      </CardHeader>
      <CardContent>
        {error ? (
          <div className="flex flex-col items-center justify-center text-red-400 ">
            <CircleAlert className="w-8 h-8 mb-4" strokeWidth={1.5} />
            <h2 className="text-lg font-semibold">Something went wrong</h2>
            <p className="my-2 text-center">
              We encountered an issue while loading the data. Please try again
              later.
            </p>
          </div>
        ) : isLoading ? (
          <Table>
            <TableHeader>
              <TableRow className="flex w-full">
                {columns.map((column, index) => (
                  <TableHead
                    key={index}
                    className={`flex-1 flex justify-center items-center ${
                      column.important ? "" : "hidden sm:flex"
                    }`}
                  >
                    {column.header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(5)].map((_, rowIndex) => (
                <TableRow key={rowIndex} className="flex w-full">
                  {columns.map((column, colIndex) => (
                    <TableCell
                      key={colIndex}
                      className={`flex-1 flex justify-center items-center ${
                        column.important ? "" : "hidden sm:flex"
                      }`}
                    >
                      {column.header === "Image" ? (
                        <Skeleton className="w-12 h-12 rounded-md" />
                      ) : (
                        <Skeleton className="w-[100px] h-[20px] rounded-full" />
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow className="flex w-full">
                  {columns.map((column, index) => (
                    <TableHead
                      key={index}
                      className={`flex-1 flex justify-center items-center ${
                        column.important ? "" : "hidden sm:flex"
                      }`}
                    >
                      {column.header}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row, rowIndex) => (
                  <TableRow key={rowIndex} className="flex w-full">
                    {columns.map((column, colIndex) => {
                      const cellData =
                        row[column.header.toLowerCase().replace(/ /g, "_")];
                      const columnClass = column.important
                        ? ""
                        : "hidden sm:flex";

                      return (
                        <TableCell
                          key={colIndex}
                          className={`flex-1 flex justify-center items-center ${columnClass}`}
                        >
                          {isImage(cellData) ? (
                            <div className="relative w-16 h-16 sm:w-14 sm:h-14 md:w-12 md:h-12 lg:w-10 lg:h-10 xl:w-8 xl:h-8 2xl:w-6 2xl:h-6">
                              <Image
                                src={cellData}
                                alt="Data"
                                className="object-cover"
                                width={89}
                                height={89}
                                unoptimized={cellData.startsWith("http")}
                              />
                            </div>
                          ) : column.badge ? (
                            <Badge
                              className="text-xs"
                              variant={cellData?.filled ? "default" : "outline"}
                            >
                              {cellData?.value || cellData}
                            </Badge>
                          ) : (
                            <div className="flex flex-col items-center">
                              {column.hasSecondaryData && cellData ? (
                                <>
                                  <div className="font-medium">
                                    {cellData.primary}
                                  </div>
                                  <div className="hidden sm:block text-sm text-gray-500">
                                    {cellData.secondary}
                                  </div>
                                </>
                              ) : (
                                <div className="text-center">{cellData}</div>
                              )}
                            </div>
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {rows.length === 0 && !isLoading && !error && (
              <div className="text-center mt-5 text-gray-500">
                No data available
              </div>
            )}
          </>
        )}
        {rows.length != 0 && !isLoading && !error && totalPages > 1 && (
          <Pagination className="flex justify-end mt-8 ">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious onClick={() => setPage(currentPage - 1)} />
              </PaginationItem>
              {Array.from({ length: totalPages }, (_, index) => (
                <PaginationItem key={index}>
                  <PaginationLink
                    isActive={index + 1 === currentPage}
                    onClick={() => setPage(index + 1)}
                  >
                    {currentPage + index}
                  </PaginationLink>
                </PaginationItem>
              ))}
              {totalPages > 1 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}
              <PaginationItem>
                <PaginationNext onClick={() => setPage(currentPage + 1)} />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </CardContent>
      {footer && (
        <CardFooter className="flex justify-center">{footer}</CardFooter>
      )}
    </Card>
  );
}
