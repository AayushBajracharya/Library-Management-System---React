import { useState } from 'react';
import { SubmitHandler } from 'react-hook-form';
import { signup } from '../services/authService';
import { User } from '../types/model';

interface SignupData extends Omit<User, 'userId'> {}

export function useSignup(onClose: () => void) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const handleSubmit: SubmitHandler<SignupData> = async (data) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await signup({ ...data, userId: 0 });
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
    loading,
    error,
    success,
    handleSubmit,
  };
}