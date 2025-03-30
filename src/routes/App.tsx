import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import StudentPage from '../pages/StudentPage';
import LoginPage from '../pages/LoginPage';
import DashboardPage from '../pages/DashboardPage';
import Navbar from '../components/Navbar';
import { AuthProvider, useAuth } from '../context/AuthContext';
import BookPage from '../pages/BookPage';
import AuthorPage from '../pages/AuthorPage';
import IssuingPage from '../pages/IssuingPage';
import TransactionPage from '../pages/TransactionPage';
import faviconUrl from '../assets/TabBook.png?url';
import { ToastContainer } from 'react-toastify';
import { setFavicon } from '../services/favicon/service';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect } from 'react';

setFavicon({ href: faviconUrl });

const AppLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { tokens } = useAuth();

  // Enforce navigation rules on every render
  useEffect(() => {
    if (tokens) {
      if (location.pathname === '/login') {
        navigate('/dashboard', { replace: true });
      }
    } 
  }, [tokens, location.pathname, navigate]);

  // Ensure history has a valid entry after login
  useEffect(() => {
    if (tokens && location.pathname === '/dashboard') {
      // Push an extra dashboard entry to ensure back button has a valid state
      window.history.pushState(null, '/dashboard');
    }
  }, [tokens, location.pathname]);

  const showNavbar = tokens && location.pathname !== '/login';

  return (
    <>
      {showNavbar && <Navbar />}
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/student" element={<StudentPage />} />
        <Route path="/book" element={<BookPage />} />
        <Route path="/author" element={<AuthorPage />} />
        <Route path="/issue" element={<IssuingPage />} />
        <Route path="/transaction-view" element={<TransactionPage />} />
      </Routes>
    </>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Router>
        <AppLayout />
      </Router>
    </AuthProvider>
  );
};

export default App;