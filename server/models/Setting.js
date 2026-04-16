const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema({
    shopName: {
        type: String,
        default: ""
    },
    gstNumber: {
        type: String,
        default: ""
    },
    address: {
        type: String,
        default: ""
    }
});

module.exports = mongoose.model("Settings", settingsSchema);