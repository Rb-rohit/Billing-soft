import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const SalesChart = () => {

    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchWeeklySales = async () => {
            try {
                const token = localStorage.getItem("token");

                const res = await axios.get(
                    "http://localhost:5000/api/dashboard/stats",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                // const days = ["Sun", "Mon","Tue", "Wed", "Thu", "Fri", "Sat"];

                const formatted = res.data.dailySales.map(item => ({
                    day: new Date(item._id).toLocaleDateString("en-US",{
                        weekday: "short"
                    }),
                    sales: item.revenue
                }));

                setData(formatted);

            }catch (error) {
                console.log(error);
            }
        };

        fetchWeeklySales();
    }, []);
    
    return (
        <div className="bg-white p-5 rounded-xl shadow">
            <h2 className="font-semibold mb-4">Weekly Sales</h2>

            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="sales" stroke="#6366f1" />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default SalesChart;