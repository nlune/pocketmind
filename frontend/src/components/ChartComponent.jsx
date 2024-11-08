import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ChartComponent = ({ data }) => (
    <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis 
                dataKey="date" 
                tick={{ fill: "#555", fontSize: 12 }} 
                axisLine={{ stroke: '#ccc' }} 
                tickLine={false} 
            />
            <YAxis 
                tick={{ fill: "#555", fontSize: 12 }} 
                axisLine={{ stroke: '#ccc' }} 
                tickLine={false} 
                width={50} 
            />
            <Tooltip 
                contentStyle={{ backgroundColor: '#333', borderColor: '#333', borderRadius: 5 }}
                labelStyle={{ color: '#fff' }}
                itemStyle={{ color: '#eee' }}
                cursor={{ stroke: 'rgba(0, 0, 0, 0.1)', strokeWidth: 2 }}
            />
            <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#8884d8" 
                strokeWidth={2.5} 
                dot={{ r: 5, stroke: "#8884d8", strokeWidth: 2, fill: '#fff' }} 
                activeDot={{ r: 6, fill: "#8884d8" }}
            />
        </LineChart>
    </ResponsiveContainer>
);

export default ChartComponent;
