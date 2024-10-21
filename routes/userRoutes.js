const express = require("express");
const {
  getAllUsers,
  registerController,
  loginController,
  getUserProfile,
  updateUserProfile,
  invalidateToken,
} = require("../controllers/userController");
const auth = require("../middlewares/auth");

// router object
const router = express.Router();

// get all users ||get
router.get("/all-user", getAllUsers);
router.get("/user", auth, getUserProfile);

// create user ||post
router.post("/register", registerController);

// login ||post
router.post("/login", loginController);

// update user ||put
router.put("/updateUser", auth, updateUserProfile);
router.post("/invalidate-token", auth, invalidateToken);

module.exports = router;
