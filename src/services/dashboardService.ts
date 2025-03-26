import axios from 'axios';
import { Dashboard, OverdueBorrower } from '../types/dashboard';


const DASHBOARD_API_URL = 'https://localhost:7238/api/Dashboard/GetDashboardData';
const OVERDUE_BORROWERS_API_URL = 'https://localhost:7238/api/Dashboard/GetOverdueBorrowers';

export const getDashboardData = async (): Promise<Dashboard> => {
  const response = await axios.get(DASHBOARD_API_URL);
  return response.data;
};

export const getOverdueBorrowers = async (): Promise<OverdueBorrower[]> => {
  const response = await axios.get(OVERDUE_BORROWERS_API_URL);
  return response.data;
};