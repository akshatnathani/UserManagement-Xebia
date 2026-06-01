/**
 * User Mongoose Model.
 * Represents user schema definitions, account status categories,
 * password hashing configurations, and indexing specifications.
 *
 * @author akshatnathani
 * @version 1.0.0
 */

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    profilePicture: {
      type: String,
      default: "",
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ['Admin', 'User'],
      default: 'User',
    },
    status: {
      type: String,
      enum: ['Active', 'Inactive', 'Deleted'],
      default: 'Active',
    },
    
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);