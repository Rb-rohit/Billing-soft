const express = require("express");
const router = express.Router();
const saleController = require("../controllers/SaleController");
const authMiddleware = require("../middlewares/AuthMiddleware");

router.post("/",authMiddleware, saleController.createSale);

// router.get("/today/report", saleController.getTodaySales);
router.get("/:id/invoice", saleController.downloadInvoice);
router.get("/recent", saleController.getRecentSales);
// router.get("/weekly", saleController.getWeeklySales);

router.get("/", saleController.getAllSales);
router.get("/:id", saleController.getSaleById);

module.exports = router;