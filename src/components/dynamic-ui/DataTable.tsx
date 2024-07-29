import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter, // Import CardFooter for footer section
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
  title: string;
  description?: string;
  columns: Column[];
  rows: Row[];
  actions?: React.ReactNode;
  footer?: React.ReactNode; // Add footer prop
  className?: string;
}

export function DataTable({
  title,
  description,
  columns,
  rows,
  actions,
  footer, // Include footer in props
  className = "",
}: DataTableProps) {
  const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".avif", ".webp"];

  const isImage = (value: any): boolean => {
    if (typeof value !== "string") return false;
    return imageExtensions.some(extension => value.endsWith(extension));
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="sm:pb-2">{title}</CardTitle>
            {description && (
              <CardDescription className="hidden sm:block">
                {description}
              </CardDescription>
            )}
          </div>
          {actions && <div className="ml-4">{actions}</div>}
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column, index) => (
                <TableHead
                  key={index}
                  className={`${
                    column.important ? "" : "hidden sm:table-cell"
                  } ${index === columns.length - 1 ? "text-right" : ""}`}
                >
                  {column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {columns.map((column, colIndex) => {
                  const cellData = row[column.header.toLowerCase().replace(/ /g, "_")];
                  const columnClass = column.important ? "" : "hidden sm:table-cell";
                  const useBadge = column.badge;

                  return (
                    <TableCell
                      key={colIndex}
                      className={`${
                        column.header === columns[columns.length - 1].header
                          ? "text-right"
                          : ""
                      } ${columnClass}`}
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
                        <>
                          {column.hasSecondaryData && cellData ? (
                            <>
                              <div className="font-medium">{cellData.primary}</div>
                              <div className="hidden sm:block text-sm text-gray-500">
                                {cellData.secondary}
                              </div>
                            </>
                          ) : (
                            cellData
                          )}
                        </>
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {rows.length === 0 && (
          <div className="text-center text-gray-500">N/A</div>
        )}
      </CardContent>
      {footer && <CardFooter>{footer}</CardFooter>}
    </Card>
  );
}
