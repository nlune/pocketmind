import { useLocation, useNavigate } from "react-router-dom"
import useApiRequest from "../hooks/useAPI";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";


export default function TransactionForm() {
  const nav = useNavigate()
  const token = useSelector(s => s.User.accessToken)
  const headers = {'Authorization': 'Bearer ' + token}

    const { sendRequest, data, error, loading } = useApiRequest({ auth: true });
    const { state } = useLocation()
    const userInput = state?.userInput // from audio input
    const scannedTxt = state?.scannedTxt

    const [description, setDescription ] = useState("")
    const [amount, setAmount ] = useState("")
    const [category, setCategory] = useState("")

    const desciptionRef = useRef(null)

    const handleClickOutside = async (event) => {
      if (desciptionRef.current && !desciptionRef.current.contains(event.target)) {
        try {
          const resp = await axios.post("/transactions/get-category/", {"description": description}, headers)
          setCategory(resp.data.name)

        } catch (error) {
          console.log("get cate err ", error)
        }
      }
  };

    useEffect(() => {
      if (userInput) {
        try {
          sendRequest("POST", "/transactions/get-via-input/", {"text": userInput})
        }catch (error) {
          console.log(error)
        }
      } else if (scannedTxt) {
        try {
          sendRequest("POST", "/transactions/get-via-scan/", {"text": scannedTxt}) 
        } catch (error) {
          console.log(error)
        }
  
      }
    }, [userInput, scannedTxt])

    useEffect(() => {
      if (data && !error) {
        console.log(data)
          setDescription(data?.description)
          setAmount(data?.amount)
          setCategory(data?.category.name)
      }
  }, [data, error])

  useEffect(() => {
    if (!data && description) {
      document.addEventListener("mousedown", handleClickOutside, {once: true});
    } else {
        document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
  };
  }, [description])
    
  const handleCancel = () => {
    nav('/home')
  }

  const handleBack = () => {
    nav(-1)
  }

  const handleSave = async () => {
    try {
      const save_dat = {
        "description": description,
        "amount": amount,
        "category": category
      }
      const resp = await axios.post('/transactions/add-by-user/', save_dat, headers)
      nav('/home')

    } catch (error) {
      console.log("save err ", error)
    }
  }

    return (
        <>
        <div className="flex flex-col w-full max-w-md p-6 bg-white rounded-lg shadow-md space-y-6 ">
        <h3 className="text-2xl font-semibold text-center text-gray-700">Add Transaction</h3>

            <div className="px-6">
            <label className="block text-sm font-medium text-gray-600">Description:</label>
            <input
              ref={desciptionRef}
              type="text"
              placeholder="e.g., Coffee at Café"
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="input input-bordered w-full mt-2 py-2 px-4 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-200"
            /></div>

            <div className="px-6">
            <label className="block text-sm font-medium text-gray-600">Amount:</label>
            <input
              type="number"
              placeholder="e.g., 15.50"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              className="input input-bordered w-full mt-2 py-2 px-4 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <div className="px-6">
            <label className="block text-sm font-medium text-gray-600">Category:</label>
            <input
              type="text"
              placeholder="e.g., Food & Drinks"
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="input input-bordered w-full mt-2 py-2 px-4 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-200"
            /></div>

          {/* <div className="px-6">
            <label className="block text-sm font-medium text-gray-600">Category</label>
            <select defaultValue={'default'} 
            value={category} 
            onChange={(e) => setCategory(e.target.value)}
            className="select select-bordered w-full mt-2 py-2 px-4 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-200">
              <option value='default' disabled>
                Select category
              </option>
              {categories && categories.map((e, i) => <option key={i}>{e}</option>)}
            </select>
          </div> */}

        <div className="flex flex-row w-full justify-end pt-6 p-1 space-x-3 ">
          <button className="btn btn-info bg-custom2 text-white w-20 rounded-lg border-gray-300
          hover:bg-opacity-90 hover:border-opacity-100 hover:border-custom2 hover:bg-custom2"
                  onClick={handleCancel}>
            Home
          </button>
          <button className="btn btn-secondary bg-custom3 text-white w-20 rounded-lg
        hover:bg-opacity-90 hover:border-opacity-100 hover:border-custom3 hover:bg-custom3"
                  onClick={handleBack}>
            Back
          </button>
          <button className="btn btn-accent bg-blue-600 text-white w-20 rounded-lg border-gray-300
          hover:bg-opacity-90 hover:border-opacity-100 hover:border-blue-600 hover:bg-blue-600"
                  onClick={handleSave}>
          Submit
          </button>
        </div>

        </div>
        </>
    )
}