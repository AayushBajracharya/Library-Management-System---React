import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/authService';
import { LoginDTO, Tokens } from '../types/model';
import { useAuth } from '../context/AuthContext';

export function useLogin() {
  const [formData, setFormData] = useState<LoginDTO>({
    username: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login: setAuthTokens } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = (): boolean => {
    if (!formData.username) {
      setError('Username is required');
      return false;
    }
    if (!formData.password || formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      const tokens: Tokens = await login(formData);
      setAuthTokens(tokens, formData.username);
      navigate('/dashboard', { state: { showLoginToast: true }, replace: true });
      window.history.pushState(null, '', '/dashboard');
    } catch (err) {
      setError('Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    loading,
    error,
    handleChange,
    handleSubmit,
  };
}