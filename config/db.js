const colors = require("colors");
const mongoose = require("mongoose");
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log(`connected to mongodb Database ${mongoose.connect.host}`.bgMagenta.white)
    } catch (err) {
        console.log(`MONGO Connect Error ${err}`.bgRed.white)
    }
}

module.exports = connectDB;

