const mongoose = require("mongoose");

/**
 * Connects to MongoDB using the MONGO_URI from environment variables.
 * Supports both local and MongoDB Atlas connection strings.
 *
 * @author akshat
 * @version 1.0.0
 */
const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error("MONGO_URI is missing in .env");
  }

  const connection = await mongoose.connect(mongoUri, {
    serverSelectionTimeoutMS: 10000, // 10 seconds
    socketTimeoutMS: 45000,
    family: 4, // Force IPv4 — prevents some DNS SRV issues on Windows
  });

  console.log(`✅ MongoDB connected: ${connection.connection.host}`);
};

module.exports = connectDB;