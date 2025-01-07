import { Carousel } from "@/types/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

// Query Keys
const CAROUSEL_KEYS = {
  all: ["carousel"] as const,
  lists: () => [...CAROUSEL_KEYS.all, "list"] as const,
  list: (filters: string) => [...CAROUSEL_KEYS.lists(), { filters }] as const,
  details: () => [...CAROUSEL_KEYS.all, "detail"] as const,
  detail: (id: string) => [...CAROUSEL_KEYS.details(), id] as const,
};

// Get all carousel items
export const useGetAllCarouselItems = () => {
  return useQuery<Carousel.Response.GetAllItems>({
    queryKey: CAROUSEL_KEYS.list("all"),
    queryFn: async () => {
      const response = await axios.get("/api/carousel?getInactive=true");
      return response.data;
    },
  });
};

// Get active carousel items
export const useGetActiveCarouselItems = () => {
  return useQuery<Carousel.Response.GetActiveItems>({
    queryKey: CAROUSEL_KEYS.list("active"),
    queryFn: async () => {
      const { data } = await axios.get("/api/carousel");
      return data;
    },
  });
};

// Create carousel item
export const useCreateCarouselItem = () => {
  const queryClient = useQueryClient();

  return useMutation<Carousel.Response.CreateItem, Error, FormData>({
    mutationFn: async (formData: FormData) => {
      const { data } = await axios.post("/api/carousel", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: CAROUSEL_KEYS.lists(),
      });
    },
  });
};

// Update carousel item
export const useUpdateCarouselItem = () => {
  const queryClient = useQueryClient();

  return useMutation<
    Carousel.Response.UpdateItem,
    Error,
    { id: string; formData: FormData }
  >({
    mutationFn: async ({ id, formData }) => {
      const { data } = await axios.put(`/api/carousel/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: CAROUSEL_KEYS.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: CAROUSEL_KEYS.detail(variables.id),
      });
    },
  });
};

// Delete carousel item
export const useDeleteCarouselItem = () => {
  const queryClient = useQueryClient();

  return useMutation<
    Carousel.Response.DeleteItem,
    Error,
    { id: string; items: { id: string; displayIndex: number }[] }
  >({
    mutationFn: async ({ id, items }) => {
      const { data } = await axios.request({
        method: "DELETE",
        url: `/api/carousel/${id}`,
        data: items, // Send items in the body
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: CAROUSEL_KEYS.lists(),
      });
    },
  });
};

// Update display indices
export const useUpdateDisplayIndices = () => {
  const queryClient = useQueryClient();

  return useMutation<
    Carousel.Response.UpdateDisplayIndices,
    Error,
    { id: string; displayIndex: number }[]
  >({
    mutationFn: async (items) => {
      const { data } = await axios.put("/api/carousel", items);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: CAROUSEL_KEYS.lists(),
      });
    },
  });
};
