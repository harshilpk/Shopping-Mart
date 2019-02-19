// const http = require("http");
const path = require("path");
const express = require("express");
// const routes = require("./routes");
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const bodyParser = require("body-parser");
// const expressHbs = require("express-handlebars");
const errorController = require("./controllers/error");
// const sequelize = require("./util/database");
// const Product = require("./models/product.js");
const User = require("./models/user");
// const Cart = require("./models/cart");
// const CartItem = require("./models/cart-item");
// const Order = require('./models/order');
// const OrderItem = require('./models/order-item')
// const mongoConnect = require("./util/database").mongoConnect;
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const session = require("express-session");
const MongoDbStore = require("connect-mongodb-session")(session);
const csrf = require("csurf");
const flash = require("connect-flash");

const app = express();
const store = new MongoDbStore({
  uri:
    "mongodb+srv://Harshil:dhoni007@cluster0-b0pi2.mongodb.net/shop?retryWrites=true",
  collection: "sessions"
});
const csrfProtection = csrf();

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

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store: store
  })
);
app.use(csrfProtection);
app.use(flash());
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});
//_______________________________________________________________MYSQL________________________
// first request
app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then(user => {
      // for MongoDB
      // req.user = new User(user.name, user.email, user.cart, user._id);
      if (!user) {
        return next();
      }
      req.user = user;
      next();
    })
    .catch(err => {
      next(new Error(err));
    });
});
//_______________________________________________________________MYSQL________________________

app.use("/admin", adminRoutes);

app.use(shopRoutes);
app.use(authRoutes);

app.get("/500", errorController.get500);
app.use(errorController.get404);

app.use((error, req, res, next) => {
  // res.status(error.httpStatusCode).render(...)
  // res.redirect("/500");
  res.status(500).render("500", {
    pageTitle: "Error!",
    path: "",
    isAuthenticated: req.session.isLoggedIn
  });
});

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
// mongoConnect(() => {
//   app.listen(4000);
// });
// app.listen(3000);

mongoose
  .connect(
    "mongodb+srv://Harshil:dhoni007@cluster0-b0pi2.mongodb.net/shop?retryWrites=true",
    {
      useNewUrlParser: true
    }
  )
  .then(result => {
    // User.findOne().then(user => {
    //   if (!user) {
    //     const user = new User({
    //       name: "Harshil",
    //       email: "test@test.com",
    //       cart: {
    //         items: []
    //       }
    //     });
    //     user.save();
    //   }
    // });
    app.listen(3000);
    console.log("CONNECTED");
  })
  .catch(err => {
    console.log(err);
  });
