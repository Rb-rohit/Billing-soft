const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            require: true,
            trim: true
        },

        barcode: {
            type: String,
            unique: true,
            sparse: true // allows null value
        },

        
        lowStockLimit: {
            type: Number,
            default: 5
        },
        

        category: {
            type: String,
            default: "General"
        },

        price: {
            type: Number,
            required: true
        },

        costPrice: {
            type: Number,
            default: 0
        },

        stock: {
            type: Number,
            required: true,
            default: 0
        },

        unit: {
            type: String,
            default: "pcs" // pcs, kg, liter etc.
        },

        gst: {
            type: Number,
            default: 0 //GST percentage
        },

        description: {
            type: String
        },

        isActive: {
            type: Boolean,
            default: true
        },

        createBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Products", productSchema);

