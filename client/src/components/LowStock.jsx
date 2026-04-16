import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";


const LowStock = () => {

    const [items, setItems] = useState([]);

    useEffect(() => {
        const fetchLowStock = async () => {
            try {
                const token = localStorage.getItem("token");

                const res = await axios.get(
                    "http://localhost:5000/api/inventory/low-stock",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                setItems(res.data.products);
            } catch (error) {
                console.log(error.response?.data || error.message);
            }
        };

        fetchLowStock();
    }, []);
    return (
        <div className="bg-white p-5 rounded-xl shadow">
            <h2 className="font-semibold mb-4 text-red-500">
                Low Stock Alert
            </h2>

            {items.length === 0? (
                <p className="text-gray-500">No low stock</p>
            ) : (
                items.map((item, index) => (
                    <div
                    key={index}
                    className="flex justify-between border-b py-2"
                    >
                        <span>{item.name}</span>
                        <span className="text-red-600 font-extrabold">
                            {item.stock} left
                        </span>
                    </div>
                ))
            )
            }
        </div>
    );
};

export default LowStock;