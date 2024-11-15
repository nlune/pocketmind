import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import MobileFooter from './MobileFooter';


export default function Layout() {


    return (
        <div className="min-h-screen bg-white flex flex-col items-center space-y-0 p-0 md:p-4 lg:p-10">

          <Header/>
          <main className="flex-grow pb-16">
            <Outlet />
            </main>

            <MobileFooter/>
        </div>
    );
}