import { Prisma, PrismaClient } from "@prisma/client";
import { KotekOrderSchema } from "../lib/validation";
import { KotekOrder } from "@/types/types";
import { DefaultArgs } from "@prisma/client/runtime/library";

const prisma = new PrismaClient();

export async function getAllKotekOrders(userId: string) {
  try {
    // Validate userId
    if (!userId) {
      throw new Error("User ID is required");
    }

    // Fetch all Kotek Orders for the user with related items and address
    const kotekOrders = await prisma.order.findMany({
      where: { userId },
      include: {
        items: true,
        address: true,
      },
    });

    return kotekOrders;
  } catch (error) {
    console.error("Error fetching Kotek Orders:", error);
    throw error;
  }
}

export async function getKotekOrderById(kotekOrderId: string) {
  try {
    // Fetch a specific Kotek Order with related items and address
    const kotekOrder = await prisma.order.findUnique({
      where: { id: kotekOrderId },
      include: {
        items: true,
        address: true,
      },
    });

    if (!kotekOrder) {
      throw new Error("Kotek Order not found");
    }

    return kotekOrder;
  } catch (error) {
    console.error("Error fetching Kotek Order:", error);
    throw error;
  }
}
export async function createKotekOrder(
  userId: string | null,
  kotekOrderData: KotekOrder
) {
  try {
    // Validate address conditions
    if (!kotekOrderData.addressId && !kotekOrderData.guestAddress) {
      throw new Error("Either addressId or guestAddress must be provided");
    }

    if (userId && !kotekOrderData.addressId) {
      throw new Error(
        "Logged-in users must provide an addressId, not a guestAddress."
      );
    }

    // Validate Kotek Order data
    const validatedKotekOrder = KotekOrderSchema.parse({
      ...kotekOrderData,
      userId,
    });

    // Prepare order creation data
    const orderCreateData: any = {
      status: validatedKotekOrder.status,
      totalAmount: validatedKotekOrder.totalAmount,
      subtotalAmount: validatedKotekOrder.subtotalAmount,
      items: {
        create: validatedKotekOrder.items.map((item) => ({
          quantity: item.quantity,
          price: item.price,
          productId: item.productId,
        })),
      },
    };

    // Add user connection if userId exists
    if (userId) {
      orderCreateData.userId = userId;
    }
    if (validatedKotekOrder.addressId) {
      orderCreateData.addressId = validatedKotekOrder.addressId;
      orderCreateData.address = {
        connect: { id: validatedKotekOrder.addressId },
      };
    }

    // Add guest address if provided
    if (validatedKotekOrder.guestAddress) {
      orderCreateData.guestAddress = validatedKotekOrder.guestAddress;
    }

    // Create new Kotek Order with related items
    const newKotekOrder = await prisma.order.create({
      data: orderCreateData,
      include: {
        items: true,
      },
    });

    return newKotekOrder;
  } catch (error) {
    console.error("Error creating Kotek Order:", error);
    throw error;
  }
}

export async function updateKotekOrder(
  kotekOrderId: string,
  kotekOrderData: Partial<KotekOrder>
) {
  try {
    // Validate Kotek Order data (partial validation)
    const validatedKotekOrder =
      KotekOrderSchema.partial().parse(kotekOrderData);

    // Update Kotek Order
    const updatedKotekOrder = await prisma.order.update({
      where: { id: kotekOrderId },
      data: {
        status: validatedKotekOrder.status,
        totalAmount: validatedKotekOrder.totalAmount,
        subtotalAmount: validatedKotekOrder.subtotalAmount,
        addressId: validatedKotekOrder.addressId,
        items: validatedKotekOrder.items
          ? {
              deleteMany: {}, // Remove existing items
              create: validatedKotekOrder.items.map((item) => ({
                quantity: item.quantity,
                price: item.price,
                productId: item.productId,
              })),
            }
          : undefined,
      },
      include: {
        items: true,
        address: true,
      },
    });

    return updatedKotekOrder;
  } catch (error) {
    console.error("Error updating Kotek Order:", error);
    throw error;
  }
}

export async function deleteKotekOrder(kotekOrderId: string) {
  try {
    // Verify the order belongs to the user before deleting
    const existingOrder = await prisma.order.findUnique({
      where: {
        id: kotekOrderId,
      },
    });

    if (!existingOrder) {
      throw new Error("Kotek Order not found or does not belong to the user");
    }

    // Delete the Kotek Order (Prisma will cascade delete related items)
    const deletedKotekOrder = await prisma.order.delete({
      where: { id: kotekOrderId },
    });

    return deletedKotekOrder;
  } catch (error) {
    console.error("Error deleting Kotek Order:", error);
    throw error;
  }
}

export async function secondCreateKotekOrder(
  userId: string | null,
  kotekOrderData: KotekOrder
) {
  try {
    // Validate Kotek Order data
    const validatedData = KotekOrderSchema.parse({
      ...kotekOrderData,
      userId,
    });

    if (!validatedData.addressId && validatedData.userId)
      throw new Error("logged-in users must provide an addressId");

    if (!validatedData.guestAddress && !validatedData.addressId)
      throw new Error("Either addressId or guestId must be provided");
    console.log(validatedData.guestAddress);
    const createQuery: Prisma.OrderCreateArgs<DefaultArgs> = {
      data: {
        status: validatedData.status,
        totalAmount: validatedData.totalAmount,
        subtotalAmount: validatedData.subtotalAmount,
        items: {
          create: validatedData.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: {
        items: true,
      },
    };

    if (userId && validatedData.addressId) {
      createQuery.data.user = {
        connect: { id: userId },
      };
      createQuery.data.address = {
        connect: { id: validatedData.addressId },
      };
    }
    if (validatedData.guestAddress) {
      createQuery.data.guestAddress = validatedData.guestAddress;
    }
    const newKotekOrder = await prisma.order.create(createQuery);

    return newKotekOrder;
  } catch (error) {
    console.error("Error creating Kotek Order:", error);
    throw error;
  }
}
