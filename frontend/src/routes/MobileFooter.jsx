import { FaHome, FaListAlt, FaPlusCircle, FaChartBar, FaSignOutAlt } from "react-icons/fa";

function MobileFooter({ onHome, onTransactions, onAddNew, onReports, onLogout }) {
  return (
    <div className="fixed bottom-0 w-full bg-white border-t border-gray-200 shadow-lg flex justify-around py-2">
      <button onClick={onHome} className="flex flex-col items-center text-gray-600 hover:text-accent">
        <FaHome size={24} />
        <span className="text-xs">Home</span>
      </button>
      <button onClick={onTransactions} className="flex flex-col items-center text-gray-600 hover:text-accent">
        <FaListAlt size={24} />
        <span className="text-xs">Transactions</span>
      </button>
      <button onClick={onAddNew} className="flex flex-col items-center text-accent">
        <FaPlusCircle size={32} className="bg-white rounded-full shadow-lg" />
        <span className="text-xs">Add New</span>
      </button>
      <button onClick={onReports} className="flex flex-col items-center text-gray-600 hover:text-accent">
        <FaChartBar size={24} />
        <span className="text-xs">Reports</span>
      </button>
      <button onClick={onLogout} className="flex flex-col items-center text-gray-600 hover:text-red-500">
        <FaSignOutAlt size={24} />
        <span className="text-xs">Logout</span>
      </button>
    </div>
  );
}

export default MobileFooter;
