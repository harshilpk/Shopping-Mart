// const http = require("http");
const path = require("path");
const express = require("express");
// const routes = require("./routes");
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const bodyParser = require("body-parser");
// const expressHbs = require("express-handlebars");
const errorController = require("./controllers/error");
const sequelize = require("./util/database");

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

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use("/admin", adminRoutes);

app.use(shopRoutes);

app.use(errorController.get404);

// RAW LOGIC
// const server = http.createServer(app);

sequelize
  .sync().then(result => {
    // console.log(result);
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });

// server.listen(3000);
