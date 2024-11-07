import { useNavigate } from "react-router-dom";
import useApiRequest from "../hooks/useAPI.js"
import {useEffect} from "react";

export default function BudgetMain() {
    const nav = useNavigate()

    //added colors so tailwind already knows the colors which are applied dynamic
    const colors = [
        'bg-red-700','bg-orange-500', 'bg-amber-400', 'bg-lime-400',
        'bg-green-600', 'bg-emerald-500', 'bg-teal-400', 'bg-cyan-600',
        'bg-sky-400', 'bg-blue-700', 'bg-indigo-600', 'bg-violet-500',
        'bg-purple-400','bg-fuchsia-400', 'bg-pink-300', 'bg-rose-600',
    ];

    const { sendRequest, data: budgets, loading, error } = useApiRequest();

    useEffect(() => {
        sendRequest("GET", "budgets/"); // Anfrage an den Budget-Endpoint
    }, []);

    if (loading) return <p>loading...</p>;
    if (error) return <p>error during file loading : {error.message}</p>;

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
            <div className="w-full max-w-lg bg-white p-6 rounded-lg shadow-md min-h-[calc(5*48px)] max-h-[calc(5*48px)] overflow-y-scroll">
                {budgets && budgets.map((budget, index) => (
                    <div key={index} className="mb-2">
                        <div className="flex items-center relative">
                            <div className="w-1/3 text-gray-700 font-medium">
                                {budget.category.name}
                            </div>
                            <div className="w-2/3 h-5 bg-gray-800 relative overflow-hidden">
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
                <button className="flex-1 btn btn-lg bg-secondary text-white py-2 px-4 rounded-lg">
                    New Budget
                </button>
                <button className="flex-1 btn btn-lg bg-accent text-white py-2 px-4 rounded-lg">
                    Edit
                </button>
            </div>
        </>

    )
}