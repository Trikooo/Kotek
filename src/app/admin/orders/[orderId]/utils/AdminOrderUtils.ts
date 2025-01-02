import { OrderStatus } from "@prisma/client";

export function getStatusColor(status: OrderStatus) {
  switch (status) {
    case "PENDING":
      return "bg-orange-50 text-orange-600";
    case "PROCESSING":
      return "bg-blue-50 text-blue-600";
    case "DISPATCHED":
      return "bg-green-50 text-green-600";
    case "DELIVERED":
      return "bg-green-600 hover:bg-green-500";
    case "CANCELLED":
      return "";
    default:
      return "";
  }
}

export function getStatusVariant(status: OrderStatus) {
  if (status === "DELIVERED") {
    return "default";
  } else if (status === "CANCELLED") {
    return "destructive";
  } else {
    return "outline";
  }
}

export function getCircleStatusColor(status: OrderStatus) {
  switch (status) {
    case "PENDING":
      return "bg-orange-500";
    case "PROCESSING":
      return "bg-blue-600";
    case "DISPATCHED":
      return "bg-green-100 outline outline-green-600";
    case "DELIVERED":
      return "bg-green-600 hover:bg-green-500";
    case "CANCELLED":
      return "bg-red-600 hover:bg-red-500";
    default:
      return "";
  }
}
