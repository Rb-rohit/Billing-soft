import axios from "axios";
import { useEffect, useState } from "react";

const Card = ({ title, value }) => {

    return (
        <div className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition">
            <h3 className="text-gray-500">{title}</h3>
            <p className="text-2xl font-bold mt-2">{value}</p>
        </div>
    );
};

const DashboardCards = () => {
    const [totalBills, setTotalBills] = useState(0);
    const [products, setProducts] = useState(0);
    const [lowStock, setLowStock] = useState(0);
    const [report, setReport] = useState({
        revenue: 0,
        orders: 0
    });
 
    // todays report
    useEffect(() => {
        const fetchReport = async () => {
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
                setReport({
                    revenue: res.data.today.totalRevenue,
                    orders: res.data.today.totalBills
                });
            } catch (error) {
                console.log(error.response?.data || error.message);
            }
            
        };

        fetchReport();
    }, []);

    // low stock
    useEffect(() => {
        const fetchLowStock = async () => {
            const token = localStorage.getItem("token");
            try {
                const res = await axios.get(
                "http://localhost:5000/api/inventory/low-stock",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
                
            );

            setLowStock(res.data.count);
            } catch (error) {
                console.log(error.response?.data || error.message);
            }
            
        };
        fetchLowStock();
    },[])


    // products
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const token = localStorage.getItem("token");

                const res = await axios.get(
                    "http://localhost:5000/api/products",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                setProducts(res.data.total)
                
            } catch (error) {
                console.log(error.response?.data || error.message);
            }
        };
        fetchProducts();
    }, []);

    // total bills
    useEffect(() => {
    const fetchBills = async () => {
        try {
            const token = localStorage.getItem("token");

            const res = await axios.get(
                "http://localhost:5000/api/sales",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setTotalBills(res.data.length);
            

        } catch (error) {
            console.log(error.response?.data || error.message);
        }
    };

    fetchBills();
}, []);

    return (
        <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
            <Card title="Today's Revenue" value={`₹${report.revenue}`} />
            <Card title="Today's Orders" value={report.orders} />
            <Card title="Total Bills" value={totalBills}/>
            <Card title="Products" value={products} />
            <Card title="Low Stock Items" value={lowStock} />
        </div>
    );
};

export default DashboardCards;