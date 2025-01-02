"use client"
import { useMutation, useQuery, QueryClient } from "@tanstack/react-query";
import axios from "axios";

type Feedback = {
  userId: string;
  sentiment: "negative" | "neutral" | "positive";
  message: string;
};

// Query key constants
export const feedbackKeys = {
  all: ["feedback"] as const,
  list: (userId?: string) => [...feedbackKeys.all, "list", userId] as const,
};

// Get feedbacks hook
export const useGetFeedbacks = (userId?: string) => {
  return useQuery({
    queryKey: feedbackKeys.list(userId),
    queryFn: async () => {
      const url = userId ? `/api/feedback?userId=${userId}` : "/api/feedback";
      const response = await axios.get(url);
      return response.data as Feedback[];
    },
  });
};

// Create feedback hook
export const useCreateFeedback = () => {
  const queryClient = new QueryClient();

  return useMutation({
    mutationFn: async (newFeedback: Feedback) => {
      const response = await axios.post(
        `/api/feedback?userId=${newFeedback.userId}`,
        newFeedback,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data as Feedback;
    },
    onSuccess: () => {
      // Invalidate relevant queries to refetch the updated data
      queryClient.invalidateQueries({ queryKey: feedbackKeys.all });
    },
  });
};
