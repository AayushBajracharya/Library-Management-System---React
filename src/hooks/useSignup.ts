import { useState } from 'react';
import { signup } from '../services/authService';
import { User } from '../types/model';

interface SignupData extends Omit<User, 'userId'> {}

export function useSignup(onClose: () => void) {
  const [formData, setFormData] = useState<SignupData>({
    username: '',
    email: '',
    password: '',
    role: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = (): boolean => {
    if (!formData.username) {
      setError('Username is required');
      return false;
    }
    if (!formData.email || !/^\S+@\S+$/i.test(formData.email)) {
      setError('Valid email is required');
      return false;
    }
    if (!formData.password || formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    if (!formData.role) {
      setError('Role is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      await signup({ ...formData, userId: 0 });
      setSuccess(true);
      onClose();
    } catch (err) {
      setError('Signup failed. Please try again.');
      console.error('Signup failed', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    loading,
    error,
    success,
    handleChange,
    handleSubmit,
  };
}