import axios from 'axios';
import { useEffect, useState } from 'react';

import {LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Line, BarChart, Bar, PieChart, Pie, Cell,  ResponsiveContainer } from "recharts";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const Reports = () => {
  const [stats, setStats] = useState(null);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [paymentData, setPaymentData] = useState([]);
  const COLORS = ["#6366f1","#22c55e","#f59e0b","#ef4444"];

  const fetchStats = async () => {
      try {

        const token = localStorage.getItem("token");
        const res = await axios.get(
          "https://billing-soft-roxt.onrender.com/api/dashboard/stats",
          {
            params: {
              fromDate,
              toDate
            },
            headers: {
              Authorization:`Bearer ${token}`
            }
          }
        );
        
        setStats(res.data);

      } catch (error) {
        console.log(error);
      }
    };

    // fetch payment report
    const fetchPaymentReport = async () => {
      try {

        const token = localStorage.getItem("token");

        const res = await axios.get(
          "https://billing-soft-roxt.onrender.com/api/dashboard/payment-report",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );


      setPaymentData(res.data);

      } catch (error) {
        console.log(error);
      }
    };

    //download report
    const downloadReport = () => {
      if (!stats) return;

      const doc = new jsPDF();

      doc.setFont("helvetica", "normal");

      // company name
      doc.setFontSize(20);
      doc.setTextColor(40, 40, 40);
      doc.text("My Billing Software", 20, 20);

      //title
      doc.setFontSize(16);
      doc.setTextColor(100);
      doc.text("Sales Analytics Report", 20, 30);

      //date range
      doc.setFontSize(11);
      doc.setTextColor(0);
      doc.text(`From: ${fromDate || "All"}`, 20, 40)
      doc.text(`To: ${toDate || "All"}`, 120, 40);

      //summary
      doc.setFontSize(14);
      doc.text("Summary", 20, 55);

      doc.setFontSize(11);
      doc.text(
        "Today's Revenue:" + stats.today.totalRevenue.toLocaleString(),
        20,
        65
      );

      doc.text(
        "Today's Bills:" + stats.today.totalBills,
        20, 
        72
      );

      //payment table
      autoTable(doc, {
        startY: 85,
        head: [["Payment Method", "Revenue"]],
        body: paymentData.map((item) => [
          item._id || "Unknown",
          item.total.toLocaleString()
        ]),
        headStyles: {
          fillColor: [99, 102, 241]
        },
        styles: {
          halign: "center"
        }
      });

      // Monthly sales table 
      autoTable(doc, {
        startY:doc.lastAutoTable.finalY + 10,
        head: [["Month", "Revenue"]],
        body: stats.monthlySales.map((item) => [
          String(item._id),
          item.revenue.toLocaleString()
        ]),
        headStyles: {
          fillColor: [34, 197, 94]
        }
      });

      //footer
      doc.setFontSize(10);
      doc.text(
        `Generated on: ${new Date().toLocaleDateString()}`,
        20,
        doc.internal.pageSize.height - 10
      );

      doc.setDrawColor(200);
      doc.line(20, 50, 190, 50);
      
      doc.save("sales-report.pdf");
    };

  useEffect(() => {
    fetchStats();
    fetchPaymentReport();
  }, []);

  if (!stats) return <h2>Loading...</h2>;

  const formattedDaily = stats?.dailySales?.map(item => ({
  day: new Date(item._id).toLocaleDateString("en-US", { weekday: "short" }),
  revenue: item.revenue
})) || [];

const months = [
"Jan","Feb","Mar","Apr","May","Jun",
"Jul","Aug","Sep","Oct","Nov","Dec"
];

const formattedMonthly = stats?.monthlySales?.map(item => ({
  month: months[item._id - 1],
  revenue: item.revenue
})) || [];
  
  return (
    <div className='p-6 bg-gray-100 min-h-screen'>
      <h1 className='text-3xl font-bold mb-6'>Sales Analytics</h1>

      {/* Filter section  */}
      <div className='bg-white p-4 rounded-lg shadow flex flex-wrap gap-4 mb-6'>

        <input 
          type='date'
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          className='border p-2 rounded'
        />

        <input 
          type='date'
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          className='border p-2 rounded'
        />

        <button
          onClick={fetchStats}
          className='bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded'
        >
          Filter
        </button>

        {/*  download button */}
        <button
        onClick={downloadReport}
        className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded"
      >
        Download PDF
      </button>
      </div>

      {/* today card  */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-8'>

        <div className='p-6 rounded-xl shadow bg-white'>
          <h3 className='text-gray-500'>
            Today's Revenue
          </h3>
          <p className='text-3xl font-bold mt-2 text-green-600'>
            ₹{stats.today.totalRevenue.toLocaleString()}
          </p>
        </div>

        <div className='p-6 rounded-xl shadow bg-white'>
          <h3 className='text-gray-500'> Today's Bills </h3>
          <p className='text-3xl font-bold mt-2 text-blue-600'> {stats.today.totalBills} </p>
        </div>

      </div>

      {/* Chart Grid  */}

      <div className='grid lg:grid-cols-2 gap-8'>

        {/* weekly sales  */}
        <div className='bg-white p-6 rounded-xl shadow'>
          <h2 className='font-semibold mb-4'>Last 7 Days Sales</h2>

          <LineChart 
            width={500}
            height={300}
            data={formattedDaily}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />

            <Line
              type="monotone"
              dataKey="revenue"
              stroke='#8884d8'
            />
          </LineChart>
        </div>

        {/* monthly Revenue  */}
        <div className='bg-white p-6 rounded-xl shadow'>
          <h2 className='mt-4 font-semibold'>Monthly Revenue</h2>

          <BarChart
            width={500}
            height={300}
            data={formattedMonthly}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey= "month" />
            <YAxis />
            <Tooltip />

            <Bar
              dataKey="revenue"
              fill='#22c55e'
            />
          </BarChart>
        </div>

      </div>

      {/* Payment Report chart*/}
      <div className='bg-white p-6 rounded-xl shadow mt-8'>
        <h2 className='mt-4 font-semibold'>Payment Mode Report</h2>

        <PieChart
        width={400}
        height={300}
      >
        <Pie
          data={paymentData.map(p => ({
            ...p,
            _id: p._id?.replace("&", "")
          }))}
          dataKey="total"
          nameKey="_id"
          cx="50%"
          cy="50%"
          outerRadius={110}
        >
          {paymentData.map((entry, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
      </div>
      

    </div>
  );
};

export default Reports;