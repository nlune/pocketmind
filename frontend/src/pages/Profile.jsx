import React from 'react';

const ProfilePage = () => {
  const user = {
    name: 'John Doe',
    email: 'johndoe@example.com'
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-4 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-center text-gray-800">Profile</h2>
        <div className="space-y-2">
          <div>
            <span className="font-semibold">Name: </span>
            <span>{user.name}</span>
          </div>
          <div>
            <span className="font-semibold">Email: </span>
            <span>{user.email}</span>
          </div>
        </div>
        <button className="w-full py-2 mt-4 font-semibold text-white bg-red-500 rounded-md hover:bg-red-600">
          Log Out
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
