import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../store/slices/userSlice';
import { useLocation, useNavigate } from 'react-router-dom';

export default function Header() {
    const d = useDispatch()
    const nav = useNavigate()
    const loc = useLocation()
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const loggedIn = useSelector(s => s.User.loggedIn)


    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsDropdownOpen(false);
        }
    };
    useEffect(() => {
        if (isDropdownOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isDropdownOpen]);

    const handleDropdownToggle = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const logoutHandler = (e) => {
        e.preventDefault()
        d(logoutUser())
        localStorage.clear()
        // nav('/login')
    }

    const handleLogoClick = (e) => {
        e.preventDefault()
        nav('/')
    }
    const handleLoginClick = (e) => {
        e.preventDefault()
        nav('/login')
    }

    return (
        <>
            {/* Header */}
                <header className="w-full max-w-screen-sm md:w-3/4 flex items-center justify-center bg-custom2
                                    p-4 rounded-lg shadow-md relative">
                    <h1 onClick={handleLogoClick} className="text-2xl font-bold text-white text-center cursor-pointer">pocketmind
                        {/*<img className="!w-1 !h-1" src="/logo2.png" alt="Pocketmind"/>*/}
                    </h1>
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
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
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
                    <div ref={dropdownRef} className="absolute right-4 top-16 bg-white shadow-lg rounded-lg w-40 py-2">
                        <ul>
                            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Profile</li>
                            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Settings</li>
                            <li onClick={logoutHandler} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Logout</li>
                        </ul>
                    </div>
                )}
            </header>
        </>
    )
}