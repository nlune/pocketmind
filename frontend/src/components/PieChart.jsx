import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';


const COLORS = ['#6366F1', '#F59E0B', '#34D399', '#F472B6', '#60A5FA', '#A78BFA'];


const CustomPieChart = ({ categoryData }) => {
    return (
        <div className="flex flex-col items-center w-full p-2 bg-white rounded-lg shadow-lg hover:shadow-sm transition-shadow">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Spending by Category</h2>
            <p className="text-sm text-gray-500 mb-6">Track and analyze your spending habits</p>
            <div className="w-full" style={{ height: '300px' }}> {/* Set parent div height */}
                <ResponsiveContainer width="100%" height="100%"> {/* Adjusted height */}
                    <PieChart>
                        <Pie
                            data={categoryData}
                            cx="50%"
                            cy="50%"
                            innerRadius={40}
                            outerRadius={90}
                            fill="#8884d8"
                            dataKey="value"
                            label={(entry) => entry.name}
                            labelLine={false}
                        >
                            {categoryData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip 
                            contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', border: 'none' }} 
                            itemStyle={{ color: '#374151' }}
                            cursor={{ fill: 'rgba(156, 163, 175, 0.2)' }}
                        />
                        {/* <Legend verticalAlign="bottom" align="center" height={36} iconType="circle" /> */}
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default CustomPieChart;