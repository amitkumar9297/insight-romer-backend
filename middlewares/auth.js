const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, "48LawsOfPower");
    const user = await User.findOne({
      _id: decoded._id,
      "tokens.token": token,
    });
    if (!user) {
      throw new Error();
    }
    req.user = user;
    req.token = token;
    // console.log(user, token);
    next();
  } catch (e) {
    res.status(401).send({ error: "Please authenticate." });
  }
};

module.exports = auth;
