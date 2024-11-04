import { useLocation } from "react-router-dom"


export default function TransactionForm() {
    const categories = ["Food", "Transportation", "Entertainment", "Shopping"]
    const { state } = useLocation()
    const userInput = state.userInput
    

    return (
        <>
        <div className="flex flex-col w-full max-w-md p-6 bg-white rounded-lg shadow-md space-y-6">
        <h2 className="text-2xl font-semibold text-center text-gray-700">Add Transaction</h2>

            <div>
            <label className="block text-sm font-medium text-gray-700">Description:</label>
            <input
              type="text"
              placeholder="Enter description"
              className="input input-bordered w-full mt-1"
            /></div>

            <div>
            <label className="block text-sm font-medium text-gray-700">Amount:</label>
            <input
              type="number"
              placeholder="Enter amount"
              className="input input-bordered w-full mt-1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <select defaultValue={'default'} className="select select-bordered w-full mt-1">
              <option value='default' disabled>
                Select category
              </option>
              {categories && categories.map((e, i) => <option key={i}>{e}</option>)}
              {/* Add more categories as needed */}
            </select>
          </div>

        <div className="flex flex-row w-full justify-end pt-5 p-1">
          <button className="btn w-20 bg-gray-300 text-gray-700 hover:bg-gray-400">Cancel</button>
          <button className="btn w-20 bg-blue-600 text-white hover:bg-blue-700">Save</button>
          </div>
          
        </div>
        </>
    )
}