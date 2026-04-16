import { useEffect, useRef } from "react";

const CartTable = ({cart, setCart, selectedItemId, setSelectedItemId}) => {
    const rowRefs = useRef({});
    const changeQty = (id, type) => {
        setCart(prev =>
            prev.map(item => {
            if (item._id === id) {
                const qty =
                    type === "inc" 
                    ? item.qty + 1 
                    : Math.max(1, item.qty - 1);
                return { ...item, qty };
            }
            return item;
            })
        );
    };

    const removeItem = (id) => {
        setCart(prev => 
            prev.filter(item => item._id !== id))
    };

    useEffect(() => {
        if (selectedItemId && rowRefs.current[selectedItemId]) {
            rowRefs.current[selectedItemId].scrollIntoView({
                behavior: "smooth",
                block: "nearest"
            });
        }
    }, [selectedItemId]);

    return (
        <div className="h-[400px] overflow-y-auto border rounded-lg bg-white shadow">
            <table className="w-full text-sm">
            <thead className="bg-gray-100 text-gray-600">
                <tr>
                    <th className="p-3 text-left">Product</th>
                    <th className="p-3">Qty</th>
                    <th className="p-3">Price</th>
                    <th className="p-3">Total</th>
                    <th className="p-3">Action</th>
                </tr>
            </thead>
            <tbody className="divide-y">
                {cart.map(item => (
                    <tr 
                        key={item._id} 
                        ref={el => (rowRefs.current[item._id] = el)}
                        onClick={() => setSelectedItemId(item._id)}
                        className={`cursor-pointer hover:bg-gray-50 ${
                            selectedItemId === item._id 
                            ? "bg-blue-50"
                            : ""
                        }`}
                    >
                        <td className="p-3 font-medium">{item.name}</td>

                        <td className="p-3">
                            <div className="flex items-center justify-center gap-2">

                                <button
                                    onClick={(e)=> {
                                        e.stopPropagation();
                                        changeQty(item._id, "dec");
                                    }}
                                    className="px-2 py-1 border rounded hover:bg-gray-100"
                                >
                                    -
                                </button>

                                <span className="px-2">{item.qty}</span>

                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        changeQty(item._id, "inc");
                                    }}
                                    className="px-2 py-1 border rounded hover:bg-gray-100"
                                >
                                    +
                                </button>
                            </div>
                        </td>

                        <td className="p-3 text-center">₹{item.price}</td>

                        <td className="p-3 text-center font-semibold text-indigo-600">₹{item.qty * item.price}</td>
                        <td className="p-3 text-center">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    removeItem(item._id)
                                }}
                                className="text-red-500 hover:text-red-700"
                            >Remove</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
        </div>
        
    );
};

export default CartTable;