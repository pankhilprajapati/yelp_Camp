const mongoose = require("mongoose");

const campgroundSchema = new mongoose.Schema(
  {
    name: String,
    price: Number,
    image: String,
    description: String,
    location: String,
    lat: Number,
    lng: Number,
    createdAt: {
      type: Date,
      default: Date.now
    },
    author: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },
      username: String
    },
    comment: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "comment"
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Camp", campgroundSchema);
