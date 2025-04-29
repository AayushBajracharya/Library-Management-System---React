import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SubmitHandler } from 'react-hook-form';
import { login } from '../services/authService';
import { LoginDTO, Tokens } from '../types/model';
import { useAuth } from '../context/AuthContext';

export function useLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login: setAuthTokens } = useAuth();
  const navigate = useNavigate();

  const handleSubmit: SubmitHandler<LoginDTO> = async (data) => {
    setLoading(true);
    setError(null);

    try {
      const tokens: Tokens = await login(data);
      setAuthTokens(tokens, data.username);
      navigate('/dashboard', { state: { showLoginToast: true }, replace: true });
      window.history.pushState(null, '', '/dashboard');
    } catch (err) {
      setError('Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    handleSubmit,
  };
}