const express = require("express");
const authMiddleware = require("../middlewares/AuthMiddleware");
const { getDashboardStats, getPaymentReport } = require("../controllers/DashboardController");
const router = express.Router();


router.get("/stats", authMiddleware, getDashboardStats);
router.get("/payment-report", authMiddleware, getPaymentReport);

module.exports = router;