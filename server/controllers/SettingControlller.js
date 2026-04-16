const Settings = require("../models/Setting")


// get settings
exports.getSettings = async (req, res) => {
    try {
        let settings = await Settings.findOne();

        if (!settings) {
            settings = await Settings.create({});
        }

        res.json(settings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// update setting
exports.updateSettings = async (req, res) => {
    try {
        const { shopName, gstNumber, address } = req.body;

        let settings = await Settings.findOne();

        if (!settings) {
            settings = await Settings.create({
                shopName,
                gstNumber,
                address
            });
        } else {
            settings.shopName = shopName;
            settings.gstNumber = gstNumber;
            settings.address = address;

            await settings.save();
        }

        res.json({
            message: "Settings Updated",
            settings
        });
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};