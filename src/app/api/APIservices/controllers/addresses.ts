import { PrismaClient } from "@prisma/client";
import { AddressSchema } from "../lib/validation";
import { Address } from "@/types/types";

const prisma = new PrismaClient();

export async function getAllAddresses(userId: string) {
  try {
    // Validate userId
    if (!userId) {
      throw new Error("User ID is required");
    }

    // Fetch all addresses for the user
    const addresses = await prisma.address.findMany({
      where: { userId },
    });

    return addresses;
  } catch (error) {
    console.error("Error fetching addresses:", error);
    throw error;
  }
}

export async function createAddress(userId: string, addressData: Address) {
  console.log(addressData);
  try {
    // Validate userId
    if (!userId) {
      throw new Error("User ID is required");
    }

    // Validate address data
    const validatedAddress = AddressSchema.parse(addressData);

    // Create new address
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
    // Delete the address
    const deletedAddress = await prisma.address.delete({
      where: { id: addressId },
    });

    return deletedAddress;
  } catch (error) {
    console.error("Error deleting address:", error);
    throw error;
  }
}
