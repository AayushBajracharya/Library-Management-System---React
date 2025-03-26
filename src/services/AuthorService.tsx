import axios from "axios";
import { Author } from "../types/authors";


const API_URL = "https://localhost:7238/api/Authors"; 

// Create an Axios instance with default headers
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add an interceptor to include the token in every request
api.interceptors.request.use((config) => {
  const tokens = JSON.parse(localStorage.getItem("tokens") || "null"); // Get tokens from localStorage
  if (tokens?.accessToken) {
    config.headers["Authorization"] = `Bearer ${tokens.accessToken}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const getAuthors = async (): Promise<Author[]> => {
  const response = await api.get<Author[]>("");
  return response.data;
};

export const addAuthor = async (author: Author): Promise<Author> => {
  const response = await api.post("", author);
  return response.data;
};

export const updateAuthor = async (author: Author): Promise<void> => {
  await api.put(`/${author.authorID}`, author);
};

export const deleteAuthor = async (authorID: number): Promise<void> => {
  await api.delete(`/${authorID}`);
};