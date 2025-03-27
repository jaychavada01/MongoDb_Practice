const mongoose = require("mongoose");
require("dotenv").config();

exports.connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connection Established")
  } catch (error) {
    console.error("MongoDB Connection Error:", error);
    process.exit(1);
  }
};
