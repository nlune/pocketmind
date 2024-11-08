//import { useNavigate } from "react-router-dom"
import useApiRequest from "../hooks/useAPI.js"
import {useEffect, useState} from "react"

export default function BudgetMain() {
    //added colors so tailwind already knows the colors which are applied dynamic
    const { sendRequest: fetchBudgets, data: budgets, loading: loadingBudgets, error: errorBudgets } = useApiRequest()
    const { sendRequest: fetchCategories, data: categories, loading: loadingCategories, error: errorCategories } = useApiRequest()

    const [showModal, setShowModal] = useState(false)
    const toggleModal = () => setShowModal(!showModal)

    const [selectedCategory, setSelectedCategory] = useState("")



    const formatCurrency = (value) => {
        if (!value) return "";
        return new Intl.NumberFormat("de-DE", {
            style: "currency",
            currency: "EUR",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(value);
    };

    //Limit
    const [limit, setLimit] = useState("");
    const [editingLimitValue, setEditingLimitValue] = useState("");
    const [isEditingLimit, setIsEditingLimit] = useState(false);

    const handleLimitChange = (e) => {
        const value = e.target.value;
        const regex = /^\d{1,6}(,\d{0,2})?$/;

        if (value === "" || regex.test(value)) {
            setEditingLimitValue(value);
        }
    };

    const handleFocusLimit = () => {
        setIsEditingLimit(true);
        setEditingLimitValue(limit.replace(/[^\d,]/g, "").replace(".", ","));
    };

    const handleBlurLimit = () => {
        setIsEditingLimit(false);
        const numericValue = parseFloat(editingLimitValue.replace(",", "."));
        if (!isNaN(numericValue)) {
            setLimit(formatCurrency(numericValue));
        }
        else {
            setLimit("");
        }
    };

    //Start Amount
    const [startingAmount, setStartingAmount] = useState("")
    const [editingStartAmountValue, setEditingStartAmountValue] = useState("");
    const [isEditingStartAmount, setIsEditingStartAmount] = useState(false);

    const handleStartAmountChange = (e) => {
        const value = e.target.value;
        const regex = /^\d{1,6}(,\d{0,2})?$/;

        if (value === "" || regex.test(value)) {
            setEditingStartAmountValue(value);
        }
    };

    const handleFocusStartAmount = () => {
        setIsEditingStartAmount(true);
        setEditingStartAmountValue(startingAmount.replace(/[^\d,]/g, "").replace(".", ","));
    };

    const handleBlurStartAmount = () => {
        setIsEditingStartAmount(false);
        const numericValue = parseFloat(editingStartAmountValue.replace(",", "."));
        if (!isNaN(numericValue)) {
            setStartingAmount(formatCurrency(numericValue));
        }
        else {
            setStartingAmount("");
        }
    };

    //Color
    const colors = [
        'bg-red-700','bg-orange-500', 'bg-amber-400', 'bg-lime-400',
        'bg-green-600', 'bg-emerald-500', 'bg-teal-400', 'bg-cyan-600',
        'bg-sky-400', 'bg-blue-700', 'bg-indigo-600', 'bg-violet-500',
        'bg-purple-400','bg-fuchsia-400', 'bg-pink-300', 'bg-rose-600',
    ];

    const [selectedColor, setSelectedColor] = useState("")
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);



    //const nav = useNavigate()

    useEffect(() => {
        fetchBudgets("GET", "budgets/");
        fetchCategories("GET", "categories/");
    }, [])


    if (loadingBudgets || loadingCategories) return <p>Loading...</p>;
    if (errorBudgets) return <p>Error loading budgets: {errorBudgets.message}</p>;
    if (errorCategories) return <p>Error loading categories: {errorCategories.message}</p>;

    return (

        <>
            <div className="w-full max-w-lg flex flex-col items-center space-y-2">
                <div className="relative flex items-center w-full">
                    <div className="flex-grow border-t border-gray-300"></div>
                    <span className="text-xl font-semibold px-4 bg-gray-100 text-gray-800">Total Budgets</span>
                    <div className="flex-grow border-t border-gray-300"></div>
                </div>
            </div>
            {/* Total Budget */}
            <div className="w-full max-w-lg bg-white p-6 rounded-lg shadow-md">
                <div className="w-full h-15 bg-gray-200 rounded-lg flex items-center justify-center">
                    <div className="relative mx-5 my-10 w-full max-w-lg">
                        <div className="w-full h-6 bg-gray-800  relative">
                            <div className="h-full bg-gradient-to-r from-red-200 to-red-500 "
                                 style={{width: '100%'}}></div>
                            {/* insert progress value at the end in [value%]*/}
                            <div className="h-full bg-gray-800  absolute top-0 right-0 bottom-0 left-[60%]"></div>
                            <div
                                className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center text-white font-semibold">
                                <span>60%</span>
                            </div>
                        </div>
                        <div className="mb-2 mt-2 flex items-center justify-between text-sm">
                            <div className="flex-col">
                                <div className="text-gray-600 font-bold">SPEND</div>
                                <div className="text-gray-600 ">600.00</div>
                            </div>
                            <div className="flex-col">
                                <div className="text-gray-600 font-bold text-right">LIMIT</div>
                                <div className="text-gray-600 text-right">1000.00</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="w-full max-w-lg flex flex-col items-center space-y-2">
                <div className="relative flex items-center w-full">
                    <div className="flex-grow border-t border-gray-300"></div>
                    <span className="text-xl font-semibold px-4 bg-gray-100 text-gray-800">Budget Overview</span>
                    <div className="flex-grow border-t border-gray-300"></div>
                </div>
            </div>
            {/* Scroll View for List of Budgets */}
            <div
                className="w-full max-w-lg bg-white p-2 rounded-lg shadow-md min-h-[calc(5*48px)] max-h-[calc(5*48px)] overflow-y-scroll">
                {budgets && budgets.map((budget, index) => (
                    <div key={index} className="mb-2">
                        <div className="flex items-center relative">
                            <div className="w-1/3 text-gray-700 font-medium">
                                {budget.category.name}
                            </div>
                            <div className="w-2/3 h-5 bg-gray-800 relative overflow-hidden ml-1">
                                <div
                                    className={`h-full ${budget.color}`}
                                    style={{
                                        width: `${(budget.spend / budget.limit) * 100}%`,
                                    }}
                                ></div>
                                <div
                                    className="absolute inset-0 flex items-center justify-center text-white font-bold text-xs">
                                    {budget.spend} / {budget.limit}
                                </div>
                            </div>
                        </div>

                    </div>
                ))}
            </div>
            <div className="flex justify-between items-center w-full max-w-lg space-x-5">
                <button
                    onClick={toggleModal}
                    className="flex-1 btn btn-lg bg-secondary text-white py-2 px-4 rounded-lg">
                    New Budget
                </button>
                <button className="flex-1 btn btn-lg bg-accent text-white py-2 px-4 rounded-lg">
                    Edit
                </button>
            </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-semibold mb-4 text-center">Create New Budget</h2>

                {/* Category Selection Dropdown */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-800">Category</label>
                    <select
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                        <option value="">Select category</option>
                        {categories && categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-800 mb-1">Limit:</label>
                    <input
                        type="text"
                        className="w-full p-2 border-2 border-gray-300 rounded-md focus:outline-none focus:border-blue-500 placeholder-gray-400"
                        placeholder="Enter budget limit"
                        value={isEditingLimit ? editingLimitValue : limit}
                        onFocus={handleFocusLimit}
                        onBlur={handleBlurLimit}
                        onChange={handleLimitChange}
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-800 mb-1">Starting Amount:</label>
                    <input
                        type="text"
                        className="w-full p-2 border-2 border-gray-300 rounded-md focus:outline-none focus:border-blue-500 placeholder-gray-400"
                        placeholder="Enter starting amount (Optional)"
                        value={isEditingStartAmount ? editingStartAmountValue : startingAmount}
                        onFocus={handleFocusStartAmount}
                        onBlur={handleBlurStartAmount}
                        onChange={handleStartAmountChange}
                    />
                </div>

 {/* Color selection */}
<div className="relative flex flex-col items-start">
  <label className="block text-sm font-medium text-gray-800 mb-1">Color:</label>
  <div className="relative flex items-center">
    <button
      onClick={toggleDropdown}
      className="w-12 h-12 flex justify-center items-center p-1 border-2 border-gray-300 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      {selectedColor ? (
        <span className={`block w-full h-full rounded-md ${selectedColor}`}></span>
      ) : (
        "Select"
      )}
    </button>

    {/* Dropdown menu with 4x4 grid of colors */}
    {isDropdownOpen && (
      <div
        className="absolute left-full ml-2 w-48 bg-white shadow-lg rounded-lg grid grid-cols-4 gap-2 p-2 max-h-60 overflow-y-auto z-50"
        style={{ top: '-150px' }}
        onClick={(e) => e.stopPropagation()}
      >
        {colors.map((color, index) => (
          <button
            key={index}
            className={`w-10 h-10 rounded-md ${color} hover:ring-2 hover:ring-gray-600 transition duration-200`}
            onClick={() => {
              setSelectedColor(color);
              setIsDropdownOpen(false); // Close dropdown on selection
            }}
          ></button>
        ))}
      </div>
    )}
  </div>
</div>

                {/* Action buttons */}
                <div className="flex justify-end space-x-3">
                    <button
                        onClick={() => setShowModal(false)}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg">
                        Cancel
                    </button>
                    <button
                        //onClick={handleSubmit}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg">
                        Save
                    </button>
                </div>
            </div>
        </div>
      )}
        </>
    );
}