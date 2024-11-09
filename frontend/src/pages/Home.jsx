import { useNavigate } from "react-router-dom";
import CustomBarChart from "../components/BarChart";
import { useRef, useState } from "react";

export default function HomePage() {
  const nav = useNavigate()  
  const [insightFocus, setInsightFocus] = useState(false)
  const insightBoxRef = useRef(null)

  const handleInsightFocus = () => setInsightFocus(true)

  const voiceClickHandler = (e) => {
    e.preventDefault();
    nav("/audio-input");
  };
  const camClickHandler = (e) => {
    e.preventDefault();
    nav("/cam-input");
  };

  const penClickHandler = (e) => {
    e.preventDefault();
    nav("/new-transaction");
  };

  const navTransactionHandler = (e) => {
    e.preventDefault();
    nav("/transactions");
  };

  const navReportsHandler = (e) => {
    e.preventDefault();
    nav("/reports");
  };

  // fake data
  const categoryData = [
    { name: "Food & Drink", value: 300 },
    { name: "Utilities", value: 150 },
    { name: "Transportation", value: 100 },
    { name: "Entertainment", value: 75 },
    { name: "Shopping", value: 200 },
    { name: "Others", value: 125 },
  ];

  return (
    <>
      <div className="w-full max-w-lg flex flex-col items-center gap-4 mt-6 mb-6">
        <div className="relative flex items-center w-full mt-4">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="text-xl font-semibold px-4 text-gray-700">
            Upload transaction
          </span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        {/* Icon Upload Buttons */}
        <div className="grid grid-cols-3 gap-4 w-full max-w-lg justify-items-center">
          <button
            onClick={camClickHandler}
            className="btn btn-lg bg-custom3 text-white w-full rounded-lg"
          >
            Camera
          </button>
          <button
            onClick={voiceClickHandler}
            className="btn btn-lg bg-custom3 text-white w-full rounded-lg"
          >
            Voice
          </button>
          <button
            onClick={penClickHandler}
            className="btn btn-lg bg-custom3 text-white w-full rounded-lg"
          >
            Write
          </button>
        </div>

        {/* Categorized Spending Chart */}
        <div className="w-full max-w-lg bg-white p-6 rounded-lg border-2">
          <h2 className="text-xl font-semibold mb-4">Categorized Spending</h2>
          {/* Placeholder for Chart */}
          <CustomBarChart categoryData={categoryData} />
        </div>

        {/* Budget Overview */}
        <div className="w-full max-w-lg bg-white p-6 rounded-lg border-2 flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
          <button className="btn btn-warning btn-circle text-white px-6 py-2 font-semibold bg-custom3 border-gray-300">
            Add
          </button>
          <div className="flex flex-col text-left">
            <p className="text-lg font-semibold">Budget Overview</p>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="grid grid-cols-2 gap-4 w-full max-w-lg">
          <button
            onClick={navReportsHandler}
            className="btn btn-info text-white shadow-md bg-custom4 border-gray-300 rounded-lg"
          >
            Graphs & reports
          </button>
          <button
            onClick={navTransactionHandler}
            className="btn btn-info text-white shadow-md bg-custom4 border-gray-300 rounded-lg"
          >
            Transactions
          </button>
        </div>

        {/* Ask for Insights */}
        <button className="btn btn-lg btn-accent text-white w-full max-w-lg py-4 font-semibold shadow-md bg-custom2
                            border-gray-300 rounded-lg">
          Ask for Insights
        </button>
      </div>
    </>
  );
}
