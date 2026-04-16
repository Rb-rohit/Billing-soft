const express = require("express");
const { getSettings, updateSettings } = require("../controllers/SettingControlller");
const router = express.Router();


router.get("/", getSettings);
router.put("/", updateSettings);

module.exports = router;