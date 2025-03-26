import axios from "axios";
import { Book } from "../types/books";

const API_URL = "https://localhost:7238/api/Books"; // Ensure this URL is correct

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

// Fetch all books
export const fetchBooks = async (): Promise<Book[]> => {
  const response = await api.get<Book[]>("");
  return response.data;
};

// Create a new book
export const createBook = async (book: Book): Promise<Book> => {
  const response = await api.post<Book>("", book);
  return response.data;
};

// Update an existing book
export const updateBook = async (book: Book): Promise<void> => {
  await api.put( `/${book.bookId}`, book);
};

// Delete a book
export const deleteBook = async (bookId: number): Promise<void> => {
  await api.delete(`/${bookId}`);
};