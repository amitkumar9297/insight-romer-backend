const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const colors = require("colors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

// env config
dotenv.config();

// router import
const userRoutes = require("./routes/userRoutes");
const blogRoutes = require("./routes/blogRoutes");
const commentRoutes = require("./routes/commentRoutes");

// mongodb connection
connectDB();

// port
const PORT = process.env.PORT || 8000;

// rest objects
const app = express();

// middleware
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/blog", blogRoutes);
app.use("/api/v1/comments", commentRoutes);

app.listen(PORT, () => {
  console.log(
    `server running on ${process.env.DEV_MODE} port no. ${PORT}`.bgCyan.white
  );
});
