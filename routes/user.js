const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { savedUrl } = require("../middleware.js");
const userController = require("../controller/user.js");

router.route("/signup")
.get( userController.renderSignUp )
.post( wrapAsync(userController.signUp));

router.route("/login")
.get( userController.renderLogIn )
.post(savedUrl, passport.authenticate("local", { failureRedirect: '/login', failureFlash: true }), userController.logIn);

router.get("/logout", userController.logOut);

module.exports = router;