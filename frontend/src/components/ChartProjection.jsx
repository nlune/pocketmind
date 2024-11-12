import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Label } from "recharts";
import { linearRegression, linearRegressionLine } from "simple-statistics";

const prepareDataForRegression = (data) => {
    return data.map((point, index) => [index + 1, point.amount]);
};

// TODO use real datapts then fill in rest until day goes to last day of month
const getProjectionData = (data, regressionFn) => {
    const totalDays = 30;
    const projectionData = [...data];
    const lastRealDataIndex = data.length;

    for (let i = lastRealDataIndex + 1; i <= totalDays - lastRealDataIndex; i++) {
        const amount = regressionFn(i);
        const date = `2024-11-${i.toString().padStart(2, '0')}`;
        projectionData.push({ date, amount });
    }

    return projectionData;
};

const ChartProjection = ({ data }) => {
    const isMobile = window.innerWidth < 640;

    // Calculate linear regression using Simple Statistics
    const regressionInput = prepareDataForRegression(data);
    const regressionModel = linearRegression(regressionInput);
    const regressionFn = linearRegressionLine(regressionModel);

    // Generate projection data only from the last actual data point onward
    const projectionData = getProjectionData(data, regressionFn);

    return (
        <ResponsiveContainer width="100%" height={isMobile ? 220 : 400}>
            <LineChart 
                margin={{ top: 20, right: isMobile ? 10 : 30, left: isMobile ? 5 : 20, bottom: 10 }}
            >
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
                
                {/* Actual Spending Line */}
                <Line 
                    type="monotone" 
                    dataKey="amount" 
                    data={data} 
                    stroke="#8884d8" 
                    strokeWidth={2.5} 
                    dot={{ r: 5, stroke: "#8884d8", strokeWidth: 2, fill: '#fff' }} 
                    activeDot={{ r: 6, fill: "#8884d8" }}
                />
                
                {/* Projection Line */}
                <Line 
                    type="monotone" 
                    dataKey="amount" 
                    data={projectionData}  // Only render the projection data starting from last real data point
                    stroke="#82ca9d" 
                    strokeDasharray="5 5" 
                    strokeWidth={2} 
                    dot={false}
                />
            </LineChart>
        </ResponsiveContainer>
    );
}

export default ChartProjection;