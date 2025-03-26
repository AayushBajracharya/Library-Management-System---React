import axios from 'axios';
import { LoginDTO, User, Tokens } from '../types/model';

const API_URL = 'https://localhost:7238/api/Auth'; 

export const login = async (credentials: LoginDTO): Promise<Tokens> => {
  const response = await axios.post(`${API_URL}/login`, credentials);
  return response.data;
};

export const signup = async (user: User): Promise<void> => {
  await axios.post(`${API_URL}/signup`, user);
};