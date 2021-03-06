const path = require("path");
const express = require("express");

const adminController = require("../controllers/admin");
const isAuth = require("../middleware/isAuth");
const { body } = require("express-validator/check");

const router = express.Router();

router.get("/add-product", isAuth, adminController.getAddProduct);

router.get("/products", isAuth, adminController.getProducts);

router.post(
  "/add-product",
  body("title")
    .isString()
    .isLength({ min: 3 })
    .trim(),
  body("price").isFloat(),
  body("description")
    .isLength({ min: 8 })
    .trim(),
  isAuth,
  adminController.postAddProduct
);

router.get("/edit-product/:id", isAuth, adminController.getEditProduct);

router.post(
  "/edit-product",
  body("title")
    .isString()
    .isLength({ min: 3 })
    .trim(),
  body("price").isFloat(),
  body("description")
    .isLength({ min: 8 })
    .trim(),
  isAuth,
  adminController.postEditProduct
);

// router.post("/delete-product", isAuth, adminController.postDeleteproduct);

router.delete("/product/:id", isAuth, adminController.deleteProduct);

module.exports = router;
