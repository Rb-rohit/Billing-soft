const express = require("express");
const authMiddleware = require("../middlewares/AuthMiddleware");
const { getLowStockProducts } = require("../controllers/InventoryController");
const router = express.Router();


router.get("/low-stock", authMiddleware, getLowStockProducts);

module.exports = router;