import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { fetchTransactions } from "../services/transactionService";
import { Transaction } from "../types/transaction";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const TransactionPage: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { tokens, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!tokens) {
      navigate("/login");
    } else {
      loadTransactions();
    }
  }, [tokens, navigate]);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      const transactionData = await fetchTransactions();
      setTransactions(transactionData);
    } catch (err: any) {
      setError("Failed to fetch transactions: " + (err.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex">
      <Navbar />
      <div className="ml-[222px] w-full">
        <div className="h-[65px] bg-white shadow-md flex items-center justify-between px-5">
          <div style={{ display: "flex", alignItems: "center" }}>
            <img src="no.png" alt="Logo" className="w-8 h-8 mr-2" />
            <h2 className="text-lg font-semibold">Transaction Details</h2>
          </div>
        </div>
        <div className="bg-[#F2F2F2] p-5 h-[calc(100vh-65px)] overflow-y-auto">
          {error && <div className="bg-red-100 text-red-700 p-3 mb-4">{error}</div>}
          {loading ? (
            <div className="text-center">Loading...</div>
          ) : (
            <div className="bg-gray-200 p-6 rounded-lg shadow-md">
              <div className="overflow-x-auto">
                <table className="w-full bg-white rounded-lg shadow-md">
                  <thead className="bg-[#255D81] text-white">
                    <tr>
                      <th className="p-3 text-center">Transaction ID</th>
                      <th className="p-3 text-center">Student Name</th>
                      <th className="p-3 text-center">User ID</th>
                      <th className="p-3 text-center">Username</th>
                      <th className="p-3 text-center">Book Title</th>
                      <th className="p-3 text-center">Type</th>
                      <th className="p-3 text-center">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.length > 0 ? (
                      transactions.map((txn) => (
                        <tr
                          key={txn.transactionId}
                          className="border-b border-gray-300 last:border-none hover:bg-gray-100"
                        >
                          <td className="p-3 text-center">{txn.transactionId}</td>
                          <td className="p-3 text-center">{txn.studentName}</td>
                          <td className="p-3 text-center">{txn.userId}</td>
                          <td className="p-3 text-center">{txn.username}</td>
                          <td className="p-3 text-center">{txn.bookTitle}</td>
                          <td className="p-3 text-center">{txn.transactionType}</td>
                          <td className="p-3 text-center">
                            {new Date(txn.date).toLocaleDateString()}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="text-center p-5 text-gray-500">
                          No transactions available.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionPage;