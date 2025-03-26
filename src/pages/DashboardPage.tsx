import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getDashboardData, getOverdueBorrowers } from '../services/dashboardService';
import { Dashboard, OverdueBorrower } from '../types/dashboard';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import PieChart from '../components/dashboard/PieChart';
import StatsCard from '../components/dashboard/StatsCard';
import OverdueBorrowers from '../components/dashboard/OverdueBorrowers';
import TotalBook from '../assets/DashBook.svg';
import TotalUser from '../assets/DashUser.svg';
import TotalTrans from '../assets/DashTrans.svg';

const DashboardPage: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<Dashboard | null>(null);
  const [overdueBorrowers, setOverdueBorrowers] = useState<OverdueBorrower[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    if (location.state?.showLoginToast) {
      toast.success('Successfully logged in!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }

    const fetchData = async () => {
      try {
        const dashboardResponse = await getDashboardData();
        setDashboardData(dashboardResponse);

        const borrowersResponse = await getOverdueBorrowers();
        setOverdueBorrowers(borrowersResponse);

        setLoading(false);
      } catch (err) {
        setError('Failed to load dashboard data.');
        setLoading(false);
        console.error(err);
      }
    };

    fetchData();
  }, [location.state]); // Add location.state as dependency

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error || !dashboardData) {
    return <div className="flex justify-center items-center h-screen text-red-500">{error || 'No data available'}</div>;
  }

  return (
    <div className="ml-[222px] pt-[65px]">
      <DashboardHeader username="Kapil Dev Thakur" />
      <div className="bg-[#F2F2F2] p-5">
        <div className="flex flex-wrap -mx-3">
          <div className="w-full lg:w-1/2 px-3">
            <PieChart
              totalBorrowedBooks={dashboardData.totalBorrowedBooks}
              totalReturnedBooks={dashboardData.totalReturnedBooks}
            />
          </div>
          <div className="w-full lg:w-1/2 px-3">
            <StatsCard
              icon={TotalUser}
              count={dashboardData.totalStudentCount}
              label="Total Student"
            />
            <StatsCard
              icon={TotalBook}
              count={dashboardData.totalBookCount}
              label="Total Book Count"
            />
            <StatsCard
              icon={TotalTrans}
              count={dashboardData.totalTransactionCount}
              label="Transactions Count"
            />
            <OverdueBorrowers borrowers={overdueBorrowers} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;