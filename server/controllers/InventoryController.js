const Product = require("../models/Product");


// get  /api/inventory/low-stock
exports.getLowStockProducts = async (req, res) => {
    try {
        const products = await Product.find({
            isActive: true,
            $expr: { $lte: ["$stock", "$lowStockLimit"] }
        }).select("name stock lowStockLimit price");

        res.json({
            count: products.length,
            products,
        });

    }catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};