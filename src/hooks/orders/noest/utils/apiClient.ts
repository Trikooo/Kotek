import axios from "axios";

const apiClient = axios.create({
  baseURL: "/api/noestOrders",
});

export default apiClient;
