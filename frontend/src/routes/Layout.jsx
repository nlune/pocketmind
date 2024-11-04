import {Outlet} from "react-router-dom";

export default function Layout() {

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center space-y-6 p-4 md:p-8 lg:p-12">
      
        {/* Header */}
        <header className="w-full md:w-3/4 flex justify-between items-center bg-white p-4 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold">ExpenseAI</h1>
          <button className="btn btn-ghost btn-square">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6h18M3 12h18M3 18h18" />
            </svg>
          </button>
        </header>
        
                    <Outlet/>
            

        </div>
    )
}