import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Label} from 'recharts';


const ChartComponent = ({ data }) =>  {
    const isMobile = window.innerWidth < 640;
    console.log(window.innerWidth)

    return (
        <ResponsiveContainer width="105%" height={isMobile ? 300 : 400}>
          <LineChart data={data} margin={{ top: 20, right: isMobile ? 10 : 30, left: isMobile ? 5 : 20, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
  
            <XAxis 
              dataKey="date" 
              tick={{ fill: "#555", fontSize: 9 }} 
              axisLine={{ stroke: '#ccc' }} 
              tickLine={false}
            >
              <Label 
                value="Date" 
                position="insideBottom" 
                offset={-10} 
                style={{ fill: '#888', fontSize: isMobile ? 9: 12 }}
              />
            </XAxis>
  
            <YAxis 
              tick={{ fill: "#555", fontSize: isMobile ? 9: 10 }} 
              axisLine={{ stroke: '#ccc' }} 
              tickLine={false} 
              width={isMobile ? 40 : 50}
            >
              <Label 
                value="Amount" 
                angle={-90} 
                position="insideLeft" 
                offset={isMobile ? 1 : -10} 
                style={{ fill: '#888', fontSize: isMobile ? 9: 12 }}
              />
            </YAxis>
  
            <Tooltip 
              contentStyle={{ backgroundColor: '#333', borderColor: '#333', borderRadius: 5 }}
              labelStyle={{ color: '#fff' }}
              itemStyle={{ color: '#eee' }}
              cursor={{ stroke: 'rgba(0, 0, 0, 0.1)', strokeWidth: 2 }}
            />
  
            <Line 
              type="monotone" 
              dataKey="amount" 
              stroke="#8884d8" 
              strokeWidth={2.5} 
              dot={{ r: 5, stroke: "#8884d8", strokeWidth: 2, fill: '#fff' }} 
              activeDot={{ r: 6, fill: "#8884d8" }}
            />
          </LineChart>
        </ResponsiveContainer>
);
}

export default ChartComponent;

