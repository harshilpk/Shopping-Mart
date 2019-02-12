// const http = require("http");
const path = require("path");
const express = require("express");
// const routes = require("./routes");
const adminData = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const bodyParser = require("body-parser");
// const expressHbs = require("express-handlebars");

const app = express();

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
app.use("/admin", adminData.routes);

app.use(shopRoutes);

app.use((req, res, next) => {
  // res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
  res.status(404).render("404", { pageTitle: "Page Not Found" });
});

// RAW LOGIC
// const server = http.createServer(app);

// server.listen(3000);
app.listen(3000);
