import axios from "axios";
import { useEffect, useState } from "react";

const SalesHistory = () => {
    const [sales, setSales] = useState([]);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all")


    const fetchSales = async () => {
        try {
            const token = localStorage.getItem("token");

        const res = await axios.get(
            "https://billing-soft-roxt.onrender.com/api/sales",
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        );

        setSales(res.data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchSales();
    }, []);

    // search

    const now = new Date();

    const filteredSales = sales.filter((sale) => {
        const matchSearch = 
            sale.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
            sale.customerName.toLowerCase().includes(search.toLowerCase())

        const saleDate = new Date(sale.createdAt);
        
        if (!matchSearch) return false;

        if (filter === "today") {
            return saleDate.toDateString() === now.toDateString();
        }

        if (filter === "week") {
            const weekAgo = new Date();
            weekAgo.setDate(now.getDate() - 7);
            return saleDate >= weekAgo;
        }

        if (filter === "month") {
            return(
                saleDate.getMonth() === now.getMonth() &&
                saleDate.getFullYear() === now.getFullYear()
            );
        }

        return true;
    });

    
    
    

    // total revenue
    const totalRevenue = filteredSales.reduce(
        (sum, sale) => sum + (sale.grandTotal || 0),
        0
    );

    const totalOrders = filteredSales.length;
    

    return (
        <div className="p-6">

            <h2 className="text-2xl font-bold mb-4">
                Sales History
            </h2>

            <div className=" flex mb-4">
                <input 
                    type="text"
                    placeholder="Search invoice or customer..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="border p-2 rounded w-full"
                />

            </div>
            <div className="flex gap-4 mb-4">
                <button
                    onClick={() => setFilter("today")}
                    className="px-3 py-1 bg-blue-500 text-white rounded"
                >
                    Today
                </button>

                <button
                    onClick={() => setFilter("week")}
                    className="px-3 py-1 bg-green-500 text-white rounded"
                >
                    This Week
                </button>

                <button
                    onClick={() => setFilter("month")}
                    className="px-3 py-1 bg-purple-500 text-white rounded"
                >
                    This Month
                </button>

                <button
                    onClick={() => setFilter("all")}
                    className="px-3 py-1 bg-gray-500 text-white rounded"
                >
                    All
                </button>
            </div>

            <div className="flex gap-4 mb-4">

                <div className="bg-white shadow p-4 rounded w-48">
                    <p className="text-gray-500 text-sm">
                        Total Revenue
                    </p>
                    <h2 className="text-xl font-bold text-green-600">
                        ₹{totalRevenue}
                    </h2>
                </div>

                <div className="bg-white shadow p-4 rounded w-48">
                    <p className="text-gray-500 text-sm">
                        Order
                    </p>
                    <h2 className="text-xl font-bold text-blue-600">
                        {totalOrders}
                    </h2>
                </div>
            </div>

            <div className="overflow-x-auto">

                <table className="w-full border rounded-lg">

                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-3 text-left">Invoice</th>
                            <th className="p-3 text-left">Customer</th>
                            <th className="p-3 text-left">Total</th>
                            <th className="p-3 text-left">Payment</th>
                            <th className="p-3 text-left">Date</th>
                            <th className="p-3 text-left">Action</th>
                        </tr>
                    </thead>

                <tbody>

                {filteredSales.map((sale) => (
                    <tr
                        key={sale._id}
                        className="border-t hover:bg-gray-50"
                    >
                        <td className="p-3 font-medium">
                            {sale.invoiceNumber}
                        </td>

                        <td className="p-3">
                            {sale.customerName}
                        </td>

                        <td className="p-3 text-green-600 font-semibold">
                            ₹{sale.grandTotal}
                        </td>

                        <td className="p-3">
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm">
                                {sale.paymentMethod.toUpperCase()}
                            </span>
                        </td>

                        <td className="p-3">
                            {new Date(sale.createdAt).toLocaleDateString()}
                        </td>

                        <td className="p-3">
                            <a
                                href={`http://localhost:5000/api/sales/${sale._id}/invoice`}
                                target="_blank"
                                className="text-indigo-600 hover:underline"
                            >
                                Download
                            </a>
                        </td>
                    </tr>
                ))}

                </tbody>

            </table>

        </div>
    </div>
    );
};

export default SalesHistory;