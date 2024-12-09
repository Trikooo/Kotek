import { Prisma, PrismaClient } from "@prisma/client";
import { KotekOrderSchema } from "../lib/validation";
import { KotekOrder } from "@/types/types";
import { DefaultArgs } from "@prisma/client/runtime/library";
import prisma from "../lib/prisma";

export async function getAllKotekOrders(
  userRole: string, // Add user role parameter
  page: number = 1,
  limit: number = 10
) {
  try {
    // Role-based access control
    if (userRole !== "ADMIN") {
      throw new Error("Unauthorized: Only admins can retrieve all orders");
    }

    // Validate pagination parameters
    const pageNumber = Math.max(1, page);
    const pageSize = Math.min(100, Math.max(1, limit));
    const skip = (pageNumber - 1) * pageSize;

    // Fetch total count of orders
    const totalOrders = await prisma.order.count();

    // Fetch orders with pagination
    const kotekOrders = await prisma.order.findMany({
      skip: skip,
      take: pageSize,
      include: {
        items: {
          select: {
            productId: true,
            price: true,
            quantity: true,
            product: {
              select: {
                imageUrls: true,
                name: true,
                weight: true,
              },
            },
          },
        },
        address: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc", // Optional: sort by most recent first
      },
    });

    return {
      orders: kotekOrders,
      pagination: {
        currentPage: pageNumber,
        pageSize: pageSize,
        totalOrders: totalOrders,
        totalPages: Math.ceil(totalOrders / pageSize),
        hasNextPage: skip + pageSize < totalOrders,
        hasPrevPage: pageNumber > 1,
      },
    };
  } catch (error) {
    console.error("Error fetching all Kotek Orders:", error);
    throw error;
  }
}
export async function getAllUserKotekOrders(
  userId: string,
  page: number = 1,
  limit: number = 10
) {
  try {
    // Validate userId
    if (!userId) {
      throw new Error("User ID is required");
    }

    // Validate pagination parameters
    const pageNumber = Math.max(1, page);
    const pageSize = Math.min(100, Math.max(1, limit));
    const skip = (pageNumber - 1) * pageSize;

    // Fetch total count of user's orders
    const totalUserOrders = await prisma.order.count({
      where: { userId },
    });

    // Fetch user's orders with pagination
    const kotekOrders = await prisma.order.findMany({
      where: { userId },
      skip: skip,
      take: pageSize,
      include: {
        items: {
          select: {
            productId: true,
            price: true,
            quantity: true,
            product: {
              select: {
                imageUrls: true,
                name: true,
                weight: true,
              },
            },
          },
        },
        address: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc", // Optional: sort by most recent first
      },
    });

    return {
      orders: kotekOrders,
      pagination: {
        currentPage: pageNumber,
        pageSize: pageSize,
        totalOrders: totalUserOrders,
        totalPages: Math.ceil(totalUserOrders / pageSize),
        hasNextPage: skip + pageSize < totalUserOrders,
        hasPrevPage: pageNumber > 1,
      },
    };
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
