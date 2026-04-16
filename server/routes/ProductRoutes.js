const express = require("express");
const { authorizeRoles } = require("../middlewares/RoleMiddleware");
const { createProduct, updateProduct, deleteProduct, getProducts, searchProducts, getProductById } = require("../controllers/ProductController");
const authMiddleware = require("../middlewares/AuthMiddleware");
const router = express.Router();

// admin only

router.post("/add", authMiddleware, authorizeRoles("admin"), createProduct);
router.put("/:id", authMiddleware, authorizeRoles("admin"), updateProduct);
router.delete("/:id", authMiddleware, authorizeRoles("admin"), deleteProduct);

// staff + admin
router.get("/", authMiddleware, getProducts);
router.get("/search", authMiddleware, searchProducts);
router.get("/:id", authMiddleware, getProductById);

module.exports = router;