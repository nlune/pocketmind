import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const nav = useNavigate()  

    const voiceClickHandler = (e) => {
      e.preventDefault()
      nav("/audio-input")

    }

    return (

  <>
        <div className="w-full max-w-lg flex flex-col items-center space-y-2">
        <div className="relative flex items-center w-full">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="text-xl font-semibold px-4 bg-gray-100 text-gray-700">Upload transaction</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>
      </div>
        {/* Icon Upload Buttons */}
        <div className="grid grid-cols-3 gap-4 w-full max-w-lg justify-items-center">
          <button className="btn btn-lg bg-primary text-white w-full">Camera</button>
          <button onClick={voiceClickHandler} className="btn btn-lg bg-primary text-white w-full">Voice</button>
          <button className="btn btn-lg bg-primary text-white w-full">Write</button>
        </div>
        
        {/* Categorized Spending Chart */}
        <div className="w-full max-w-lg bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Categorized Spending</h2>
          {/* Placeholder for Chart */}
          <div className="w-full h-32 bg-gray-200 rounded-lg"></div>
        </div>
  
        {/* Budget Overview */}
        <div className="w-full max-w-lg bg-white p-6 rounded-lg shadow-md flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
          <button className="btn btn-warning btn-circle text-black px-6 py-2 font-semibold">Add</button>
          <div className="flex flex-col text-left">
            <p className="text-lg font-semibold">Budget Overview</p>
            {/* <p className="text-gray-600">Food budget: 250 / 400</p>
            <p className="text-gray-600">Travel budget: 50 / 150</p> */}
          </div>
        </div>
  
        {/* Navigation Buttons */}
        <div className="grid grid-cols-2 gap-4 w-full max-w-lg">
          <button className="btn btn-info text-white">Graphs & reports</button>
          <button className="btn btn-info  text-white">Transactions</button>
          {/* <button className="btn bg-gray-900 text-white">Recurring expenses</button>
          <button className="btn bg-gray-900 text-white">AI-generated spending insights</button> */}
        </div>
  
        {/* Ask for Insights */}
        <button className="btn btn-lg btn-accent text-black w-full max-w-lg py-4 font-semibold">Ask for insights</button>
        </>

    )
}