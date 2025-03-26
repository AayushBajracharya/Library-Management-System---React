import axios from "axios";
import { IssuingTransaction } from "../types/issuing";

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

export const createTransaction = async (
  transaction: IssuingTransaction
): Promise<number> => { // Returning transaction ID as per CreatedAtAction
  console.log("Sending transaction payload:", JSON.stringify(transaction, null, 2));
  const response = await api.post("", transaction);
  console.log("Response from server:", response.data);
  return response.data; // Assuming backend returns the transaction ID
};