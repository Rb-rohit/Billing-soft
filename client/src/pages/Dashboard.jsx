import DashboardCards from "../components/DashboardCards";
import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";
import LowStock from "../components/LowStock";
import RecentBills from "../components/RecentBills";
import SalesChart from "../components/SalesChart";



const Dashboard = () => {
  return (
    <div className="bg-gray-100 min-h-screen" >
      <Sidebar/>
      <Navbar/>

      <div className="ml-64 p-6 mt-16 space-y-6">
        <DashboardCards />

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2">
            <SalesChart/>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <LowStock/>
          </div>

          
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <RecentBills />
        </div>
        
      </div>
    </div>

  );
};

export default Dashboard;