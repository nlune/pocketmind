import React, { useState } from 'react';

const PasswordResetPage = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handlePasswordReset = (e) => {
    e.preventDefault();
    // Mock API call or reset password logic here
    setMessage('If an account with this email exists, you will receive a password reset link shortly.');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-4 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-center text-gray-800">Reset Password</h2>
        <p className="text-center text-gray-600">Enter your email to receive a password reset link.</p>
        <form onSubmit={handlePasswordReset} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="w-full py-2 font-semibold text-white bg-blue-500 rounded-md hover:bg-blue-600"
          >
            Send Reset Link
          </button>
        </form>

        {message && (
          <p className="mt-4 text-center text-green-600">{message}</p>
        )}
      </div>
    </div>
  );
};

export default PasswordResetPage;
