import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-blue-500">404</h1>
        <p className="mt-4 text-xl text-gray-700">Page Not Found</p>
        <Link to="/" className="inline-block px-6 py-3 mt-6 font-semibold text-white bg-blue-500 rounded-md hover:bg-blue-600">
          Go Home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
