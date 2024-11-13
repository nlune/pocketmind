import { useNavigate } from "react-router-dom";
import CustomBarChart from "../components/BarChart";
import AskInsightComponent from "../components/AskInsightComponent";


export default function HomePage() {
  const nav = useNavigate()  

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

  const navBudgetHandler = (e) => {
    e.preventDefault();
    nav("/reports");
  };

  // fake data
  const categoryData = [
    { name: "Food & Drink", amount: 300 },
    { name: "Utilities", amount: 150 },
    { name: "Transportation", amount: 100 },
    { name: "Entertainment", amount: 75 },
    { name: "Shopping", amount: 200 },
    { name: "Others", amount: 125 },
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
            className="btn btn-lg bg-custom3 text-white w-full rounded-lg border-gray-300
          hover:bg-opacity-90 hover:border-opacity-100 hover:border-custom3 hover:bg-custom3"
          >
            Camera
          </button>
          <button
            onClick={voiceClickHandler}
            className="btn btn-lg bg-custom3 text-white w-full rounded-lg border-gray-300
          hover:bg-opacity-90 hover:border-opacity-100 hover:border-custom3 hover:bg-custom3"
          >
            Voice
          </button>
          <button
            onClick={penClickHandler}
            className="btn btn-lg bg-custom3 text-white w-full rounded-lg border-gray-300
          hover:bg-opacity-90 hover:border-opacity-100 hover:border-custom3 hover:bg-custom3"
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
          <button onClick={navBudgetHandler} className="btn btn-warning btn-circle text-white px-6 py-2 font-semibold bg-custom3 border-gray-300
          hover:bg-opacity-90 hover:border-opacity-100 hover:border-custom3 hover:bg-custom3">
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
            className="btn btn-info text-white shadow-md bg-custom4 border-gray-300 rounded-lg
          hover:bg-opacity-90 hover:border-opacity-100 hover:border-custom4 hover:bg-custom4"
          >
            Graphs & reports
          </button>
          <button
            onClick={navTransactionHandler}
            className="btn btn-info text-white shadow-md bg-custom4 border-gray-300 rounded-lg
          hover:bg-opacity-90 hover:border-opacity-100 hover:border-custom4 hover:bg-custom4"
          >
            Transactions
          </button>
        </div>

        <AskInsightComponent/>

      </div>
    </>
  );
}
