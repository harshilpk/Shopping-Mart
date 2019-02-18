const User = require("../models/user");
const bcrypt = require("bcryptjs");

exports.getLogin = (req, res, next) => {
  //   const isLoggedIn = req
  //     .get("Cookie")
  //     .split(";")[6]
  //     .trim()
  //     .split("=")[1];
  let message = req.flash("error");
  console.log(req.session.isLoggedIn);
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: false,
    errorMessage: message
  });
};

exports.getSignup = (req, res, next) => {
  let message = req.flash("error");
  console.log(req.session.isLoggedIn);
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "SignUp",
    isAuthenticated: false,
    errorMessage: message
  });
};

exports.postLogin = (req, res, next) => {
  // res.header("Set-Cookie", "loggedIn = true");
  const email = req.body.email;
  // indById("5c674325a3cb3b2b74544241")
  //     .then(user => {  const password = req.body.password;
  //   User.f
  //       // for MongoDB
  //       // req.user = new User(user.name, user.email, user.cart, user._id);
  //       req.session.isLoggedIn = true;
  //       req.session.user = user;
  //       req.session.save(err => {
  //         console.log(err);
  //         res.redirect("/");
  //       });
  //     })
  //     .catch(err => {
  //       console.log(err);
  //     });
  User.findOne({ email: email })
    .then(user => {
      if (!user) {
        req.flash("error", "Invalid email or password");
        return res.redirect("/login");
      }
      bcrypt
        .compare(password, user.password)
        .then(doMatch => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save(err => {
              console.log(err);
              res.redirect("/");
            });
          }
          req.flash("error", "Invalid email or password");
          res.redirect("/login");
        })
        .catch(err => {
          console.log(err);
          res.redirect("/login");
        });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  User.findOne({ email: email })
    .then(user => {
      if (user) {
        req.flash("error", "Email already exists. Please choose a new one.");
        return res.redirect("/signup");
      }
      return bcrypt
        .hash(password, 12)
        .then(hashedPassword => {
          const newUser = new User({
            email: email,
            password: hashedPassword,
            cart: { items: [] }
          });
          return newUser.save();
        })
        .then(result => {
          res.redirect("/login");
        });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect("/");
  });
};
