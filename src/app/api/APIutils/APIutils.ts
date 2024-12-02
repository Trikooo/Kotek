import { NextResponse } from "next/server";

export const handleError = (error: any, resource: string = "") => {
  console.error(`Error handling ${resource}:`, error);

  // Check for specific error types and return appropriate responses
  if (error instanceof SyntaxError) {
    return NextResponse.json(
      { message: `Invalid JSON format while handling ${resource}.` },
      { status: 400 }
    );
  }

  if (error instanceof TypeError) {
    return NextResponse.json(
      { message: `Type error occurred while handling ${resource}.` },
      { status: 400 }
    );
  }

  if (error instanceof RangeError) {
    return NextResponse.json(
      { message: `Value out of acceptable range while handling ${resource}.` },
      { status: 400 }
    );
  }

  // Handle resource not found dynamically
  if (
    error.message.toLowerCase().includes(`${resource.toLowerCase()} not found`)
  ) {
    return NextResponse.json(
      {
        message: `${
          resource.charAt(0).toUpperCase() + resource.slice(1)
        } not found.`,
      },
      { status: 404 }
    );
  }

  // Handle unauthorized errors dynamically
  if (error.message.toLowerCase().includes("unauthorized")) {
    return NextResponse.json(
      { message: `Unauthorized access to ${resource}.` },
      { status: 401 }
    );
  }

  // Database related errors
  if (error.message.includes("ECONNREFUSED")) {
    return NextResponse.json(
      { message: `Database connection failed while handling ${resource}.` },
      { status: 500 }
    );
  }

  // Handle validation errors
  if (error.name === "ValidationError") {
    return NextResponse.json(
      {
        message: `Validation failed while handling ${resource}: ${error.message}`,
      },
      { status: 422 }
    );
  }

  // Fallback for unexpected errors
  return NextResponse.json(
    { message: `An unexpected error occurred while handling ${resource}.` },
    { status: 500 }
  );
};

export default handleError;


