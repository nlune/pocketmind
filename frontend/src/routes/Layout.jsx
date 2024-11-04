import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';

export default function Layout() {


    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center space-y-6 p-4 md:p-8 lg:p-12">

          <Header/>

            <Outlet />
        </div>
    );
}