import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const SpendingLineGraph = ({data}) => {
    return (
        <div style={{ width: "100%", padding: "1rem", boxSizing: "border-box" }}>
            <h2 style={{ textAlign: "center", fontSize: "1.2rem", marginBottom: "1rem", color: "#333" }}>
                Daily Spending
            </h2>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Line type="monotone" dataKey="amount" stroke="#8884d8" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default SpendingLineGraph;