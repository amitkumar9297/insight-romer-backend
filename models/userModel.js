const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "username is required"],
    },
    email: {
      type: String,
      required: [true, "email is requiredd"],
    },
    password: {
      type: String,
      required: [true, "password is required"],
    },
    blogs: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Blog",
      },
    ],
    profilePicture: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      default: "",
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
        expiresAt: {
          type: Date,
          required: true,
        },
      },
    ],
  },
  { timestamp: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Method to generate JWT token
userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, "48LawsOfPower", {
    expiresIn: "30d",
  });
  return token;
};

// Method to add token to user document
userSchema.methods.addToken = function (token, expiresIn) {
  this.tokens = this.tokens.concat({
    token,
    expiresAt: new Date(Date.now() + expiresIn),
  });
  return this.save();
};

// Method to invalidate a token
userSchema.methods.invalidateToken = function (token) {
  this.tokens = this.tokens.filter((t) => t.token !== token);
  return this.save();
};

// const User = mongoose.model("User", userSchema);

// module.exports = User;

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
