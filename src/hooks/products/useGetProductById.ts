
import axios from "axios";
import { useState, useEffect } from "react";

export default  function useGetProductById(id: string) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);
  const [data, setData] = useState<any>();
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/products/${id}`);
        setData(response.data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);
  return { data, loading, error };
}
