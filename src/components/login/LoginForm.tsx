import React from 'react';
import Book from '../../assets/Book.svg';
import { useLogin } from '../../hooks/useLogin';

const LoginForm: React.FC = () => {
  const { formData, loading, error, handleChange, handleSubmit } = useLogin();

  return (
    <div className="flex flex-col justify-center items-center h-screen w-1/2 bg-white">
      <form onSubmit={handleSubmit} className="w-full max-w-md text-center">
        <img src={Book} alt="Library Logo" className="mb-4 mx-auto" />
        <h2 className="text-2xl font-bold mb-2">HSMSS Library Management System</h2>
        <p className="text-lg mb-6">Please enter your credentials</p>

        <div className="mb-4">
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Username"
            className="w-4/5 mx-auto p-3 border border-black rounded-full text-center text-gray-600 text-lg"
            required
          />
        </div>

        <div className="mb-4">
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-4/5 mx-auto p-3 border border-black rounded-full text-center text-gray-600 text-lg"
            required
          />
        </div>

        <div className="w-3/5 mx-auto flex flex-col items-start">
          <span className="mb-2 text-sm">Forgot Password?</span>
          <button
            type="submit"
            disabled={loading}
            className="bg-[#255d81] text-white py-3 px-20 rounded-full font-bold text-lg disabled:bg-gray-400"
          >
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </div>

        {error && <p className="text-red-500 mt-4">{error}</p>}
      </form>
    </div>
  );
};

export default LoginForm;