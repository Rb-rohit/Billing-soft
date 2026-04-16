import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";

const ProductList = ({ addToCart}) => {
    const [products, setProduct] = useState([]);

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
                
                setProduct(res.data.products || []);
            }  catch (error) {
                console.log(error.response?.data || error.message);
            }
        };

        fetchProducts();
    }, []);

    return (
        <div className="grid grid-cols-3 gap-3">
            {products.map(product => (
                <div
                    key={product._id}
                    onClick={() => addToCart(product)}
                    className="border rounded-lg p-4 cursor-pointer hover:bg-gray-100"
                >
                    <h3 className="font-semibold">{product.name}</h3>
                    <p>₹{product.price}</p>
                </div>
            ))}
        </div>
    );
};

export default ProductList;