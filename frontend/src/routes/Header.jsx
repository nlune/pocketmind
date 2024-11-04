import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../store/slices/userSlice';

export default function Header() {
    const d = useDispatch()
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);


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


    return (
        <>
            {/* Header */}
                <header className="w-full md:w-3/4 flex justify-between items-center bg-white p-4 rounded-lg shadow-md relative">
                <h1 className="text-2xl font-bold">PocketMind</h1>
                <button
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
                </button>

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