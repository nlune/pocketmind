import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Markdown from 'react-markdown'
import LoadingSwirl from '../components/LoadingSwirlAnimation';
import ChartComponent from '../components/ChartComponent';
import CustomPieChart from '../components/PieChart';
import CustomBarChart from '../components/BarChart';
import SpendingLineGraph from '../components/LineGraph';
import ChartProjection from '../components/ChartProjection';

export default function GraphsReportsPage() {
    const token = useSelector(s => s.User.accessToken)
    const headers = {'Authorization': 'Bearer ' + token}
    const [loading, setLoading] = useState(false)

    const [activeTab, setActiveTab] = useState('graphs');
    const [graphTab, setGraphTab] = useState('line') // line, pie, forecast
    const [weeklyInsight, setWeeklyInsight] = useState('')
    const [monthlyInsight, setMonthlyInsight] = useState('')
    // console.log(activeTab)
    // console.log(graphTab)

    const handleTabSwitch = (tab) => setActiveTab(tab);
    const handleGraphTabSwitch = (tab) => setGraphTab(tab);


    useEffect( () => {

        if (activeTab === "weekly" && !weeklyInsight) {
            setLoading(true)
            const get_weekly = async () => {
                try {
                    const resp = await axios.get("/transactions/get-insight/?interval=weekly", {"headers": headers})
                    setWeeklyInsight(resp.data.content)
                } catch (error) {
                    console.error("Error fetching:", error);
                } finally {
                    setLoading(false)
                }
             }
             get_weekly()
        }

        if (activeTab === "monthly" && !monthlyInsight) {
            setLoading(true)
            const get_monthly = async () => {
                try {
                    const resp = await axios.get("/transactions/get-insight/?interval=monthly", {"headers": headers})
                    setMonthlyInsight(resp.data.content)
                } catch (error) {
                    console.error("Error fetching:", error);
                } finally {
                    setLoading(false)
                }
             }
             get_monthly()
        }
    }, [activeTab])

    function fillMissingDates(data) {
        const sortedData = data.sort((a, b) => new Date(a.date) - new Date(b.date));
        const startDate = new Date(sortedData[0].date);
        const endDate = new Date(sortedData[sortedData.length - 1].date);
        const filledData = [];

        let i = 0
        for (let date = startDate; date <= endDate; date.setDate(date.getDate() + 1)) {
            const dateStr = date.toISOString().split('T')[0]; // Format date as 'yyyy-mm-dd'
            // console.log(sortedData[i])
            if (sortedData[i].date === dateStr) {
                filledData.push(sortedData[i])
                i++
            } else {
                const dataPoint =  { date: dateStr, amount: 0 };
                filledData.push(dataPoint);
            }
        }
        return filledData;
    }
    
    // Example data input (some days are missing)
    const data = [
        { date: "2024-11-01", amount: 10 },
        { date: "2024-11-02", amount: 24 },
        { date: "2024-11-03", amount: 15 },
        { date: "2024-11-04", amount: 15 },
        { date: "2024-11-05", amount: 15 },
        { date: "2024-11-06", amount: 15 },
        { date: "2024-11-07", amount: 15 }
        // Add more data as needed
    ];
    
    const filledData = fillMissingDates(data);

    const categoryData = [
        { name: 'Food & Drink', value: 300 },
        { name: 'Utilities', value: 150 },
        { name: 'Transportation', value: 100 },
        { name: 'Entertainment', value: 75 },
        { name: 'Shopping', value: 200 },
        { name: 'Others', value: 125 },
    ];

    return (
        <div className="min-h-screen w-full bg-gray-100 flex flex-col items-center p-6">
            {/* Tabs Section */}
            <div role="tablist" className="tabs tabs-bordered tabs-lg self-center mb-6">
                <a 
                    role="tab" 
                    onClick={() => handleTabSwitch('graphs')}
                    className={`tab ${activeTab === "graphs" ? 'tab-active' : ''}`}
                >
                    <span className="block md:hidden">Graphs</span>
                    <span className="hidden md:block">Graphs Insights</span>
                </a>
                <a 
                    role="tab" 
                    onClick={() => handleTabSwitch('weekly')}
                    className={`tab ${activeTab === "weekly" ? 'tab-active' : ''}`}
                >
                    <span className="block md:hidden">Weekly</span>
                    <span className="hidden md:block">Weekly Insights</span>
                </a>
                <a 
                    role="tab" 
                    onClick={() => handleTabSwitch('monthly')}
                    className={`tab ${activeTab === "monthly" ? 'tab-active' : ''}`}
                >
                    <span className="block md:hidden">Monthly</span>
                    <span className="hidden md:block">Monthly Insights</span>
                </a>
            </div>

            {/* Content Section */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 w-full max-w-3xl bg-white p-6 sm:p-1 rounded-lg shadow-lg transition-all duration-300 ease-in-out">
                <div className="form-control w-full text-center md:text-left">
                    <h1 className="text-xl py-2 md:text-2xl lg:text-3xl font-semibold text-gray-700 transition-all duration-300 ease-in-out">
                        {activeTab === 'graphs' ? 'Graphs' : activeTab === 'weekly' ? 'Insights from last week transactions' : 'Insights based on transactions from past month'}
                    </h1>
                    {/* <p className="mt-2 text-gray-600 text-sm md:text-base lg:text-lg max-w-md mx-auto md:mx-0"> */}

                   {/* Tabs for graphs */}
                    {activeTab === 'graphs' && 
                                <div role="tablist" className="tabs tabs-lifted tabs-sm self-center mb-6 ">
                                <a 
                                    role="tab" 
                                    onClick={() => handleGraphTabSwitch('line')}
                                    className={`tab ${graphTab === "line" ? 'tab-active' : ''}`}
                                >
                                    <span className="block md:hidden">Daily</span>
                                    <span className="hidden md:block">Daily Spending</span>
                                </a>
                                <a 
                                    role="tab" 
                                    onClick={() => handleGraphTabSwitch('pie')}
                                    className={`tab ${graphTab === "pie" ? 'tab-active' : ''}`}
                                >
                                    <span className="block md:hidden">Categorized</span>
                                    <span className="hidden md:block">Categorized Spending</span>
                                </a>
                                <a 
                                    role="tab" 
                                    onClick={() => handleGraphTabSwitch('forecast')}
                                    className={`tab ${graphTab === "forecast" ? 'tab-active' : ''}`}
                                >
                                    <span className="block md:hidden">Projected</span>
                                    <span className="hidden md:block">Projected Spending</span>
                                </a>
                            </div>
                     }

                    {/* Display different type of graph  */}
                    {activeTab === 'graphs' &&
                    <div className="flex flex-col justify-center items-center sm:m-0 md:m-5 lg:m-8 xl:m-10 2xl:m-10">
                        {graphTab === 'pie'  &&
                            <CustomPieChart categoryData={categoryData}/>}
                        {graphTab === 'line' &&
                            <ChartComponent data={filledData}/> }
                         {/* <SpendingLineGraph data={filledData}/>} */}
                         {graphTab === 'forecast' &&
                          <ChartProjection data={filledData}/>}
                    </div>}

                    {loading && <LoadingSwirl/>}
                    {/* {activeTab === 'weekly' && weeklyInsight && <pre className="whitespace-pre-wrap font-sans text-base-content p-4 bg-base-200 rounded-lg shadow-md">{weeklyInsight}</pre> } */}
                    {activeTab === 'weekly' && weeklyInsight && <Markdown className="font-sans text-base-content p-4 bg-base-200 rounded-lg shadow-md">{weeklyInsight}</Markdown> }
                    {activeTab === 'monthly' && monthlyInsight && <Markdown className="font-sans text-base-content p-4 bg-base-200 rounded-lg shadow-md">{monthlyInsight}</Markdown> }
                </div>
            </div>
        </div>
    );
}
