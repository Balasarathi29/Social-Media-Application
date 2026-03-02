const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined in environment variables");
    }

    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);

    if (error.message.includes("bad auth")) {
      console.error(
        "Authentication failed. Please check your MongoDB username and password.",
      );
      console.error(
        "Make sure there are no special characters in the password that need URL encoding.",
      );
    }

    process.exit(1);
  }
};

module.exports = connectDB;
