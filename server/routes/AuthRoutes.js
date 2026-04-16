const express = require("express");
const router = express.Router();
const { register, getMe, login } = require("../controllers/AuthController");
const authMiddleware = require("../middlewares/AuthMiddleware");



router.post("/register", register);
router.post("/login", login);
router.get("/me",authMiddleware, getMe);



module.exports = router;