import axios from "axios";

export const handleAxiosError = (error: unknown): Error => {
  if (axios.isAxiosError(error)) {
    return new Error(error.response?.data || error.message);
  } else {
    return new Error("Unexpected error occurred");
  }
};
