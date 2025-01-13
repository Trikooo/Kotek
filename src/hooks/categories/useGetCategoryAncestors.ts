import { CategoryName } from "@/types/types";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { Category } from "@prisma/client";

const fetchCategoryAncestors = async (
  id: string
): Promise<Partial<Category>[]> => {
  const { data } = await axios.get<Partial<Category>[]>(
    `/api/categories/${id}/ancestors`
  );
  return data;
};

export default function useGetAllCategoryAncestors(id: string) {
  return useQuery({
    queryKey: ["categoryAncestors", id], // Include id in the queryKey
    queryFn: () => fetchCategoryAncestors(id),
    enabled: !!id, // Ensure the query runs only when id is not empty or undefined
  });
}
