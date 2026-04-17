const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/Db");

const authRoutes = require("./routes/AuthRoutes");
const productRoutes = require("./routes/ProductRoutes");
const saleRoutes = require("./routes/SaleRoutes");
const dashboardRoutes = require("./routes/DashboardRoutes");
const inventoryRoutes = require("./routes/InventoryRoute");
const settingsRoutes = require("./routes/SettingRoutes");

dotenv.config();

const app = express();

//cors configuration
const corsOptions = { 
    origin:"https://billing-soft-topaz.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials:true 
};

app.use(cors(corsOptions));
// app.options("*", cors(corsOptions)); //handle preflight

// middleware 
app.use(express.json());


//Rouutes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/sales", saleRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/settings", settingsRoutes );


connectDB();


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
