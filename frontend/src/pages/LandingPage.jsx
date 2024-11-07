import React from 'react';
import {Link} from "react-router-dom";

const LandingPage = () => {

  return (
      <div className="flex items-center flex-col justify-center min-h-screen bg-white">
          <div className="mb-4 mx-auto"><img src="/logo_big.png" alt="Pocketmind"/></div>
          <div className="mx-auto"><img src="/test.png" alt="Pocketmind"/></div>
          <h2 className="text-3xl font-extrabold text-center text-gray-800 max-w-md p-8 space-y-4 bg-white rounded-lg">
              The best app to keep a record of your expenses!</h2>
          <div className="max-w-md p-8 space-y-4 bg-white rounded-lg">
            <Link to="/registration/">
              <button
                  type="button"
                  className="w-full tracking-wide text-lg p-2 font-bold text-white
                                rounded-md bg-custom2 shadow-lg mb-4"
              >
                  GET STARTED
              </button>
            </Link>
            <Link to="/login/">
              <button
                  type="button"
                  className="w-full py-2 font-semibold text-custom2 bg-white rounded-md
                                border"
              >
                  I ALREADY HAVE AN ACCOUNT
              </button>
            </Link>

          </div>
      </div>
  );
};

export default LandingPage;
