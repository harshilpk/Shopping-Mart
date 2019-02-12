const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
  // res.sendFile(path.join(__dirname, "../", "views", "add-product.html"));
  res.render("add-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    formsCSS: true,
    productCSS: true,
    activeAddProduct: true
  });
};

exports.postAddProduct = (req, res, nect) => {
  //   products.push({ title: req.body.title });
  const product = new Product(req.body.title);
  product.save();
  res.redirect("/");
};

exports.getProducts = (req, res, next) => {
  // console.log(adminData.products);
  // res.sendFile(path.join(__dirname, '../', "views", "shop.html"));
  const products = Product.fetchAll();
  res.render("shop", {
    prods: products,
    pageTitle: "Shop",
    path: "/",
    activeShop: true,
    productCSS: true,
    hasProducts: products.length > 0
  });
};
