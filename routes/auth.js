const express = require("express");
const { check, body } = require("express-validator/check");

const authController = require("../controllers/auth");
const User = require("../models/user");

const router = express.Router();

router.get("/login", authController.getLogin);

router.get("/signup", authController.getSignup);

router.post(
  "/login",
  body("email")
    .isEmail()
    .withMessage("Please enter a valid email address.")
    .normalizeEmail(),
  body("password", "Password has to be valid.")
    .isLength({ min: 5 })
    .isAlphanumeric()
    .trim(),
  authController.postLogin
);

router.post(
  "/signup",
  check("email")
    .isEmail()
    .withMessage("Please enter a valid email!!")
    .custom((value, { req }) => {
      //   if (value === "test@test.com") {
      //     throw new Error("This email address is forbidden.");
      //   }
      //   return true;
      return User.findOne({ email: value }).then(user => {
        if (user) {
          return Promise.reject(
            "Email already exists. Please choose a new one."
          );
        }
      });
    })
    .normalizeEmail(),
  body(
    "password",
    "Please enter a password with only numbers and text and at least 5 charcters."
  )
    .isLength({ min: 5 })
    .isAlphanumeric()
    .trim(),
  body("confirmPassword")
    .trim()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match.");
      }
      return true;
    }),
  authController.postSignup
);

router.post("/logout", authController.postLogout);

router.get("/reset", authController.getReset);

router.post("/reset", authController.postReset);

router.get("/reset/:token", authController.getResetPassword);

router.post("/reset-password", authController.postNewPassword);

module.exports = router;
