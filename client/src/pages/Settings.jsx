import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import { toast } from "react-toastify";


const Settings = () => {

    const [shopName, setShopName] = useState("");
    const [gstNumber, setGstNumber] = useState("");
    const [address, setAddress] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const fetchSettings = async () => {
        try{
            const res = await axios.get(
            "http://localhost:5000/api/settings"
        );

        setShopName(res.data.shopName || "");
        setGstNumber(res.data.gstNumber || "");
        setAddress(res.data.address || "");
        } catch (error) {
            console.log(error);
        }
        
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    const handleSave = async () => {
        try {
            setLoading(true);

            await axios.put(
            "http://localhost:5000/api/settings",
            {
                shopName,
                gstNumber,
                address
            }
        )
            .then(() => {
                toast("Setting Saved Successfully");
            });

        setMessage("Settings saved successfully");
        setLoading(false)

        setTimeout(() => {
            setMessage("");
        }, 3000);

        } catch (error) {
            console.log(error);
            setLoading(false);
        }
        
    };

    return(
        <div className="p-6 flex justify-center">

        <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-lg">

            <h2 className="text-2xl font-bold mb-6 text-gray-800">
                Shop Settings
            </h2>

            <div className="space-y-4">
                <div>
                    <label className="text-sm text-gray-600">Shop Name</label>
                    <input 
                        type="text"
                        placeholder="Shop Name"
                        value={shopName}
                        onChange={(e) => setShopName(e.target.value)}
                        className="border p-2 w-full rounded mt-1"
                    />
                </div>
                
                <div>
                    <label className="text-sm text-gray-600">GST Number</label>
                    <input 
                        type="text"
                        placeholder="GST Number"
                        value={gstNumber}
                        onChange={(e) => setGstNumber(e.target.value)}
                        className="border p-2 w-full rounded mt-1"
                    />
                </div>
                
                <div>
                    <label className="text-sm text-gray-600">Address</label>
                    <textarea 
                        placeholder="Address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="border p-2 w-full rounded m-1"
                />
                </div>
                

                <button
                    onClick={handleSave}
                    disabled={loading}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded w-full"
                >
                    {loading ? "saving...." : "Save Settings"}
                </button>

                {message && (
                    <p className="text-green-600 text-sm mt-2">{message}</p>
                )}
            </div>
        </div>
        
        </div>
    );
};

export default Settings;