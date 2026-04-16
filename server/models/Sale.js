
const mongoose = require("mongoose");

// sale item (products inside bill)

const saleItemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },

    name: {
        type: String,
        required: true
    },

    price: {
        type: Number,
        required: true
    },

    quantity: {
        type: Number,
        required: true
    },

    gst: {
        type: Number,
        required: true
    },

    total: {
        type: Number,
        required: true
    }
});

// main sale schema
const saleSchema = new mongoose.Schema(
    {
        invoiceNumber: {
            type: String,
            required: true,
            unique: true
        },

        customerName: {
            type: String,
        },

        items: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product"
                },
                name: String,
                price: Number,
                quantity: Number,
                total: Number
            }
        ],

        // totalAmount: {
        //     type: Number,
        //     required: true
        // },

        subTotal: {
            type: Number,
            required: true
        },

        // totalGST: {
        //     type: Number,
        //     default: 0
        // },

        grandTotal: {
            type: Number,
            required: true
        },

        paymentMethod: {
            type: String,
            enum: ["cash", "upi", "card"],
            default: "cash"
        },

        createBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Sale", saleSchema);