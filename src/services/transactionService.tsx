import axios from "axios";
import { Transaction } from "../types/transaction";

const API_URL = "https://localhost:7238/api/Transactions"; // Updated to match backend

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const tokens = JSON.parse(localStorage.getItem("tokens") || "null");
    if (tokens?.accessToken) {
      config.headers["Authorization"] = `Bearer ${tokens.accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const fetchTransactions = async (): Promise<Transaction[]> => {
  const response = await api.get<Transaction[]>("");
  return response.data;
};