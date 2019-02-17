const User = require("../models/user");

exports.getLogin = (req, res, next) => {
  //   const isLoggedIn = req
  //     .get("Cookie")
  //     .split(";")[6]
  //     .trim()
  //     .split("=")[1];
  console.log(req.session.isLoggedIn);
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: false
  });
};

exports.getSignup = (req, res, next) => {
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "SignUp",
    isAuthenticated: false
  });
};

exports.postLogin = (req, res, next) => {
  // res.header("Set-Cookie", "loggedIn = true");

  User.findById("5c674325a3cb3b2b74544241")
    .then(user => {
      // for MongoDB
      // req.user = new User(user.name, user.email, user.cart, user._id);
      req.session.isLoggedIn = true;
      req.session.user = user;
      req.session.save(err => {
        console.log(err);
        res.redirect("/");
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.postSignup = (req, res, next) => {};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect("/");
  });
};
