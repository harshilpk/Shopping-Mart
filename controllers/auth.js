const crypto = require("crypto");

const User = require("../models/user");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");
const { validationResult } = require("express-validator/check");

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key:
        "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"
    }
  })
);

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
    errorMessage: message,
    oldInput: {
      email: "",
      password: ""
    },
    validationErrors: []
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
    errorMessage: message,
    oldInput: {
      email: "",
      password: "",
      confirmPassword: ""
    },
    validationErrors: []
  });
};

exports.postLogin = (req, res, next) => {
  // res.header("Set-Cookie", "loggedIn = true");
  const email = req.body.email;
  const password = req.body.password;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("auth/login", {
      path: "/login",
      pageTitle: "Login",
      isAuthenticated: false,
      errorMessage: errors.array()[0].msg,
      oldInput: {
        email: email,
        password: password
      },
      validationErrors: errors.array()
    });
  }
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
        // req.flash("error", "Invalid email or password");
        return res.status(422).render("auth/login", {
          path: "/login",
          pageTitle: "Login",
          isAuthenticated: false,
          errorMessage: "Invalid email or password",
          oldInput: {
            email: email,
            password: password
          },
          validationErrors: []
        });
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
          // req.flash("error", "Invalid email or password");
          return res.status(422).render("auth/login", {
            path: "/login",
            pageTitle: "Login",
            isAuthenticated: false,
            errorMessage: "Invalid email or password",
            oldInput: {
              email: email,
              password: password
            },
            validationErrors: []
          });
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
  // const confirmPassword = req.body.confirmPassword;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("auth/signup", {
      path: "/signup",
      pageTitle: "SignUp",
      isAuthenticated: false,
      errorMessage: errors.array()[0].msg,
      oldInput: {
        email: email,
        password: password,
        confirmPassword: req.body.confirmPassword
      },
      validationErrors: errors.array()
    });
  }
  //   User.findOne({ email: email })
  //     .then(user => {
  //       if (user) {
  //         req.flash("error", "Email already exists. Please choose a new one.");
  //         return res.redirect("/signup");
  //       }
  bcrypt
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
      transporter.sendMail({
        to: email,
        from: "shop@node-complete.com",
        subject: "Signup succeeded!",
        html: "<h1>You successfully signed up!</h1>"
      });
      res.redirect("/login");
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

exports.getReset = (req, res, next) => {
  let message = req.flash("error");
  console.log(req.session.isLoggedIn);
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/reset", {
    path: "/reset",
    pageTitle: "Reset Password",
    isAuthenticated: false,
    errorMessage: message
  });
};

exports.postReset = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect("/reset");
    }
    const token = buffer.toString("hex");
    User.findOne({ email: req.body.email })
      .then(user => {
        if (!user) {
          req.flash("error", "No account with this email exists.");
          return res.redirect("/reset");
        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        return user.save();
      })
      .then(result => {
        res.redirect("/");
        transporter.sendMail({
          to: req.body.email,
          from: "shop@node-complete.com",
          subject: "Password Reset!",
          html: `
            <p> You requested a password reset</p>
            <p>Click this <a href="http://localhost:3000/reset/${token}">link </a> to set a new password.</p>
            `
        });
      })
      .catch(err => {
        console.log(err);
      });
  });
};

exports.getResetPassword = (req, res, next) => {
  const token = req.params.token;
  User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
    .then(user => {
      let message = req.flash("error");
      console.log(req.session.isLoggedIn);
      if (message.length > 0) {
        message = message[0];
      } else {
        message = null;
      }
      res.render("auth/reset-password", {
        path: "/reset-password",
        pageTitle: "Reset New Password",
        isAuthenticated: false,
        errorMessage: message,
        userId: user._id.toString(),
        passwordToken: token
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.postNewPassword = (req, res, next) => {
  const newPassword = req.body.password;
  const userId = req.body.userId;
  const passwordToken = req.body.passwordToken;
  let resetUser;

  User.findOne({
    resetToken: passwordToken,
    resetTokenExpiration: { $gt: Date.now() },
    _id: userId
  })
    .then(user => {
      resetUser = user;
      return bcrypt.hash(newPassword, 12);
    })
    .then(hashedPassword => {
      resetUser.password = hashedPassword;
      resetUser.resetTokenExpiration = undefined;
      resetUser.resetToken = undefined;
      return resetUser.save();
    })
    .then(result => {
      res.redirect("/login");
    })
    .catch(err => {
      console.log(err);
    });
};
