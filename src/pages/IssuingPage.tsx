import { useState } from "react";
import { toast } from "react-toastify";
import IssuingForm from "../components/issue/IssuingForm";
import Navbar from "../components/Navbar";
import { createTransaction } from "../services/IssuingService";
import { IssuingTransaction } from "../types/issuing";
import { useAuth } from "../context/AuthContext"; // Adjust path
import { useNavigate } from "react-router-dom";

const IssuingPage: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const { tokens, logout } = useAuth();
  const navigate = useNavigate();

  if (!tokens) {
    navigate("/login");
  }

  const handleIssueBook = async (transaction: IssuingTransaction) => {
    try {
      const transactionId = await createTransaction(transaction);
      setError(null);
      toast.success("Book issued successfully!");
      console.log("Transaction issued successfully, ID:", transactionId);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data ||
        err.message ||
        "Failed to issue book.";
      setError(JSON.stringify(errorMessage, null, 2));
      toast.error("Failed to issue book.");
      console.error("Error issuing transaction:", {
        message: err.message,
        status: err.response?.status,
        responseData: err.response?.data,
        requestPayload: transaction,
      });
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
        <div
          className="header"
          style={{
            height: "65px",
            background: "#fff",
            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 20px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <img
              src="no.png" // Replace with actual icon
              alt="Issue Book Icon"
              style={{ width: "35px", height: "35px", marginRight: "10px" }}
            />
            <h2 style={{ fontSize: "18px", margin: "0" }}>Issue Book</h2>
          </div>
        </div>
        <div
          className="body"
          style={{
            background: "#F2F2F2",
            padding: "20px",
            height: "calc(100vh - 65px)",
            overflowY: "auto",
          }}
        >
          {error && (
            <div
              style={{
                background: "#fdd",
                color: "#d00",
                padding: "10px",
                marginBottom: "20px",
                whiteSpace: "pre-wrap",
              }}
            >
              {error}
            </div>
          )}
          <IssuingForm onSubmit={handleIssueBook} />
        </div>
      </div>
    </div>
  );
};

export default IssuingPage;