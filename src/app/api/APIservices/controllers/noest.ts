import { NoestCreateResponse, NoestOrderForm } from "@/types/types";
import axios, { isAxiosError } from "axios";
import { z } from "zod";
import {
  CreateNoestOrderSchema,
  UpdateNoestOrderSchema,
} from "../lib/validation";

export async function deleteNoestOrder(tracking: string) {
  const response = await axios.post<NoestCreateResponse>(
    "https://app.noest-dz.com/api/public/delete/order",
    { tracking, user_guid: process.env.NOEST_GUID }, // Send user_guid in body
    {
      headers: {
        Authorization: `Bearer ${process.env.NOEST_TOKEN}`,
      },
    }
  );
  return response;
}

export async function createSingleNoestOrder(data: NoestOrderForm) {
  const validatedData = CreateNoestOrderSchema.parse(data);

  const response = await axios.post<NoestCreateResponse>(
    "https://app.noest-dz.com/api/public/create/order",
    { ...validatedData, user_guid: process.env.NOEST_GUID }, // Send user_guid in body
    {
      headers: {
        Authorization: `Bearer ${process.env.NOEST_TOKEN}`,
      },
    }
  );
  return response;
}

export async function createNoestOrders(data: NoestOrderForm[]) {
  const results: Array<{
    response?: NoestCreateResponse;
    error?: any;
    items?: NoestOrderForm["produit"];
  }> = [];

  for (const orderForm of data) {
    try {
      const validatedData = CreateNoestOrderSchema.parse(orderForm);

      const response = await axios.post<NoestCreateResponse>(
        "https://app.noest-dz.com/api/public/create/order",
        { ...validatedData, user_guid: process.env.NOEST_GUID }, // Send user_guid in body
        {
          headers: {
            Authorization: `Bearer ${process.env.NOEST_TOKEN}`,
          },
        }
      );

      results.push({
        response: response.data,
        items: orderForm.produit,
      });
    } catch (error) {
      results.push({
        error: error,
        items: orderForm.produit,
      });
    }
  }

  return results;
}

export async function validateNoestOrders(trackings: string[]): Promise<any[]> {
  const results = [];

  for (const tracking of trackings) {
    const response = await axios.post(
      "https://app.noest-dz.com/api/public/valid/order",
      { tracking, user_guid: process.env.NOEST_GUID }, // Send user_guid in body
      {
        headers: {
          Authorization: `Bearer ${process.env.NOEST_TOKEN}`,
        },
      }
    );
    results.push(response.data); // Collect the response data
  }

  return results;
}

export async function updateNoestOrders(data: NoestOrderForm[]) {
  const results: Array<{
    response?: NoestCreateResponse;
    error?: any;
    items?: NoestOrderForm["produit"];
  }> = [];

  for (const orderForm of data) {
    try {
      const validatedData = UpdateNoestOrderSchema.parse(orderForm);

      const response = await axios.post<NoestCreateResponse>(
        "https://app.noest-dz.com/api/public/update/order",
        { ...validatedData, user_guid: process.env.NOEST_GUID }, // Send user_guid in body
        {
          headers: {
            Authorization: `Bearer ${process.env.NOEST_TOKEN}`,
          },
        }
      );

      results.push({
        response: response.data,
        items: orderForm.produit,
      });
    } catch (error) {
      results.push({
        error: error,
        items: orderForm.produit,
      });
    }
  }

  return results;
}

export async function getLabel(tracking: string) {
  const response = await axios.get(
    "https://app.noest-dz.com/api/public/get/order/label",
    {
      params: { tracking }, // Send tracking in params
      headers: {
        Authorization: `Bearer ${process.env.NOEST_TOKEN}`,
      },
      responseType: "arraybuffer",
    }
  );

  return response;
}
