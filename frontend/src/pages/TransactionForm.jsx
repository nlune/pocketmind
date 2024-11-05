import { useLocation } from "react-router-dom"
import useApiRequest from "../hooks/useAPI";
import { useEffect, useState } from "react";


export default function TransactionForm() {
    const { sendRequest, data, error, loading } = useApiRequest({ auth: true });
    const categories = ["Food", "Transportation", "Entertainment", "Shopping"]
    const { state } = useLocation()
    const userInput = state.userInput

    const [description, setDescription ] = useState("")
    const [amount, setAmount ] = useState("")
    const [category, setCategory] = useState("")

    useEffect(() => {
      sendRequest("POST", "/transactions/get-via-input/", {"text": userInput})
    }, [userInput])

    useEffect(() => {
      if (data && !error) {
          setDescription(data.description)
          setAmount(data.amount)
      }
  }, [data, error])
    

    return (
        <>
        <div className="flex flex-col w-full max-w-md p-6 bg-white rounded-lg shadow-md space-y-6 ">
        <h3 className="text-2xl font-semibold text-center text-gray-700">Add Transaction</h3>

            <div className="px-6">
            <label className="block text-sm font-medium text-gray-600">Description:</label>
            <input
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
            <label className="block text-sm font-medium text-gray-600">Category</label>
            <select defaultValue={'default'} 
            className="select select-bordered w-full mt-2 py-2 px-4 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-200">
              <option value='default' disabled>
                Select category
              </option>
              {categories && categories.map((e, i) => <option key={i}>{e}</option>)}
            </select>
          </div>

        <div className="flex flex-row w-full justify-end pt-6 p-1 space-x-3 ">
          <button className="btn btn-warning w-20 rounded-lg">Cancel</button>
          <button className="btn btn-accent w-20 rounded-lg">Save</button>
          </div>
          
        </div>
        </>
    )
}