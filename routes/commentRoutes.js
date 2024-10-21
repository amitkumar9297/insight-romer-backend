// routes/comments.js
const express = require("express");
const router = express.Router();
const Comment = require("../models/commentModel");
const Blog = require("../models/blogModel");
const auth = require("../middlewares/auth");
const {
  postComment,
  deleteComment,
  updateComment,
} = require("../controllers/commentControllers");

// Create a new comment
router.post("/", auth, postComment);

// Update a comment by ID
router.put("/:id", auth, updateComment);

// Delete a comment by ID
router.delete("/:id", auth, deleteComment);

module.exports = router;
