import { NextRequest, NextResponse } from "next/server";
import { createProduct, getAllProducts, productValidation } from "../APIservices/controllers/products";
import { createCategory } from "../APIservices/controllers/categories";

export async function GET(request: NextRequest) {
  try {
    const products = await getAllProducts();
    return new Response(JSON.stringify(products), { status: 200 });
  } catch (error) {
    console.error("Error fetching categories:", error);
    // Return a generic error message for unknown errors
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";

    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await productValidation(request, "POST");
    console.log(data)
    await createProduct(data);
    return NextResponse.json(
      { message: "Product created successfully." },
      { status: 201 }
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      let status = 500;
      let message = error.message;
      if (message.startsWith("Validation")) status = 400;
      if (message.startsWith("Conflict")) status = 409;
      console.error(error);
      return NextResponse.json({ message: message }, { status: status });
    } else {
      console.error("Unknown Error");
      return NextResponse.json({ message: "Unknown Error" }, { status: 500 });
    }
  }
}
