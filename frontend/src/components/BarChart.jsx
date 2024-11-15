import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

const COLORS = ['#6366F1', '#F59E0B', '#34D399', '#F472B6', '#60A5FA', '#A78BFA'];

const CustomTooltipFormatter = (value, name, props) => {
  // Customize the label based on `name` or other data properties
  const displayLabel = `Total: $${value.toFixed(2)}`;
  return [displayLabel]; // The second argument is the label name
};

const CustomBarChart = ({ categoryData }) => {


  return (
        // <div className="w-full sm:flex sm:items-center sm:justify-center sm:p-4 sm:bg-white sm:rounded-xl sm:shadow-lg sm:max-w-screen-lg sm:mx-auto">
            <ResponsiveContainer width="100%" height={window.innerWidth < 640 ? 120 : 200}>
                <BarChart data={categoryData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                    <XAxis dataKey="name" hide />
                    <Tooltip cursor={{ fill: 'rgba(0,0,0,0.05)' }} formatter={CustomTooltipFormatter}  />
                    <Bar dataKey="total" radius={[8, 8, 0, 0]}>
                        {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color.hexcode} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        // </div>
  );
};

export default CustomBarChart;