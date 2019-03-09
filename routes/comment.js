var express = require("express");
var router = express.Router({ mergeParams: true });
var Camp = require("../models/campSchema");
var Comment = require("../models/comment");
const middleware = require("../middleware");

router.get("/new", middleware.isLoggedIn, (req, res) => {
  console.log(req.params.id);
  Camp.findById(req.params.id, (err, campground) => {
    if (err) {
      console.log(err);
    } else {
      res.render("comment/new", { campground: campground });
    }
  });
});

router.post("/", middleware.isLoggedIn, (req, res) => {
  Camp.findById(req.params.id, (err, campground) => {
    if (err) {
      console.log(err);
      res.redirect("/campground");
    } else {
      Comment.create(req.body.comment, (err, comment) => {
        if (err) {
          req.flash("error", "Something Went Wrong");
          console.log(err);
        } else {
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;

          comment.save();
          campground.comment.push(comment);
          campground.save();
          console.log(comment);
          req.flash("success", "Successfully Added Comment");
          res.redirect("/campground/" + campground._id);
        }
      });
    }
  });
});

router.get("/:comment_id/edit", middleware.checkComOwner, (req, res) => {
  Comment.findById(req.params.comment_id, (err, findCom) => {
    if (err) {
      res.redirect("back");
    } else {
      res.render("comment/edit", {
        campground_id: req.params.id,
        comment: findCom
      });
    }
  });
});

router.put("/:comment_id", middleware.checkComOwner, (req, res) => {
  Comment.findByIdAndUpdate(
    req.params.comment_id,
    req.body.comment,
    (err, UpdateCom) => {
      if (err) {
        res.redirect("back");
      } else {
        req.flash("success", "Successfully Updated Comment");
        res.redirect("/campground/" + req.params.id);
      }
    }
  );
});

router.delete("/:comment_id", middleware.checkComOwner, (req, res) => {
  Comment.findByIdAndRemove(req.params.comment_id, err => {
    if (err) {
      res.redirect("back");
    } else {
      req.flash("success", "Successfully Deleted Comment");
      res.redirect("/campground/" + req.params.id);
    }
  });
});

module.exports = router;
