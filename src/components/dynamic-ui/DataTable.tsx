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
}: DataTableProps) {
  const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".avif", ".webp"];

  const isImage = (value: any): boolean => {
    if (typeof value !== "string") return false;
    return imageExtensions.some(extension => value.endsWith(extension));
  };

  return (
    <Card className={`${className}`}>
      <CardHeader>
        <div className="flex flex-col">
          <CardTitle className="sm:pb-2">{title}</CardTitle>
          {description && (
            <CardDescription className="hidden sm:block">
              {description}
            </CardDescription>
          )}
          {actions && <div className="mt-2">{actions}</div>}
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
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
                    const cellData = row[column.header.toLowerCase().replace(/ /g, "_")];
                    const columnClass = column.important ? "" : "hidden sm:flex";
                    const useBadge = column.badge;

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
                            />
                          </div>
                        ) : useBadge && cellData ? (
                          <Badge
                            className="text-xs"
                            variant={cellData.filled ? "default" : "outline"}
                          >
                            {cellData.value}
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
                              cellData
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
        )}
        {rows.length === 0 && !isLoading && (
          <div className="text-center text-gray-500">N/A</div>
        )}
      </CardContent>
      {footer && <CardFooter className="flex justify-center">{footer}</CardFooter>}
    </Card>
  );
}