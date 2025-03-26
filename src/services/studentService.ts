import axios from "axios";
import { Student } from "../types/student";


const API_URL = "https://localhost:7238/api/Students";

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

export const fetchStudents = async (): Promise<Student[]> => {
    const response = await api.get<Student[]>("");
    return response.data;
};

export const createStudent = async (student: Student): Promise<Student> => {
    const response = await api.post<Student>("", student);
    return response.data;
};

export const updateStudent = async (student: Student): Promise<void> => {
    await api.put(`/${student.studentId}`, student);
};

export const deleteStudent = async (studentId: number): Promise<void> => {
    await api.delete(`/${studentId}`);
};
