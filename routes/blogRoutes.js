const express = require("express");
const {
  getAllBlogsController,
  createBlogController,
  updateBlogController,
  getBlogByIdController,
  deleteBlogController,
  userBlogController,
  likeBlog,
} = require("../controllers/blogController");
const auth = require("../middlewares/auth");

// router object
const router = express.Router();

// routes
// get || all blogs
router.get("/all-blog", getAllBlogsController);

// create || all blogs
router.post("/create-blog", auth, createBlogController);

// put || update blog
router.put("/update-blog/:id", auth, updateBlogController);

// get || single blog detail
router.get("/get-blog/:id", getBlogByIdController);

// delete || delete blog
router.delete("/delete-blog/:id", auth, deleteBlogController);

// get || user blog
router.get("/user-blog/:id", userBlogController);

router.post("/like/:id", likeBlog);

module.exports = router;
