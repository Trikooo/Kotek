import { CategoryName } from "@/types/types";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

const fetchCategoryNames = async (): Promise<CategoryName[]> => {
  const { data } = await axios.get<CategoryName[]>(
    "/api/categories/categoryNames"
  );
  return data;
};

export default function useGetAllCategoryNames() {
  return useQuery({
    queryKey: ["categoryNames"],
    queryFn: fetchCategoryNames,
  });
}
