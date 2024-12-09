import axios, { AxiosError } from "axios";

export const handleAxiosError = (error: unknown): Error | AxiosError => {
  if (axios.isAxiosError(error)) {
    // Extract more detailed error information
    const errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Request failed";

    const statusCode = error.response?.status;

    // Create a more informative error message
    const fullErrorMessage = statusCode
      ? `Error ${statusCode}: ${errorMessage}`
      : errorMessage;

    // Log the full error for debugging
    console.error("Axios Error:", {
      message: fullErrorMessage,
      status: statusCode,
      data: error.response?.data,
    });

    return new Error(fullErrorMessage);
  } else if (error instanceof Error) {
    // Handle standard JavaScript errors
    return error;
  } else {
    // Fallback for completely unexpected errors
    const errorString =
      typeof error === "string" ? error : JSON.stringify(error);

    console.error("Unexpected error:", errorString);
    return new Error(`Unexpected error: ${errorString}`);
  }
};
