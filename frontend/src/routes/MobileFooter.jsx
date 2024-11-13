import { FaHome, FaListAlt, FaPlusCircle, FaChartBar, FaSignOutAlt } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

function MobileFooter({ onHome, onTransactions, onAddNew, onReports, onLogout }) {
  const d = useDispatch()
  const nav = useNavigate()
  const loc = useLocation()
  const loggedIn = useSelector(s => s.User.loggedIn)

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

  
  return (
    <div className="fixed bottom-0 w-full bg-white border-t border-gray-200 shadow-lg flex justify-around py-2">
      <button onClick={handleHomeClick} 
      className={`flex flex-col items-center text-gray-600 ${
        isActive('/home') ? 'text-accent' : 'hover:text-accent'
      }`}>
        <FaHome size={24} />
        <span className="text-xs">Home</span>
      </button>
      <button onClick={navTransactionHandler} 
      className={`flex flex-col items-center text-gray-600 ${
        isActive('/transactions') ? 'text-accent' : 'hover:text-accent'
      }`}>
        <FaListAlt size={24} />
        <span className="text-xs">Transactions</span>
      </button>
      <button onClick={onAddNew} className="flex flex-col items-center text-accent">
        <FaPlusCircle size={32} className="bg-white rounded-full shadow-lg" />
        <span className="text-xs">Add New</span>
      </button>
      <button onClick={navReportsHandler} 
      className={`flex flex-col items-center text-gray-600 ${
        isActive('/reports') ? 'text-accent' : 'hover:text-accent'
      }`}>
        <FaChartBar size={24} />
        <span className="text-xs">Reports</span>
      </button>
      <button onClick={logoutHandler} className="flex flex-col items-center text-gray-600 hover:text-red-500">
        <FaSignOutAlt size={24} />
        <span className="text-xs">Logout</span>
      </button>
    </div>
  );
}

export default MobileFooter;
