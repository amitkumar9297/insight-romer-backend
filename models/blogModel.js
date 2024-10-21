const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
    },
    discription: {
      type: String,
      required: [true, "Discription is required"],
    },
    content: {
      type: String,
      required: true,
    },
    tags: [String],
    image: {
      type: String,
      required: [true, "Image is required"],
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      require: [true, "user id is required"],
    },
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

const blogModel = mongoose.model("Blog", blogSchema);

module.exports = blogModel;
