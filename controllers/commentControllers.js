const Comment = require("../models/commentModel");
const Blog = require("../models/blogModel");
const auth = require("../middlewares/auth");

exports.postComment = async (req, res) => {
  const { content, blogId } = req.body;
  try {
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ message: "Blog post not found" });
    }

    const newComment = new Comment({
      content,
      user: req.user._id,
      blog: blogId,
    });

    await newComment.save();
    blog.comments.push(newComment._id);
    await blog.save();

    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.updateComment = async (req, res) => {
  const { content } = req.body;
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "User not authorized to update this comment" });
    }

    comment.content = content;
    comment.updatedAt = Date.now();

    await comment.save();
    res.status(200).json(comment);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "User not authorized to delete this comment" });
    }

    const blog = await Blog.findById(comment.blog);
    if (blog) {
      blog.comments = blog.comments.filter(
        (commentId) => commentId.toString() !== comment._id.toString()
      );
      await blog.save();
    }

    // await comment.remove();
    await Comment.deleteOne({ _id: comment._id });
    res.status(200).json({ message: "Comment deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
