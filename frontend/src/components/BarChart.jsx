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

const CustomBarChart = ({ categoryData }) => {
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 rounded shadow-md">
          <p className="text-gray-800">
            {label}: ${payload[0].value}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex items-center justify-center w-full p-4 bg-white rounded-xl shadow-lg max-w-screen-lg mx-auto">
      <ResponsiveContainer width="100%" height={150}>
        <BarChart data={categoryData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
          <XAxis dataKey="name" hide />
          <Tooltip content={<CustomTooltip />} /> {/* Use the custom tooltip */}
          <Bar dataKey="value" radius={[8, 8, 0, 0]}>
            {categoryData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CustomBarChart;