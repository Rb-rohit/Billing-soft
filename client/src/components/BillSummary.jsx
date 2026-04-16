import axios from "axios";
import { useState } from "react";


const BillSummary = ({ cart = [], setCart }) => {
    const [payment, setPayment] = useState("cash");
    const [customerName, setCustomerName] = useState("");
    

    const subtotal = cart.reduce(
        (sum, item) => sum + item.price * item.qty,
        0
    );

    const gst = subtotal * 0.18;
    const total = subtotal + gst;

    const handleGenerateBill = async () => {

        try {

            if (cart.length === 0) {
                alert("Cart is empty");
                return;
            }

            const token = localStorage.getItem("token");

            const response = await axios.post(
                "https://bill-soft.onrender.com/api/sales",
                {
                    customerName: customerName || "Rohit",
                    paymentMethod: payment,
                    items: cart.map(item => ({
                        productId: item._id,
                        quantity: item.qty
                    }))
                },
                {headers: { Authorization: `Bearer ${token}` }}
            );
                
            console.log("SALE RESPONSE:", response.data);

            const saleId = response?.data?.sale?._id;

            // download invoice
            if (saleId) {
                window.open(
                `https://bill-soft.onrender.com/api/sales/${saleId}/invoice`,
                "_blank"
                );
            }
            

            alert("Sale saved successfully");

            setCart([]); // clear cart
            setCustomerName("");
        } catch (error) {
        console.error(error);
        alert(
            error.response?.data?.message || "Failed to generate bill" 
            
        );
    }
    };

    return (
        <div className="mt-6 border-t pt-4">

            <div>
                <input 
                    type="text"
                    placeholder="Customer Name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full border p-2 rounded-lg mb-4"
                />
            </div>
            <div className="flex justify-between mb-2">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between mb-2">
                <span>GST (18%)</span>
                <span>₹{gst.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-lg font-bold mb-4">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
            </div>

            {/* payment buttons  */}
            <div className="grid grid-cols-3 gap-2">

                <button 
                    onClick={()=> setPayment("cash")}
                    className={`p-2 rounded ${
                        payment === "cash"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200"
                    }`}
                >
                    Cash
                </button>
                <button 
                    onClick={()=> setPayment("upi")}
                    className={`p-2 rounded ${
                        payment === "upi"
                        ? "bg-green-600 text-white"
                        : "bg-gray-200"
                    }`}
                >
                    UPI
                </button>
                <button 
                    onClick={()=> setPayment("card")}
                    className={`p-2 rounded ${
                        payment === "card"
                        ? "bg-purple-600 text-white"
                        : "bg-gray-200"
                    }`}
                >
                    Card
                </button>
            </div>

            <button 
                onClick={handleGenerateBill} 
                className="w-full bg-black text-white p-3 mt-4 rounded-lg hover:bg-gray-800"
            >
                Generate Bill
            </button>

            <p className="mt-2 text-sm text-gray-500">
                Payment: {payment.toUpperCase()}
            </p>
        </div>
    );
};

export default BillSummary;