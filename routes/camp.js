const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Camp = require("../models/campSchema");
const middleware = require("../middleware");
var NodeGeocoder = require("node-geocoder");

var options = {
  provider: "google",
  httpAdapter: "https",
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null
};

var geocoder = NodeGeocoder(options);

router.get("/", (req, res) => {
  Camp.find({}, (err, campground) => {
    if (err) {
      console.log(err);
    } else {
      res.render("camp/campground", {
        campground: campground,
        currentUser: req.user
      });
    }
  });
});

router.post("/", middleware.isLoggedIn, async (req, res) => {
  var name = req.body.name;
  var price = req.body.price;
  var image = req.body.image;
  var desc = req.body.description;
  const author = {
    id: req.user._id,
    username: req.user.username
  };
  var newcamp = {
    name: name,
    price: price,
    image: image,
    description: desc,
    author: author
  };

  Camp.create(newcamp, (err, newlycreated) => {
    if (err) {
      console.log(err);
    } else {
      req.flash("success", "Successfully Added Campground");
      res.redirect("/campground");
    }
  });
});

router.get("/new", middleware.isLoggedIn, (req, res) => {
  res.render("camp/new");
});

router.get("/:id", (req, res) => {
  Camp.findById(req.params.id)
    .populate("comment")
    .exec((err, findcamp) => {
      if (err) {
        console.log(err);
      } else {
        res.render("camp/show", { campground: findcamp });
      }
    });
});

router.get("/:id/edit", middleware.checkCampOwner, (req, res) => {
  Camp.findById(req.params.id, (err, findCamp) => {
    res.render("camp/edit.ejs", { campground: findCamp });
  });
});

// router.put("/:id", middleware.checkCampOwner, function(req, res) {
//   Camp.findByIdAndUpdate(req.params.id, req.body.campground, function(
//     err,
//     updatedCampground
//   ) {
//     if (err) {
//       res.redirect("/campground");
//     } else {
//       req.flash("success", "Successfully Updated Campground");
//       res.redirect("/campground/" + req.params.id);
//     }
//   });
// });

// UPDATE CAMPGROUND ROUTE
router.put("/:id", middleware.checkCampOwner, function(req, res) {
  geocoder.geocode(req.body.location, function(err, data) {
    if (err || !data.length) {
      req.flash("error", "Invalid address");
      return res.redirect("back");
    }
    req.body.campground.lat = data[0].latitude;
    req.body.campground.lng = data[0].longitude;
    req.body.campground.location = data[0].formattedAddress;

    Camp.findByIdAndUpdate(req.params.id, req.body.campground, function(
      err,
      campground
    ) {
      if (err) {
        req.flash("error", err.message);
        res.redirect("back");
      } else {
        console.log(req.body.campground);
        req.flash("success", "Successfully Updated!");
        res.redirect("/campground/" + campground._id);
      }
    });
  });
});

router.delete("/:id", middleware.checkCampOwner, (req, res) => {
  Camp.findByIdAndRemove(req.params.id, err => {
    if (err) {
      res.render("/campgroud");
    } else {
      res.redirect("/campground");
    }
  });
});

module.exports = router;
