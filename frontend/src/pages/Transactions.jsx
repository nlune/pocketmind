import React, { useEffect, useState } from 'react';
import useApiRequest from '../hooks/useAPI';
import formatDate from '../helpers/formatDate'
import { useSelector } from 'react-redux';
import axios from 'axios';
import LoadingSwirl from '../components/LoadingSwirlAnimation';

export default function TransactionsPage() {
    const { sendRequest, data, error, loading } = useApiRequest({ auth: true });

    const token = useSelector(s => s.User.accessToken)
    const headers = {'Authorization': 'Bearer ' + token}

    const [activeTab, setActiveTab] = useState('recent');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [categories, setCategories] = useState(null)
    const [category, setCategory] = useState('');
    const [transactions, setTransactions] = useState(null)
    const [trasnactionTotal, setTransactionTotal] = useState("")
    const [recurringItems, setRecurringItems] = useState(null)
    const [recurringTotal, setRecurringTotal] = useState("")

    console.log(category)

    const getCategories = async () => {
        try {
            const resp = await axios.get("/categories/", {"headers": headers})
            setCategories(resp.data)
        }catch (error) {
            console.log(error)
        }
    }

    const getRecurring = async () => {
        try {
            const resp = await axios.get("/transactions/recurring/", {"headers": headers})
            setRecurringItems(resp.data)
            console.log(resp.data)
        }catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        const today = new Date();
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(today.getDate() - 7);

        setToDate(today.toISOString().split('T')[0]);
        setFromDate(thirtyDaysAgo.toISOString().split('T')[0]);

        if (token) {
            getCategories()
            getRecurring()
        }

    }, [token]);

    const handleTabSwitch = (tab) => setActiveTab(tab);

    useEffect(() => {
        if (fromDate && toDate){
        try {
            if (!category) {
                sendRequest("GET", `/transactions/reports/?interval=custom&start_date=${fromDate}&end_date=${toDate}`)
            } else {
                sendRequest("GET", `/transactions/reports/?interval=custom&start_date=${fromDate}&end_date=${toDate}&category=${category}`) 
            }
            
        } catch (error) {
            console.log("can't get transactions err ", error)
        }
    }

    }, [fromDate, toDate, category])

    useEffect(() => {
        if (data && !error) {
            setTransactions(data.details)
            setTransactionTotal(data.total_expense)
        }
    }, [data, error])

    return (
        <div className="min-h-screen bg-white flex flex-col items-center p-6">
            {/* <h1 className="text-2xl font-bold mb-6">Transactions</h1> */}

            <div role="tablist" className="tabs tabs-lifted tabs-lg self-start">
            <a role="tab" 
            onClick={() => handleTabSwitch('recent')}
            className={`tab ${activeTab === "recent" ? 'tab-active' : ''}`}>
                                    <span className="block md:hidden">Recent</span>
                                    <span className="hidden md:block">Recent Transactions</span></a>

            <a role="tab" 
            onClick={() => handleTabSwitch('recurring')}
            className={`tab ${activeTab === "recurring" ? 'tab-active' : ''}`}>
                                    <span className="block md:hidden">Recurring</span>
                                    <span className="hidden md:block">Recurring Transactions</span></a>
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
                        className="input input-bordered rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
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
                        className="input input-bordered rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                        value={toDate}
                        onChange={(e) => setToDate(e.target.value)}
                    />
                </div>
                <div className="form-control w-full max-w-xs">
                    <label className="label">
                        <span className="label-text">Category</span>
                    </label>
                    <select
                        className="select select-bordered rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        <option value="">Select Category</option>
                        {categories && categories.map((dat, i) => <option key={i} value={dat.id}>{dat.name}</option>)}
                    </select>
                </div>
            </div>
            {loading && <LoadingSwirl/>} 
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
                <TransactionItem key={idx} description={item.description} amount={item.amount} category={item.category?.name} color={item.category?.color?.hexcode} date={formatDate(item.created)} /> 
                 )}

                {activeTab === "recurring" && recurringItems && recurringItems.map((item, idx) => 
                <TransactionItem key={idx} description={item.description} amount={item.amount} category={item.category?.name} color={item.category?.color?.hexcode} date={formatDate(item.created)} /> 
                 )}
                </ul>
            </div>
        </div>
    );
}

function TransactionItem({ description, amount, date, category, color }) {
    return (
      <li className="flex justify-between items-center p-3 bg-gray-50 rounded-md hover:bg-gray-100">
        <div>
          <p className="text-lg font-medium">{description}</p>
          <div className="flex flex-row gap-2">
            <p className="text-sm text-gray-500">{date}</p>
            {category && (
              <p className="text-sm" style={{ color: color || "#000" }}>
                {category}
              </p>
            )}
          </div>
        </div>
        <p
          className={`text-lg font-semibold ${
            amount < 0 ? "text-red-600" : "text-gray-600"
          }`}
        >
          ${amount.toFixed(2)}
        </p>
      </li>
    );
  }
