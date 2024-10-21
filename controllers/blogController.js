const mongoose = require("mongoose");
const blogModel = require("../models/blogModel");
const userModel = require("../models/userModel");

// get all user
exports.getAllBlogsController = async (req, res) => {
  try {
    // Find all blogs and populate related fields
    const blogs = await blogModel
      .find()
      .populate({ path: "user", select: "-password -tokens" })
      .sort({ createdAt: -1 });
    // .populate("comments")
    // .populate("likes");

    return res.status(200).json({
      success: true,
      blogs,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Error while retrieving blogs",
      error: err.message,
    });
  }
};

// create blog
exports.createBlogController = async (req, res) => {
  try {
    const { title, discription, content, tags, image, userId } = req.body;

    // Validation
    if (!title || !discription || !content || !image || !userId) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    // Check if user exists
    const existingUser = await userModel.findById(userId);
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "Unable to find user",
      });
    }

    // Create new blog
    const newBlog = new blogModel({
      title,
      discription,
      content,
      tags,
      image,
      user: userId,
    });

    // Save new blog
    await newBlog.save();

    // Add new blog to user's blog array
    existingUser.blogs.push(newBlog._id);
    await existingUser.save();

    return res.status(201).json({
      success: true,
      message: "Blog created successfully",
      newBlog,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Error while creating blog",
      error: err.message,
    });
  }
};

// update blog
exports.updateBlogController = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, discription, content, tags, image, userId } = req.body;

    // Find the blog to update
    const blog = await blogModel.findById(id);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    // Check if the user is the author of the blog
    if (blog.user.toString() !== userId || req.user._id != userId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this blog",
      });
    }

    // Update blog details
    const updatedBlog = await blogModel.findByIdAndUpdate(
      id,
      { title, discription, content, tags, image },
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: "Blog updated successfully",
      updatedBlog,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Error while updating blog",
      error: err.message,
    });
  }
};

// get single blog
exports.getBlogByIdController = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the blog and populate related fields
    const blog = await blogModel
      .findById(id)
      // .populate("user")
      // .populate("comments");
      .populate({
        path: "comments",
        populate: {
          path: "user",
          select: "-password -tokens -email -blogs -bio",
        },
      })
      .exec();
    // .populate("likes");
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    return res.status(200).json({
      success: true,
      blog,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Error while retrieving blog",
      error: err.message,
    });
  }
};

// delete blog
exports.deleteBlogController = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    // Find the blog to delete
    const blog = await blogModel.findById(id);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    // Check if the user is the author of the blog

    if (blog?.user?.toString() !== userId || req?.user?._id != userId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this blog",
      });
    }

    // Delete the blog
    await blogModel.findByIdAndDelete(id);

    // Remove blog reference from user’s blog array
    await userModel.findByIdAndUpdate(userId, {
      $pull: { blogs: id },
    });

    return res.status(200).json({
      success: true,
      message: "Blog deleted successfully",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Error while deleting blog",
      error: err.message,
    });
  }
};

// get user blog
exports.userBlogController = async (req, res) => {
  try {
    const userBlog = await userModel.findById(req.params.id).populate("blogs");
    if (!userBlog) {
      return res.status(404).send({
        success: false,
        message: "Blog not found with this id",
      });
    }
    return res.status(200).send({
      success: true,
      message: "user blogs",
      userBlog,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).send({
      success: false,
      message: "Error in user blog",
      err,
    });
  }
};

exports.likeBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    // Find the blog to like/dislike
    const blog = await blogModel.findById(id);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    // Like/Dislike the blog
    if (blog.likes.includes(userId)) {
      blog.likes = blog.likes.filter(
        (like) => like.toString() !== userId.toString()
      );
    } else {
      blog.likes.push(userId);
    }

    await blog.save();

    return res.status(200).json({
      success: true,
      blog,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Error while liking/disliking blog",
      error: err.message,
    });
  }
};
