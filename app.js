// const http = require("http");
const express = require("express");
// const routes = require("./routes");

const bodyParser = require('body-parser');

const app = express();


app.use(bodyParser.urlencoded({extended: false}));

app.get('/add-product',(req, res, next) => {
    console.log("In another middleware");
    res.send("<form action='/product' method='POST'><input type='text' name='title'><button type='submit'>Add Product</button></form>");
  });

app.use('/product', (req,res, nect) => {
    console.log(req.body)
    res.redirect('/');
})

app.use('/',(req, res, next) => {
  console.log("In another middleware");
  res.send("<h1>Hello from express</h1>");
});
// RAW LOGIC
// const server = http.createServer(app);

// server.listen(3000);
app.listen(3000);
