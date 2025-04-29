import { BrowserRouter as Router, Routes, Route, useLocation, Navigate, Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
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
import { TokenService } from '../services/tokenManagement/TokenService';
import { isTokenExpired } from '../services/Utils/tokenUtils';


setFavicon({ href: faviconUrl });

interface AuthRouteProps {
  type: 'public' | 'protected';
}

const AuthRoute: React.FC<AuthRouteProps> = ({ type }) => {
  const {logout } = useAuth();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const accessToken = TokenService.getAccessToken();
        const refreshToken = TokenService.getRefreshToken();

        if (!accessToken || !refreshToken || isTokenExpired(refreshToken)) {
          logout();
          setIsAuthenticated(false);
        } else {
          setIsAuthenticated(!isTokenExpired(accessToken));
        }
      } catch (error) {
        logout();
        setIsAuthenticated(false);
      } finally {
        setIsChecking(false);
      }
    };

    verifyToken();
  }, [location, logout]);

  if (isChecking) return <div>Loading...</div>;

  if (type === 'protected' && !isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (type === 'public' && isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

const AppLayout: React.FC = () => {
  const { tokens } = useAuth();
  const location = useLocation();

  const showNavbar = tokens && location.pathname !== '/login';

  return (
    <>
      {showNavbar && <Navbar />}
      <Routes>
        <Route element={<AuthRoute type="public" />}>
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Route>
        <Route element={<AuthRoute type="protected" />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/student" element={<StudentPage />} />
          <Route path="/book" element={<BookPage />} />
          <Route path="/author" element={<AuthorPage />} />
          <Route path="/issue" element={<IssuingPage />} />
          <Route path="/transaction-view" element={<TransactionPage />} />
        </Route>
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