import { House, PlusCircle, List, Camera, Microphone, FileText, ChartBar, SignOut , Pencil} from 'phosphor-react';
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { logoutUser } from '../store/slices/userSlice';
import { useEffect, useRef, useState } from "react";

function MobileFooter({ onHome, onTransactions, onAddNew, onReports, onLogout }) {
  const [showAddOptions, setShowAddOptions] = useState(false);
  const popUpRef = useRef(null)
  const addBtnRef = useRef(null)
  const d = useDispatch()
  const nav = useNavigate()
  const loc = useLocation()
  const loggedIn = useSelector(s => s.User.loggedIn)
  
  const handleClickOutside = (event) => {
    if (popUpRef.current && !popUpRef.current.contains(event.target) && !addBtnRef.current.contains(event.target)) {
        setShowAddOptions(false);
    }
};

useEffect(() => {
    if (showAddOptions) {
        document.addEventListener("mousedown", handleClickOutside);
    } else {
        document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
        document.removeEventListener("mousedown", handleClickOutside);
    };
}, [showAddOptions]);

  const isActive = (path) => loc.pathname === path

  const handleHomeClick = (e) => {
    e.preventDefault()
    if (loggedIn) {
        nav('/home/')
    } else {
        nav('/')
    }

}

const logoutHandler = (e) => {
  e.preventDefault()
  d(logoutUser())
  localStorage.clear()
  nav('/')
}

const navTransactionHandler = (e) => {
  e.preventDefault();
  nav("/transactions");
};

const navReportsHandler = (e) => {
  e.preventDefault();
  nav("/reports");
};

const voiceClickHandler = (e) => {
  e.preventDefault();
  setShowAddOptions(false);
  nav("/audio-input");
};
const camClickHandler = (e) => {
  e.preventDefault();
  setShowAddOptions(false);
  nav("/cam-input");
};

const penClickHandler = (e) => {
  e.preventDefault();
  setShowAddOptions(false);
  nav("/new-transaction");
};

const toggleAddOptions = () => setShowAddOptions(!showAddOptions);

const iconSize = 24
const addNewSize = 32
const addIconSize = 24
  
  return (
    <div className="fixed bottom-0 w-full bg-white border-t border-gray-200 shadow-lg flex justify-around py-2">
      
      <button onClick={handleHomeClick} 
      className={`flex flex-col items-center text-gray-600  ${
        isActive('/home') ? 'text-accent' : 'hover:text-accent'
      }`}>
        <House size={iconSize}/>
        <span className="text-xs">Home</span>
      </button>

      <button onClick={navTransactionHandler} 
      className={`flex flex-col items-center text-gray-600  ${
        isActive('/transactions') ? 'text-accent' : 'hover:text-accent'
      }`}>
        <FileText size={iconSize} />
        <span className="text-xs">Transactions</span>
      </button>

      {/* <button onClick={onAddNew} className="flex flex-col items-center text-accent">
        <FaPlusCircle size={32} className="bg-white rounded-full shadow-lg" />
        <span className="text-xs">Add New</span>
      </button> */}

        {/* Main Add New Button */}
         <div className="relative flex flex-col items-center">
        <button ref={addBtnRef} onClick={toggleAddOptions} className="flex flex-col items-center text-blue-500">
        <PlusCircle size={addNewSize} className="bg-white rounded-full shadow-sm" />
          <span className="text-xs">Add New</span>
        </button>

        {/* Pop-up Add Options */}
        {showAddOptions && (
          <div ref={popUpRef} className="absolute bottom-14 left-1/2 transform -translate-x-1/2 flex space-x-4 transition-all">
            <button onClick={camClickHandler} className="bg-white rounded-full p-2 shadow-md hover:bg-gray-100">
            <Camera size={addIconSize} className="text-gray-600" />
            </button>
            <button className="bg-white rounded-full p-2 shadow-md hover:bg-gray-100" onClick={voiceClickHandler}>
            <Microphone size={addIconSize} className="text-gray-600" />
            </button>
            <button className="bg-white rounded-full p-2 shadow-md hover:bg-gray-100" onClick={penClickHandler}>
            <Pencil size={addIconSize} className="text-gray-600" />
            </button>
          </div>
        )}
      </div>

      <button onClick={navReportsHandler} 
      className={`flex flex-col items-center text-gray-600 ${
        isActive('/reports') ? 'text-accent' : 'hover:text-accent'
      }`}>
        <ChartBar size={iconSize} />
        <span className="text-xs">Reports</span>
      </button>
      <button onClick={logoutHandler} className="flex flex-col items-center text-gray-600 hover:text-red-500">
        <SignOut size={iconSize} />
        <span className="text-xs">Logout</span>
      </button>
    </div>
  );
}

export default MobileFooter;
