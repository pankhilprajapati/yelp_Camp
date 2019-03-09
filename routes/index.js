var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var Camp = require("../models/campSchema");
router.get("/", function(req, res) {
  res.render("landing");
});

router.get("/register", function(req, res) {
  res.render("register");
});

router.post("/register", function(req, res) {
  var newUser = new User({
    username: req.body.username,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    avatar: req.body.avatar
  });
  if (req.body.adminCode === "secretcode123") {
    newUser.isAdmin = true;
  }
  User.register(newUser, req.body.password, function(err, user) {
    if (err) {
      req.flash("error", err.message);
      console.log(err.message);
      return res.render("register.ejs");
    }
    passport.authenticate("local")(req, res, function() {
      req.flash("success", "Welcome to YelpCamp " + user.username);
      res.redirect("/campground");
    });
  });
});

router.get("/login", function(req, res) {
  res.render("login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/campground",
    failureRedirect: "/login"
  }),
  function(req, res) {}
);

router.get("/logout", function(req, res) {
  req.logout();
  req.flash("success", "Logged You Out");
  res.redirect("/campground");
});

router.get("/user/:id", function(req, res) {
  User.findById(req.params.id, function(err, foundUser) {
    if (err) {
      req.flash("error", "Something went wrong.");
      return res.redirect("/");
    }
    Camp.find()
      .where("author.id")
      .equals(foundUser._id)
      .exec(function(err, campground) {
        if (err) {
          req.flash("error", "Something went wrong.");
          return res.redirect("/");
        }
        res.render("user/show", { user: foundUser, campground: campground });
      });
  });
});

module.exports = router;
