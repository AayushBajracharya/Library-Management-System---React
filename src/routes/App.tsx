import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import StudentPage from '../pages/StudentPage';
import LoginPage from '../pages/LoginPage';
import DashboardPage from '../pages/DashboardPage';
import Navbar from '../components/Navbar';
import { AuthProvider } from '../context/AuthContext';
import BookPage from '../pages/BookPage';
import AuthorPage from '../pages/AuthorPage';
import IssuingPage from '../pages/IssuingPage';
import TransactionPage from '../pages/TransactionPage';
import faviconUrl from '../assets/TabBook.png?url';
import { ToastContainer } from 'react-toastify';
import { setFavicon } from '../services/favicon/service';

setFavicon({ href: faviconUrl });

const AppLayout: React.FC = () => {
  const location = useLocation();
  const showNavbar = location.pathname !== '/login';

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
        <Route path="/" element={<Navigate to="/login" replace />} />
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