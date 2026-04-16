import { Bell, User } from "lucide-react"


const Navbar = () => {
    return (
        <div className="ml-64 h-16 bg-white shadow flex items-center justify-between px-6">
            <h2 className="text-xl font-semibold">Dashboard</h2>

            <div className="flex items-center gap-6">
                <input 
                    type="text"
                    placeholder="Search Products"
                    className="border rounded-lg px-3 py-1 outline-none"
                />

                <Bell className="cursor-pointer" />

                <div className="flex items-center gap-2 cursor-pointer">
                    <User />
                    <span>Admin</span>
                </div>
            </div>
        </div>
    );
};

export default Navbar;