require("dotenv").config();

const express = require("express");
app = express();
body = require("body-parser");
mongoose = require("mongoose");
flash = require("connect-flash");
app.locals.moment = require("moment");
passport = require("passport");
LocalStrategy = require("passport-local");
methodOverride = require("method-override");
passportLocalMong = require("passport-local-mongoose");
Camp = require("./models/campSchema");
comment = require("./models/comment");
User = require("./models/user");

console.log(process.env.DATABASEURL);

mongoose.connect("process.env.DATABASEURL");

const commentRoutes = require("./routes/comment");
campgroundRoutes = require("./routes/camp");
indexRoutes = require("./routes/index");

app.use(body.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.use(express.static(__dirname + "public"));
app.use(methodOverride("_method"));
app.use(flash());

app.use(
  require("express-session")({
    secret: "Once Agin",
    resave: false,
    saveUninitialized: false
  })
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

app.use("/", indexRoutes);
app.use("/campground", campgroundRoutes);
app.use("/campground/:id/comment", commentRoutes);

app.listen(process.env.PORT || 3000, () => {
  console.log("Lets GO !!");
});
