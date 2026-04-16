
const Product = require("../models/Product");
const Sale = require("../models/Sale");
const generateInvoice = require("../utils/GenerateInvoice");

const generateInvoiceNumber = async () => {
    const year = new Date().getFullYear();

    // find last invoice of this year
    const lastSale = await Sale.findOne({
        invoiceNumber: new RegExp(`INV-${year}`)
    }).sort({ createdAt: -1 });

    let nextNumber = 1;

    if (lastSale && lastSale.invoiceNumber) {
        const lastNumber = parseInt(
            lastSale.invoiceNumber.split("-")[2]
        );
        nextNumber = lastNumber + 1;
    }

    return `INV-${year}-${String(nextNumber).padStart(4, "0")}`;
};

// create sale / bill
// post /api/sales
exports.createSale = async (req, res) => {
    try {
        const { customerName, items, paymentMethod } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({
                message: "No items provided",
            });
        }

        let subTotal = 0;
        const saleItems = [];

        // calculate totals + update stock
        for (const item of items) {
            const product = await Product.findById(item.productId);;

            if (!product) {
                return res.status(404).json({
                    message: `Product not found`
                });
            }

            if (product.stock < item.quantity) {
                return res.status(400).json({
                    message: `${product.name} out of stock`
                });
            }

            const total = product.price * item.quantity;
            subTotal += total;

            saleItems.push({
                productId: product._id,
                name: product.name,
                price: product.price,
                quantity: item.quantity,
                total
            });

            //deduct stock
            product.stock -= item.quantity;
            await product.save();
        }

        // tax example (optional)
        const tax = 0;
        const grandTotal = subTotal + tax;

        // generate invoice number
        // const invoiceNumber = "IMNV-" + Date.now();
        const invoiceNumber = await generateInvoiceNumber();

        // create sale
        const sale = await Sale.create({
            invoiceNumber,
            customerName,
            items: saleItems,
            subTotal,
            grandTotal,
            paymentMethod,
            createBy: req.user.userId
        });

        res.status(201).json({
            message: "Sale create successfully",
            sale
        });

    } catch (error) {
        console.error("Create Sale Error:", error);
        res.status(500).json({
            message: error.message,
        });
    }
};

// get all sales
// get  /api/sales
exports.getAllSales = async (req, res) => {
    try{
        const sales = await Sale.find()
            .sort({ createdAt: -1 });
        
        res.json(sales);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch sales",
        });
    };
};

    // get single sale 
    // get /api/sales/:id
    exports.getSaleById = async (req, res) => {
        try {
            const sale = await Sale.findById(req.params.id);

            if (!sale) {
                return res.status(404).json({
                    message: "Sale not found",
                });
            }

            res.json({
                success: true,
                sales
            });
        } catch (error) {
            res.status(500).json({
                message: "Server error",
            });
        }
    };

    // download invoice
    exports.downloadInvoice = async (req, res) => {
        try {
            const sale = await Sale.findById(req.params.id);

            if (!sale) {
                return res.status(404).json({
                    message: "Sale not found"
                });
            }

            generateInvoice(sale, res);

        } catch (error) {
            console.error(error);

            // only send response if headers not sent
            if (!res.headersSent) {
                res.status(500).json({
                    message: error.message
                });
            }
        }
    };

    // get today sale
    // exports.getTodaySales = async (req, res) => {
    //     try {
    //         const start = new Date();
    //         start.setHours(0, 0, 0, 0);

    //         const end = new Date();
    //         end.setHours(23, 59, 59, 999);

    //         const sales = await Sale.find({
    //             createdAt: { $gte: start, $lte: end }
    //         })

    //         const revenue = sales.reduce(
    //             (sum, sale) => sum + (sale.grandTotal || 0),
    //             0
    //         );

    //         res.json({
    //             orders: sales.length,
    //             revenue,
                
    //         });
    //     } catch (error) {
    //         res.status(500).json({
    //             message:error.message
    //         });
    //     }
    // };

    // get recent sales
    exports.getRecentSales = async (req, res) => {
        try {
            const sales = await Sale.find()
                .sort({ createdAt: -1 })
                .limit(5)
                .select("invoiceNumber customerName grandTotal createdAt");
            
            res.json({
                success: true,
                sales
            });
        } catch (error) {
            res.status(500).json({
                message: error.message
            });
        }
    };

    // weekly sale
    // exports.getWeeklySales = async (req, res) => {
    //     try {

    //         const lastWeek = new Date();
    //         lastWeek.setDate(lastWeek.getDate() - 7);
            
    //         const sales = await Sale.aggregate([
    //             {
    //                 $match: {
    //                     createdAt: {
    //                         $gte: lastWeek
    //                     }
    //                 }
    //             },
    //             {
    //                 $group: {
    //                     _id: { $dayOfWeek: "$createdAt"},
    //                     totalSales: { $sum: "$grandTotal" }
    //                 }
    //             },
    //             {
    //                 $sort: { _id: 1 }
    //             }
                
    //         ]);

    //         res.json({
    //             success: true,
    //             sales
    //         });
    //     } catch (error) {
    //         console.error("Weekly Sales Error:", error);
    //         res.status(500).json({
    //             message: error.message
    //         });
    //     }
    // };

