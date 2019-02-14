// const http = require("http");
const path = require("path");
const express = require("express");
// const routes = require("./routes");
const adminRoutes = require("./routes/admin");
// const shopRoutes = require("./routes/shop");
const bodyParser = require("body-parser");
// const expressHbs = require("express-handlebars");
// const errorController = require("./controllers/error");
// const sequelize = require("./util/database");
// const Product = require("./models/product.js");
// const User = require("./models/user");
// const Cart = require("./models/cart");
// const CartItem = require("./models/cart-item");
// const Order = require('./models/order');
// const OrderItem = require('./models/order-item')
const mongoConnect = require('./util/database').mongoConnect;

const app = express();

// db.execute("SELECT * FROM products")
//   .then(result => {
//     console.log(result[0], result[1]);
//   })
//   .catch(err => {
//     console.log(err);
//   });

// app.engine(
//   "handlebars",
//   expressHbs({
//     layoutsDir: "views/layouts",
//     defaultLayout: "main-layout",
//     extname: "handlebars"
//   })
// );
// app.set("view engine", "pug");
// app.set("views", "views");
// app.set("view engine", "handlebars");
// app.set("views", "views");
app.set("view engine", "ejs");
app.set("views", "views");

//_______________________________________________________________MYSQL________________________
// first request
// app.use((req, res, next) => {
//   User.findById(1)
//     .then(user => {
//       req.user = user;
//       next();
//     })
//     .catch(err => {
//       console.log(err);
//     });
// });
//_______________________________________________________________MYSQL________________________

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use("/admin", adminRoutes);

// app.use(shopRoutes);

// app.use(errorController.get404);

// RAW LOGIC
// const server = http.createServer(app);
//_______________________________________________________________MYSQL________________________
// Product.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
// User.hasMany(Product);
// User.hasOne(Cart);
// Cart.belongsTo(User);
// Cart.belongsToMany(Product, { through: CartItem });
// Product.belongsToMany(Cart, { through: CartItem });
// Order.belongsTo(User);
// User.hasMany(Order);
// Order.belongsToMany(Product, {through: OrderItem})
// Product.belongsToMany(Order, { through: CartItem });


// sequelize
//   .sync()
//   .then(result => {
//     return User.findById(1);
//     // console.log(result);
//   })
//   .then(user => {
//     if (!user) {
//       User.create({ name: "Harshil", email: "test@gmail.com" });
//     }
//     return user;
//   })
//   .then(user => {
//     //  console.log(user);
//     return user.createCart();
//   })
//   .then(cart => {
//     app.listen(3000);
//   })
//   .catch(err => {
//     console.log(err);
//   });

//_______________________________________________________________MYSQL________________________

// server.listen(3000);
mongoConnect(() => {
    app.listen(3000);
})