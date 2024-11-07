import React, { useEffect, useState } from 'react';
import useApiRequest from '../hooks/useAPI';
import formatDate from '../helpers/formatDate'

export default function TransactionsPage() {
    const { sendRequest, data, error, loading } = useApiRequest({ auth: true });

    const [activeTab, setActiveTab] = useState('recent');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [category, setCategory] = useState('');
    const [transactions, setTransactions] = useState(null)
    const [trasnactionTotal, setTransactionTotal] = useState("")
    const [recurringItems, setRecurringItems] = useState(null)
    const [recurringTotal, setRecurringTotal] = useState("")


    useEffect(() => {
        const today = new Date();
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(today.getDate() - 7);

        setToDate(today.toISOString().split('T')[0]);
        setFromDate(thirtyDaysAgo.toISOString().split('T')[0]);
    }, []);

    const handleTabSwitch = (tab) => setActiveTab(tab);

    useEffect(() => {
        console.log("getting trans")
        if (fromDate && toDate){
        try {
            sendRequest("GET", `/transactions/reports/?interval=custom&start_date=${fromDate}&end_date=${toDate}`)
        } catch (error) {
            console.log("can't get transactions err ", error)
        }
    }

    }, [fromDate, toDate])

    useEffect(() => {
        if (data && !error) {
            setTransactions(data.details)
            setTransactionTotal(data.total_expense)
        }
    }, [data])

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
            {/* <h1 className="text-2xl font-bold mb-6">Transactions</h1> */}

            <div role="tablist" className="tabs tabs-lifted tabs-lg self-start">
            <a role="tab" 
            onClick={() => handleTabSwitch('recent')}
            className={`tab ${activeTab === "recent" ? 'tab-active' : ''}`}>Recent Transactions</a>

            <a role="tab" 
            onClick={() => handleTabSwitch('recurring')}
            className={`tab ${activeTab === "recurring" ? 'tab-active' : ''}`}>Recurring Transactions</a>
            {/* <a role="tab" className="tab">Tab 3</a> */}
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6 w-full max-w-2xl bg-white p-4 rounded-lg shadow-md">
                <div className="form-control w-full max-w-xs">
                    <label className="label">
                        <span className="label-text">From Date</span>
                    </label>
                    <input
                        type="date"
                        className="input input-bordered"
                        value={fromDate}
                        onChange={(e) => setFromDate(e.target.value)}
                    />
                </div>
                <div className="form-control w-full max-w-xs">
                    <label className="label">
                        <span className="label-text">To Date</span>
                    </label>
                    <input
                        type="date"
                        className="input input-bordered"
                        value={toDate}
                        onChange={(e) => setToDate(e.target.value)}
                    />
                </div>
                <div className="form-control w-full max-w-xs">
                    <label className="label">
                        <span className="label-text">Category</span>
                    </label>
                    <select
                        className="select select-bordered"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        <option value="">All Categories</option>
                        <option value="food">Food</option>
                        <option value="travel">Travel</option>
                        <option value="entertainment">Entertainment</option>
                        <option value="utilities">Utilities</option>
                    </select>
                </div>
            </div>

            {/* Transactions List */}
            <div className="w-full max-w-2xl bg-white p-4 rounded-lg shadow-md">
                <div className="flex flex-row justify-between mb-3">
                <h2 className="text-xl font-semibold p-2">
                    {activeTab === 'recent' ? 'Recent Transactions' : 'Recurring Transactions'}
                </h2>
                {activeTab === 'recent' && trasnactionTotal && <h2 className="text-xl p-2">Total: {trasnactionTotal.toFixed(2)}</h2>}
                {activeTab === 'recurring' && recurringTotal && <h2 className="text-xl p-2">Total: {recurringTotal.toFixed(2)}</h2>}

                </div>
                <ul className="space-y-4">
                {activeTab === "recent" && transactions && transactions.map((item, idx) => 
                <TransactionItem key={idx} description={item.description} amount={item.amount} date={formatDate(item.created)} /> 
                 )
                    // <TransactionItem description="Grocery shopping" amount={-50} date="2024-11-01" />
                    // <TransactionItem description="Netflix Subscription" amount={-15} date="2024-10-25" />
                    // <TransactionItem description="Electricity Bill" amount={-100} date="2024-10-20" />
                }
                </ul>
            </div>
        </div>
    );
}

function TransactionItem({ description, amount, date }) {
    return (
        <li className="flex justify-between items-center p-3 bg-gray-50 rounded-md hover:bg-gray-100">
            <div>
                <p className="text-lg font-medium">{description}</p>
                <p className="text-sm text-gray-500">{date}</p>
            </div>
            <p className={`text-lg font-semibold ${amount < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                ${amount.toFixed(2)}
            </p>
        </li>
    );
}
