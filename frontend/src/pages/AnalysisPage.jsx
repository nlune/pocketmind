import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Markdown from 'react-markdown'
import LoadingSwirl from '../components/LoadingSwirlAnimation';
import ChartComponent from '../components/ChartComponent';

export default function GraphsReportsPage() {
    const token = useSelector(s => s.User.accessToken)
    const headers = {'Authorization': 'Bearer ' + token}
    const [loading, setLoading] = useState(false)

    const [activeTab, setActiveTab] = useState('graphs');
    const [weeklyInsight, setWeeklyInsight] = useState('')
    const [monthlyInsight, setMonthlyInsight] = useState('')

    const handleTabSwitch = (tab) => setActiveTab(tab);


    useEffect( () => {

        if (activeTab === "weekly" && !weeklyInsight) {
            setLoading(true)
            const get_weekly = async () => {
                try {
                    const resp = await axios.get("/transactions/get-insight/?interval=weekly", {"headers": headers})
                    console.log(resp.data.content)
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
                const dataPoint =  { date: dateStr, value: 0 };
                filledData.push(dataPoint);
            }
        }
        return filledData;
    }
    
    // Example data input (some days are missing)
    const data = [
        { date: "2024-11-01", value: 10 },
        { date: "2024-11-03", value: 15 },
        { date: "2024-11-04", value: 7 }
    ];
    
    const filledData = fillMissingDates(data);
    console.log(filledData);

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
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 w-full max-w-3xl bg-white p-6 rounded-lg shadow-lg transition-all duration-300 ease-in-out">
                <div className="form-control w-full text-center md:text-left">
                    <h1 className="text-xl md:text-2xl lg:text-3xl font-semibold text-gray-700 transition-all duration-300 ease-in-out">
                        {activeTab === 'graphs' ? 'Graphs' : activeTab === 'weekly' ? 'Insights from last week transactions' : 'Insights based on transactions from past month'}
                    </h1>
                    {/* <p className="mt-2 text-gray-600 text-sm md:text-base lg:text-lg max-w-md mx-auto md:mx-0"> */}
                   
                    {activeTab === 'graphs' && 
                     <div className="flex justify-center m-10"><ChartComponent data={filledData}/> </div>}
                    
                    {loading && <LoadingSwirl/>}
                    {/* {activeTab === 'weekly' && weeklyInsight && <pre className="whitespace-pre-wrap font-sans text-base-content p-4 bg-base-200 rounded-lg shadow-md">{weeklyInsight}</pre> } */}
                    {activeTab === 'weekly' && weeklyInsight && <Markdown className="font-sans text-base-content p-4 bg-base-200 rounded-lg shadow-md">{weeklyInsight}</Markdown> }
                    {activeTab === 'monthly' && monthlyInsight && <Markdown className="font-sans text-base-content p-4 bg-base-200 rounded-lg shadow-md">{monthlyInsight}</Markdown> }
                </div>
            </div>
        </div>
    );
}
