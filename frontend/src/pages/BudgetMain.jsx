import useApiRequest from "../hooks/useAPI.js"
import {useEffect, useState} from "react"

export default function BudgetMain() {

    const {sendRequest: fetchBudgets, data: budgets, loading: loadingBudgets, error: errorBudgets} = useApiRequest()
    const {
        sendRequest: fetchCategories,
        data: categories,
        loading: loadingCategories,
        error: errorCategories
    } = useApiRequest()
    const {sendRequest: fetchColors, data: colors, loading: loadingColors, error: errorColors} = useApiRequest()
    const {sendRequest: createBudget} = useApiRequest();
    const {sendRequest: updateBudget, loading: loadingUpdate, error: errorUpdate} = useApiRequest();

    //Shared
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

    const [shouldRefresh, setShouldRefresh] = useState(false);


    //Total Budget
    const [showTotalBudgetModal, setShowTotalBudgetModal] = useState(false);
    const toggleTotalBudgetModal = () => setShowTotalBudgetModal(!showTotalBudgetModal);
    const [expensesBudget, setExpensesBudget] = useState(null);

    const [limitTotalBudget, setLimitTotalBudget] = useState("");
    const [isEditingLimitTotalBudget, setIsEditingLimitTotalBudget] = useState(false);
    const [editingLimitValueTotalBudget, setEditingLimitValueTotalBudget] = useState("");

    const [startingAmountTotalBudget, setStartingAmountTotalBudget] = useState("")
    const [isEditingStartAmountTotalBudget, setIsEditingStartAmountTotalBudget] = useState(false);
    const [editingStartAmountValueTotalBudget, setEditingStartAmountValueTotalBudget] = useState("");


    //Limit-Handler TotalBudget
    const handleFocusLimitTotalBudget = () => {
        setIsEditingLimitTotalBudget(true);
        setEditingLimitValueTotalBudget(limitTotalBudget.replace(/[^\d,]/g, "").replace(".", ","));
    };

    const handleBlurLimitTotalBudget = () => {
        setIsEditingLimitTotalBudget(false);
        const numericValue = parseFloat(editingLimitValueTotalBudget.replace(",", "."));
        if (!isNaN(numericValue)) {
            setLimitTotalBudget(formatCurrency(numericValue));
        } else {
            setLimitTotalBudget("");
        }
    };

    const handleLimitChangeTotalBudget = (e) => {
        const value = e.target.value;
        const regex = /^\d{1,6}(,\d{0,2})?$/;

        if (value === "" || regex.test(value)) {
            setEditingLimitValueTotalBudget(value);
        }
    };

    //StartAmount-Handler TotalBudget
    const handleStartAmountChangeTotalBudget = (e) => {
        const value = e.target.value;
        const regex = /^\d{1,6}(,\d{0,2})?$/;

        if (value === "" || regex.test(value)) {
            setEditingStartAmountValueTotalBudget(value);
        }
    };

    const handleFocusStartAmountTotalBudget = () => {
        setIsEditingStartAmountTotalBudget(true);
        setEditingStartAmountValueTotalBudget(startingAmountTotalBudget.replace(/[^\d,]/g, "").replace(".", ","));
    };

    const handleBlurStartAmountTotalBudget = () => {
        setIsEditingStartAmountTotalBudget(false);
        const numericValue = parseFloat(editingStartAmountValueTotalBudget.replace(",", "."));
        if (numericValue === "") {
            setStartingAmountTotalBudget(formatCurrency(0));
        } else {
            if (!isNaN(numericValue)) {
                setStartingAmountTotalBudget(formatCurrency(numericValue));
            } else {
                setStartingAmountTotalBudget("");
            }
        }
    };

    const handleCancelTotalBudget = () => {
        setShowTotalBudgetModal(false)
    };

    const handleSubmitTotalBudget = async () => {
        const limitWithoutDot = limitTotalBudget.replace(".", "");
        const parsedLimit = parseFloat(limitWithoutDot.replace(",", "."));

        let startAmountNoDot = startingAmountTotalBudget.replace(".", "");
        let parsedStartAmount = parseFloat(startAmountNoDot.replace(",", "."));

        if (isNaN(parsedLimit)) {
            alert("Please enter a valid limit.");
            return;
        }
        if (isNaN(parsedStartAmount)) {
            parsedStartAmount = 0;
        }

        const updatedBudgetData = {
            limit: parsedLimit,
            spend: parsedStartAmount,
        };

        try {
            await updateBudget("PATCH", `budgets/${expensesBudget.id}/`, updatedBudgetData);
            toggleTotalBudgetModal();
            setShouldRefresh(true);
        } catch (error) {
            console.error("Error updating budget:", error);
            alert(`Failed to update total budget. Reason: ${error.message || "Unknown"}`);
        }
    };


    //New Budget
    const [showNewBudgetModal, setShowNewBudgetModal] = useState(false)
    const toggleNewBudgetModal = () => setShowNewBudgetModal(!showNewBudgetModal)

    const [availableCategories, setAvailableCategories] = useState([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);

    const [limitNewBudget, setLimitNewBudget] = useState("");
    const [isEditingLimitNewBudget, setIsEditingLimitNewBudget] = useState(false);
    const [editingLimitValueNewBudget, setEditingLimitValueNewBudget] = useState("");

    const [startingAmountNewBudget, setStartingAmountNewBudget] = useState("")
    const [isEditingStartAmountNewBudget, setIsEditingStartAmountNewBudget] = useState(false);
    const [editingStartAmountValueNewBudget, setEditingStartAmountValueNewBudget] = useState("");

    const [isNewBudgetColorDropdownOpen, setNewBudgetColorDropdownOpen] = useState(false);
    const toggleColorDropdown = () => setNewBudgetColorDropdownOpen(!isNewBudgetColorDropdownOpen);

    const [selectedNewBudgetColor, setSelectedNewBudgetColor] = useState({id: null, hexcode: ""});
    const [isColorSelectedManually, setIsColorSelectedManually] = useState(false);

    const resetNewBudgetModalFields = () => {
        setSelectedCategoryId(""); // Reset category
        setSelectedNewBudgetColor({id: null, hexcode: ""}); // Reset color
        setIsColorSelectedManually(false); //Reset flag for manually selected
        setLimitNewBudget(""); // Reset limit
        setStartingAmountNewBudget(""); // Reset starting amount
        setEditingLimitValueNewBudget(""); // Reset editing value for limit
        setEditingStartAmountValueNewBudget(""); // Reset editing value for starting amount
        setIsEditingLimitNewBudget(false); // Reset editing state for limit
        setIsEditingStartAmountNewBudget(false); // Reset editing state for starting amount
        setShouldRefresh(true);
    };

    const handleNewBudgetCategoryChange = (event) => {
        console.log("handleNewBudgetCategoryChange" + event)
        console.log(event)

        const selectedCategoryId = event.target.value;
        setSelectedCategoryId(selectedCategoryId);

        const selectedCategoryData = categories.find((category) => category.id === parseInt(selectedCategoryId));
        console.log("Selected Category Data:", selectedCategoryData);

        if (selectedCategoryData && selectedCategoryData.color) {
            const categoryColorHex = selectedCategoryData.color.hexcode;

            console.log(isColorSelectedManually)
            // Set category color only if the user hasn't selected their own color
            if (!isColorSelectedManually) {
                setSelectedNewBudgetColor({id: selectedCategoryData.color.id, hexcode: categoryColorHex});
                console.log("Category color set to:", categoryColorHex);
            }
        }
    };

    //Limit-Handler New Budget
    const handleNewBudgetFocusLimit = () => {
        setIsEditingLimitNewBudget(true);
        setEditingLimitValueNewBudget(limitNewBudget.replace(/[^\d,]/g, "").replace(".", ","));
    };

    const handleNewBudgetBlurLimit = () => {
        setIsEditingLimitNewBudget(false);
        const numericValue = parseFloat(editingLimitValueNewBudget.replace(",", "."));
        if (!isNaN(numericValue)) {
            setLimitNewBudget(formatCurrency(numericValue));
        } else {
            setLimitNewBudget("");
        }
    };

    const handleNewBudgetLimitChange = (e) => {
        const value = e.target.value;
        const regex = /^\d{1,6}(,\d{0,2})?$/;

        if (value === "" || regex.test(value)) {
            setEditingLimitValueNewBudget(value);
        }
    };

    //StartAmount-Handler New Budget
    const handleNewBudgetStartAmountChange = (e) => {
        const value = e.target.value;
        const regex = /^\d{1,6}(,\d{0,2})?$/;

        if (value === "" || regex.test(value)) {
            setEditingStartAmountValueNewBudget(value);
        }
    };

    const handleNewBudgetFocusStartAmount = () => {
        setIsEditingStartAmountNewBudget(true);
        setEditingStartAmountValueNewBudget(startingAmountNewBudget.replace(/[^\d,]/g, "").replace(".", ","));
    };

    const handleNewBudgetBlurStartAmount = () => {
        setIsEditingStartAmountNewBudget(false);
        const numericValue = parseFloat(editingStartAmountValueNewBudget.replace(",", "."));
        if (numericValue === "") {
            setStartingAmountNewBudget(formatCurrency(0));
        } else {
            if (!isNaN(numericValue)) {
                setStartingAmountNewBudget(formatCurrency(numericValue));
            } else {
                setStartingAmountNewBudget("");
            }
        }
    };

    const handleNewBudgetColorChange = (color) => {
        console.log("new color");
        console.log(color);
        setSelectedNewBudgetColor({id: color.id, hexcode: color.hexcode});
        setIsColorSelectedManually(true);
        setNewBudgetColorDropdownOpen(false);
    };

    const handleNewBudgetCancel = () => {
        resetNewBudgetModalFields();
        setShowNewBudgetModal(false);
    };

    const handleNewBudgetSubmit = async () => {
        // Parse limit to a float and ensure spend is set to 0 if it not a valid
        const limitWithoutDot = limitNewBudget.replace(".", "");
        const parsedLimit = parseFloat(limitWithoutDot.replace(",", "."));

        let startAmountNoDot = startingAmountNewBudget.replace(".", "");
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
            color_id: selectedNewBudgetColor.id,
            limit: parsedLimit,
            spend: parsedStartAmount
        };

        try {
            await createBudget("POST", "budgets/", budgetData);
            toggleNewBudgetModal();
            resetNewBudgetModalFields();
            setShouldRefresh(true);
        } catch (error) {
            console.error("Error creating budget:", error);
            alert(`Failed to create budget. Reason: ${error.message || "Unknown"}`);
        }
    };

    //Edit
    const [isEditingMode, setIsEditingMode] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedBudget, setSelectedBudget] = useState(null);

    //const [editLimit, setEditLimit] = useState('');
    const [limitEditBudget, setLimitEditBudget] = useState("");
    const [isEditingLimitEditBudget, setIsEditingLimitEditBudget] = useState(false);
    const [editingLimitValueEditBudget, setEditingLimitValueEditBudget] = useState("");

    //const [editStartAmount, setEditStartAmount] = useState('');
    const [startingAmountEditBudget, setStartingAmountEditBudget] = useState("")
    const [isEditingStartAmountEditBudget, setIsEditingStartAmountEditBudget] = useState(false);
    const [editingStartAmountValueEditBudget, setEditingStartAmountValueEditBudget] = useState("");


    const [editCategoryID, setEditCategoryID] = useState(null);
    const [editCategoryName, setEditCategoryName] = useState(null);
    const [editColor, setEditColor] = useState({id: null, hexcode: ""});
    const [isEditColorSelectedManually, setIsEditColorSelectedManually] = useState(false);
    const [isEditBudgetColorDropdownOpen, setEditBudgetColorDropdownOpen] = useState(false);
    // const toggleEditBudgetColorDropdown = () => setEditBudgetColorDropdownOpen(!isEditBudgetColorDropdownOpen);

    const toggleEditMode = () => {
        setIsEditingMode((prevMode) => !prevMode);
    };

    const openEditModal = (budget) => {
        console.log(budget);
        setSelectedBudget(budget);
        setEditCategoryID(budget.category.id);
        setEditCategoryName(budget.category.name)
        //setEditLimit(budget.limit);
        setLimitEditBudget(budget.limit)
        //setEditStartAmount(budget.spend);
        setStartingAmountEditBudget(budget.spend);
        setEditColor({id: budget.category.color.id, hexcode: budget.category.color.hexcode});
        setShowEditModal(true);
        setIsEditColorSelectedManually(false);
    };


    const handleEditBudgetCategoryChange = (event) => {
        console.log("handleNewBudgetCategoryChange" + event)
        console.log(event)

        const selectedCategoryId = event.target.value;
        setEditCategoryID(selectedCategoryId);

        const selectedCategoryData = categories.find((category) => category.id === parseInt(selectedCategoryId));
        console.log("Selected Category Data:", selectedCategoryData);

        if (selectedCategoryData && selectedCategoryData.color) {
            const categoryColorHex = selectedCategoryData.color.hexcode;
            if (!isEditColorSelectedManually) {
                setEditColor({id: selectedCategoryData.color.id, hexcode: categoryColorHex});
            }
            setEditCategoryName(selectedCategoryData.name)
        }
    };

    const handleEditBudgetColorChange = (color) => {
        console.log(color)
        setEditColor({id: color.id, hexcode: color.hexcode});
        setIsEditColorSelectedManually(true);
        setEditBudgetColorDropdownOpen(false);
    };

    //Limit-Handler Edit Budget
    const handleEditBudgetFocusLimit = () => {
        setIsEditingLimitEditBudget(true);
        setEditingLimitValueEditBudget(String(limitEditBudget).replace(/[^\d,.]/g, "").replace(".", ","));
    };

    const handleEditBudgetBlurLimit = () => {
        setIsEditingLimitEditBudget(false);
        const numericValue = parseFloat(editingLimitValueEditBudget.replace(",", "."));
        if (!isNaN(numericValue)) {
            setLimitEditBudget(numericValue);
        } else {
            setLimitEditBudget("");
        }
    };

    const handleEditBudgetLimitChange = (e) => {
        const value = e.target.value;
        const regex = /^\d{1,10}([,.]\d{0,2})?$/;

        if (value === "" || regex.test(value)) {
            setEditingLimitValueEditBudget(value);
        }
    };

    //StartAmount-Handler Edit Budget
    const handleEditBudgetFocusStartAmount = () => {
        setIsEditingStartAmountEditBudget(true);
        setEditingStartAmountValueEditBudget(String(startingAmountEditBudget).replace(/[^\d,.]/g, "").replace(".", ","));
    };

    const handleEditBudgetBlurStartAmount = () => {
        setIsEditingStartAmountEditBudget(false);
        const numericValue = parseFloat(editingStartAmountValueEditBudget.replace(",", "."));
        if (!isNaN(numericValue)) {
            setStartingAmountEditBudget(numericValue);
        } else {
            setStartingAmountEditBudget("");
        }
    };

    const handleEditBudgetStartAmountChange = (e) => {
        const value = e.target.value;
        const regex = /^\d{1,10}([,.]\d{0,2})?$/;

        if (value === "" || regex.test(value)) {
            setEditingStartAmountValueEditBudget(value);
        }
    };

    const handleEditSave = async (budget) => {

        const updatedBudgetData = {
            limit: limitEditBudget,
            spend: startingAmountEditBudget,
            category_id: editCategoryID,
            color_id: editColor.id,
        };

        try {
            await updateBudget("PATCH", `budgets/${budget.id}/`, updatedBudgetData);
            setShowEditModal(false);
            setShouldRefresh(true);
        } catch (error) {
            console.error("Error updating budget:", error);
            alert(`Failed to update budget. Reason: ${error.message || "Unknown"}`);
        }
    }

    const handleDeleteBudget = async (budget) => {

        const updatedBudgetData = {
            limit: limitEditBudget,
            spend: startingAmountEditBudget,
            category_id: editCategoryID,
            color_id: editColor.id,
        };

        try {
            await updateBudget("DELETE", `budgets/${budget.id}/`, updatedBudgetData);
        } catch (error) {
            console.error("Error updating budget:", error);
            alert(`Failed to update budget. Reason: ${error.message || "Unknown"}`);
        }
        setShouldRefresh(true);
        setShowEditModal(false);
    };

    useEffect(() => {
        fetchBudgets("GET", "budgets/");
        fetchCategories("GET", "categories/");
        fetchColors("GET", "colors/");
        setShouldRefresh(false);
    }, [shouldRefresh])

    useEffect(() => {
        //Total Budget
        if (Array.isArray(budgets)) {
            const expensesBudgetItem = budgets.find((budget) => budget.category.name === "Expenses");
            if (expensesBudgetItem) {
                setExpensesBudget(expensesBudgetItem);
                setLimitTotalBudget(formatCurrency(expensesBudgetItem.limit));
                setStartingAmountTotalBudget(formatCurrency(expensesBudgetItem.spend));
            }
        }

        if (Array.isArray(budgets) && Array.isArray(categories)) {
            const budgetedCategoryIds = budgets.map(budget => budget.category.id);
            const filteredCategories = categories.filter(category => !budgetedCategoryIds.includes(category.id));
            setAvailableCategories(filteredCategories);
        }

    }, [budgets, categories]);

    useEffect(() => {
        if (!showTotalBudgetModal && !showNewBudgetModal && !showEditModal) {
            setShouldRefresh(true);
        }
    }, [showTotalBudgetModal, showNewBudgetModal, showEditModal]);

    const refreshData = async () => {
        fetchBudgets("GET", "budgets/");
        fetchCategories("GET", "categories/");
        fetchColors("GET", "colors/");
    };

    useEffect(() => {
        if (shouldRefresh) {
            refreshData();
            setShouldRefresh(false);
        }
    }, [shouldRefresh]);
    if (loadingBudgets || loadingCategories) return <p>Loading...</p>;
    if (errorBudgets) return <p>Error loading budgets: {errorBudgets.message}</p>;
    if (errorCategories) return <p>Error loading categories: {errorCategories.message}</p>;


    return (

        <>
            <div className="w-full max-w-lg flex flex-col items-center space-y-2">
                <div className="relative flex items-center w-full pt-2">
                    <div className="flex-grow border-t border-gray-300"></div>
                    <span className="text-xl font-semibold px-4 bg-transparent text-gray-800">Total Budgets</span>
                    <div className="flex-grow border-t border-gray-300"></div>
                </div>
            </div>
            {/* Total Budget Box */}
            {expensesBudget && (
                <div className="w-full max-w-lg bg-white p-6 rounded-lg shadow-md relative">
                    <div className="w-full h-15 bg-gray-200 rounded-lg flex items-center justify-center">
                        <div className="relative mx-5 my-10 w-full max-w-lg">
                            <div className="w-full h-6 bg-gray-800  relative">
                                <div className="h-full bg-gradient-to-r from-red-200 to-red-500 "
                                     style={{width: '100%'}}></div>
                                <div className="h-full bg-gray-800  absolute top-0 right-0 bottom-0"
                                     style={{left: `${(expensesBudget.spend / expensesBudget.limit) * 100}%`}}></div>
                                <div
                                    className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center text-white font-semibold">
                                    <span>{expensesBudget.limit > 0 ? `${((expensesBudget.spend / expensesBudget.limit) * 100).toFixed(1)}%` : '0.0%'}</span>
                                </div>
                            </div>
                            <div className="mb-2 mt-2 flex items-center justify-between text-sm">
                                <div className="flex-col">
                                    <div className="text-gray-600 font-bold">SPEND</div>
                                    <div className="text-gray-600 ">{formatCurrency(expensesBudget.spend)}</div>
                                </div>
                                <div>
                                    <button
                                        onClick={toggleTotalBudgetModal}
                                        className="absolute left-1/2 transform -translate-x-1/2 px-4 py-2 bg-primary text-white font-bold rounded-lg"
                                    >
                                        Set Budget
                                    </button>
                                </div>

                                <div className="flex-col">
                                    <div className="text-gray-600 font-bold text-right">LIMIT</div>
                                    <div
                                        className="text-gray-600 text-right">{formatCurrency(expensesBudget.limit)}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>)}

            {/* Total Budget Modal */}
            {showTotalBudgetModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                        <h2 className="text-2xl font-semibold mb-4 text-center">Set Total Budget</h2>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-800 mb-1">Limit:</label>
                            <input
                                type="text"
                                className="w-full p-2 border-2 border-gray-300 rounded-md focus:outline-none focus:border-blue-500 placeholder-gray-400"
                                placeholder="Enter budget limit"
                                value={isEditingLimitTotalBudget ? editingLimitValueTotalBudget : limitTotalBudget}
                                onFocus={handleFocusLimitTotalBudget}
                                onBlur={handleBlurLimitTotalBudget}
                                onChange={handleLimitChangeTotalBudget}
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-800 mb-1">Starting Amount:</label>
                            <input
                                type="text"
                                className="w-full p-2 border-2 border-gray-300 rounded-md focus:outline-none focus:border-blue-500 placeholder-gray-400"
                                placeholder="Enter starting amount (Optional)"
                                value={isEditingStartAmountTotalBudget ? editingStartAmountValueTotalBudget : startingAmountTotalBudget}
                                onFocus={handleFocusStartAmountTotalBudget}
                                onBlur={handleBlurStartAmountTotalBudget}
                                onChange={handleStartAmountChangeTotalBudget}
                            />
                        </div>

                        <div className="flex justify-end space-x-3">
                            <button onClick={handleCancelTotalBudget}
                                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg">
                                Cancel
                            </button>
                            <button onClick={handleSubmitTotalBudget}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg">
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}


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
                    budgets.filter(budget => budget.category.name !== "Expenses").map((budget, index) => (
                        <div
                            key={index}
                            className={`mb-2 cursor-pointer p-2 rounded transition-all duration-100 ${
                                isEditingMode ? "bg-gray-200 border-1 border-gray-500" : "bg-white"
                            }`}
                            onClick={() => isEditingMode && openEditModal(budget)}
                        >
                            <div className="flex items-center relative">
                                <div className="w-1/3 text-gray-700 font-medium">
                                    {budget.category.name}
                                </div>
                                <div className="w-2/3 h-5 bg-gray-800 relative overflow-hidden ml-1">
                                    <div
                                        className="h-full"
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
                    onClick={() => {
                        resetNewBudgetModalFields();
                        toggleNewBudgetModal();
                    }}
                    disabled={isEditingMode || availableCategories.length === 0}
                    className={`flex-1 btn btn-lg py-2 px-4 rounded-lg ${
                        isEditingMode || availableCategories.length === 0
                            ? "bg-gray-300 cursor-not-allowed"
                            : "bg-secondary text-white"
                    }`}
                >
                    New Budget
                </button>

                <button
                    onClick={toggleEditMode}
                    className={`flex-1 btn btn-lg py-2 px-4 rounded-lg text-white ${
                        isEditingMode ? "bg-orange-400 border-2 border-gray-500" : "bg-accent"
                    }`}
                >
                    {isEditingMode ? "Exit Edit Mode" : "Edit"}
                </button>
            </div>

            {/* Modal for Creating Budget */}
            {showNewBudgetModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                        <h2 className="text-2xl font-semibold mb-4 text-center">Create New Budget</h2>

                        {/* Category Selection Dropdown */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-800">Category</label>
                            <select
                                value={selectedCategoryId || ""}
                                onChange={handleNewBudgetCategoryChange}
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
                                value={isEditingLimitNewBudget ? editingLimitValueNewBudget : limitNewBudget}
                                onFocus={handleNewBudgetFocusLimit}
                                onBlur={handleNewBudgetBlurLimit}
                                onChange={handleNewBudgetLimitChange}
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-800 mb-1">Starting Amount:</label>
                            <input
                                type="text"
                                className="w-full p-2 border-2 border-gray-300 rounded-md focus:outline-none focus:border-blue-500 placeholder-gray-400"
                                placeholder="Enter starting amount (Optional)"
                                value={isEditingStartAmountNewBudget ? editingStartAmountValueNewBudget : startingAmountNewBudget}
                                onFocus={handleNewBudgetFocusStartAmount}
                                onBlur={handleNewBudgetBlurStartAmount}
                                onChange={handleNewBudgetStartAmountChange}
                            />
                        </div>

                        {/* Color Selection */}
                        <div className="relative flex flex-col items-start">
                            <label className="block text-sm font-medium text-gray-800 mb-1">Color:</label>
                            <div className="relative flex items-center">
                                <button
                                    onClick={toggleColorDropdown}
                                    className="w-12 h-12 flex justify-center items-center p-1 border-2 border-gray-300 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    style={{backgroundColor: selectedNewBudgetColor.hexcode || "#e5e7eb"}}
                                >
                                    {selectedNewBudgetColor.hexcode ? (
                                        <span className="block w-full h-full rounded-md"></span>
                                    ) : (
                                        "Select" // Placeholder when no color is selected
                                    )}
                                </button>

                                {isNewBudgetColorDropdownOpen && (
                                    <div
                                        className="absolute left-full ml-2 w-48 bg-white shadow-lg rounded-lg grid grid-cols-4 gap-2 p-2 max-h-60 overflow-y-auto z-50"
                                        style={{top: "-150px"}}
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        {colors.map((color) => (
                                            <button
                                                key={color.id}
                                                className="w-10 h-10 rounded-md hover:ring-2 hover:ring-gray-600 transition duration-200"
                                                style={{backgroundColor: color.hexcode}}
                                                onClick={() => handleNewBudgetColorChange(color)}
                                            ></button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>


                        {/* Submit Buttons */}
                        <div className="flex justify-end space-x-3">
                            <button onClick={handleNewBudgetCancel}
                                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg">
                                Cancel
                            </button>
                            <button onClick={handleNewBudgetSubmit}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg">
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}


            {/* Modal for Editing Budget */}
            {showEditModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-semibold">Edit Budget</h2>

                            {/* Delete Button */}
                            <button
                                onClick={() => handleDeleteBudget(selectedBudget)}
                                className="flex items-center justify-center w-8 h-8 bg-transparent hover:bg-gray-200 rounded-full"
                                title="Delete"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="w-4 h-4 text-red-600"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                                    />
                                </svg>
                            </button>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-800">Category</label>
                            <select
                                value={editCategoryID || ""}
                                onChange={handleEditBudgetCategoryChange}
                                className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md"
                            >
                                <option value={editCategoryID || ""}>{editCategoryName}</option>
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
                                value={isEditingLimitEditBudget ? editingLimitValueEditBudget : formatCurrency(limitEditBudget)}
                                onFocus={handleEditBudgetFocusLimit}
                                onBlur={handleEditBudgetBlurLimit}
                                onChange={handleEditBudgetLimitChange}
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-800 mb-1">Starting Amount:</label>
                            <input
                                type="text"
                                className="w-full p-2 border-2 border-gray-300 rounded-md focus:outline-none focus:border-blue-500 placeholder-gray-400"
                                placeholder="Enter starting amount (Optional)"
                                value={isEditingStartAmountEditBudget ? editingStartAmountValueEditBudget : formatCurrency(startingAmountEditBudget)}
                                onFocus={handleEditBudgetFocusStartAmount}
                                onBlur={handleEditBudgetBlurStartAmount}
                                onChange={handleEditBudgetStartAmountChange}
                            />
                        </div>

                        <div className="relative flex flex-col items-start mb-4">
                            <label className="block text-sm font-medium text-gray-800 mb-1">Color:</label>
                            <div className="relative flex items-center">
                                <button
                                    onClick={() => setEditBudgetColorDropdownOpen(!isEditBudgetColorDropdownOpen)}
                                    className="w-12 h-12 flex justify-center items-center p-1 border-2 border-gray-300 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    style={{backgroundColor: editColor.hexcode || "#e5e7eb"}}
                                >
                                    {editColor ? (
                                        <span className="block w-full h-full rounded-md"></span>
                                    ) : (
                                        "Select"
                                    )}
                                </button>

                                {isEditBudgetColorDropdownOpen && (
                                    <div
                                        className="absolute left-full ml-2 w-48 bg-white shadow-lg rounded-lg grid grid-cols-4 gap-2 p-2 max-h-60 overflow-y-auto z-50">
                                        {colors.map((color) => (
                                            <button
                                                key={color.id}
                                                className="w-10 h-10 rounded-md hover:ring-2 hover:ring-gray-600 transition duration-200"
                                                style={{backgroundColor: color.hexcode}}
                                                onClick={() => handleEditBudgetColorChange(color)}
                                            ></button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="flex justify-end space-x-3">
                            <button onClick={() => setShowEditModal(false)}
                                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg">
                                Cancel
                            </button>
                            <button
                                onClick={() => handleEditSave(selectedBudget)}
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