const User = require("../models/userModel");

const bcrypt = require("bcrypt");

// create user register user
exports.registerController = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already registered" });
    }

    // Create a new user
    const newUser = new User({ username, email, password });

    // Save the user
    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    return res.status(200).send({
      userCount: users.length,
      success: true,
      message: "all user data",
      users,
    });
  } catch (err) {
    return res.status(500).send({
      success: false,
      message: "Error in the get all user",
      err,
    });
  }
};

// login
exports.loginController = async (req, res) => {
  const { email, password } = req.body;
  // console.log(email, password);
  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // Generate JWT token
    const token = user.generateAuthToken();
    const expiresIn = 3600000; // Token expiration (1 hour)

    // Add the token to the user's document
    await user.addToken(token, expiresIn);

    // Respond with the token
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id, { tokens: 0 })
      .select("-password")
      .populate({
        path: "blogs",
        options: { sort: { createdAt: -1 } }, // Sort blogs by createdAt in descending order
      });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.updateUserProfile = async (req, res) => {
  const { username, email, profilePicture, bio } = req.body;
  try {
    // Find user by ID
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (req.user._id.toString() !== user._id.toString()) {
      return res
        .status(401)
        .json({ message: "You are not authorized to update this user" });
    }

    // Update user details
    user.username = username || user.username;
    user.email = email || user.email;
    user.profilePicture = profilePicture || user.profilePicture;
    user.bio = bio || user.bio;

    // Save the updated user
    await user.save();
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.invalidateToken = async (req, res) => {
  const { token } = req.body;
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    await user.invalidateToken(token);
    res.status(200).json({ message: "Token invalidated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
