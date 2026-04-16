import { BarChart3, FileText, LayoutDashboard, Package, Settings, Users } from "lucide-react"
import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import { toast } from "react-toastify";

const Sidebar = () => {
    const {logout} = useContext(AuthContext);
    const navigate = useNavigate();
    const handleLogout = () => {
        toast("LogOut SuccessFull !")
        logout();
        navigate("/login");
    };
    return (
        <div className="h-screen w-64 bg-gray-900 text-white fixed">
            <h1 className="text-2xl font-bold p-5 border-gray-700">
                Billing System
            </h1>

            <ul className="p-4 space-y-4">
                <li className="flex items-center gap-3 hover:text-yellow-400 cursor-pointer">
                    <LayoutDashboard size={20} /> Dashboard
                </li>

                <li className="flex items-center gap-3 hover:text-yellow-400 cursor-pointer">
                    <Link to={"/Billing"} className="flex items-center gap-3"> <FileText size={20} /> New Bill </Link>
                </li>

                <li className="flex items-center gap-3 hover:text-yellow-400 cursor-pointer">
                    <Link to={"/Product"} className="flex gap-3"><Package size={20} /> Products</Link>
                </li>

                <li className="flex items-center gap-3 hover:text-yellow-400 cursor-pointer">
                    <Link to={"/sales-history"} className="flex gap-3"><Users size={20} /> Customers</Link>
                </li>

                <li className="flex items-center gap-3 hover:text-yellow-400 cursor-pointer">
                    <Link to={"/report"} className="flex gap-3"><BarChart3 size={20} /> Reports</Link>
                </li>

                <li className="flex items-center gap-3 hover:text-yellow-400 cursor-pointer">
                    <Link to={"/settings"} className="flex gap-3"><Settings size={20} /> Settings</Link>
                </li>

                <li>
                    <button
                        onClick={handleLogout}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg"
                    >
                        Logout
                    </button>
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;