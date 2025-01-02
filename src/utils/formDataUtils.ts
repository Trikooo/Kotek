import { EMPTY_ADDRESS } from "@/lib/constants";
import { CreateProductT, KotekOrder, NoestOrderForm } from "@/types/types";

export function createProductFormData(product: Partial<CreateProductT>) {
  const formData = new FormData();
  formData.append("name", product.name ?? "");
  formData.append("featured", String(product.featured ?? false));
  formData.append("description", product.description ?? "");
  formData.append("price", product.price?.toString() ?? "");
  formData.append("stock", product.stock?.toString() ?? "");
  formData.append("barcode", product.barcode ?? "");
  formData.append("categoryId", product.categoryId ?? "");
  formData.append("tags", product.tags ?? "");
  formData.append("keyFeatures", product.keyFeatures ?? "");
  formData.append("brand", product.brand ?? "");
  formData.append("status", product.status ?? "ACTIVE");
  formData.append("length", product.length?.toString() ?? "");
  formData.append("width", product.width?.toString() ?? "");
  formData.append("height", product.height?.toString() ?? "");
  formData.append("weight", product.weight?.toString() ?? "");

  if (product.images && product.images.length > 0) {
    product.images.forEach((file) => {
      formData.append("images[]", file);
    });
  }
  return formData;
}

export function updateProductFormData(updatedProduct: any) {
  const formData = new FormData();
  Object.entries(updatedProduct).forEach(([key, value]) => {
    if (key === "images" && Array.isArray(value)) {
      (value as File[]).forEach((image: File) => {
        formData.append("images[]", image);
      });
    } else if (key === "imageUrls") {
      formData.append(key, JSON.stringify(value));
    } else if (key === "imagesToDelete") {
      formData.append(key, JSON.stringify(value));
    } else if (key === "featured" && typeof value === "boolean") {
      formData.append(key, value.toString());
    } else if (value !== undefined && value !== null) {
      formData.append(key, value.toString());
    }
  });
  return formData;
}

export function createNoestForms(order: KotekOrder): NoestOrderForm[] {
  const address = order.address || order.guestAddress || EMPTY_ADDRESS;

  // Group items by tracking number
  const itemsByTracking: Record<string, typeof order.items> = {};

  order.items.forEach((item) => {
    const trackingNumber = item.tracking?.trackingNumber || "untracked";
    if (!itemsByTracking[trackingNumber] && trackingNumber === "untracked") {
      itemsByTracking[trackingNumber] = [];
    }
    if (trackingNumber === "untracked" && item.noestReady === true) {
      itemsByTracking[trackingNumber].push(item);
    }
  });

  // Create a Noest form for each tracking group
  return Object.entries(itemsByTracking).map(([trackingNumber, items]) => {
    const totalWeight = Math.ceil(
      items.reduce(
        (sum, item) => sum + (item.product?.weight || 1) * item.quantity,
        0
      ) / 1000
    );

    const totalAmount =
      items.reduce((sum, item) => sum + item.price * item.quantity, 0) +
      order.shippingPrice;

    return {
      reference: order.id,
      client: address.fullName,
      phone: address.phoneNumber,
      phone_2: address.secondPhoneNumber || undefined,
      adresse: address.address,
      wilaya_id: parseInt(address.wilayaValue, 10),
      commune: address.commune,
      montant: totalAmount,
      produit: items
        .filter(
          (item) => item.noestReady === true && !item.tracking?.trackingNumber
        )
        .map(
          (item) =>
            `${item.product?.name || "Unknown Product"} (x${item.quantity})`
        )
        .join(", "),
      type_id: 1,
      poids: totalWeight,
      stop_desk: address.stopDesk ? 1 : 0,
      station_code: address.stationCode,
      stock: 0,
      can_open: 1,
    };
  });
}
