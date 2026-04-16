import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";


const RecentBills = () => {

    const [sales, setSales] = useState([]);

    useEffect(()=> {
        const fetchRecentSales = async () => {
            try {
                const res = await axios.get(
                    "https://billing-soft-roxt.onrender.com/api/sales/recent"
                );

                setSales(res.data.sales);
            }catch (error) {
                console.log(error);
            }
        };

        fetchRecentSales();
    }, []);
    return (
        <div className="bg-white p-5 rounded-xl shadow">
            <h2 className="font-semibold mb-4">Recent Bills</h2>

            <table className="w-full text-left">
                <thead>
                    <tr className="border-b">
                        <th className="py-2">Customer</th>
                        <th>Amoount</th>
                        <th>Date</th>
                    </tr>
                </thead>

                <tbody>
                    {sales.map((sale) => {
                        return (
                        <tr key={sale._id} className="border-b hover:bg-gray-50">
                            <td className="py-2">{sale.customerName}</td>
                            <td>₹{sale.grandTotal}</td>
                            <td>
                                {new Date(sale.createdAt).toLocaleDateString()}
                            </td>
                        </tr>
                    );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default RecentBills;