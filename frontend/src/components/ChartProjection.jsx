import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Label } from "recharts";
import { linearRegression, linearRegressionLine } from "simple-statistics";

const prepareDataForRegression = (data) => {
    return data.map((point, index) => [index + 1, point.amount]);
};

const toTimestamp = (dateStr) => new Date(dateStr).getDate();

const getAvg = (arr) => arr.reduce((sum, val) => sum + val.amount, 0) / arr.length


const returnHigher = (a, b) => a.amount >= b.amount ? a : b

const getHighest = (arr) => arr.reduce((a, b) => returnHigher(a,b))

const getProjectionData = (data, regressionFn) => {
    const avg_daily_spend = getAvg(data)

    const avg_datapts = data.map((d) => ({
        ...d,
        amount: avg_daily_spend,
    }))

    const monthend = new Date(data[data.length - 1].date);
    monthend.setMonth(monthend.getMonth() + 1)

    monthend.setDate(0)
    
    const totalDays = monthend.getDate();
    const projectionData = [];
    const lastRealDataIndex = data.length;

    for (let i = 1; i <= totalDays; i++) {
        let amount = regressionFn(i);
        amount = (amount < 0) ? 0 : amount
        let date = `${monthend.getFullYear()}-${monthend.getMonth() + 1}-${i.toString().padStart(2, '0')}`;
        date = toTimestamp(date)
        projectionData.push({ date, amount });
    }


    return projectionData;
};

const ChartProjection = ({ data }) => {
    const isMobile = window.innerWidth < 640;


    const dat = data.map((d) => ({
        ...d,
        date: toTimestamp(d.date),
    }));


    // Calculate linear regression using Simple Statistics
    const regressionInput = prepareDataForRegression(dat);
    const regressionModel = linearRegression(regressionInput);
    const regressionFn = linearRegressionLine(regressionModel);

    // Generate projection data only from the last actual data point onward
    const projectionData = getProjectionData(dat, regressionFn);

    const lastDayMonth = projectionData[projectionData.length - 1].date

    const highest = getHighest(data)
    const maxTickValue = Math.ceil(highest.amount + 1);
    const ticks = Array.from({ length: maxTickValue + 1 }, (_, i) => i + 1);


    return (
        <ResponsiveContainer width="105%" height={isMobile ? 300 : 400}>
            <LineChart 
                margin={{ top: 20, right: isMobile ? 10 : 30, left: isMobile ? 5 : 20, bottom: 10 }}
            >
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                
                <XAxis 
                    dataKey="date" 
                    tick={{ fill: "#555", fontSize: 9 }} 
                    axisLine={{ stroke: '#ccc' }} 
                    tickLine={false}
                    domain={[1, lastDayMonth]}
                    type="number"
                    ticks={Array.from({ length: lastDayMonth }, (_, i) => i + 1)} // Create ticks for each day
                    tickFormatter={(day) => day}
                >
                    <Label 
                        value="Day" 
                        position="insideBottom" 
                        offset={-1} 
                        style={{ fill: '#888', fontSize: isMobile ? 9: 12 }}
                    />
                </XAxis>
                
                <YAxis 
                    tick={{ fill: "#555", fontSize: isMobile ? 9: 10 }} 
                    axisLine={{ stroke: '#ccc' }} 
                    tickLine={false} 
                    // domain={[5, Math.max(highest.amount + 1, 10)]}
                    // allowDecimals={false} // Disable decimals on tick labels
                    // interval="preserveStartEnd"
                    // ticks={ticks}
                    type="number"
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
                    data={dat} 
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