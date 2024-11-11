import { useNavigate } from "react-router-dom";
import CustomBarChart from "../components/BarChart";
import { useEffect, useRef, useState } from "react";
import useApiRequest from "../hooks/useAPI";

export default function HomePage() {
  const { sendRequest, data, error, loading } = useApiRequest({ auth: true });
  const nav = useNavigate()  

  const [insightFocus, setInsightFocus] = useState(false)
  const [inputValue, setInputValue] = useState("");
  const [insightResp, setInsightResp] = useState("")

  const insightBoxRef = useRef(null)
  const cancelBtnRef = useRef(null)
  const submitBtnRef = useRef(null)

  useEffect(() => {
    if (data && !error) {
      console.log(data.content)
      setInsightResp(data.content)
    }
  }, [data, error])

  const handleFocusInsightClick = (e) => {
    e.preventDefault()
    if (cancelBtnRef.current && cancelBtnRef.current.contains(e.target)) {
      // cancel insight container
      setInsightFocus(false)
    } else if (submitBtnRef.current && submitBtnRef.current.contains(e.target)) {
      // *** send user ask request
      try {
        sendRequest('POST', '/transactions/get-ask-insight/', {"user_context": inputValue})
      } catch (error) {
        console.log(error)
      }
    } else {
      // set insight container focus
      setInsightFocus(true)
    }
  }

  const handleClickOutside = (event) => {
    if (insightBoxRef.current && !insightBoxRef.current.contains(event.target)) {
      setInsightFocus(false);
    }
  };

  useEffect(() => {
    if (insightFocus && !insightResp) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [insightFocus]);

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
      <div
          ref={insightBoxRef}
          className={`w-full max-w-lg p-4 font-semibold shadow-md bg-custom2 border border-gray-300 rounded-lg transition-all duration-300 ease-in-out ${
            insightFocus ? "py-6" : "cursor-pointer"
          }`}
          onClick={handleFocusInsightClick}
        >
          <div className="text-white">Ask for Insights</div>
          
          {insightFocus && (
            <div className="mt-4 space-y-2">
              <input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                type="text"
                className="w-full p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="Type your question here..."
              />

              <div className="flex justify-end">
                <button
                  ref={cancelBtnRef}
                  className="bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>

                <button
                  ref={submitBtnRef}
                  disabled={!inputValue.trim()}
         
                  className={`py-2 px-4 font-semibold rounded-lg ml-2 ${
                    inputValue.trim()
                      ? "bg-accent text-white hover:bg-accent-dark"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  Submit
                </button>
              </div>

              {insightResp && (
                <div className="mt-8 p-4 border rounded-lg shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Response:</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {insightResp}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
