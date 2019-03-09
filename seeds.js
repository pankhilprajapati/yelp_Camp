const mongoose = require("mongoose");
const Camp = require("./models/campSchema");
const comment = require("./models/comment");

var data = [
  {
    name: "Rahul",
    image:
      "https://newevolutiondesigns.com/images/freebies/4k-wallpaper-16.jpg",
    description: " ha ha ha"
  },
  {
    name: "Rahul",
    image:
      "https://newevolutiondesigns.com/images/freebies/4k-wallpaper-16.jpg",
    description: " ha ha ha"
  },
  {
    name: "Rahul",
    image:
      "https://newevolutiondesigns.com/images/freebies/4k-wallpaper-16.jpg",
    description: " ha ha ha"
  }
];

function seed() {
  Camp.remove({}, err => {
    if (err) {
      console.log(err);
    } else {
      console.log("remove campgroung");
    }
    // data.forEach(seed => {
    //   Camp.create(seed, (err, campground) => {
    //     if (err) {
    //       console.log(err);
    //     } else {
    //       console.log("ADDED camp");
    //       comment.create(
    //         {
    //           text: "text place is grest ,but I wish ther was internet",
    //           author: "Homer"
    //         },
    //         (err, comment) => {
    //           if (err) {
    //             console.log(err);
    //           } else {
    //             campground.comment.push(comment);
    //             campground.save();
    //             console.log("created new comments");
    //           }
    //         }
    //       );
    //     }
    //   });
    // });
  });
}

module.exports = seed;
