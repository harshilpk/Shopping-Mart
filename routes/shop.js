const path = require("path");

const express = require("express");

const router = express.Router();

const productsController = require("../controllers/produtcs");


router.get("/", productsController.getProducts);

module.exports = router;
