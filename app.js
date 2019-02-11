// const http = require("http");
const express = require("express");
// const routes = require("./routes");
const adminRoutes = require('./routes/admin');
const shopRoutes = require("./routes/shop");
const bodyParser = require('body-parser');

const app = express();


app.use(bodyParser.urlencoded({extended: false}));

app.use('/admin',adminRoutes);

app.use(shopRoutes);

app.use((req,res,next) => {
  res.status(404).send('<h1>Page not found</h1>');
})

// RAW LOGIC
// const server = http.createServer(app);

// server.listen(3000);
app.listen(3000);
