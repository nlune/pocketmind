//import { useNavigate } from "react-router-dom"
import useApiRequest from "../hooks/useAPI.js"
import {useEffect, useState} from "react"

export default function BudgetMain() {

    const {sendRequest: fetchBudgets, data: budgets, loading: loadingBudgets, error: errorBudgets} = useApiRequest()
    const {sendRequest: fetchCategories, data: categories, loading: loadingCategories, error: errorCategories} = useApiRequest()
    const {sendRequest: fetchColors, data: colors, loading: loadingColors, error: errorColors} = useApiRequest()
    const {sendRequest: createBudget} = useApiRequest();

    const [showModal, setShowModal] = useState(false)
    const toggleModal = () => setShowModal(!showModal)

    const [availableCategories, setAvailableCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("")
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);
    const [selectedColor, setSelectedColor] = useState({ id: null, hexcode: "" });
    const [isColorSelectedManually, setIsColorSelectedManually] = useState(false);

    const [limit, setLimit] = useState("");
    const [editingLimitValue, setEditingLimitValue] = useState("");
    const [isEditingLimit, setIsEditingLimit] = useState(false);

    const [startingAmount, setStartingAmount] = useState("")
    const [editingStartAmountValue, setEditingStartAmountValue] = useState("");
    const [isEditingStartAmount, setIsEditingStartAmount] = useState(false);

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

    const [shouldRefresh, setShouldRefresh] = useState(false);

    useEffect(() => {
        fetchBudgets("GET", "budgets/");
        fetchCategories("GET", "categories/");
        fetchColors("GET", "colors/");
        setShouldRefresh(false);
    }, [shouldRefresh])

    useEffect(() => {
        if (budgets && categories) {
            const budgetedCategoryIds = budgets.map(budget => budget.category.id);
            const filteredCategories = categories.filter(category => !budgetedCategoryIds.includes(category.id));
            setAvailableCategories(filteredCategories);
        }
    }, [budgets, categories]);



// const handleCategoryChange = (e) => {
//     const categoryId = e.target.value;
//     setSelectedCategory(categoryId); // Update selected category state
//
//     console.log("Selected category ID:", categoryId);
//
//     if (loadingCategories) {
//         console.log("Categories are still loading...");
//         return;  // Return early if categories are still loading
//     }
//
//     // Make sure categories data is loaded
//     if (categories && Array.isArray(categories)) {
//         const selectedCategoryData = categories.find(category => category.id === parseInt(categoryId));
//
//         console.log("Selected Category Data:", selectedCategoryData);
//
//         if (selectedCategoryData && selectedCategoryData.color) {
//             const colorId = selectedCategoryData.color.id;
//
//             // Find the color by ID and update selected color
//             const color = colors.find(c => c.id === colorId);
//             if (color) {
//                 setSelectedColor({ id: color.id, hexcode: color.hexcode });
//             } else {
//                 console.log("Color with ID not found");
//             }
//         } else {
//             console.log("No color assigned to the selected category");
//         }
//     } else {
//         console.log("Categories data is not available");
//     }
// };

    const handleCategoryChange = (event) => {
        const selectedCategoryId = event.target.value;
        setSelectedCategoryId(selectedCategoryId);

        const selectedCategoryData = categories.find((category) => category.id === parseInt(selectedCategoryId));
        console.log("Selected Category Data:", selectedCategoryData);

        if (selectedCategoryData && selectedCategoryData.color) {
            const categoryColorHex = selectedCategoryData.color.hexcode;

            // Set category color only if the user hasn't selected their own color
            if (!selectedColor.hexcode) {
                setSelectedColor({ id: selectedCategoryData.color.id, hexcode: categoryColorHex });
                console.log("Category color set to:", categoryColorHex);
            }
        }
    };

    const handleColorChange = (color) => {
        setSelectedColor({ id: color.id, hexcode: color.hexcode });
        setIsColorSelectedManually(true); // Indicate that the user manually selected a color
        setIsDropdownOpen(false);
    };

    //Value-to-Currency Converter
    const formatCurrency = (value) => {
        if (!value) return "";
        return new Intl.NumberFormat("de-DE", {
            style: "currency",
            currency: "EUR",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(value);
    };

    //Limit-Handler
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
        console.log("editingLimitValue: " + editingLimitValue)
        const numericValue = parseFloat(editingLimitValue.replace(",", "."));
        if (!isNaN(numericValue)) {
        console.log("numericValue: " + numericValue)
            const limitCurreny = formatCurrency(numericValue)
        console.log("limitCurreny: " + limitCurreny)

            setLimit(limitCurreny);
        } else {
            setLimit("");
        }
    };

    //StartAmount-Handler
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
        if (numericValue === "") {
            setStartingAmount(formatCurrency(0));
        } else {
            if (!isNaN(numericValue)) {
                setStartingAmount(formatCurrency(numericValue));
            } else {
                setStartingAmount("");
            }
        }
    };

    const handleSubmit = async () => {
        // Parse limit to a float and ensure spend is set to 0
        const limitWithoutDot = limit.replace(".", "");
        const parsedLimit = parseFloat(limitWithoutDot.replace(",", "."));

        let startAmountNoDot = startingAmount.replace(".", "");
        let parsedStartAmount = parseFloat(startAmountNoDot.replace(",", "."));


        if (isNaN(parsedLimit)) {
            alert("Please enter a valid limit.");
            return;
        }
        if (isNaN(parsedStartAmount)) {
            parsedStartAmount = 0;
        }

        console.log("submit limit: " + parsedLimit)

        const budgetData = {
            category_id: selectedCategoryId,
            color_id: selectedColor.id,
            limit: parsedLimit,
            spend: parsedStartAmount
        };

        try {
            await createBudget("POST", "budgets/", budgetData);
            toggleModal(); // Close modal on success
            setShouldRefresh(true);
        } catch (error) {
            console.error("Error creating budget:", error);
            alert(`Failed to create budget. Reason: ${error.message || "Unknown"}`);
        }
    };

    if (loadingBudgets || loadingCategories) return <p>Loading...</p>;
    if (errorBudgets) return <p>Error loading budgets: {errorBudgets.message}</p>;
    if (errorCategories) return <p>Error loading categories: {errorCategories.message}</p>;

    console.log(selectedColor)
    console.log(selectedCategory.color)
    console.log("limit: " + limit)

    return (

        <>
            <div className="w-full max-w-lg flex flex-col items-center space-y-2">
                <div className="relative flex items-center w-full pt-2">
                    <div className="flex-grow border-t border-gray-300"></div>
                    <span className="text-xl font-semibold px-4 bg-transparent text-gray-800">Total Budgets</span>
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
                <div className="relative flex items-center w-full pt-2">
                    <div className="flex-grow border-t border-gray-300"></div>
                    <span className="text-xl font-semibold px-4 bg-transparent text-gray-800">Budget Overview</span>
                    <div className="flex-grow border-t border-gray-300"></div>
                </div>
            </div>
            {/* Scroll View for List of Budgets */}
            <div
                className="w-full max-w-lg bg-white p-2 mb-6 rounded-lg shadow-md min-h-[calc(5*48px)] max-h-[calc(5*48px)] overflow-y-scroll">
                {Array.isArray(budgets) && budgets.length > 0 ? (
                    budgets.map((budget, index) => (
                        <div key={index} className="mb-2">
                            <div className="flex items-center relative">
                                <div className="w-1/3 text-gray-700 font-medium">
                                    {budget.category.name}
                                </div>
                                <div className="w-2/3 h-5 bg-gray-800 relative overflow-hidden ml-1">
                                    <div
                                        className={`h-full `}
                                        style={{
                                            width: `${(budget.spend / budget.limit) * 100}%`,
                                            backgroundColor: budget.category.color.hexcode
                                        }}
                                    ></div>
                                    <div
                                        className="absolute inset-0 flex items-center justify-center text-white font-bold text-xs">
                                        {budget.spend} / {budget.limit}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="flex items-center justify-center w-full h-full">
                        <p className="text-gray-500">No budgets set</p>
                    </div>
                )}
            </div>
            <div className="flex justify-between items-center w-full max-w-lg space-x-5 pt-4">
                <button
                    onClick={toggleModal}
                    disabled={availableCategories.length === 0}
                    className={`flex-1 btn btn-lg py-2 px-4 rounded-lg ${availableCategories.length === 0 ? "bg-gray-300 cursor-not-allowed" : "bg-secondary text-white"}`}
                >
                    New Budget
                </button>
                <button className="flex-1 btn btn-lg bg-accent text-white py-2 px-4 rounded-lg">Edit</button>
            </div>

        {/* Modal for Creating Budget */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                        <h2 className="text-2xl font-semibold mb-4 text-center">Create New Budget</h2>

                        {/* Category Selection Dropdown */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-800">Category</label>
                            <select
                                value={selectedCategoryId || ""}
                                onChange={handleCategoryChange}
                                className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md"
                            >
                                <option value="">Select category</option>
                                {availableCategories.map((category) => (
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

                                                {/* Color Selection */}
                        <div className="relative flex flex-col items-start">
                            <label className="block text-sm font-medium text-gray-800 mb-1">Color:</label>
                            <div className="relative flex items-center">
                                <button
                                    onClick={toggleDropdown}
                                    className="w-12 h-12 flex justify-center items-center p-1 border-2 border-gray-300 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    style={{ backgroundColor: selectedColor.hexcode || "#e5e7eb" }}
                                >
                                    {selectedColor.hexcode ? (
                                        <span className="block w-full h-full rounded-md"></span>
                                    ) : (
                                        "Select" // Placeholder when no color is selected
                                    )}
                                </button>

                                {isDropdownOpen && (
                                    <div
                                        className="absolute left-full ml-2 w-48 bg-white shadow-lg rounded-lg grid grid-cols-4 gap-2 p-2 max-h-60 overflow-y-auto z-50"
                                        style={{ top: "-150px" }}
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        {colors.map((color) => (
                                            <button
                                                key={color.id}
                                                className="w-10 h-10 rounded-md hover:ring-2 hover:ring-gray-600 transition duration-200"
                                                style={{ backgroundColor: color.hexcode }}
                                                onClick={() => handleColorChange(color)}
                                            ></button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Submit Buttons */}
                        <div className="flex justify-end space-x-3">
                            <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg">
                                Cancel
                            </button>
                            <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded-lg">
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}