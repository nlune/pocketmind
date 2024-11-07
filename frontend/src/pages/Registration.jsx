import React, { useState } from 'react';

const RegistrationPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = (e) => {
    e.preventDefault();
    // Handle registration logic here
  };

  return (
      <div className="flex items-center flex-col justify-center min-h-screen bg-white">
        <div className=""><img src="/logo_big.png" alt="Pocketmind"/></div>
        <div className="max-w-md p-8 space-y-4 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-center text-gray-800">
            The best app to keep a record of your expenses</h2>
          <form onSubmit={handleRegister} className="space-y-4">
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
                type="submit"
                className="w-full text-2xl py-2 font-semibold text-gray-800 bg-custom1 rounded-md hover:bg-blue-600"
            >
              Get Started
            </button>
          </form>
        </div>
      </div>
  );
};

export default RegistrationPage;
