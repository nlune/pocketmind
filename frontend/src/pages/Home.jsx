import { useNavigate } from "react-router-dom";
import CustomBarChart from "../components/BarChart";
import AskInsightComponent from "../components/AskInsightComponent";
import { useEffect, useState } from "react";
import useApiRequest from "../hooks/useAPI";
import LoadingSwirl from "../components/LoadingSwirlAnimation";

import {  Camera, Microphone, Pencil,  } from 'phosphor-react';

export default function HomePage() {
  const { sendRequest, data, error, loading } = useApiRequest({ auth: true });
  const [categoryDat, setCategoryDat] = useState(null)
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
    nav("/budget");
  };

  useEffect(() => {
    sendRequest('GET', '/categories/totals/')
  }, [])


  useEffect(() => {
    if (data && !error) {
      console.log(data.categories[0].color)
      setCategoryDat(data.categories)

  }
  }, [data, error])

  const iconSize = 27

  return (
    <>
      <div className="w-full p-1 max-w-lg flex flex-col items-center gap-4 ">
        <div className="relative flex items-center w-full mt-4">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="text-xl font-semibold px-4 text-gray-700">
            Upload transaction
          </span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        {/* Icon Upload Buttons */}
        <div className="grid grid-cols-3 gap-6 w-full max-w-lg justify-items-center px-1">
          <button
            onClick={camClickHandler}
            className="btn btn-lg bg-custom3 text-white w-full rounded-lg  border-gray-300
          hover:bg-opacity-90 hover:border-opacity-100 hover:border-custom3 hover:bg-custom3"
          >
            <Camera size={iconSize}/>
          </button>
          <button
            onClick={voiceClickHandler}
            className="btn btn-lg bg-custom3 text-white w-full rounded-lg border-gray-300
          hover:bg-opacity-90 hover:border-opacity-100 hover:border-custom3 hover:bg-custom3"
          >
            <Microphone size={iconSize}/>
          </button>
          <button
            onClick={penClickHandler}
            className="btn btn-lg bg-custom3 text-white w-full rounded-lg border-gray-300
          hover:bg-opacity-90 hover:border-opacity-100 hover:border-custom3 hover:bg-custom3"
          >
            <Pencil size={iconSize}/>
          </button>
        </div>

        {loading && <LoadingSwirl/>} 

        {/* Categorized Spending Chart */}
        {categoryDat && !loading && <div className="w-full max-w-lg bg-white p-6 rounded-lg border-2">
          <h2 className="text-xl font-semibold mb-4">Categorized Spending</h2>
          {/* Placeholder for Chart */}
          <CustomBarChart categoryData={categoryDat} />
        </div>}

        {/* Budget Overview */}
        <div className="w-full max-w-lg bg-white p-2 py-4 rounded-lg border-2 flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4">
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
