import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';


const COLORS = ['#6366F1', '#F59E0B', '#34D399', '#F472B6', '#60A5FA', '#A78BFA'];


const CustomPieChart = ({ categoryData }) => {
    const isMobile = window.innerWidth < 640;
    // console.log(window.innerWidth)

    // Custom label function to display labels inside the pie on small screens
    const renderCustomLabel = ({ name, percent, cx, cy, midAngle, innerRadius, outerRadius, index }) => {
      if (!isMobile) return null; // Only display labels inside on mobile
      
      const RADIAN = Math.PI / 180;
      const radius = innerRadius + (outerRadius - innerRadius) * 0.2;
      const x = cx + radius * Math.cos(-midAngle * RADIAN);
      const y = cy + radius * Math.sin(-midAngle * RADIAN);
  
      return (
        <text
          x={x}
          y={y}
          fill="lightgray"
          textAnchor={x > cx ? "start" : "end"}
          dominantBaseline="central"
          fontSize="10px"
          fontWeight="bold"
        >
          {/* {`${name}: ${(percent * 100).toFixed(0)}%`} */}
          {name}
        </text>
      );
    };
  
    return (
      <div className="flex flex-col items-center w-full p-2 sm:p-0 bg-white rounded-lg">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Spending by Category</h2>
        <p className="text-sm text-gray-500 mb-6">Overview of your spending habits by category</p>
        <div className="w-full" style={{ height: '300px' }}>
          <ResponsiveContainer width="110%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={isMobile ? 50 : 40}
                outerRadius={isMobile ? 100 : 90}
                fill="#8884d8"
                dataKey="total"
                label={isMobile ? renderCustomLabel : (entry) => entry.name} // Use the custom label function
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
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };
  

export default CustomPieChart;