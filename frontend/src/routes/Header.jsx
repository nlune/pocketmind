import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../store/slices/userSlice';
import { useLocation, useNavigate } from 'react-router-dom';

export default function Header() {
    const d = useDispatch()
    const nav = useNavigate()
    const loc = useLocation()
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const btnRef = useRef(null)
    const dropdownRef = useRef(null);
    const loggedIn = useSelector(s => s.User.loggedIn)
    console.log(isDropdownOpen)


    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target) && !btnRef.current.contains(event.target)) {
            setIsDropdownOpen(false);
        }
    };
    useEffect(() => {
        if (isDropdownOpen) {
            document.addEventListener("mousedown", handleClickOutside, {once: true});
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isDropdownOpen]);

    const handleDropdownToggle = (e) => {
        e.preventDefault()
        setIsDropdownOpen(!isDropdownOpen);
    };

    const logoutHandler = (e) => {
        e.preventDefault()
        d(logoutUser())
        localStorage.clear()
        nav('/')
    }

    const handleLogoClick = (e) => {
        e.preventDefault()
        if (loggedIn) {
            nav('/home/')
        } else {
            nav('/')
        }
 
    }
    const handleLoginClick = (e) => {
        e.preventDefault()
        nav('/login')
    }

    return (
        <>
            {/* Header */}
                <header className="w-full flex items-center justify-between bg-custom2
                                    p-2 px-3 shadow-md">
                                       
                    <div className='flex flex-row items-center gap-1'>
                     <img className="h-6" src="/logo2.png" alt="Pocketmind"/> 
                    <h1 onClick={handleLogoClick} className="text-2xl font-bold text-white text-center cursor-pointer">
                        pocketmind
                    </h1></div>
                    <div className="btns flex flex-row gap-2">

                    {/*USER WILL NEVER SEE THE HEADER WITHOUT BEING LOGGED IN*/}

                {/*{!loggedIn &&*/}
                {/*<button className='btn btn-secondary btn-sm text-white bg-custom5' >*/}
                {/*    SIGN UP*/}
                {/*</button> }*/}
                {/*{!loggedIn && loc.pathname !== '/login' &&*/}
                {/*<button */}
                {/*onClick={handleLoginClick}*/}
                {/*className='btn btn-secondary btn-sm text-white bg-custom5' >*/}
                {/*    LOGIN*/}
                {/*</button>}*/}
                </div>
                {loggedIn && <button
                    className="btn btn-ghost btn-square"
                    onClick={handleDropdownToggle}
                    ref={btnRef}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="lightgray"
                        className="w-6 h-6"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M3 6h18M3 12h18M3 18h18"
                        />
                    </svg>
                </button>}

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                    <div ref={dropdownRef} className="absolute right-4 top-16 bg-white shadow-lg rounded-lg w-40 py-2 dropdown-menu">
                        <ul >
                            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Profile</li>
                            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Settings</li>
                            {/* <li onClick={logoutHandler} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Logout</li> */}
                        </ul>
                    </div>
                )}
            </header>
        </>
    )
}