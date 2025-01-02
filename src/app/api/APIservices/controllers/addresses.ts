import { Prisma, PrismaClient } from "@prisma/client";
import { AddressSchema } from "../lib/validation";
import { Address } from "@/types/types";

const prisma = new PrismaClient();

export async function getAllAddresses(userId: string) {
  try {
    // Fetch all addresses for the user
    const addresses = await prisma.address.findMany({
      where: { userId, archived: false },
    });

    return addresses;
  } catch (error) {
    console.error("Error fetching addresses:", error);
    throw error;
  }
}

export async function createAddress(userId: string, addressData: Address) {
  try {
    // Validate address data
    const validatedAddress = AddressSchema.parse(addressData);

    // Check if the address already exists and is archived
    const existingAddress = await prisma.address.findUnique({
      where: {
        wilayaValue_commune_address_userId_fullName_phoneNumber: {
          wilayaValue: validatedAddress.wilayaValue,
          commune: validatedAddress.commune,
          address: validatedAddress.address,
          userId: userId,
          fullName: validatedAddress.fullName,
          phoneNumber: validatedAddress.phoneNumber,
        },
      },
    });

    if (existingAddress) {
      // If the address exists and is archived, unarchive it
      if (existingAddress.archived) {
        const unArchivedAddress = await prisma.address.update({
          where: { id: existingAddress.id },
          data: { archived: false },
        });
        return unArchivedAddress;
      }

      // If the address is already active, throw an error with a custom message
      throw new Prisma.PrismaClientKnownRequestError(
        `Unique constraint failed on wilayaValue_commune_address_userId`,
        { code: "P2002", clientVersion: Prisma.prismaVersion.client }
      );
    }

    // If the address doesn't exist, create a new one
    const newAddress = await prisma.address.create({
      data: {
        ...validatedAddress,
        userId,
      },
    });

    return newAddress;
  } catch (error) {
    console.error("Error creating address:", error);
    throw error;
  }
}

export async function updateAddress(
  addressId: string,
  addressData: Partial<Address>
) {
  try {
    // Validate address data (partial validation)
    const validatedAddress = AddressSchema.partial().parse(addressData);
    // Update address
    const updatedAddress = await prisma.address.update({
      where: { id: addressId },
      data: validatedAddress,
    });

    return updatedAddress;
  } catch (error) {
    console.error("Error updating address:", error);
    throw error;
  }
}

export async function deleteAddress(addressId: string) {
  try {
    // Check if the address has related orders
    const address = await prisma.address.findUnique({
      where: { id: addressId },
      include: { Order: true },
    });

    if (address && address.Order.length > 0) {
      // If related orders exist, archive the address
      const archivedAddress = await prisma.address.update({
        where: { id: addressId },
        data: { archived: true },
      });

      return archivedAddress;
    } else {
      // If no related orders, delete the address
      const deletedAddress = await prisma.address.delete({
        where: { id: addressId },
      });

      return deletedAddress;
    }
  } catch (error) {
    console.error("Error deleting address:", error);
    throw error;
  }
}
