const Sale = require("../models/Sale");
const mongoose = require("mongoose");



// get/api/dashboard/stats
exports.getDashboardStats = async (req, res) => {
    try {

        const { fromDate, toDate } = req.query;

        let match = {};

        if (fromDate && toDate) {
            match.createdAt = {
                $gte: new Date(fromDate),
                $lte: new Date(toDate)
            };
        }


        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);

        const todayEnd = new Date();
        todayEnd.setHours(23, 59, 59, 999);

        //today sales chart
        const todaySales = await Sale.aggregate([
            {
                $match: {
                    createdAt: { $gte: todayStart, $lte: todayEnd }
                }
            },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: "$grandTotal" },
                    totalBills: { $sum: 1 }
                }
            }
        ]);

        //monthly sale chart
        const monthlySales = await Sale.aggregate([
            { $match: match },
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    revenue: { $sum: "$grandTotal" }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        //daily sale (last 7 days)
        const last7Days = new Date();
        last7Days.setDate(last7Days.getDate() - 7);

        const dailyMatch = fromDate && toDate
            ? match
            : { createdAt: { $gte: last7Days } };

        const dailySales = await Sale.aggregate([
            {
                $match: dailyMatch
            },
            {
                $group: {
                    _id: {
                            $dateToString: {
                                format: "%Y-%m-%d",
                                date: "$createdAt"
                            }
                        },
                    revenue: { $sum: "$grandTotal" }
                }
            },
            { $sort: { _id: 1} }
        ]);

        res.json({
            today: todaySales[0] || { totalRevenue: 0, totalBills: 0 },
            monthlySales,
            dailySales
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// payment Report
exports.getPaymentReport = async (req, res) => {
    try {

        const payments = await Sale.aggregate([
            {
                $group: {
                    _id: { $ifNull: ["$paymentMethod", "Unknown"] },
                    total: { $sum: "$grandTotal" }
                }
            }
        ]);

        res.json(payments);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
