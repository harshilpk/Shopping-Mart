const path = require("path");

const express = require("express");

const router = express.Router();

const adminData = require("./admin");

router.get("/", (req, res, next) => {
  // console.log(adminData.products);
  // res.sendFile(path.join(__dirname, '../', "views", "shop.html"));
  const products = adminData.products;
  res.render("shop", {
    prods: products,
    pageTitle: "Shop",
    path: "/",
    activeShop: true,
    productCSS: true,
    hasProducts: products.length > 0
  });
});

module.exports = router;
